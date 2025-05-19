const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  document.addEventListener("mousemove", (e) => {
    const { clientX: x, clientY: y } = e;
    if (cursorDot && cursorRing) {
      cursorDot.style.left = `${x}px`;
      cursorDot.style.top = `${y}px`;
      cursorRing.style.left = `${x}px`;
      cursorRing.style.top = `${y}px`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const hiddenCards = document.querySelectorAll('.tool-card:not(.visible)');

  function revealOnScroll() {
    const triggerPoint = window.innerHeight * 0.85;

    hiddenCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerPoint) {
        card.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); 
});

function startSpeakerTest() {
  const audioSection = document.querySelector("#speaker-test .audio-list");
  if (audioSection) {
    audioSection.style.display = "block";
  }
}

function playTrack(id) {
  const tracks = ["track1", "track2", "track3"];
  tracks.forEach((trackId) => {
    const track = document.getElementById(trackId);
    if (track) {
      if (trackId === id) {
        track.play();
      } else {
        track.pause();
        track.currentTime = 0;
      }
    }
  });
}

const screenTestBtn = document.querySelector(".screen-test-btn");

// Create overlay element
const overlay = document.createElement("div");
overlay.id = "screen-test-overlay";
document.body.appendChild(overlay);

const colors = ["red", "green", "blue", "white", "black", "gray"];
let colorIndex = 0;
let screenInterval;

screenTestBtn.addEventListener("click", () => {
  overlay.style.display = "block";
  colorIndex = 0;
  overlay.style.backgroundColor = colors[colorIndex];

  // Go fullscreen
  if (overlay.requestFullscreen) {
    overlay.requestFullscreen();
  }

  screenInterval = setInterval(() => {
    colorIndex = (colorIndex + 1) % colors.length;
    overlay.style.backgroundColor = colors[colorIndex];
  }, 1000); // change every 1 second
});

// Stop test on key press or click
const stopScreenTest = () => {
  overlay.style.display = "none";
  clearInterval(screenInterval);
  document.exitFullscreen?.();
};

overlay.addEventListener("click", stopScreenTest);
document.addEventListener("keydown", (e) => {
  if (overlay.style.display === "block") stopScreenTest();
});


// Battery Test
function startBatteryTest() {
  const batteryInfo = document.getElementById("battery-info");
  if (!navigator.getBattery) {
    batteryInfo.innerHTML = "Battery API not supported on this device.";
    batteryInfo.style.display = "block";
    return;
  }

  navigator.getBattery().then((battery) => {
    const level = battery.level * 100;
    const charging = battery.charging ? "Yes" : "No";
    batteryInfo.innerHTML = `Battery Level: ${level}%<br>Charging: ${charging}`;
    batteryInfo.style.display = "block";
  });
}

// Microphone Test
function startMicrophoneTest() {
  const resultDiv = document.getElementById("mic-result");
  resultDiv.textContent = "Requesting microphone access...";

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      resultDiv.textContent = "Microphone is working!";
      stream.getTracks().forEach(track => track.stop());
    })
    .catch(err => {
      resultDiv.textContent = "Microphone not accessible or permission denied.";
    });
}

// Mouse Test
function startMouseTest() {
  const status = document.getElementById("mouse-status");
  status.textContent = "Move your mouse or click buttons to test...";

  function onMove(e) {
    status.textContent = `Mouse Position: X=${e.clientX}, Y=${e.clientY}`;
  }

  function onClick(e) {
    status.textContent = `Mouse Button Clicked: ${e.button === 0 ? 'Left' : e.button === 2 ? 'Right' : 'Middle'}`;
  }

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mousedown", onClick);

  setTimeout(() => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mousedown", onClick);
    status.textContent = "Mouse test completed.";
  }, 5000); // test for 5 seconds
}

function startKeyboardTest() {
  const display = document.getElementById("keyboard-display");
  display.innerHTML = ""; // Reset if already active
  display.style.display = "flex";

  // Create visual keys for A-Z, 0–9, arrows, etc.
  const keysToTrack = [
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "Enter", "Backspace", "Space", "Shift", "Ctrl", "Alt", "Tab", "CapsLock", "Escape"
  ];

  const keyElements = {};

  keysToTrack.forEach(key => {
    const div = document.createElement("div");
    div.className = "key-box";
    div.innerText = key.length > 1 ? key.slice(0, 3) : key;
    display.appendChild(div);
    keyElements[key.toLowerCase()] = div;
  });

  // Listen for key presses
  window.onkeydown = (e) => {
    const key = e.key.toLowerCase();
    if (keyElements[key]) {
      keyElements[key].classList.add("active");
    }
  };

  window.onkeyup = (e) => {
    const key = e.key.toLowerCase();
    if (keyElements[key]) {
      keyElements[key].classList.remove("active");
    }
  };
}
