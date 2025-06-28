import { ExpantaNumXType } from "./ExpantaNumX";

export function format(a: ExpantaNumXType) {
    return a.toStringWithDecimalPlaces(3, undefined, 3)
}