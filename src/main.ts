import './style.css'
import player, { load, resetGame, save } from './data.js';
import element from './dom.js';

load()

function format(a: { toStringWithDecimalPlaces: (arg0: number) => unknown; }) {
    return a.toStringWithDecimalPlaces(3)
}
const x = new ExpantaNum("2")
console.log(x)

element("doubleaone").onclick = () => {
    player.alphaone = player.alphaone.times(2)
};

//game loop
setInterval(() => {

}, 100);

//text update loop
setInterval(() => {
    element("alphaonetext").innerHTML = `You have ${format(player.alphaone)} α<sub>1</sub>`
}, 100);

//save loop
setInterval(() => {
    save()
}, 4000);


element("wipesave").onclick = () => {resetGame()};