import './style.css'
import player, { getUpgradeTimesBought, load, resetGame, save } from './data';
import element from './dom';
import { format } from './util';
import { loadCosts, upgrades } from './upgrades';
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

if(getUpgradeTimesBought("autoclick").gt(0)) {
    clearInterval(autoclickInterval);
    autoclickInterval = setInterval(() => { bulkClickDoubler(player.bulkLevel, true) }, player.autoclickKey)
}
if(getUpgradeTimesBought("bulkautoclick").gt(0)) {
    clearInterval(bulkAutoclickInterval);
    bulkAutoclickInterval = setInterval(() => { bulkClickDoubler(player.bulkLevel, true) }, player.bulkAutoclickKey)
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
        bulkAutoclickInterval = setInterval(() => { clickDoubler() }, player.autoclickKey)
        player.bulkAutoclickFlag = false
    }
}, 100);

function updateTexts() {
    element("alphaonetext").innerHTML = `You have ${format(player.alphaone)} α<sub>1</sub>`
    element("alphatwotext").innerHTML = `You have ${format(player.alphatwo)} α<sub>2</sub>`
    element("overview").innerHTML = `α<sub>1</sub>: ${format(player.alphaone)}<br>
        α<sub>2</sub>: ${format(player.alphatwo)}<br> `

    element("doubleaone").innerHTML = `${format(player.doubleaonemult)}x α<sub>1</sub>`
    element("bulkdoubleaone").innerHTML = `${format(player.doubleaonemult)}x α<sub>1</sub> (x${format(new ExpantaNumX.pow(10, player.bulkLevel))})`
    element("bulkconvertaone").innerHTML = `Convert α<sub>2</sub> to α<sub>1</sub> (x${format(new ExpantaNumX.pow(10, player.bulkLevel))})`
}

function updateButtons() {
    for (const upgrade in upgrades) {
        const upgradeObj = upgrades[upgrade];
        const canBuy = player[upgradeObj.currency].gte(upgradeObj.cost)
        if(canBuy) {
            element(upgradeObj.buttonDiv).removeAttribute("disabled")
        } else {
            element(upgradeObj.buttonDiv).setAttribute("disabled", "disabled")
        }
    }
    if(getUpgradeTimesBought("bulkup").gt(0)) {
        element("bulkdoubleaone").removeAttribute("disabled");
        element("bulkconvertaone").removeAttribute("disabled");
        element("bulkautoclick").removeAttribute("disabled");

    } else {
        element("bulkdoubleaone").setAttribute("disabled", "disabled");
        element("bulkconvertaone").setAttribute("disabled", "disabled");
        element("bulkautoclick").setAttribute("disabled", "disabled");
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