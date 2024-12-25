import './ExpantaNum.js'

export function formatBig(): string {
    n = new ExpantaNum("0")
    if(n.log10)
    
    n.absLog10().toNumber() >= 6
        ? formatDecimal(n, 2).replace("e+", "e").replace(".00", "")
        : n.toFixed(0);
}