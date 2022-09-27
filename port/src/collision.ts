import { Rect } from "./types";

export function intersect(a: Rect, b: Rect): boolean {
  const x = Math.max(a.x, b.x);
  const n1 = Math.min(a.x + a.width, b.x + b.width);
  const y = Math.max(a.y, b.y);
  const n2 = Math.min(a.y + a.height, b.y + b.height);
  return n1 >= x && n2 >= y;
}

export function pointInRect(x: number, y: number, rect: Rect) {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
}
