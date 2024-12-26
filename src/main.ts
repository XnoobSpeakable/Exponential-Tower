import './style.css'
import player, { load, Player, resetGame, save } from './data.js';
import element from './dom.js';
import { ExpantaNumXType } from './ExpantaNumX.js';

function loadMisc() {
    const playerTyped = player as Player;
    for (const upgrade in playerTyped.upgrades) {
        const upgradeTyped = playerTyped.upgrades[upgrade];
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

export function updateCost(costDiv: string, cost: unknown) {
    element(costDiv).innerHTML = `Cost: ${format(cost)} α<sub>1</sub>`
}

export function buyUpgrade(upgrade: Upgrade) {
    const playerTyped = player as Player;
    if(playerTyped[upgrade.currency].gte(upgrade.cost)) {
        upgrade.onClick()
    }
    updateCost(upgrade.costDiv, upgrade.cost)
}

function toBottom()
{
    window.scrollTo(0, document.body.scrollHeight);
}
window.onload=toBottom;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function format(a: any) {
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
    const playerTyped = player as Player;
    for (const upgrade in playerTyped.upgrades) {
        const upgradeTyped = playerTyped.upgrades[upgrade as keyof typeof playerTyped.upgrades] as Upgrade;
        const canBuy = playerTyped[upgradeTyped.currency].gte(upgradeTyped.cost)
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