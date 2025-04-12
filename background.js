chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'pomodoroTimer') {
      chrome.storage.local.get(['timeLeft', 'originalTime'], (data) => {
        if (data.timeLeft > 0) {
          chrome.storage.local.set({
            timeLeft: data.timeLeft - 1
          });
        } else {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: '番茄时钟',
            message: '时间到！'
          });
          chrome.storage.local.set({
            isRunning: false
          });
          chrome.alarms.clear('pomodoroTimer');
        }
      });
    }
  });