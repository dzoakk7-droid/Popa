export async function fileToJpeg(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const first = draw(bitmap, 1280, 0.72);
    if (first.length <= 1_700_000) return first;
    const second = draw(bitmap, 960, 0.6);
    if (second.length <= 1_700_000) return second;
    throw new Error("too-big");
  } finally {
    bitmap.close();
  }
}

function draw(bitmap: ImageBitmap, maxEdge: number, quality: number): string {
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(8, Math.round(bitmap.width * scale));
  const height = Math.max(8, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}
