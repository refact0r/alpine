# alpine

A clean browser startpage with weather and stock market widgets.

## features

- time and date
- current weather and 12hr forecast using [OpenWeatherMap](https://openweathermap.org/api)
- stock market tracker using [Alpaca](https://alpaca.markets) or [FinancialModelingPrep](https://site.financialmodelingprep.com/)
- 16 customizable links

![image](https://user-images.githubusercontent.com/34758569/218351845-fad3989f-3662-4f93-b63b-8955e405596a.png)

my firefox css: <https://github.com/refact0r/sidefox>

matching firefox color theme: [firefox color](https://color.firefox.com/?theme=XQAAAAJnAgAAAAAAAABBqYhm849SCicxcUF-LXcGHf3p79EhVPVQizvzWDHermX3x4Ndce8GU3lAYj6VjlT7trCv4ZbKin9T0uvI5Tl940N20U1li8Ep9D7QNMncKwLWuNp6w3qXhxdSTAv63FusZrSR7Z7r8yI6xNb0fHpi6Lpoy4BNAvZOCmrP64MkQKHQmEm2SdoKO78G3vd5Dc6vPTlMKK9nJ7sHvSJc2GLK-7DThOGDTNXPssZG-syuCqoHAse4AwXl0tqz9kWLF-rNf-DpuxHCHiZNjTONkPKhWSoAbCMkiPef7wAsSDi43MDDhpuVQkUXpo3pztPiMr_QSaHK1ui7jbr0XUA19zHcV_sXn0qBiXbavI9mzghud2EsEjDD__gvIDc)

## usage

firefox

1. download the .xpi extension file from the latest release
2. go to `about:addons` in firefox, click the gear icon in the top right
3. click "Install Add-on from File" and select the .xpi file

chrome

1. clone the repo
2. delete this section from `public/manifest.json`:

```
"chrome_settings_overrides": {
    "homepage": "index.html"
},
```

3. run `npm install`
4. run `npm run build`, you should see it create a folder called `/dist`
5. go to `chrome://extensions/` in chrome and enable developer mode in the top right
6. click "Load Unpacked" in the top left and select the `/dist` folder

enabling weather and stocks

1. create an account at <https://openweathermap.org/api>
2. get your weather API key at <https://home.openweathermap.org/api_keys>
3. create an account for [Alpaca](https://alpaca.markets) or [FinancialModelingPrep](https://site.financialmodelingprep.com/)

   using Alpaca will get % changes for the 9 stocks specified in the config, while using FinancialModelingPrep will get the 9 most active stocks of the day
4. get your [Alpaca key and secret](https://app.alpaca.markets/paper/dashboard/overview) (far right) or [FinancialModelingPrep API key](https://site.financialmodelingprep.com/developer/docs/api-keys)
5. open alpine and click in the bottom right to open the config editor
6. paste your api keys into the corresponding spots on the config, make sure to change `stocks.source` to `fmp` if using FinancialModelingPrep
7. you can also edit settings like weather location, links, and stocks

## build from source

environment requirements:

```
node: >=14.18.0
npm: >=8.0.0
```

1. run `npm install`
2. run `npm run build`
3. the generated code should appear in `/dist`
