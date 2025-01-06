import { Random, Vector } from 'excalibur';

export const random = new Random();
export const isCanvasElement = (ele: HTMLElement | null): ele is HTMLCanvasElement => !(ele === null || ele.nodeName !== 'CANVAS');
export const round = (value: number, rounding: number): number => Number(value.toFixed(rounding));
export const vecToArray = (vector: Vector, rounding?: number): [number, number] => rounding ? [round(vector.x, rounding), round(vector.y, rounding)] : [vector.x, vector.y];
export const vec = (a: number | Vector | [number, number], b?: number): Vector => typeof a === 'number' ? new Vector(a, b!) : Array.isArray(a) ? new Vector(...a) : a;
