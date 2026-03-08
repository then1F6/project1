export default function ParseCount(/**@type {number}*/ count){
  if (count === undefined) return "0"
  if (count < 1000) {
    return String(count)
  } else if (count < 10_000) {
    const num = (count / 1000)
    return num.toFixed(1) + "k"
  } else if (count < 1000_000) {
    const num = (count / 1000)
    return Math.floor(num) + "k"
  } else if (count < 10_000_000) {
    const num = (count / 1000_000)
    return num.toFixed(1) + "M"
  } else if (count < 1000_000_000) {
    const num = (count / 1000_000)
    return Math.floor(num) + "M"
  } else if (count < 10_000_000_000) {
    const num = (count / 1000_000_000)
    return num.toFixed(1) + "B"
  } else {
    return Math.floor(count / 1000_000_000) + "B"
  }
}