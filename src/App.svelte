<script>
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { twelveHour, twoDigit } from './lib/js/utils.js'
    import { getWeather } from './lib/js/weather.js'
    import { getStocks as getFMP } from './lib/js/stocks-fmp.js'
    import { getStocks as getAlpaca } from './lib/js/stocks-alpaca.js'

    // @ts-ignore
    import banner0 from './assets/banners/banner0.jpg?format=avif&w=5000&h=700'
    // @ts-ignore
    import banner1 from './assets/banners/banner1.jpg?format=avif&w=6269&h=880&quality=60'
    // @ts-ignore
    import banner2 from './assets/banners/banner2.jpg?format=avif&w=10633&h=1400'
    // @ts-ignore
    import banner3 from './assets/banners/banner3.jpg?format=avif&w=3871&h=540&quality=60'
    // @ts-ignore
    import banner4 from './assets/banners/banner4.jpg?format=avif&w=5568&h=780&quality=75'
    // @ts-ignore
    import banner5 from './assets/banners/banner5.jpg?format=avif&w=4089&h=570&quality=60'
    // @ts-ignore
    import banner6 from './assets/banners/banner6.jpg?format=avif&w=6000&h=840'
    // @ts-ignore
    import banner7 from './assets/banners/banner7.jpg?format=avif&w=4134&h=580'
    // @ts-ignore
    import banner8 from './assets/banners/banner8.jpg?format=avif&w=4426&h=620'
    // @ts-ignore
    import banner9 from './assets/banners/banner9.jpg?format=avif&w=7769&h=1090&quality=60'
    // @ts-ignore
    import banner10 from './assets/banners/banner10.jpg?format=avif&w=4599&h=640'

    export let config

    let showConfig = false
    let configString = JSON.stringify($config, undefined, 4)

    let banners = [
        banner0,
        banner1,
        banner2,
        banner3,
        banner4,
        banner5,
        banner6,
        banner7,
        banner8,
        banner9,
        banner10
    ]
    $: banner = banners[$config.banner]
    let nextBanner =
        $config.banner + 1 >= banners.length ? 0 : $config.banner + 1
    $config.banner = nextBanner

    let d = new Date()
    $: hours = twelveHour(d.getHours())
    $: min = twoDigit(d.getMinutes())
    $: sec = twoDigit(d.getSeconds())
    $: time = `${hours}:${min}`
    $: date = d.getDate()
    $: month = d.toLocaleString('default', { month: 'long' }).toLowerCase()
    $: day = d.toLocaleString('default', { weekday: 'long' }).toLowerCase()

    const timeInterval = setInterval(() => {
        d = new Date()
    }, 200)

    let weather = []
    let stocks = []

    function fetchData() {
        getWeather($config).then((data) => {
            weather = data
        })
        if ($config.stocks.source === 'fmp') {
            getFMP($config).then((data) => {
                stocks = data
            })
        } else if ($config.stocks.source === 'alpaca') {
            getAlpaca($config).then((data) => {
                stocks = data
            })
        }
    }

    onMount(() => {
        fetchData()
    })

    function toggleConfig() {
        showConfig = !showConfig
    }

    function updateConfig() {
        try {
            $config = JSON.parse(configString)
            configString = JSON.stringify($config, undefined, 4)
            fetchData()
        } catch (e) {
            console.error(e)
        }
    }
</script>

<main>
    <div class="grid">
        <div class="banner box">
            <img class="banner-img" src={banner} alt="banner" />
        </div>
        <div class="widgets">
            <div class="time box">
                <div class="time-text">{time}</div>
                <div class="seconds" style:width={(sec / 60) * 100 + '%'} />
            </div>
            <div class="date box">
                <div class="month-day">
                    <div class="day">{day}</div>
                    <div class="month">{month}</div>
                </div>
                <div class="date-number">{date}</div>
            </div>
            <div class="weather box">
                {#if weather.length > 0}
                    {#each weather as block}
                        <div
                            class="weather-block"
                            transition:fade={{ duration: 200 }}
                        >
                            <div class="weather-time">{block.time}</div>
                            <img
                                class="weather-icon"
                                src={`/weather-icons/${block.icon}.svg`}
                                title={block.description}
                                alt={block.description}
                            />
                            <div class="weather-temp">&nbsp;{block.temp}°</div>
                        </div>
                    {/each}
                {/if}
            </div>
            <div class="stocks box">
                {#if stocks.length > 0}
                    {#each stocks as column}
                        <div
                            class="stocks-column"
                            transition:fade={{ duration: 200 }}
                        >
                            {#each column as stock}
                                <div class="stock">
                                    <div class="symbol">{stock.symbol}</div>
                                    <div
                                        class={'percent' +
                                            (stock.changesPercentage > 0
                                                ? ' positive'
                                                : stock.changesPercentage < 0
                                                ? ' negative'
                                                : '')}
                                    >
                                        {stock.changesPercentage.toFixed(2)}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/each}
                {/if}
            </div>
        </div>

        {#each $config.links as group, index}
            <div class="links box" style={`grid-column: ${index + 1}`}>
                {#each group as link}
                    <a class="link" href={link.url}>{link.name}</a>
                {/each}
            </div>
        {/each}

        {#if showConfig}
            <div class="config box">
                <textarea
                    class="config-textarea"
                    bind:value={configString}
                    on:change={updateConfig}
                />
            </div>
        {/if}
    </div>
    <button class="config-button" on:click={toggleConfig}>
        {showConfig ? 'close config' : 'open config'}
    </button>
</main>

<style>
    main {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .grid {
        margin: 0;
        display: grid;
        grid-template-columns: min-content min-content min-content min-content;
        grid-template-rows: 200px 145px 220px;
        grid-gap: 20px;
    }

    .widgets {
        grid-column: 1 / 5;
        grid-row: 2;
        display: flex;
        justify-content: center;
        gap: 20px;
        width: fit-content;
        z-index: 5;
        animation: 0.8s widgets ease-in-out forwards;
        transform: translate(0px, -192.5px);
    }

    @keyframes widgets {
        from {
            transform: translate(0px, -192.5px);
        }
        to {
            transform: translate(0px, 0px);
        }
    }

    .banner {
        height: 200px;
        grid-column: 1 / 5;
        grid-row: 1;
        z-index: 10;
        box-shadow: 0px 0px 20px 0px var(--background-1);
    }

    .banner-img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }

    .time {
        display: flex;
        flex-direction: column;
        padding: 0 40px;
        box-shadow: 0px 0px 20px 0px var(--background-1);
    }

    .time-text {
        font-size: 2.8em;
        font-weight: 300;
        line-height: 48px;
    }

    .seconds {
        align-self: flex-start;
        width: 0%;
        height: 1.5px;
        background-color: var(--font-color);
        transition: width 0.2s ease;
    }

    .date {
        display: flex;
        padding: 0 40px;
        box-shadow: 0px 0px 20px 0px var(--background-1);
    }

    .month-day {
        font-size: 1.4em;
    }

    .date-number {
        font-size: 2.8em;
        font-weight: 300;
        margin-left: 30px;
    }

    .weather {
        padding: 20px 40px;
        gap: 20px;
        width: 460px;
        box-shadow: 0px 0px 20px 0px var(--background-1);
    }

    .weather-block {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .weather-time {
        font-size: 0.9em;
    }

    .weather-icon {
        width: 60px;
        height: 60px;
        object-fit: cover;
        filter: saturate(0.8) brightness(0.8);
    }

    .weather-temp {
        font-size: 1.2em;
    }

    .stocks {
        gap: 40px;
        padding: 0 40px;
        width: 500px;
        box-shadow: 0px 0px 20px 0px var(--background-1);
    }

    .stocks-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .stock {
        display: flex;
        justify-content: space-between;
        gap: 20px;
    }

    .percent {
        min-width: 48px;
        text-align: right;
    }

    .percent.positive {
        color: var(--font-positive);
    }

    .percent.negative {
        color: var(--font-negative);
    }

    .links {
        flex-direction: column;
        gap: 20px;
        grid-row: 3;
        height: 200px;
        animation: 0.8s links ease-in-out forwards;
        transform: translate(0px, -385px);
    }

    @keyframes links {
        from {
            height: 200px;
            transform: translate(0px, -385px);
        }
        to {
            height: 220px;
            transform: translate(0px, 0px);
        }
    }

    .link {
        font-size: 1.2em;
        color: var(--font-color);
        text-decoration: none;
        transform: scale(1);
        transition: color 0.2s ease;
    }

    .link:hover {
        color: var(--font-bright);
        /* text-shadow: 0px 0px 20px var(--font-color); */
    }

    .link::after {
        content: '';
        display: block;
        position: absolute;
        bottom: -2px;
        /* left: 50%; */
        right: 0;
        width: 0%;
        height: 1.5px;
        background-color: var(--font-color);
        transition: width 0.2s ease, background-color 0.2s ease,
            height 0.1s ease;
        /* transform: translateX(-50%); */
        z-index: -1;
    }

    .link:hover::after {
        width: 100%;
        right: auto;
        left: 0;
        background-color: var(--font-bright);
    }

    .link:active {
        /* transform: scale(0.95); */
        color: var(--background-2);
    }

    .link:active::after {
        height: 110%;
    }

    .config-button {
        position: absolute;
        right: 0;
        bottom: 0;
        background: none;
        opacity: 0;
        padding: 20px;
        transform: scale(1);
        transition: 0.05s linear;
    }

    .config-button:hover {
        opacity: 1;
    }

    .config-button:active {
        transform: scale(0.95);
    }

    .config {
        grid-column: 1 / 5;
        grid-row: 2 / 4;
        display: flex;
        z-index: 20;
        padding: 40px;
    }

    .config-textarea {
        width: 100%;
        height: 100%;
        background: var(--background-3);
        border: none;
        border-radius: 10px;
        padding: 20px;
        color: inherit;
        font: inherit;
    }
</style>
