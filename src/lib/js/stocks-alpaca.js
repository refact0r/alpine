import { chunk } from './utils.js'

export async function getStocks(config) {
    const res = await fetch(
        `https://data.alpaca.markets/v2/stocks/snapshots?symbols=${config.stocks.tickers.join(
            ','
        )}`,
        {
            headers: {
                'APCA-API-KEY-ID': config.stocks.alpacaKeyId,
                'APCA-API-SECRET-KEY': config.stocks.alpacaSecretKey
            }
        }
    )

    if (!res.ok) {
        console.log(res)
        console.warn(
            'Failed to fetch from Alpaca. Check your API key and secret.'
        )
        return []
    }

    const data = await res.json()
    console.log(data)

    const ret = []
    for (let ticker of config.stocks.tickers) {
        const stock = data[ticker]
        const prevClose = stock.prevDailyBar.c
        const lastPrice = stock.dailyBar.c
        const changePercent = ((lastPrice - prevClose) / prevClose) * 100
        ret.push({
            symbol: ticker,
            price: lastPrice,
            changesPercentage: changePercent
        })
    }
    return chunk(ret, 3)
}
