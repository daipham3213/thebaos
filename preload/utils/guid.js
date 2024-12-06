const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const uniqId = function (prefix) {
  let n = new Date().getTime()
  let base = Math.floor(n / 1000)
  let ext = Math.floor((n % 1000) * 1000)
  let now = ('00000000' + base.toString(16)).slice(-8) + ('000000' + ext.toString(16)).slice(-5)
  return (prefix ? prefix : '') + now
}

module.exports = {
  createGuid,
  uniqId
}
