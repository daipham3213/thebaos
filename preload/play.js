// const axios = require('axios')
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', async () => {
  const game = document.getElementById('gameContent')
  const username = localStorage.getItem('username')
  const config = await ipcRenderer.invoke('getConfig')
  game.src = config.host + 'web.php?UserName=' + username
})

// const createLoginRequest = async (username) => {
//   const config = await ipcRenderer.invoke('getConfig')
//
//   const form = new FormData()
//   form.append('UserName', username)
//
//   const res = await axios.post(config.host + 'api.php', form, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//     params: {
//       UserName: username
//     }
//   })
//
//   return res.data
// }
