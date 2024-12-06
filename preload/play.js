const axios = require('axios')
const { ipcRenderer } = require('electron')

const { createGuid } = require('./utils/guid')
const { md5 } = require('./utils/md5')

window.addEventListener('DOMContentLoaded', async () => {
  const flash = document.getElementById('7road-ddt-game')
  
  const username = localStorage.getItem('username')
  const data = await createLoginRequest(username)
  console.log('data', data);
  
  const loadingUrl = `${data.server}/Loading.swf?user=${data.username}&key=${data.guid}&config=${data.config}`

  const embed = document.createElement('embed')
  embed.setAttribute('flashVars', 'site=bb.mail.ru&sitename=&rid=&enterCode=')
  embed.setAttribute('quality', 'high')
  embed.setAttribute('align', 'middle')
  embed.setAttribute('width', '1000')
  embed.setAttribute('height', '600')
  embed.setAttribute('pluginspage', 'http://www.macromedia.com/go/getflashplayer')
  embed.setAttribute('wmode', 'direct')
  embed.setAttribute('name', 'Main')
  embed.setAttribute('allowscriptaccess', 'always')
  embed.setAttribute('type', 'application/x-shockwave-flash')
  embed.setAttribute('src', loadingUrl)

  const movie = document.createElement('param')
  movie.setAttribute('name', 'movie')
  movie.setAttribute('value', loadingUrl)

  flash.appendChild(movie)
  flash.appendChild(embed)
})

const createLoginRequest = async (username) => {
  const config = await ipcRenderer.invoke('getConfig')
  console.log('config', config)

  const guid = createGuid()
  const time = Date.now()
  const sign = md5(''.concat('', username, guid, time, config.loginKey))

  await axios.get('createLogin.aspx', {
    baseURL: config.request,
    params: {
      content: ''.concat(username, '|', guid, '|', username, '|', 'Test01', '|', time, '|', sign)
    }
  })

  return {
    guid,
    username,
    config: config.config,
    server: config.flash
  }
}
