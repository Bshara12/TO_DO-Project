import { startTimer } from '../components/timer'

export function initFocus(refresh: () => void) {
  const btn = document.getElementById('start-focus')

  btn?.addEventListener('click', () => {
    startTimer(1500,
      (t) => {
        document.getElementById('timer')!.textContent = String(t)
      },
      () => {
        alert('Done!')
        refresh()
      }
    )
  })
}