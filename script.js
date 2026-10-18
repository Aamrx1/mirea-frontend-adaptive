// Кастомный видеоплеер на HTML5 <video>: воспроизведение/пауза, громкость, прогресс-бар
(function () {
  const player = document.querySelector('.player');
  if (!player) return;

  const video = player.querySelector('video');
  const playBtn = player.querySelector('.player-play');
  const progress = player.querySelector('.player-progress');
  const time = player.querySelector('.player-time');
  const muteBtn = player.querySelector('.player-mute');
  const volume = player.querySelector('.player-volume');

  // Свои кнопки заменяют стандартные элементы управления браузера
  video.controls = false;

  function format(sec) {
    const s = Math.floor(sec || 0);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function togglePlay() {
    if (video.paused || video.ended) video.play();
    else video.pause();
  }

  function updatePlayButton() {
    const playing = !video.paused && !video.ended;
    playBtn.textContent = playing ? '❚❚' : '►';
    playBtn.setAttribute('aria-label', playing ? 'Пауза' : 'Воспроизвести');
  }

  function updateMuteButton() {
    const silent = video.muted || video.volume === 0;
    muteBtn.textContent = silent ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-label', silent ? 'Включить звук' : 'Выключить звук');
  }

  playBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  video.addEventListener('play', updatePlayButton);
  video.addEventListener('pause', updatePlayButton);
  video.addEventListener('ended', updatePlayButton);

  // Прогресс-бар: range от 0 до 100 (% длительности)
  video.addEventListener('loadedmetadata', function () {
    time.textContent = '0:00 / ' + format(video.duration);
  });

  video.addEventListener('timeupdate', function () {
    if (!video.duration) return;
    progress.value = (video.currentTime / video.duration) * 100;
    time.textContent = format(video.currentTime) + ' / ' + format(video.duration);
  });

  progress.addEventListener('input', function () {
    if (video.duration) video.currentTime = (progress.value / 100) * video.duration;
  });

  // Громкость: range от 0 до 1
  volume.addEventListener('input', function () {
    video.volume = Number(volume.value);
    video.muted = video.volume === 0;
  });

  muteBtn.addEventListener('click', function () {
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) {
      video.volume = 0.5;
      volume.value = 0.5;
    }
  });

  video.addEventListener('volumechange', function () {
    volume.value = video.muted ? 0 : video.volume;
    updateMuteButton();
  });

  updatePlayButton();
  updateMuteButton();
})();

// Доступность бургер-меню: чекбокс и так переключается пробелом без JS,
// здесь добавляем только переключение клавишей Enter
(function () {
  const toggle = document.getElementById('nav-toggle');
  if (!toggle) return;

  toggle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      toggle.checked = !toggle.checked;
    }
  });

  // После перехода по якорю на мобильном закрываем меню
  document.querySelectorAll('.menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.checked = false;
    });
  });
})();
