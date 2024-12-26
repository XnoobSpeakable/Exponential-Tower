import './style.css'
import player, { load, resetGame, save } from './data.js';
import element from './dom.js';
import { ExpantaNumXType } from './ExpantaNumX.js';

function loadMisc() {
    for (const upgrade in player.upgrades) {
        const upgradeTyped = player.upgrades[upgrade];
        updateCost(upgradeTyped.costDiv, upgradeTyped.cost)
    }
}

load()
loadMisc()

export interface Upgrade {
    buttonDiv: string;
    costDiv: string;
    cost: ExpantaNumXType;
    currency: "alphaone" | "alphatwo";
    onClick: () => void;
}

export function updateCost(costDiv: string, cost: ExpantaNumXType) {
    element(costDiv).innerHTML = `Cost: ${format(cost)} α<sub>1</sub>`
}

export function buyUpgrade(upgrade: Upgrade) {
    if(player[upgrade.currency].gte(upgrade.cost)) {
        upgrade.onClick()
    }
    updateCost(upgrade.costDiv, upgrade.cost)
}

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
element("convertaone").onclick = () => {
    buyUpgrade(player.upgrades.convertaone as Upgrade)
};
element("upaonemult").onclick = () => {
    buyUpgrade(player.upgrades.upaonemult as Upgrade)
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
    for (const upgrade in player.upgrades) {
        const upgradeTyped = player.upgrades[upgrade as keyof typeof player.upgrades] as Upgrade;
        const canBuy = player[upgradeTyped.currency].gte(upgradeTyped.cost)
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