import './style.css'
import player, { getUpgradeTimesBought, load, resetGame, save, saveExport, saveImport, saveImportConfirm } from './data';
import element from './dom';
import { format } from './util';
import { loadCosts, updateCostDisp, upgrades } from './upgrades';
import { ExpantaNumX, ExpantaNumXType } from './ExpantaNumX';

load()
loadCosts()

function toBottom()
{
    window.scrollTo(0, document.body.scrollHeight);
}
window.onload=toBottom;

function clickDoubler() {
    player.alphaone = player.alphaone.times(player.doubleaonemult)
}
function bulkClickDoubler(bulk: ExpantaNumXType, powered: boolean) {
    if(powered) {
        bulk = new ExpantaNumX.pow(10, bulk)
    }
    player.alphaone = player.alphaone.times(player.doubleaonemult.pow(bulk))
}

element("doubleaone").onclick = () => { clickDoubler()};
element("bulkdoubleaone").onclick = () => { bulkClickDoubler(player.bulkLevel, true)};

let autoclickInterval: number | undefined = undefined;
let bulkAutoclickInterval: number | undefined = undefined;
let autobulkInterval: number | undefined = undefined;

if(getUpgradeTimesBought("autoclick").gt(0)) {
    clearInterval(autoclickInterval);
    autoclickInterval = setInterval(() => { bulkClickDoubler(player.bulkLevel, true) }, player.autoclickKey)
}
if(getUpgradeTimesBought("bulkautoclick").gt(0)) {
    clearInterval(bulkAutoclickInterval);
    bulkAutoclickInterval = setInterval(() => { bulkClickDoubler(player.bulkLevel, true) }, player.bulkAutoclickKey)
}
if(getUpgradeTimesBought("autobulk").gt(0)) {
    clearInterval(autobulkInterval);
    if(getUpgradeTimesBought("autobulk").lte(10)) {
        const t = 1000 / getUpgradeTimesBought("autobulk").toNumber()
        autobulkInterval = setInterval(() => { 
            player.bulkLevel = player.bulkLevel.plus(1) 
            player.upgradesBought.bulkup = player.upgradesBought.bulkup.plus(1)
            upgrades.bulkup.costFormula()
            updateCostDisp(upgrades.bulkup.costDiv, upgrades.bulkup.cost, upgrades.bulkup.currency, "div")
        }, t)
    } else {
        const times = getUpgradeTimesBought("autobulk").minus(9)
        autobulkInterval = setInterval(() => { 
            player.bulkLevel = player.bulkLevel.plus(times) 
            player.upgradesBought.bulkup = player.upgradesBought.bulkup.plus(times)
            upgrades.bulkup.costFormula()
            updateCostDisp(upgrades.bulkup.costDiv, upgrades.bulkup.cost, upgrades.bulkup.currency, "div")
        }, 100)
    }
}

//game loop
setInterval(() => {
    if(getUpgradeTimesBought("autoclick").gt(0) && player.autoclickFlag) {
        clearInterval(autoclickInterval);
        autoclickInterval = setInterval(() => { clickDoubler() }, player.autoclickKey)
        player.autoclickFlag = false
    }
    if(getUpgradeTimesBought("bulkautoclick").gt(0) && player.bulkAutoclickFlag) {
        clearInterval(bulkAutoclickInterval);
        bulkAutoclickInterval = setInterval(() => { bulkClickDoubler(player.bulkLevel, true) }, player.autoclickKey)
        player.bulkAutoclickFlag = false
    }
    if(getUpgradeTimesBought("autobulk").gt(0) && player.autobulkFlag) {
        clearInterval(autobulkInterval);
        if(getUpgradeTimesBought("autobulk").lte(10)) {
            const t = 1000 / getUpgradeTimesBought("autobulk").toNumber()
            autobulkInterval = setInterval(() => { 
                player.bulkLevel = player.bulkLevel.plus(1) 
                player.upgradesBought.bulkup = player.upgradesBought.bulkup.plus(1)
                upgrades.bulkup.costFormula()
                updateCostDisp(upgrades.bulkup.costDiv, upgrades.bulkup.cost, upgrades.bulkup.currency, "div")
            }, t)
        } else {
            const times = getUpgradeTimesBought("autobulk").minus(9)
            autobulkInterval = setInterval(() => { 
                player.bulkLevel = player.bulkLevel.plus(times) 
                player.upgradesBought.bulkup = player.upgradesBought.bulkup.plus(times)
                upgrades.bulkup.costFormula()
                updateCostDisp(upgrades.bulkup.costDiv, upgrades.bulkup.cost, upgrades.bulkup.currency, "div")
            }, 100)
        }
        player.autobulkFlag = false
    }

    upgrades.convertaone.costFormula()
    updateCostDisp(upgrades.convertaone.costDiv, upgrades.convertaone.cost, upgrades.convertaone.currency, "div")
    upgrades.bulkconvertaone.costFormula() 
    updateCostDisp(upgrades.bulkconvertaone.costDiv, upgrades.bulkconvertaone.cost, upgrades.bulkconvertaone.currency, "div")
}, 100);

function updateTexts() {
    element("alphaonetext").innerHTML = `You have ${format(player.alphaone)} α<sub>1</sub>`
    element("alphatwotext").innerHTML = `You have ${format(player.alphatwo)} α<sub>2</sub>`
    element("alphathreetext").innerHTML = `You have ${format(player.alphathree)} α<sub>3</sub>`
    element("alphafourtext").innerHTML = `You have ${format(player.alphafour)} α<sub>4</sub>`
    element("overview").innerHTML = `α<sub>1</sub>: ${format(player.alphaone)}<br>
        α<sub>2</sub>: ${format(player.alphatwo)}<br> 
        α<sub>3</sub>: ${format(player.alphathree)}<br>
        α<sub>4</sub>: ${format(player.alphafour)}<br>`

    element("doubleaone").innerHTML = `${format(player.doubleaonemult)}x α<sub>1</sub>`
    element("bulkdoubleaone").innerHTML = `${format(player.doubleaonemult)}x α<sub>1</sub> (x${format(new ExpantaNumX.pow(10, player.bulkLevel))})`
    element("bulkconvertaone").innerHTML = `Convert α<sub>1</sub> to α<sub>2</sub> (x${format(new ExpantaNumX.pow(10, player.bulkLevel))})`
}

function updateButtons() {
    if(!getUpgradeTimesBought("bulkup").gt(0)) {
        element("bulkdoubleaone").setAttribute("disabled", "disabled");
        element("bulkconvertaone").setAttribute("disabled", "disabled");
        element("bulkautoclick").setAttribute("disabled", "disabled");
    } else {
        element("bulkdoubleaone").removeAttribute("disabled");
        element("bulkconvertaone").removeAttribute("disabled");
        element("bulkautoclick").removeAttribute("disabled");
    }
    for (const upgrade in upgrades) {
        const upgradeObj = upgrades[upgrade];
        const canBuy = player[upgradeObj.currency].gte(upgradeObj.cost)
        if(canBuy) {
            element(upgradeObj.buttonDiv).removeAttribute("disabled")
        } else {
            element(upgradeObj.buttonDiv).setAttribute("disabled", "disabled")
        }
    }
}

//UI update loop
setInterval(() => {
    updateTexts()
    updateButtons()
}, 100);

//save loop
setInterval(() => {
    save()
}, 4000);

element("wipesave").onclick = () => {resetGame()};
element("export").onclick = () => { saveExport()};
element("import").onclick = () => { saveImport()};
element("saveimportconfirm").onclick = () => { saveImportConfirm()};

if (import.meta.env.DEV) {
    element("cheat").style.display = "inline";
    function cheat() {
        player.alphaone = player.alphaone.times(ExpantaNumX.pow(10, 1000))
    }
    element("cheat").onclick = () => { cheat()};
}
