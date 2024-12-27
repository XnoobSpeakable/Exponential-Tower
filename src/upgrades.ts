import player from "./data";
import element from "./dom";
import { ExpantaNumX, ExpantaNumXType } from "./ExpantaNumX";
import { format } from "./util"

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
            const x = ExpantaNumX.pow(1e15, ExpantaNumX.div(1, player.upgradesBought.upconversion.div(10).plus(1)))
            upgrades.convertaone.cost = ExpantaNumX.pow(x, player.upgradesBought.convertaone.plus(1))
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
            player.doubleaonemult = player.doubleaonemult.pow(1.1)
        }
    },
    autoclick: {
        buttonDiv: "autoclick",
        costDiv: "autoclickcost",
        cost: new ExpantaNumX('1e50'),
        costType: "sub",
        costFormula: () => {
            upgrades.autoclick.cost = ExpantaNumX.pow(1e50, player.upgradesBought.autoclick.plus(1))
            if(player.upgradesBought.autoclick.gt(25)) {
                upgrades.autoclick.cost = new ExpantaNumX("Infinity")
            }
        },
        currency: "alphaone",
        upgrFunction: () => {
            if(player.upgradesBought.autoclick.lte(25)) {
                player.autoclickKey = 1000 / player.upgradesBought.autoclick.toNumber()
            }
            player.autoclickFlag = true
        }
    },
    upconversion: {
        buttonDiv: "upconversion",
        costDiv: "upconversioncost",
        cost: new ExpantaNumX('22'),
        costType: "sub",
        costFormula: () => {
            upgrades.upconversion.cost = ExpantaNumX.pow(3, player.upgradesBought.upconversion).times(22)
        },
        currency: "alphatwo",
        upgrFunction: () => {
            upgrades.convertaone.costFormula()
        }
    },
}

export function updateCostDisp(costDiv: string, cost: ExpantaNumXType, curr: Currency, d: "sub" | "div" = "sub") {
    let currencyrender = ""
    let costText = "Cost:"
    switch (curr) {
        case "alphaone":
            currencyrender = 'α<sub>1</sub>'
            break;
        case "alphatwo":
            currencyrender = 'α<sub>2</sub>'
            break;
    }
    if(d === "div") costText = "DivCost:"
    element(costDiv).innerHTML = `${costText} ${format(cost)} ${currencyrender}`
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
        if(upgrade.costType === "sub") {
            updateCostDisp(upgrade.costDiv, upgrade.cost, upgrade.currency, "sub")
        } else {
            updateCostDisp(upgrade.costDiv, upgrade.cost, upgrade.currency, "div")
        }

    }
}

//load costs on game reload
export function loadCosts() {
    for (const upgrade in upgrades) {
        const upgradeObj = upgrades[upgrade];
        upgradeObj.costFormula()
        if(upgradeObj.costType === "sub") {
            updateCostDisp(upgradeObj.costDiv, upgradeObj.cost, upgradeObj.currency, "sub")
        } else {
            updateCostDisp(upgradeObj.costDiv, upgradeObj.cost, upgradeObj.currency, "div")
        }
    }
}

element("convertaone").onclick = () => {
    buyUpgrade(upgrades.convertaone)
};
element("upaonemult").onclick = () => {
    buyUpgrade(upgrades.upaonemult)
};
element("upaonepower").onclick = () => {
    buyUpgrade(upgrades.upaonepower)
};
element("autoclick").onclick = () => {
    buyUpgrade(upgrades.autoclick)
};
element("upconversion").onclick = () => {
    buyUpgrade(upgrades.upconversion)
};