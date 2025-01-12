import "./Ticker.css";

function randomTicker(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;

  const tickerLength = 3 + Math.round(Math.random());

  let result = "";
  for (let i = 0; i < tickerLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randomPrice(): number {
  return Math.random() * 1000;
}

function randomChange(price: number): [number, number] {
  const pct_change = -0.1 + Math.random() * 0.1 * 2;
  const diff = price * pct_change;
  return [diff, pct_change * 100];
}

function Ticker() {
  const stocks = [];
  for (let i = 0; i < 15; i++) {
    const ticker = randomTicker();
    const price = randomPrice();
    const [change, pct_change] = randomChange(price);

    let colorClass = "text-white";
    if (change < 0) colorClass = "text-red-700";
    else if (change > 0) colorClass = "text-green-600";

    stocks.push(
      <div key={ticker} className="min-w-48 px-6 py-2">
        <div className="flex justify-between text-white">
          <p>{ticker}</p>
          <span className="font-bold">{price.toFixed(2)}</span>
        </div>
        <div className={`mt-1 flex items-end ${colorClass}`}>
          <span className="text-xl leading-none">{pct_change.toFixed(2)}%</span>
          <span className="pl-2 text-xs">({change.toFixed(2)})</span>
        </div>
      </div>,
    );
  }

  return (
    <section
      id="ticker"
      className="flex divide-x divide-gray-700 overflow-scroll overflow-y-hidden bg-gray-900"
    >
      {stocks}
    </section>
  );
}

export default Ticker;
