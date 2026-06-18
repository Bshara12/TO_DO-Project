import { startTimer } from '../components/timer';
export function initFocus(refresh) {
    const btn = document.getElementById('start-focus');
    btn === null || btn === void 0 ? void 0 : btn.addEventListener('click', () => {
        startTimer(1500, (t) => {
            document.getElementById('timer').textContent = String(t);
        }, () => {
            alert('Done!');
            refresh();
        });
    });
}
//# sourceMappingURL=focusView.js.map