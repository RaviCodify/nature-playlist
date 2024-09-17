const play = document.querySelector(".play");
const audioTime = document.querySelector(".current-time");
const audioDuration = document.querySelector(".audio-duration");
const songListContainer = document.querySelector(".song-list");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress");

const musicState = {
  songs: [
    {
      songsName: "Bad Blood",
      filePath: "assets/songs/1.mp3",
      coverPath: "assets/images/covers/1.jpg",
    },
    {
      songsName: "Drag Me Down",
      filePath: "assets/songs/2.mp3",
      coverPath: "assets/images/covers/2.jpg",
    },
    {
      songsName: "Hymn For The Weekend",
      filePath: "assets/songs/3.mp3",
      coverPath: "assets/images/covers/3.jpg",
    },
    {
      songsName: "Left and Right",
      filePath: "assets/songs/4.mp3",
      coverPath: "assets/images/covers/4.jpg",
    },
    {
      songsName: "Pasoori",
      filePath: "assets/songs/5.mp3",
      coverPath: "assets/images/covers/5.jpg",
    },
    {
      songsName: "See You Again",
      filePath: "assets/songs/6.mp3",
      coverPath: "assets/images/covers/6.jpg",
    },
    {
      songsName: "We Don't Talk Anymore",
      filePath: "assets/songs/7.mp3",
      coverPath: "assets/images/covers/7.jpg",
    },
    {
      songsName: "You Belong With Me",
      filePath: "assets/songs/8.mp3",
      coverPath: "assets/images/covers/8.jpg",
    },
  ],
  songCount: 0,
  audio: null,
};

document.addEventListener("DOMContentLoaded", () => {
  musicState.audio = new Audio(musicState.songs[musicState.songCount].filePath);
});

setTimeout(() => {
  displaySongList();
}, 1000);

function displaySongList() {
  // Empty the song-list container
  songListContainer.innerHTML = "";

  musicState.songs.forEach((song, index) => {
    // Display the songs in song-list container from Songs array 
    const songElement = document.createElement("div");
    songElement.classList.add("song", "list-group-item");
    songElement.id = index;
    songElement.style.cursor = "pointer";
    songElement.innerHTML = `
      <img src="${song.coverPath}" alt="${song.songsName}" class="img-fluid"/>
      <span>${song.songsName}</span>  
      `;
    songListContainer.appendChild(songElement);

    // Play or Pause the song
    songElement.addEventListener("click", () => playSong(index));
  });
}

function playSong(index = null) {
  // Play or pause the song
  if (index !== null) {
    if (index !== musicState.songCount) {
      musicState.songCount = index;
      musicState.audio.src = musicState.songs[musicState.songCount].filePath;
      musicState.audio.play();  
    } else {
      musicState.audio[musicState.audio.paused ? "play" : "pause"]();
    }
  } else {
    if (!musicState.audio) return;
    const isPaused = musicState.audio.paused;
    musicState.audio[isPaused ? "play" : "pause"]();
  }

  // Update progress bar
  musicState.audio.addEventListener("timeupdate", () => {
    const progress =
      (musicState.audio.currentTime / musicState.audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
  });
  progressContainer.addEventListener("click", updateProgressBar);

  // Update audio time display
  if (audioTime) {
    setInterval(() => {
      updateAudioTime();
    }, 1000);
  }

  // Update play/pause button icon
  play.innerHTML = musicState.audio.paused
    ? '<i class="fa-solid fa-play"></i>'
    : '<i class="fa-solid fa-pause"></i>';

  // Update right container with song cover
  document.querySelector(".right-container").innerHTML = `
    <img src="${musicState.songs[musicState.songCount].coverPath}" alt="apple"/>
    `;

  // Highlight the current song
  document.querySelectorAll(".song").forEach((element, index) => {
    element.style.fontWeight =
      index === musicState.songCount ? "bold" : "normal";
  });
}

function changeSong(direction) {
  if (!musicState.audio) return;
  musicState.audio.pause();

  // Update the song index based on direction (next/prev)
  musicState.songCount += direction;

  // Handle wrapping around the playlist
  if (musicState.songCount < 0) {
    musicState.songCount = musicState.songs.length - 1;
  } else if (musicState.songCount >= musicState.songs.length) {
    musicState.songCount = 0;
  }

  // Update the audio source based on the current song
  musicState.audio.src = musicState.songs[musicState.songCount].filePath;
  playSong(musicState.songCount);
}

function updateProgressBar(event) {
  // Sets the width percentage of progress container
  const rect = progressContainer.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const widthPercentage = (offsetX / rect.width) * 100;

  // Update the progress bar
  progressBar.style.width = `${widthPercentage}%`;
  musicState.audio.currentTime =
    (widthPercentage * musicState.audio.duration) / 100;
}

function updateAudioTime() {
  if (!audioTime || !musicState.audio.currentTime) return;

  // Convert time unit from seconds to minutes
  const formatTime = (seconds) => {
    const addZero = (time) => (time < 10 ? `0${time}` : time);
    const min = addZero(Math.floor(seconds / 60));
    const sec = addZero(Math.floor(seconds % 60));
    return `${min}:${sec}`;
  };

  // Update audio time
  const currentTime = formatTime(musicState.audio.currentTime);
  const duration = isNaN(musicState.audio.duration)
    ? "00:00"
    : formatTime(musicState.audio.duration);    
    audioTime.textContent = currentTime;
    audioDuration.textContent = duration;

  // Play the next song after a song ends
  if (currentTime === duration) {changeSong(1)}    
}

// Click Event listeners
[
  [play, () => playSong()],
  [document.querySelector(".next"), () => changeSong(1)],
  [document.querySelector(".prev"), () => changeSong(-1)],
].forEach(([element, callback]) => element.addEventListener("click", callback));
