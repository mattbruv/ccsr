import { Pos, Rect } from "./types";

export function intersect(a: Rect, b: Rect): boolean {
  const x = Math.max(a.x, b.x);
  const n1 = Math.min(a.x + a.width, b.x + b.width);
  const y = Math.max(a.y, b.y);
  const n2 = Math.min(a.y + a.height, b.y + b.height);
  return n1 > x && n2 > y;
}

export function rectAinRectB(rectA: Rect, rectB: Rect): boolean {
  const a = rectA;
  const points: Pos[] = [
    { x: a.x, y: a.y },
    { x: a.x + a.width, y: a.y },
    { x: a.x, y: a.y + a.height },
    { x: a.x + a.width, y: a.y + a.height },
  ];
  return points.every((p) => pointInRect(p, rectB));
}

export function pointInRect(point: Pos, rect: Rect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}
