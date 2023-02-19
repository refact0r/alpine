import { chunk } from './utils.js'

export async function getStocks(config) {
    const res = await fetch(
        `https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${config.stocks.fmpApiKey}`
    )

    if (!res.ok) {
        console.log(res)
        console.warn(
            'Failed to fetch from Financial Modeling Prep. Check your API key.'
        )
        return []
    }

    const json = await res.json()

    // get most active 9 stocks
    const stocks = json.splice(0, 9)
    stocks.sort((a, b) => b.changesPercentage - a.changesPercentage)

    // get most changed from most active 20
    // const stocks = json.splice(0, 20)
    // stocks.sort((a, b) => b.changesPercentage - a.changesPercentage)
    // stocks= stocks.splice(0, 5).concat(stocks.splice(-4))

    return chunk(stocks, 3)
}
