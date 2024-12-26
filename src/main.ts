import './style.css'
import player, { load, resetGame, save } from './data.js';
import element from './dom.js';
import { ExpantaNumXType } from './ExpantaNumX.js';
import { getUpgradeTimesBought, loadCosts, Upgrade, upgrades } from './upgrades.js';

load()
setTimeout(() => {
    loadCosts()
}, 5);

function toBottom()
{
    window.scrollTo(0, document.body.scrollHeight);
}
window.onload=toBottom;

export function format(a: ExpantaNumXType) {
    return a.toStringWithDecimalPlaces(3)
}

element("doubleaone").onclick = () => {
    player.alphaone = player.alphaone.times(player.doubleaonemult)
};

//game loop
setInterval(() => {
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
        console.log(upgrade)
        const upgradeTyped = upgrades[upgrade as keyof typeof upgrades] as Upgrade;
        const canBuy = player[upgradeTyped.currency].gte(upgradeTyped.cost)
        console.log(canBuy)
        console.log(player[upgradeTyped.currency].toString())
        console.log(upgradeTyped.cost.toString())
        if(canBuy) {
            element(upgradeTyped.buttonDiv).removeAttribute("disabled")
        } else {
            element(upgradeTyped.buttonDiv).setAttribute("disabled", "disabled")
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