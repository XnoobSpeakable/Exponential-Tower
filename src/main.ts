import './style.css'
import player, { getUpgradeTimesBought, load, resetGame, save } from './data';
import element from './dom';
import { format } from './util';
import { loadCosts, Upgrade, upgrades } from './upgrades';

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

element("doubleaone").onclick = () => { clickDoubler()};

let autoclickInterval: number | undefined = undefined;

//game loop
setInterval(() => {
    if(getUpgradeTimesBought("autoclick").gt(0) && getUpgradeTimesBought("autoclick").lt(20) && player.autoclickFlag) {
        clearInterval(autoclickInterval);
        autoclickInterval = setInterval(() => { clickDoubler() }, player.autoclickKey)
    }
    player.autoclickFlag = false
}, 100);

function updateTexts() {
    element("alphaonetext").innerHTML = `You have ${format(player.alphaone)} α<sub>1</sub>`
    element("alphatwotext").innerHTML = `You have ${format(player.alphatwo)} α<sub>2</sub>`
    element("overview").innerHTML = `α<sub>1</sub>: ${format(player.alphaone)}<br>
        α<sub>2</sub>: ${format(player.alphatwo)}<br> `

    element("doubleaone").innerHTML = `${format(player.doubleaonemult)}x α<sub>1</sub>`
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