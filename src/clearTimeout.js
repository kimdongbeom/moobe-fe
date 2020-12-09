
window.timeouts = [];
window.originalTimeoutFn = window.setTimeout;
window.setTimeout = function(fun, delay) { //this is over-writing the original method
    const t = originalTimeoutFn(fun, delay);
    //WithJs 함수에서 timeout을 clear하지 않는 문제가 발생해서 추가 됨
    //TODO 웹페이지가 리프레쉬 되거나 clearTimeouts가 호출되지 않으면 timeouts은 계속 증가하기만 한다.
    timeouts.push(t);
};

window.clearTimeouts = function clearTimeouts() { //clean up timeout
    while(timeouts.length) {
        window.clearTimeout(timeouts.pop())
    }
};
