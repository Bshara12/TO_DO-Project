let timer: any = null

export function startTimer(
  seconds: number,
  onTick: (t: number) => void,
  onEnd: () => void
) {
  let time = seconds

  timer = setInterval(() => {
    time--
    onTick(time)

    if (time <= 0) {
      clearInterval(timer)
      onEnd()
    }
  }, 1000)
}

export function stopTimer() {
  clearInterval(timer)
}