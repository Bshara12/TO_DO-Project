let timer = null;
export function startTimer(seconds, onTick, onEnd) {
    let time = seconds;
    timer = setInterval(() => {
        time--;
        onTick(time);
        if (time <= 0) {
            clearInterval(timer);
            onEnd();
        }
    }, 1000);
}
export function stopTimer() {
    clearInterval(timer);
}
//# sourceMappingURL=timer.js.map