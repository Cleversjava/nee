const timer = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timeButtons = document.querySelectorAll('.time-btn');
const minutesInput = document.getElementById('minutes');
const circle = document.querySelector('.progress');

let timeLeft = 1500; // 默认25分钟
let timerId = null;
let originalTime = 1500;

// 设置圆环进度条
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    circle.style.strokeDashoffset = offset;
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // 更新进度圈
    const percent = (timeLeft / originalTime) * 100;
    setProgress(percent);
}

function startTimer() {
    if (timerId === null) {
        startBtn.textContent = '暂停';
        startBtn.classList.remove('start');
        startBtn.classList.add('pause');
        timerId = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                alert('时间到！');
                resetTimer();
            }
        }, 1000);
    } else {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = '开始';
        startBtn.classList.remove('pause');
        startBtn.classList.add('start');
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = originalTime;
    updateTimer();
    startBtn.textContent = '开始';
    startBtn.classList.remove('pause');
    startBtn.classList.add('start');
}

// 添加按钮点击事件
timeButtons.forEach(button => {
    button.addEventListener('click', () => {
        timeLeft = parseInt(button.dataset.time);
        originalTime = timeLeft;
        updateTimer();
        timeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// 添加自定义时间输入事件
minutesInput.addEventListener('change', () => {
    const minutes = parseInt(minutesInput.value);
    if (minutes > 0 && minutes <= 60) {
        timeLeft = minutes * 60;
        originalTime = timeLeft;
        updateTimer();
        timeButtons.forEach(btn => btn.classList.remove('active'));
    }
});

// 添加开始和重置按钮事件
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// 初始化进度圈
updateTimer();

// 添加通知功能
function showNotification() {
    if (Notification.permission === "granted") {
        new Notification("番茄时钟", {
            body: "时间到！",
            icon: "icon.png" // 如果有图标的话
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showNotification();
            }
        });
    }
}