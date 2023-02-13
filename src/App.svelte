<script>
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { twelveHour, twoDigit } from './lib/js/utils.js'
    import { getWeather } from './lib/js/weather.js'
    // import { getStocks as getFMP } from './lib/js/stocks-fmp.js'
    import { getStocks as getAlpaca } from './lib/js/stocks-alpaca.js'

    // @ts-ignore
    import banner0 from './assets/banners/banner0.jpg?format=avif&w=5000&h=700'
    // @ts-ignore
    import banner1 from './assets/banners/banner1.jpg?format=avif&w=5000&h=700'

    export let config

    let banners = [banner0, banner1]
    let banner = banners[$config.banner]
    let nextBanner =
        $config.banner + 1 >= banners.length ? 0 : $config.banner + 1
    $config.banner = nextBanner

    let d = new Date()
    $: hours = twelveHour(d.getHours())
    $: min = twoDigit(d.getMinutes())
    // $: sec = twoDigit(d.getSeconds())
    $: time = `${hours}:${min}`
    $: date = d.getDate()
    $: month = d.toLocaleString('default', { month: 'long' }).toLowerCase()
    $: day = d.toLocaleString('default', { weekday: 'long' }).toLowerCase()

    const timeInterval = setInterval(() => {
        d = new Date()
    }, 200)

    let weather = []
    let stocks = []

    onMount(async () => {
        getWeather($config).then((data) => {
            weather = data
        })
        // getFMP($config)
        getAlpaca($config).then((data) => {
            stocks = data
        })
    })
</script>

<main>
    <div class="grid">
        <div class="banner box">
            <img class="banner-img" src={banner} alt="banner" />
        </div>

        <div class="widgets">
            <div class="time box">{time}</div>
            <div class="date box">
                <div class="month-day">
                    <div class="day">{day}</div>
                    <div class="month">{month}</div>
                </div>
                <div class="date-number">{date}</div>
            </div>
            <div class="weather box">
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
            </div>
            <div class="stocks box">
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
            </div>
        </div>

        {#each $config.links as group}
            <div class="links box">
                {#each group as link}
                    <a class="link" href={link.url}>{link.name}</a>
                {/each}
            </div>
        {/each}
    </div>
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
        grid-column: 1 / -1;
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
        grid-column: 1 / -1;
        z-index: 10;
        box-shadow: 0px 0px 20px 0px #16191d;
    }

    .banner-img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }

    .time {
        font-size: 2.8em;
        font-weight: 300;
        padding: 0 40px;
        box-shadow: 0px 0px 20px 0px #16191d;
    }

    .date {
        display: flex;
        padding: 0 40px;
        box-shadow: 0px 0px 20px 0px #16191d;
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
        box-shadow: 0px 0px 20px 0px #16191d;
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
        box-shadow: 0px 0px 20px 0px #16191d;
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
        transition: 0.05s linear;
    }

    .link:hover {
        color: var(--font-hover);
        transform: scale(1.05);
    }

    .link:active {
        transform: scale(0.95);
    }
</style>
