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
    functionfirst ?: boolean;
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
        costFormula: function () {
            const x = ExpantaNumX.pow(1e15, ExpantaNumX.div(1, player.upgradesBought.upconversion.div(10).plus(1)))
            upgrades.convertaone.cost = ExpantaNumX.pow(x, player.conversions.plus(1))
        },
        currency: "alphaone",
        upgrFunction: function () {
            player.alphatwo = player.alphatwo.plus(1)
            player.conversions = player.conversions.plus(1)
        },
        functionfirst: true
    },
    upaonemult: {
        buttonDiv: "upaonemult",
        costDiv: "upaonemultcost",
        cost: new ExpantaNumX('1'),
        costType: "sub",
        costFormula: function () {
            upgrades.upaonemult.cost = player.upgradesBought.upaonemult.plus(1)
        },
        currency: "alphatwo",
        upgrFunction: function () {
            player.doubleaonemult = player.doubleaonemult.plus(1)
        }
    },
    upaonepower: {
        buttonDiv: "upaonepower",
        costDiv: "upaonepowercost",
        cost: new ExpantaNumX('1'),
        costType: "sub",
        costFormula: function () {
            upgrades.upaonepower.cost = player.upgradesBought.upaonepower.plus(1)
        },
        currency: "alphatwo",
        upgrFunction: function () {
            player.doubleaonemult = player.doubleaonemult.pow(1.1)
        }
    },
    autoclick: {
        buttonDiv: "autoclick",
        costDiv: "autoclickcost",
        cost: new ExpantaNumX('1e50'),
        costType: "sub",
        costFormula: function () {
            upgrades.autoclick.cost = ExpantaNumX.pow(1e50, player.upgradesBought.autoclick.plus(1))
            if(player.upgradesBought.autoclick.gt(25)) {
                upgrades.autoclick.cost = new ExpantaNumX("Infinity")
            }
        },
        currency: "alphaone",
        upgrFunction: function () {
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
        costFormula: function () {
            upgrades.upconversion.cost = ExpantaNumX.pow(3, player.upgradesBought.upconversion).times(22)
        },
        currency: "alphatwo",
        upgrFunction: function () {
            upgrades.convertaone.costFormula()
        }
    },
    bulkup: {
        buttonDiv: "bulkup",
        costDiv: "bulkupcost",
        cost: new ExpantaNumX('1e1000'),
        costType: "div",
        costFormula: function () {
            upgrades.bulkup.cost = ExpantaNumX.pow(new ExpantaNumX("1e1000"), ExpantaNumX.pow(10, player.upgradesBought.bulkup))
        },
        currency: "alphaone",
        upgrFunction: function () {
            player.bulkLevel = player.bulkLevel.plus(1)
        }
    },
    bulkautoclick: {
        buttonDiv: "bulkautoclick",
        costDiv: "bulkautoclickcost",
        cost: new ExpantaNumX('1e1000'),
        costType: "div",
        costFormula: function () {
            upgrades.bulkautoclick.cost = ExpantaNumX.pow(new ExpantaNumX("1e1000"), player.upgradesBought.bulkautoclick.plus(1))
            if(player.upgradesBought.bulkautoclick.gt(10)) {
                upgrades.bulkautoclick.cost = new ExpantaNumX("Infinity")
            }
        },
        currency: "alphaone",
        upgrFunction: function () {
            if(player.upgradesBought.bulkautoclick.lte(10)) {
                player.bulkAutoclickKey = 1000 / player.upgradesBought.bulkautoclick.toNumber()
            }
            player.bulkAutoclickFlag = true
        }
    },
    bulkconvertaone: {
        buttonDiv: "bulkconvertaone",
        costDiv: "bulkconvertaonecost",
        cost: new ExpantaNumX('1e15'),
        costType: "div",
        costFormula: function () {
            const x = ExpantaNumX.pow(1e15, ExpantaNumX.div(1, player.upgradesBought.upconversion.div(10).plus(1)))
            upgrades.bulkconvertaone.cost = ExpantaNumX.pow(x, player.conversions.plus(new ExpantaNumX.pow(10, player.bulkLevel)))
        },
        currency: "alphaone",
        upgrFunction: function () {
            player.alphatwo = player.alphatwo.plus(new ExpantaNumX.pow(10, player.bulkLevel))
            player.conversions = player.conversions.plus(new ExpantaNumX.pow(10, player.bulkLevel))
        },
        functionfirst: true
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
        if(upgrade.functionfirst) {
            upgrade.upgrFunction()
            upgrade.costFormula()

        } else {
            upgrade.costFormula()
            upgrade.upgrFunction()
        }
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
    upgrades.bulkconvertaone.costFormula() //not a mistake
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
element("bulkup").onclick = () => {
    buyUpgrade(upgrades.bulkup)
};
element("bulkconvertaone").onclick = () => {
    buyUpgrade(upgrades.bulkconvertaone)
    upgrades.convertaone.costFormula() //not a mistake
};
element("bulkautoclick").onclick = () => {
    buyUpgrade(upgrades.bulkautoclick)
};