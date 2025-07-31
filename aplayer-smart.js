let playerContainer = document.getElementById('player');
let ap;

// 🌐 i18n setup
const i18n = {
  current: 'vi',
  messages: {
    greeting: {
      vi: 'Chúc bạn nghe nhạc vui vẻ!',
      en: 'Enjoy your music!'
    },
    selectTheme: {
      vi: 'Chọn giao diện',
      en: 'Select theme'
    },
    mood: {
      happy: 'Thật vui vì bạn đang hạnh phúc!',
      sad: 'Hy vọng âm nhạc sẽ giúp bạn vượt qua!',
      chill: 'Thư giãn cùng giai điệu nhẹ nhàng nhé!'
    }
  },
  t(key) {
    return this.messages[key]?.[this.current] || key;
  }
};

// 🎨 Hệ thống chọn màu theo trạng thái
function getDynamicColor(mode = 'time', mood = 'chill') {
  const palettes = {
    time: {
      morning: '#3498db',
      afternoon: '#f39c12',
      evening: '#9b59b6',
      night: '#2c3e50'
    },
    mood: {
      happy: '#f67280',
      sad: '#95a5a6',
      chill: '#00b894',
      energetic: '#fd79a8'
    },
    random: () => {
      const colors = ['#e74c3c', '#1abc9c', '#f1c40f', '#8e44ad', '#2ecc71'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  };

  const hour = new Date().getHours();
  if (mode === 'time') {
    if (hour < 6) return palettes.time.night;
    if (hour < 12) return palettes.time.morning;
    if (hour < 18) return palettes.time.afternoon;
    return palettes.time.evening;
  }
  if (mode === 'mood') return palettes.mood[mood] || palettes.mood.chill;
  if (mode === 'random') return palettes.random();
  return '#333'; // fallback
}

// 🎶 Enhance lyrics: chèn intro nếu lời đến muộn
function enhanceLyrics(lyrics, song, artist) {
  const match = lyrics.match(/\[\d{2}:\d{2}\.\d{2}\]/);
  if (!match) return lyrics;
  const time = parseFloat(match[0].replace(/[^\d.]/g, ''));
  if (time > 5) {
    const intro = `[00:00.00]Bài hát: ${song} - ${artist}\n[00:03.00]${i18n.t('greeting')}\n`;
    return intro + lyrics;
  }
  return lyrics;
}

// 🎧 Gắn màu cho toàn bộ phần APlayer
function applyColor(color) {
  const selectors = [
    '.aplayer-title',
    '.aplayer-author',
    '.aplayer-lrc p',
    '.aplayer-time-inner',
    '.aplayer-bar',
    '.aplayer-list-index',
    '.aplayer-list-author',
    '.aplayer-list-extra'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.style.color = color);
  });
}

// 🚀 Khởi tạo APlayer
async function initPlayer(isFixed = false) {
  if (ap) ap.destroy();

  const mood = document.getElementById('mood-select')?.value || 'chill';
  const colorMode = document.getElementById('color-mode')?.value || 'time';
  const chosenColor = getDynamicColor(colorMode, mood);

  const audioInfo = {
    name: 'Yêu em dại khờ',
    artist: 'Lou Hoàng',
    url: 'https://example.com/audio.mp3',
    cover: 'https://example.com/cover.jpg',
    lrc: 'https://example.com/lyrics.lrc'
  };

  let lrcText = '';
  try {
    const res = await fetch(audioInfo.lrc);
    lrcText = await res.text();
  } catch (err) {
    lrcText = '[00:00.00]Không thể tải lời bài hát';
  }

  const enhancedLrc = enhanceLyrics(lrcText, audioInfo.name, audioInfo.artist);
  const blob = new Blob([enhancedLrc], { type: 'text/plain' });
  const lrcUrl = URL.createObjectURL(blob);

  ap = new APlayer({
    container: playerContainer,
    fixed: isFixed,
    audio: [{ ...audioInfo, lrc: lrcUrl }],
    lrcType: 3
  });

  ap.on('lrcshow', () => applyColor(chosenColor));
  applyColor(chosenColor);
}

// 🎛 Sự kiện điều khiển giao diện + tâm trạng + màu
document.getElementById('theme-select').addEventListener('change', (e) => {
  initPlayer(e.target.value === 'fixed');
});

document.getElementById('mood-select')?.addEventListener('change', () => {
  initPlayer();
});

document.getElementById('color-mode')?.addEventListener('change', () => {
  initPlayer();
});