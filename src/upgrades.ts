import player from "./data";
import element from "./dom";
import { ExpantaNumX, ExpantaNumXType } from "./ExpantaNumX";
import { format } from "./main"

export type Currency = "alphaone" | "alphatwo"

export interface Upgrade {
    buttonDiv: string;
    costDiv: string;
    cost: ExpantaNumXType;
    costType: "sub" | "div";
    costFormula: () => void;
    currency: Currency;
    upgrFunction: () => void;
}

export interface Upgrades {
    [key: string]: Upgrade;
}

export const upgrades: Upgrades = {
    convertaone: {
        buttonDiv: "convertaone",
        costDiv: "convertaonecost",
        cost: new ExpantaNumX('1e15'),
        costType: "div",
        costFormula: () => {
            upgrades.convertaone.cost = ExpantaNumX.pow(1e15, player.upgradesBought.convertaone.plus(1))
        },
        currency: "alphaone",
        upgrFunction: () => {
            player.alphatwo = player.alphatwo.plus(1)
        },
    },
    upaonemult: {
        buttonDiv: "upaonemult",
        costDiv: "upaonemultcost",
        cost: new ExpantaNumX('1'),
        costType: "sub",
        costFormula: () => {
            upgrades.upaonemult.cost = player.upgradesBought.upaonemult.plus(1)
        },
        currency: "alphatwo",
        upgrFunction: () => {
            player.doubleaonemult = player.doubleaonemult.plus(1)
        }
    },
    upaonepower: {
        buttonDiv: "upaonepower",
        costDiv: "upaonepowercost",
        cost: new ExpantaNumX('1'),
        costType: "sub",
        costFormula: () => {
            upgrades.upaonepower.cost = player.upgradesBought.upaonepower.plus(1)
        },
        currency: "alphatwo",
        upgrFunction: () => {
            player.doubleaonemult = player.doubleaonemult.pow(getUpgradeTimesBought("upaonepower").div(10).plus(1))
        }
    }
}

export function updateCostDisp(costDiv: string, cost: ExpantaNumXType, curr: Currency) {
    switch (curr) {
        case "alphaone":
            element(costDiv).innerHTML = `Cost: ${format(cost)} α<sub>1</sub>`
            break;
        case "alphatwo":
            element(costDiv).innerHTML = `Cost: ${format(cost)} α<sub>2</sub>`
            break;
    }
}

//snippet from https://www.webdevtutor.net/blog/typescript-get-object-key-by-value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getObjectKeyByValue = (obj: { [key: string]: any }, value: any) => {
    return Object.keys(obj).find(key => obj[key] === value);
};

export function buyUpgrade(upgrade: Upgrade) {
    if(player[upgrade.currency].gte(upgrade.cost)) {
        //subtract cost from currency
        if(upgrade.costType === "sub") {
            player[upgrade.currency] = player[upgrade.currency].minus(upgrade.cost)
        } else {
            player[upgrade.currency] = player[upgrade.currency].div(upgrade.cost)
        }
        //add 1 to upgrade times bought
        const upgradeKey = getObjectKeyByValue(upgrades, upgrade) as unknown as string
        player.upgradesBought[upgradeKey] = player.upgradesBought[upgradeKey].plus(1)
        //update cost, execute what the upgrade does, update displayed cost
        upgrade.costFormula()
        upgrade.upgrFunction()
        updateCostDisp(upgrade.costDiv, upgrade.cost, upgrade.currency)
    }
}

//load costs on game reload
export function loadCosts() {
    for (const upgrade in upgrades) {
        const upgradeObj = upgrades[upgrade];
        upgradeObj.costFormula()
        updateCostDisp(upgradeObj.costDiv, upgradeObj.cost, upgradeObj.currency)
    }
}

export function getUpgradeTimesBought(upgrade: string) {
    return player.upgradesBought[upgrade]
}

element("convertaone").onclick = () => {
    buyUpgrade(upgrades.convertaone as Upgrade)
};
element("upaonemult").onclick = () => {
    buyUpgrade(upgrades.upaonemult as Upgrade)
};
element("upaonepower").onclick = () => {
    buyUpgrade(upgrades.upaonepower as Upgrade)
};