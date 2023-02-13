export function twelveHour(h) {
    return h % 12 === 0 ? 12 : h % 12
}

export function twoDigit(n) {
    return n < 10 ? '0' + n : n
}

export function chunk(arr, size) {
    const ret = []
    for (let i = 0; i < arr.length; i += size) {
        const chunk = arr.slice(i, i + size)
        ret.push(chunk)
    }
    return ret
}
