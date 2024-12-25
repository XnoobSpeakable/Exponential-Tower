import './style.css'
import './ExpantaNum.js'
import player, { load, resetGame, save } from './data.js';
import element from './dom.js';

load()

element("doubleaone").onclick = () => {
    player.alphaone = player.alphaone.times(2)
};

//game loop
setInterval(() => {

}, 100);

//text update loop
setInterval(() => {
    element("alphaonetext").innerHTML = `You have ${player.alphaone} α<sub>1</sub>`
}, 100);

//save loop
setInterval(() => {
    save()
}, 4000);


element("wipesave").onclick = () => {resetGame()};