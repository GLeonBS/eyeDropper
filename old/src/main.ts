import './style.scss'
import bodyPage from './application/eyeDropper.html?raw'
import { EyeDropperApplication } from './application/EyeDropperApplication'

const body = document.querySelector<HTMLDivElement>('#app')

if (body) {
  body.innerHTML = bodyPage
  EyeDropperApplication()
}
