import './style.css'
import element from './dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ExpantaNumX, ExpantaNumXType } from './ExpantaNumX';

let storedIllion = new ExpantaNumX(0)

element('one').onclick = () => {
    storedIllion = storedIllion.add(1)
    element('illion').innerText = storedIllion.toString()
}

element('ten').onclick = () => {
    storedIllion = storedIllion.add(10)
    element('illion').innerText = storedIllion.toString()
}

element('mult').onclick = () => {
    storedIllion = storedIllion.mul(10)
    element('illion').innerText = storedIllion.toString()
}

element('pow').onclick = () => {
    storedIllion = new ExpantaNumX(10).pow(storedIllion)
    element('illion').innerText = storedIllion.toString()
}

element('comp').onclick = () => {
    compute()
}

let number: string = ""

const array = ["nullillion", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"]
const pref = ["nulli", "uni", "du", "tri", "quadri", "quinque", "sexa", "septa", "octo", "novem"]
const specific = ["killillion", "megillion", "gigillion", "terillion", "petillion", "exillion", "zettillion", "yottillion", "ronnillion", "quettillion"]
const lp = ["kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta", "ronna", "quetta"]

function i(n: ExpantaNumXType | number | string) {
    if (typeof n === "number") {
        n = new ExpantaNumX(n)
    }
    if (typeof n === "string") {
        n = new ExpantaNumX(n)
    }
    return new ExpantaNumX(10).pow(n.times(3).plus(3))
}

function compute() {
    number = "";
    if(storedIllion.lt(10)) {
        number = array[storedIllion.toNumber()]
    } else if(storedIllion.lt(1000)) {
        const str = storedIllion.toString()
        number += pref[Number(str.slice(0, 1))]
        if(storedIllion.gt(99)) {
            number += pref[Number(str.slice(1, 2))]
            number += array[Number(str.slice(2, 3))]
        } else {
            number += array[Number(str.slice(1, 2))]
        }
    } else if(storedIllion.lt(10**33 - 1)) {
        const str = storedIllion.toString()
        //github copilot code cuz im lazy
        const parts: string[] = [];
        const firstPartLength = str.length % 3 || 3;
        parts.push(str.slice(0, firstPartLength));
        for (let i = firstPartLength; i < str.length; i += 3) {
            parts.push(str.slice(i, i + 3));
        }
        //end of copilot code
        for(let i = 0; i < parts.length; i++) {
            if(Number(parts[i]) == 0) continue
            if(parts.length - i > 1) {
                if(Number(parts[i]) > 1) {
                    number += pref[Number(parts[i].slice(0, 1))]
                    if(Number(parts[i]) > 99) {
                        number += pref[Number(parts[i].slice(1, 2))]
                        number += pref[Number(parts[i].slice(2, 3))]
                    }
                    else {
                        number += pref[Number(parts[i].slice(1, 2))]
                    }
                }
                number += lp[parts.length - i - 2]
                number += '-'
            } else {
                number += pref[Number(parts[i].slice(0, 1))]
                if(Number(parts[i]) > 99) {
                    number += pref[Number(parts[i].slice(1, 2))]
                    number += array[Number(parts[i].slice(2, 3))]
                }
                else {
                    number += array[Number(parts[i].slice(1, 2))]
                }
            }
        }

        for(let i = 0; i < 10; i++) {
            if(storedIllion.eq(10**(3*i + 3))) {
                number = specific[i]
                break
            }
        }
    } else if(storedIllion.lt(i(10**33 - 1))) {
        //todo
    }
}


setInterval(() => {
    element('number').innerText = number
}, 100);