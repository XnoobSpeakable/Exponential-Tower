import './style.css'
import player, { load, resetGame, save } from './data.js';
import element from './dom.js';

load()

function toBottom()
{
    window.scrollTo(0, document.body.scrollHeight);
}
window.onload=toBottom;

function format(a: { toStringWithDecimalPlaces: (arg0: number) => unknown; }) {
    return a.toStringWithDecimalPlaces(3)
}

element("doubleaone").onclick = () => {
    player.alphaone = player.alphaone.times(2)
};
element("convertaone").onclick = () => {
    player.alphaone = player.alphaone.div(1e15)
    player.alphatwo = player.alphatwo.plus(1)
};

//game loop
setInterval(() => {

}, 100);

//UI update loop
setInterval(() => {
    element("alphaonetext").innerHTML = `You have ${format(player.alphaone)} α<sub>1</sub>`
    element("alphatwotext").innerHTML = `You have ${format(player.alphatwo)} α<sub>2</sub>`
    element("overview").innerHTML = `α<sub>1</sub>: ${format(player.alphaone)}<br>
        α<sub>2</sub>: ${format(player.alphatwo)}<br> `
    if(player.alphaone.gt(player.costs.convertaone)) {
        element("convertaone").removeAttribute("disabled")
    } else {
        element("convertaone").setAttribute("disabled", "disabled")
    }
    
}, 100);

//save loop
setInterval(() => {
    save()
}, 4000);


element("wipesave").onclick = () => {resetGame()};