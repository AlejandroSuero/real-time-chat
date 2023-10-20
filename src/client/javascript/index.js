/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js'

const getUsername = async () => {
  const username = localStorage.getItem('username')
  console.log('username', username)
  if (username !== null) return username
  const res = await fetch('https://random-data-api.com/api/users/random_user')
  const { username: randomUsername } = await res.json()
  localStorage.setItem('username', randomUsername)
  return randomUsername
}

const socket = io({
  auth: {
    username: await getUsername(),
    serverOffset: 0
  }
})

const $ = (selectors) => document.querySelector(selectors)

const $form = $('#form')
const $input = $('#input')
const $messages = $('#messages')

socket.on('chat message', (message, serverOffset, username) => {
  const item = `<li>
    <p>${message}</p>
    <small>${username}</small>
  </li>`
  $messages.insertAdjacentHTML('beforeend', item)
  socket.auth.serverOffset = serverOffset
})

$form.addEventListener('submit', (e) => {
  e.preventDefault()
  if ($input.value !== '' || $input.value !== undefined) {
    socket.emit('chat message', $input.value, socket.auth.username)
    $input.value = ''
  }
})
