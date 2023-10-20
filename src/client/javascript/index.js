import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js'

const socket = io()

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const $ = (selectors) => document.querySelector(selectors)

const $form = $('#form')
const $input = $('#input')

$form.addEventListener('submit', (e) => {
  e.preventDefault()
  if ($input.value !== '' || $input.value !== undefined) {
    socket.emit('chat message', $input.value)
    $input.value = ''
  }
})
