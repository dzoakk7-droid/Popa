import { norm } from "./calc";
import type { Food } from "./types";

export const CATEGORIES = [
  "Завтраки",
  "Мясо и птица",
  "Рыба",
  "Молочное",
  "Гарниры",
  "Хлеб",
  "Овощи и салаты",
  "Супы и готовое",
  "Фрукты",
  "Сладости",
  "Напитки",
  "Масла и соусы",
] as const;

type Extra = {
  aliases?: string;
  portionName?: string;
  portionGrams?: number;
};

function food(
  id: string,
  name: string,
  category: (typeof CATEGORIES)[number],
  kcal: number,
  protein: number,
  fat: number,
  carbs: number,
  extra?: Extra,
): Food {
  return { id, name, category, kcal, protein, fat, carbs, ...extra };
}

export const CATALOG: Food[] = [
  food("egg", "Яйцо куриное", "Завтраки", 155, 12.7, 10.9, 0.7, {
    aliases: "яйца яйцо всмятку вкрутую",
    portionName: "1 шт",
    portionGrams: 50,
  }),
  food("omelet", "Омлет", "Завтраки", 184, 12, 14, 2, { portionName: "порция", portionGrams: 150 }),
  food("syrniki", "Сырники", "Завтраки", 220, 15, 9, 20, {
    aliases: "сырник",
    portionName: "1 шт",
    portionGrams: 60,
  }),
  food("blin", "Блин", "Завтраки", 227, 6.1, 8, 32, { portionName: "1 шт", portionGrams: 40 }),
  food("oladya", "Оладья", "Завтраки", 210, 6, 7, 28, { aliases: "оладьи", portionName: "1 шт", portionGrams: 40 }),
  food("oat", "Овсяная каша на воде", "Завтраки", 88, 3, 1.7, 15, {
    aliases: "овсянка геркулес",
    portionName: "тарелка",
    portionGrams: 250,
  }),
  food("oat-milk", "Овсяная каша на молоке", "Завтраки", 102, 3.2, 4.1, 14.2, {
    aliases: "овсянка на молоке",
    portionName: "тарелка",
    portionGrams: 250,
  }),
  food("cottage5", "Творог 5%", "Завтраки", 121, 17, 5, 1.8, {
    aliases: "творог",
    portionName: "пачка",
    portionGrams: 180,
  }),
  food("cottage0", "Творог 0%", "Завтраки", 71, 16.5, 0.1, 1.3, { aliases: "творог обезжиренный" }),
  food("greek", "Греческий йогурт 2%", "Завтраки", 73, 9.5, 2, 3.5, {
    aliases: "йогурт",
    portionName: "баночка",
    portionGrams: 140,
  }),
  food("granola", "Гранола", "Завтраки", 471, 10, 20, 64, { portionName: "порция", portionGrams: 40 }),
  food("muesli", "Мюсли", "Завтраки", 352, 8, 6, 66, { portionName: "порция", portionGrams: 40 }),
  food("casserole", "Творожная запеканка", "Завтраки", 180, 12, 7, 16, {
    portionName: "кусок",
    portionGrams: 150,
  }),
  food("chicken", "Куриная грудка", "Мясо и птица", 165, 31, 3.6, 0, {
    aliases: "курица грудка филе",
    portionName: "филе",
    portionGrams: 150,
  }),
  food("thigh", "Куриное бедро без кожи", "Мясо и птица", 177, 24, 9, 0, { aliases: "бедро курица" }),
  food("turkey", "Филе индейки", "Мясо и птица", 157, 29, 3.5, 0, { aliases: "индейка" }),
  food("beef", "Говядина отварная", "Мясо и птица", 175, 25.7, 8, 0, { aliases: "говядина" }),
  food("pork", "Свинина тушёная", "Мясо и птица", 235, 17, 18, 0, { aliases: "свинина" }),
  food("cutlet", "Котлета домашняя", "Мясо и птица", 250, 15, 17, 9, {
    aliases: "котлеты",
    portionName: "1 шт",
    portionGrams: 80,
  }),
  food("chicken-cutlet", "Котлета куриная", "Мясо и птица", 190, 16, 10, 8, {
    portionName: "1 шт",
    portionGrams: 80,
  }),
  food("sausage", "Сосиска", "Мясо и птица", 266, 11, 24, 1.5, {
    aliases: "сосиски",
    portionName: "1 шт",
    portionGrams: 50,
  }),
  food("kolbasa", "Колбаса варёная", "Мясо и птица", 260, 12, 22, 1.5, { aliases: "колбаса докторская" }),
  food("bacon", "Бекон жареный", "Мясо и птица", 541, 37, 42, 1.4, { portionName: "2 полоски", portionGrams: 20 }),
  food("pelmeni", "Пельмени варёные", "Мясо и птица", 248, 12, 10, 27, {
    aliases: "пельмени",
    portionName: "порция",
    portionGrams: 180,
  }),
  food("steak", "Стейк говяжий", "Мясо и птица", 250, 26, 16, 0, {
    portionName: "стейк",
    portionGrams: 180,
  }),
  food("salmon", "Лосось запечённый", "Рыба", 208, 20, 13, 0, {
    aliases: "семга лосось рыба",
    portionName: "стейк",
    portionGrams: 150,
  }),
  food("cod", "Треска", "Рыба", 82, 18, 0.7, 0),
  food("pollock", "Минтай", "Рыба", 79, 17, 0.9, 0, { aliases: "рыба" }),
  food("shrimp", "Креветки", "Рыба", 95, 20, 1.1, 0.5, { portionName: "порция", portionGrams: 100 }),
  food("herring", "Сельдь солёная", "Рыба", 217, 19, 15, 0, { aliases: "селедка" }),
  food("tuna", "Тунец консервированный", "Рыба", 96, 21, 1, 0, { aliases: "тунец" }),
  food("milk25", "Молоко 2,5%", "Молочное", 52, 2.8, 2.5, 4.7, {
    aliases: "молоко",
    portionName: "стакан",
    portionGrams: 200,
  }),
  food("milk32", "Молоко 3,2%", "Молочное", 60, 2.9, 3.2, 4.7, { aliases: "молоко" }),
  food("kefir", "Кефир 1%", "Молочное", 40, 3, 1, 4, {
    aliases: "кефир",
    portionName: "стакан",
    portionGrams: 200,
  }),
  food("ryazhenka", "Ряженка 2,5%", "Молочное", 54, 2.9, 2.5, 4.2, { portionName: "стакан", portionGrams: 200 }),
  food("smetana", "Сметана 15%", "Молочное", 158, 2.6, 15, 3, {
    aliases: "сметана",
    portionName: "1 ст. л.",
    portionGrams: 20,
  }),
  food("cheese", "Сыр твёрдый", "Молочное", 356, 26, 27, 0, {
    aliases: "сыр российский гауда",
    portionName: "ломтик",
    portionGrams: 20,
  }),
  food("mozzarella", "Моцарелла", "Молочное", 280, 22, 22, 2.2),
  food("butter", "Масло сливочное", "Молочное", 748, 0.5, 82.5, 0.8, {
    aliases: "масло",
    portionName: "ломтик",
    portionGrams: 10,
  }),
  food("buckwheat", "Гречка варёная", "Гарниры", 110, 4.2, 1.1, 21.3, {
    aliases: "греча гречневая",
    portionName: "порция",
    portionGrams: 200,
  }),
  food("rice", "Рис варёный", "Гарниры", 116, 2.2, 0.3, 25, {
    aliases: "рис белый",
    portionName: "порция",
    portionGrams: 200,
  }),
  food("rice-brown", "Рис бурый варёный", "Гарниры", 123, 2.7, 1, 25.6, { aliases: "бурый рис" }),
  food("pasta", "Макароны варёные", "Гарниры", 135, 5, 1.1, 26, {
    aliases: "паста спагетти",
    portionName: "порция",
    portionGrams: 200,
  }),
  food("potato", "Картофель варёный", "Гарниры", 82, 2, 0.4, 16.7, {
    aliases: "картошка",
    portionName: "1 шт",
    portionGrams: 120,
  }),
  food("potato-fried", "Картофель жареный", "Гарниры", 192, 2.8, 9.5, 23.5, { aliases: "жареная картошка" }),
  food("mash", "Пюре картофельное", "Гарниры", 106, 2.1, 4.2, 14.7, {
    aliases: "пюре",
    portionName: "порция",
    portionGrams: 200,
  }),
  food("bulgur", "Булгур варёный", "Гарниры", 83, 3.1, 0.2, 14),
  food("bread", "Хлеб белый", "Хлеб", 265, 7.6, 3.2, 50, {
    aliases: "батон хлеб",
    portionName: "кусок",
    portionGrams: 30,
  }),
  food("bread-rye", "Хлеб бородинский", "Хлеб", 201, 6.8, 1.3, 40, {
    aliases: "чёрный хлеб ржаной",
    portionName: "кусок",
    portionGrams: 35,
  }),
  food("bread-whole", "Хлеб цельнозерновой", "Хлеб", 230, 9, 3.5, 41, {
    portionName: "кусок",
    portionGrams: 35,
  }),
  food("lavash", "Лаваш", "Хлеб", 275, 9.1, 1.2, 56, { portionName: "кусок", portionGrams: 50 }),
  food("cucumber", "Огурец", "Овощи и салаты", 15, 0.7, 0.1, 2.5, { portionName: "1 шт", portionGrams: 120 }),
  food("tomato", "Помидор", "Овощи и салаты", 20, 0.9, 0.2, 3.9, {
    aliases: "томат",
    portionName: "1 шт",
    portionGrams: 120,
  }),
  food("cabbage", "Капуста белокочанная", "Овощи и салаты", 27, 1.8, 0.1, 4.7, { aliases: "капуста" }),
  food("carrot", "Морковь", "Овощи и салаты", 35, 1.3, 0.1, 6.9),
  food("broccoli", "Брокколи", "Овощи и салаты", 34, 2.8, 0.4, 6.6),
  food("lettuce", "Салат листовой", "Овощи и салаты", 15, 1.4, 0.2, 2),
  food("avocado", "Авокадо", "Овощи и салаты", 160, 2, 15, 8.5, { portionName: "половина", portionGrams: 70 }),
  food("olivier", "Оливье", "Овощи и салаты", 192, 5, 15, 8, { portionName: "порция", portionGrams: 150 }),
  food("vinegret", "Винегрет", "Овощи и салаты", 130, 1.6, 8, 12),
  food("greek-salad", "Греческий салат", "Овощи и салаты", 110, 3, 9, 4, { portionName: "порция", portionGrams: 200 }),
  food("caesar", "Цезарь с курицей", "Овощи и салаты", 180, 12, 11, 7, { portionName: "порция", portionGrams: 220 }),
  food("borsch", "Борщ", "Супы и готовое", 60, 2.5, 2.4, 6, {
    aliases: "борщ со сметаной",
    portionName: "тарелка",
    portionGrams: 300,
  }),
  food("shchi", "Щи", "Супы и готовое", 45, 1.6, 2, 4.5, { portionName: "тарелка", portionGrams: 300 }),
  food("chicken-soup", "Куриный суп", "Супы и готовое", 36, 3, 1.2, 2.5, {
    portionName: "тарелка",
    portionGrams: 300,
  }),
  food("solyanka", "Солянка", "Супы и готовое", 69, 4, 4, 3.5, { portionName: "тарелка", portionGrams: 300 }),
  food("plov", "Плов", "Супы и готовое", 190, 6.5, 8, 22, { portionName: "порция", portionGrams: 250 }),
  food("pizza", "Пицца Маргарита", "Супы и готовое", 230, 9, 9, 28, {
    aliases: "пицца",
    portionName: "кусок",
    portionGrams: 120,
  }),
  food("burger", "Бургер", "Супы и готовое", 250, 13, 12, 22, { portionName: "1 шт", portionGrams: 200 }),
  food("fries", "Картофель фри", "Супы и готовое", 312, 3.4, 15, 41, {
    aliases: "фри",
    portionName: "порция",
    portionGrams: 100,
  }),
  food("shaurma", "Шаурма", "Супы и готовое", 214, 9, 10, 22, {
    aliases: "шаверма",
    portionName: "1 шт",
    portionGrams: 300,
  }),
  food("rolls", "Роллы с лососем", "Супы и готовое", 172, 7.5, 6, 22, {
    aliases: "суши роллы",
    portionName: "6 шт",
    portionGrams: 180,
  }),
  food("carbonara", "Паста карбонара", "Супы и готовое", 195, 8, 9, 20, { portionName: "порция", portionGrams: 280 }),
  food("apple", "Яблоко", "Фрукты", 47, 0.4, 0.4, 9.8, { portionName: "1 шт", portionGrams: 180 }),
  food("banana", "Банан", "Фрукты", 89, 1.1, 0.3, 23, { portionName: "1 шт", portionGrams: 120 }),
  food("orange", "Апельсин", "Фрукты", 43, 0.9, 0.2, 8.1, { portionName: "1 шт", portionGrams: 200 }),
  food("grapes", "Виноград", "Фрукты", 69, 0.6, 0.2, 17),
  food("berries", "Ягоды", "Фрукты", 40, 0.8, 0.3, 8, { aliases: "клубника черника" }),
  food("choc", "Шоколад молочный", "Сладости", 535, 6.9, 30, 59, {
    aliases: "шоколад",
    portionName: "4 дольки",
    portionGrams: 20,
  }),
  food("dark", "Шоколад тёмный 70%", "Сладости", 598, 8, 43, 46, { portionName: "4 дольки", portionGrams: 20 }),
  food("cookie", "Печенье", "Сладости", 417, 7.5, 12, 74, { portionName: "1 шт", portionGrams: 15 }),
  food("ice", "Мороженое пломбир", "Сладости", 227, 3.7, 15, 20, {
    aliases: "мороженое",
    portionName: "шарик",
    portionGrams: 60,
  }),
  food("honey", "Мёд", "Сладости", 304, 0.3, 0, 82, { portionName: "1 ч. л.", portionGrams: 10 }),
  food("sugar", "Сахар", "Сладости", 399, 0, 0, 99.8, { portionName: "1 ч. л.", portionGrams: 5 }),
  food("jam", "Варенье", "Сладости", 250, 0.3, 0.1, 62, { portionName: "1 ч. л.", portionGrams: 15 }),
  food("chips", "Чипсы", "Сладости", 520, 6, 32, 53, { portionName: "пачка", portionGrams: 80 }),
  food("walnut", "Грецкий орех", "Сладости", 654, 15, 65, 14, {
    aliases: "орехи грецкие",
    portionName: "горсть",
    portionGrams: 30,
  }),
  food("almond", "Миндаль", "Сладости", 579, 21, 50, 22, { portionName: "горсть", portionGrams: 30 }),
  food("peanut", "Арахис", "Сладости", 567, 26, 49, 16, { portionName: "горсть", portionGrams: 30 }),
  food("bar", "Протеиновый батончик", "Сладости", 380, 30, 14, 32, { portionName: "1 шт", portionGrams: 50 }),
  food("coffee", "Кофе чёрный", "Напитки", 2, 0.1, 0, 0, { portionName: "чашка", portionGrams: 200 }),
  food("cappuccino", "Капучино", "Напитки", 45, 2.2, 2.2, 4, {
    aliases: "кофе с молоком",
    portionName: "чашка",
    portionGrams: 250,
  }),
  food("latte", "Латте", "Напитки", 55, 2.8, 2.5, 4.8, { portionName: "стакан", portionGrams: 300 }),
  food("tea", "Чай без сахара", "Напитки", 1, 0, 0, 0.3, { portionName: "чашка", portionGrams: 250 }),
  food("juice", "Сок апельсиновый", "Напитки", 45, 0.7, 0.2, 10, { portionName: "стакан", portionGrams: 200 }),
  food("cola", "Кола", "Напитки", 42, 0, 0, 10.6, { aliases: "газировка", portionName: "банка", portionGrams: 330 }),
  food("beer", "Пиво светлое", "Напитки", 43, 0.5, 0, 3.6, { portionName: "0,5 л", portionGrams: 500 }),
  food("wine", "Вино красное сухое", "Напитки", 85, 0.1, 0, 2.6, { portionName: "бокал", portionGrams: 150 }),
  food("shake", "Протеиновый коктейль", "Напитки", 70, 12, 1.2, 3, {
    portionName: "шейкер",
    portionGrams: 300,
  }),
  food("olive", "Масло оливковое", "Масла и соусы", 898, 0, 99.8, 0, {
    aliases: "оливковое масло",
    portionName: "1 ст. л.",
    portionGrams: 13,
  }),
  food("sunflower", "Масло подсолнечное", "Масла и соусы", 899, 0, 99.9, 0, {
    portionName: "1 ст. л.",
    portionGrams: 13,
  }),
  food("mayo", "Майонез", "Масла и соусы", 680, 1, 75, 2.6, { portionName: "1 ст. л.", portionGrams: 15 }),
  food("soy", "Соевый соус", "Масла и соусы", 53, 6, 0, 6, { portionName: "1 ст. л.", portionGrams: 15 }),
];

const seen = new Set<string>();
for (const item of CATALOG) {
  if (seen.has(item.id)) throw new Error(`Повтор id в базе: ${item.id}`);
  seen.add(item.id);
}

export const POPULAR_IDS = [
  "egg",
  "oat",
  "buckwheat",
  "rice",
  "chicken",
  "cottage5",
  "apple",
  "banana",
  "bread",
  "cappuccino",
  "greek",
  "cucumber",
  "potato",
  "pasta",
  "salmon",
  "cheese",
  "olive",
  "kefir",
  "beef",
  "borsch",
];

export function foodById(foods: Food[], id: string): Food | undefined {
  return foods.find((item) => item.id === id);
}

export function searchFoods(foods: Food[], query: string): Food[] {
  const q = norm(query);
  if (!q) return foods;
  return foods
    .map((item) => {
      const name = norm(item.name);
      const hay = norm(`${item.name} ${item.aliases ?? ""} ${item.category}`);
      if (!hay.includes(q)) return null;
      const score = (name.startsWith(q) ? 3 : 0) + (hay.startsWith(q) ? 1 : 0);
      return { item, score };
    })
    .filter((row): row is { item: Food; score: number } => row !== null)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name, "ru"))
    .map((row) => row.item);
}
