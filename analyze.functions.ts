import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { parseAnalysis, type ParsedAnalysis } from "./parse-analysis";

const Input = z.object({
  imageDataUrl: z.string().min(32).max(1_800_000),
  mode: z.enum(["meal", "label"]),
});

const hits: number[] = [];

function underLimit(): boolean {
  const now = Date.now();
  while (hits.length && now - hits[0]! > 60 * 60 * 1000) hits.shift();
  if (hits.length >= 24) return false;
  hits.push(now);
  return true;
}

export const analyzeFoodPhoto = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<ParsedAnalysis> => {
    if (!/^data:image\/(jpeg|jpg|png);base64,[a-z0-9+/=\s]+$/i.test(data.imageDataUrl)) {
      return { ok: false, error: "Нужна фотография в формате JPEG или PNG." };
    }
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return {
        ok: false,
        error: "Распознавание сейчас недоступно. Добавьте блюдо из базы или вручную.",
      };
    }
    if (!underLimit()) {
      return {
        ok: false,
        error: "Слишком много фото за час. Добавьте продукт из базы или вручную.",
      };
    }

    const task =
      data.mode === "label"
        ? "На фото этикетка или упаковка. Извлеки название и пищевую ценность. Если таблица дана на порцию — пересчитай КБЖУ на 100 г. grams поставь равным массе порции, если она указана, иначе 100."
        : "На фото еда. Определи видимые блюда и оцени массу каждой порции в граммах по объёму. КБЖУ укажи на 100 г: типичные справочные значения, без выдуманных брендов.";

    const prompt = `${task}
Верни JSON вида {"summary":"одна короткая фраза по-русски","items":[{"name":"название по-русски","grams":число,"kcalPer100":число,"proteinPer100":число,"fatPer100":число,"carbsPer100":число,"note":"коротко или пустая строка"}]}.
Не больше 6 позиций. Если еды или этикетки не видно — items пустой, а summary объясняет почему. Только JSON.`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(50_000),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          reasoning_effort: "low",
          max_tokens: 1200,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "Ты аккуратный оценщик рациона. Названия пиши по-русски. Не добавляй продукты, которых не видно. Числа реалистичные.",
            },
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: data.imageDataUrl } },
              ],
            },
          ],
        }),
      });
      if (!res.ok) {
        return { ok: false, error: "Не получилось распознать фото. Попробуйте ещё раз." };
      }
      const body = (await res.json()) as {
        choices?: { message?: { content?: string | null } }[];
      };
      const content = body.choices?.[0]?.message?.content ?? "";
      const parsed = parseAnalysis(content);
      if (!parsed.ok) {
        return { ok: false, error: "Не получилось разобрать ответ. Попробуйте ещё раз." };
      }
      if (!parsed.items.length) {
        return {
          ok: true,
          items: [],
          summary: parsed.summary || "Не видно еды. Снимите тарелку ближе, при дневном свете.",
        };
      }
      return parsed;
    } catch {
      return {
        ok: false,
        error: "Не получилось распознать фото. Проверьте соединение и попробуйте ещё раз.",
      };
    }
  });
