const { ipcRenderer, dialog } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form')
    const loginBtn = document.getElementById('login-btn')

    loginForm.addEventListener('submit', onSubmit)
    loginBtn.addEventListener('click', onSubmit)
})

const onSubmit = (e) => {
    e.preventDefault()
    const username = document.getElementById('username')

    if (!username.value) {
        dialog.showErrorBox('Error', 'Quên nhập tên kìa bạn êi!')
        return
    }
    localStorage.setItem('username', username.value)
    ipcRenderer.send('toPlay', {windowIndex: 'login'});
}
