import './LiveBar.css'

function randomTicker(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const charactersLength = characters.length

    const tickerLength = 3 + Math.round(Math.random())

    let result = ''
    for (let i = 0; i < tickerLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

function randomPrice(): number {
    return Math.random()*1000
}

function randomChange(price: number): [number, number] {
    const pct_change = -0.1 + Math.random()*0.1*2
    const diff = price*pct_change
    return [diff, pct_change*100]
}

function LiveBar() {
    const stocks = []
    for (let i = 0; i < 15; i++) {
        const ticker = randomTicker()
        const price = randomPrice()
        const [change, pct_change] = randomChange(price)
        stocks.push(
            <div key={ticker} className="px-6 py-2">
                <p>{ticker}<span className="p-2">{price.toFixed(2)}</span></p>
                <p>{change.toFixed(2)}<span className="p-2">{pct_change.toFixed(2)}</span></p>
            </div>
        )
    }

    return (
        <div id="live-bar" className="inline-flex">{stocks}</div>
    )
}

export default LiveBar
