import {ExpantaNumX} from "./ExpantaNumX.ts"
import { ExpantaNumXType } from './ExpantaNumX.js';
import { Upgrade } from "./main.ts";

const player: Player = {
    alphaone: new ExpantaNumX('1'),
    alphatwo: new ExpantaNumX('0'),
    upgrades: {
        convertaone: {
            buttonDiv: "convertaone",
            costDiv: "convertaonecost",
            cost: new ExpantaNumX('1e15'),
            currency: "alphaone",
            onClick: () => {
                player.alphaone = player.alphaone.div(player.upgrades.convertaone.cost)
                player.alphatwo = player.alphatwo.plus(1)
                player.upgrades.convertaone.cost = player.upgrades.convertaone.cost.times(1e15)
            }
        },
        upaonemult: {
            buttonDiv: "upaonemult",
            costDiv: "upaonemultcost",
            cost: new ExpantaNumX('1'),
            currency: "alphatwo",
            onClick: () => {
                player.doubleaonemult = player.doubleaonemult.plus(1)
                player.alphatwo = player.alphatwo.minus(player.upgrades.upaonemult.cost)
                player.upgrades.upaonemult.cost = player.upgrades.upaonemult.cost.times(2)
            }
        }
    },
    doubleaonemult: new ExpantaNumX('2')
};

export interface Player {
    alphaone: ExpantaNumXType;
    alphatwo: ExpantaNumXType;
    upgrades: {
        [key: string]: Upgrade;
    },
    doubleaonemult: ExpantaNumXType;
    [key: string]: ExpantaNumXType | { [key: string]: Upgrade } | string;
}

const gameId = "exponentialtower_savefile";

/**
 * Recursively merge two objects.
 * @param source The object to which copy the property values from the
 * other object.
 * @param data The object from which to copy property values.
 */
export function deepMerge<T extends object>(source: T, data: T): void {
    for (const key in data) {
        const value = data[key];
        if (
            typeof value === "object" &&
            value !== null
        ) {
            const newSource = source[key];
            if (!(key in source)) {
                // @ts-expect-error I know this is fine
                source[key] = Array.isArray(value) ? [] : {};
            }
            if (typeof newSource === "object" && newSource !== null) {
                deepMerge(newSource, value);
            }
        } else source[key] = value;
    }
}

export function save(): void {
    localStorage.setItem(gameId, JSON.stringify(player));
}

export function load(): void {
    const save = localStorage.getItem(gameId);
    if (save === null) return;
    const parsed = JSON.parse(save);
    deepMerge(player, parsed);
    for(const key in player) {
        if(typeof player[key] === "string") {
            console.log(player[key]);
            console.log(new ExpantaNumX(player[key]));
            player[key] = new ExpantaNumX(player[key]);
        }
    }
}

export function resetGame(): void {
    localStorage.removeItem(gameId);
}

export default player;