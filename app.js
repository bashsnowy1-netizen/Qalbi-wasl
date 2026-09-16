/* =========================================================
   QALBI WASL
   FINAL FRONTEND ENGINE
   ========================================================= */


/* =========================================================
   APP STATE
   ========================================================= */

const state = {

  /* Reading */
  currentSurah: 1,
  currentAyah: 1,
  totalAyahs: 7,

  /* Appearance */
  theme: "night",
  environment: "rain",
  blur: 3,
  fontScale: 100,

  /* Motion */
  motionSpeed: 0.9,
  syncWithRecitation: true,

  /* Reading preferences */
  showTransliteration: false,

  /* Audio */
  playing: false,
  muted: false,
  shuffle: false,

  /* User */
  bookmarked: false,

  /* Reciter */
  reciter: "Abdurrahman ibn Musad"

};


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (id) =>
  document.getElementById(id);


/* =========================================================
   MAIN ELEMENTS
   ========================================================= */

const background =
  $("liveBackground");

const backgroundOverlay =
  $("backgroundOverlay");

const arabicText =
  $("arabicText");

const translationText =
  $("translationText");

const transliterationText =
  $("transliterationText");

const surahName =
  $("surahName");

const readerSurahName =
  $("readerSurahName");

const ayahCounter =
  $("ayahCounter");

const readerAyahCount =
  $("readerAyahCount");

const ayahNumber =
  $("ayahNumber");

const ayahLocation =
  $("ayahLocation");

const ayahProgressFill =
  $("ayahProgressFill");

const fontScaleLabel =
  $("fontScale");

const environmentName =
  $("environmentName");

const bookmarkButton =
  $("bookmarkButton");

const themeButton =
  $("themeButton");

const transliterationToggle =
  $("transliterationToggle");


/* =========================================================
   AUDIO ELEMENTS
   ========================================================= */

const quranAudio =
  $("quranAudio");

const audioPlayButton =
  $("audioPlayButton");

const audioProgress =
  $("audioProgress");

const audioCurrentTime =
  $("audioCurrentTime");

const audioDuration =
  $("audioDuration");

const audioPrevious =
  $("audioPrevious");

const audioNext =
  $("audioNext");

const audioVolume =
  $("audioVolume");

const audioShuffle =
  $("audioShuffle");

const audioMoreButton =
  $("audioMoreButton");

const audioReciterName =
  $("audioReciterName");


/* =========================================================
   MODALS
   ========================================================= */

const textModal =
  $("textModal");

const reciterModal =
  $("reciterModal");

const themeModal =
  $("themeModal");

const audioModal =
  $("audioModal");

const environmentModal =
  $("environmentModal");


/* =========================================================
   STATUS MESSAGE
   ========================================================= */

const appStatus =
  $("appStatus");


function showStatus(message) {

  if (!appStatus) return;

  appStatus.textContent =
    message;

  appStatus.classList.add(
    "visible"
  );

  clearTimeout(
    showStatus.timeout
  );

  showStatus.timeout =
    setTimeout(() => {

      appStatus.classList.remove(
        "visible"
      );

    }, 2500);

}


/* =========================================================
   QUR'AN DATA
   =========================================================

   IMPORTANT:

   This is only the initial local display state.

   Production Qur'an text and translations will come
   from the verified Quran Foundation backend.

   We are deliberately not putting API credentials
   inside this browser file.
   ========================================================= */

const fallbackSurah = {

  number: 1,

  name: "Al-Fatihah",

  arabicName: "الفاتحة",

  verses: [

    {
      number: 1,
      arabic:
        "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation:
        "In the name of Allah, the Most Gracious, the Most Merciful.",
      transliteration: ""
    },

    {
      number: 2,
      arabic:
        "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation:
        "All praise is for Allah—Lord of the worlds.",
      transliteration: ""
    },

    {
      number: 3,
      arabic:
        "الرَّحْمَٰنِ الرَّحِيمِ",
      translation:
        "The Most Gracious, the Most Merciful.",
      transliteration: ""
    },

    {
      number: 4,
      arabic:
        "مَالِكِ يَوْمِ الدِّينِ",
      translation:
        "Master of the Day of Judgment.",
      transliteration: ""
    },

    {
      number: 5,
      arabic:
        "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      translation:
        "You alone we worship and You alone we ask for help.",
      transliteration: ""
    },

    {
      number: 6,
      arabic:
        "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      translation:
        "Guide us along the Straight Path.",
      transliteration: ""
    },

    {
      number: 7,
      arabic:
        "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      translation:
        "The path of those You have blessed—not those You are displeased with, or those who are astray.",
      transliteration: ""
    }

  ]

};


/* =========================================================
   CURRENT VERSE
   ========================================================= */

function getCurrentVerse() {

  return fallbackSurah.verses[
    state.currentAyah - 1
  ];

}


/* =========================================================
   RENDER VERSE
   ========================================================= */

function renderVerse() {

  const verse =
    getCurrentVerse();

  if (!verse) return;


  /* Arabic */

  if (arabicText) {

    arabicText.textContent =
      verse.arabic;

  }


  /* Translation */

  if (translationText) {

    translationText.textContent =
      verse.translation;

  }


  /* Transliteration */

  if (transliterationText) {

    transliterationText.textContent =
      verse.transliteration || "";

  }


  /* Number */

  if (ayahNumber) {

    ayahNumber.textContent =
      toArabicNumber(
        verse.number
      );

  }


  /* Surah */

  if (surahName) {

    surahName.textContent =
      fallbackSurah.name;

  }


  if (readerSurahName) {

    readerSurahName.textContent =
      fallbackSurah.name
        .toUpperCase();

  }


  /* Counters */

  if (ayahCounter) {

    ayahCounter.textContent =
      `Ayah ${state.currentAyah} of ${state.totalAyahs}`;

  }


  if (readerAyahCount) {

    readerAyahCount.textContent =
      `${state.currentAyah} / ${state.totalAyahs}`;

  }


  /* Location */

  if (ayahLocation) {

    ayahLocation.textContent =
      `${state.currentSurah}:${state.currentAyah}`;

  }


  /* Progress */

  if (ayahProgressFill) {

    const percentage =
      (
        state.currentAyah /
        state.totalAyahs
      ) * 100;

    ayahProgressFill.style.width =
      `${percentage}%`;

  }


  /* Reset audio display */

  resetAudioInterface();


  /* Bookmark */

  updateBookmarkUI();

}


/* =========================================================
   ARABIC NUMBERS
   ========================================================= */

function toArabicNumber(number) {

  const digits = [
    "٠",
    "١",
    "٢",
    "٣",
    "٤",
    "٥",
    "٦",
    "٧",
    "٨",
    "٩"
  ];

  return String(number)
    .split("")
    .map(
      digit => digits[
        Number(digit)
      ]
    )
    .join("");

}


/* =========================================================
   NEXT AYAH
   ========================================================= */

function nextAyah() {

  if (
    state.currentAyah <
    state.totalAyahs
  ) {

    state.currentAyah++;

    renderVerse();

    showStatus(
      `Ayah ${state.currentAyah}`
    );

    return;

  }


  showStatus(
    "You have reached the end of this Surah."
  );

}


/* =========================================================
   PREVIOUS AYAH
   ========================================================= */

function previousAyah() {

  if (
    state.currentAyah >
    1
  ) {

    state.currentAyah--;

    renderVerse();

    showStatus(
      `Ayah ${state.currentAyah}`
    );

    return;

  }


  showStatus(
    "You are already at the first ayah."
  );

}


/* =========================================================
   NAVIGATION BUTTONS
   ========================================================= */

$("nextAyah")
  ?.addEventListener(
    "click",
    nextAyah
  );

$("previousAyah")
  ?.addEventListener(
    "click",
    previousAyah
  );

audioNext
  ?.addEventListener(
    "click",
    nextAyah
  );

audioPrevious
  ?.addEventListener(
    "click",
    previousAyah
  );


/* =========================================================
   BOOKMARK
   ========================================================= */

function updateBookmarkUI() {

  if (!bookmarkButton)
    return;


  bookmarkButton.textContent =
    state.bookmarked
      ? "♥"
      : "♡";


  bookmarkButton.setAttribute(
    "aria-pressed",
    String(
      state.bookmarked
    )
  );

}


bookmarkButton
  ?.addEventListener(
    "click",
    () => {

      state.bookmarked =
        !state.bookmarked;

      updateBookmarkUI();

      showStatus(
        state.bookmarked
          ? "Ayah bookmarked."
          : "Bookmark removed."
      );

    }
  );


/* =========================================================
   FONT SIZE
   ========================================================= */

const BASE_ARABIC_FONT_SIZE =
  30;


function applyFontScale(
  value
) {

  state.fontScale =
    clamp(
      Number(value),
      70,
      180
    );


  const actualSize =
    BASE_ARABIC_FONT_SIZE *
    (
      state.fontScale /
      100
    );


  if (arabicText) {

    arabicText.style.fontSize =
      `${actualSize}px`;

  }


  if (fontScaleLabel) {

    fontScaleLabel.textContent =
      `${state.fontScale}%`;

  }


  const modalValue =
    $("arabicSizeValue");

  if (modalValue) {

    modalValue.textContent =
      `${state.fontScale}%`;

  }


  const slider =
    $("arabicSizeSlider");

  if (slider) {

    slider.value =
      state.fontScale;

  }

}


$("fontIncrease")
  ?.addEventListener(
    "click",
    () => {

      applyFontScale(
        state.fontScale + 10
      );

    }
  );


$("fontDecrease")
  ?.addEventListener(
    "click",
    () => {

      applyFontScale(
        state.fontScale - 10
      );

    }
  );


$("arabicSizeSlider")
  ?.addEventListener(
    "input",
    event => {

      applyFontScale(
        event.target.value
      );

    }
  );


/* =========================================================
   BACKGROUND BLUR
   ========================================================= */

function applyBlur(
  value
) {

  state.blur =
    clamp(
      Number(value),
      0,
      20
    );


  if (background) {

    background.style.filter =
      `blur(${state.blur}px)`;

    background.style.transform =
      `scale(${1.02 + state.blur * 0.004})`;

  }


  const blurValue =
    $("blurValue");

  if (blurValue) {

    blurValue.textContent =
      `${state.blur}px`;

  }


  const slider =
    $("blurSlider");

  if (slider) {

    slider.value =
      state.blur;

  }

}


applyBlur(
  state.blur
);


$("blurButton")
  ?.addEventListener(
    "click",
    () => {

      const values =
        [
          0,
          3,
          6,
          10,
          14
        ];


      let index =
        values.indexOf(
          state.blur
        );


      index =
        index === -1
          ? 1
          : (
              index + 1
            ) %
            values.length;


      applyBlur(
        values[index]
      );

    }
  );


$("blurSlider")
  ?.addEventListener(
    "input",
    event => {

      applyBlur(
        event.target.value
      );

    }
  );


/* =========================================================
   TRANSLITERATION
   ========================================================= */

function updateTransliteration() {

  if (!transliterationText)
    return;


  if (
    state.showTransliteration
  ) {

    transliterationText.hidden =
      false;

  } else {

    transliterationText.hidden =
      true;

  }

}


transliterationToggle
  ?.addEventListener(
    "change",
    event => {

      state.showTransliteration =
        event.target.checked;

      updateTransliteration();

    }
  );


/* =========================================================
   MOTION SPEED
   ========================================================= */

const motionSpeedSlider =
  $("motionSpeedSlider");

const motionSpeedLabel =
  $("motionSpeedLabel");


if (motionSpeedSlider) {

  motionSpeedSlider
    .addEventListener(
      "input",
      event => {

        state.motionSpeed =
          Number(
            event.target.value
          );


        if (
          motionSpeedLabel
        ) {

          const labels = {

            "0.9":
              "0.9× · Calm",

            "1":
              "1.0× · Natural",

            "1.1":
              "1.1× · Gentle"

          };


          motionSpeedLabel.textContent =
            labels[
              String(
                state.motionSpeed
              )
            ] ||
            `${state.motionSpeed}×`;

        }

      }
    );

}


/* =========================================================
   RECITATION SYNC
   ========================================================= */

$("recitationSync")
  ?.addEventListener(
    "change",
    event => {

      state.syncWithRecitation =
        event.target.checked;

    }
  );


/* =========================================================
   AUDIO
   ========================================================= */

function formatAudioTime(
  seconds
) {

  if (
    !Number.isFinite(
      seconds
    )
  ) {

    return "0:00";

  }


  const minutes =
    Math.floor(
      seconds / 60
    );


  const remaining =
    Math.floor(
      seconds % 60
    )
      .toString()
      .padStart(
        2,
        "0"
      );


  return `${minutes}:${remaining}`;

}


/* =========================================================
   RESET AUDIO
   ========================================================= */

function resetAudioInterface() {

  if (
    quranAudio
  ) {

    quranAudio.pause();

    quranAudio.removeAttribute(
      "src"
    );

    quranAudio.load();

  }


  state.playing =
    false;


  if (audioProgress) {

    audioProgress.value =
      0;

  }


  if (audioCurrentTime) {

    audioCurrentTime.textContent =
      "0:00";

  }


  if (audioDuration) {

    audioDuration.textContent =
      "0:00";

  }


  if (audioPlayButton) {

    audioPlayButton.textContent =
      "▶";

    audioPlayButton.classList.remove(
      "playing"
    );

  }

}


/* =========================================================
   AUDIO PLAY / PAUSE
   ========================================================= */

audioPlayButton
  ?.addEventListener(
    "click",
    async () => {

      /*
        Audio is intentionally not connected yet.

        The production source will come from our
        verified backend integration.
      */

      if (
        !quranAudio ||
        !quranAudio.src
      ) {

        showStatus(
          "Recitation audio will be connected next."
        );

        return;

      }


      try {

        if (
          quranAudio.paused
        ) {

          await quranAudio.play();

        } else {

          quranAudio.pause();

        }

      } catch (
        error
      ) {

        console.error(
          error
        );

        showStatus(
          "Audio could not be started."
        );

      }

    }
  );


/* =========================================================
   AUDIO EVENTS
   ========================================================= */

quranAudio
  ?.addEventListener(
    "play",
    () => {

      state.playing =
        true;

      if (audioPlayButton) {

        audioPlayButton.textContent =
          "Ⅱ";

        audioPlayButton.classList.add(
          "playing"
        );

      }

    }
  );


quranAudio
  ?.addEventListener(
    "pause",
    () => {

      state.playing =
        false;

      if (audioPlayButton) {

        audioPlayButton.textContent =
          "▶";

        audioPlayButton.classList.remove(
          "playing"
        );

      }

    }
  );


quranAudio
  ?.addEventListener(
    "loadedmetadata",
    () => {

      if (
        audioDuration
      ) {

        audioDuration.textContent =
          formatAudioTime(
            quranAudio.duration
          );

      }

    }
  );


quranAudio
  ?.addEventListener(
    "timeupdate",
    () => {

      if (
        !quranAudio.duration
      ) {

        return;

      }


      const percentage =
        (
          quranAudio.currentTime /
          quranAudio.duration
        ) * 100;


      if (
        audioProgress
      ) {

        audioProgress.value =
          percentage;

      }


      if (
        audioCurrentTime
      ) {

        audioCurrentTime.textContent =
          formatAudioTime(
            quranAudio.currentTime
          );

      }

    }
  );


quranAudio
  ?.addEventListener(
    "ended",
    () => {

      state.playing =
        false;

      if (
        audioPlayButton
      ) {

        audioPlayButton.textContent =
          "▶";

      }

      if (
        state.currentAyah <
        state.totalAyahs
      ) {

        nextAyah();

      }

    }
  );


/* =========================================================
   AUDIO SEEK
   ========================================================= */

audioProgress
  ?.addEventListener(
    "input",
    () => {

      if (
        !quranAudio ||
        !quranAudio.duration
      ) {

        return;

      }


      quranAudio.currentTime =
        (
          Number(
            audioProgress.value
          ) /
          100
        ) *
        quranAudio.duration;

    }
  );


/* =========================================================
   VOLUME
   ========================================================= */

audioVolume
  ?.addEventListener(
    "click",
    () => {

      if (!quranAudio)
        return;


      quranAudio.muted =
        !quranAudio.muted;

      state.muted =
        quranAudio.muted;


      audioVolume.textContent =
        quranAudio.muted
          ? "🔇"
          : "🔊";

    }
  );


/* =========================================================
   SHUFFLE
   ========================================================= */

audioShuffle
  ?.addEventListener(
    "click",
    () => {

      state.shuffle =
        !state.shuffle;


      audioShuffle.classList.toggle(
        "active",
        state.shuffle
      );


      showStatus(
        state.shuffle
          ? "Shuffle enabled."
          : "Normal Qur'an order."
      );

    }
  );


$("shuffleToggle")
  ?.addEventListener(
    "change",
    event => {

      state.shuffle =
        event.target.checked;

      audioShuffle?.classList.toggle(
        "active",
        state.shuffle
      );

    }
  );


/* =========================================================
   RECITER
   ========================================================= */

function setReciter(
  name
) {

  state.reciter =
    name;


  if (
    audioReciterName
  ) {

    audioReciterName.textContent =
      name;

  }


  closeModal(
    reciterModal
  );


  showStatus(
    `${name} selected.`
  );

}


document
  .querySelectorAll(
    ".selection-button[data-reciter]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          setReciter(
            button.dataset.reciter
          );

        }
      );

    }
  );


/* =========================================================
   MODAL SYSTEM
   ========================================================= */

function openModal(
  modal
) {

  if (!modal)
    return;


  modal.classList.remove(
    "hidden"
  );

  document.body.classList.add(
    "modal-open"
  );

}


function closeModal(
  modal
) {

  if (!modal)
    return;


  modal.classList.add(
    "hidden"
  );


  const openModals =
    document.querySelectorAll(
      ".modal:not(.hidden)"
    );


  if (
    openModals.length === 0
  ) {

    document.body.classList.remove(
      "modal-open"
    );

  }

}


/* =========================================================
   READING SETTINGS
   ========================================================= */

$("readingSettingsButton")
  ?.addEventListener(
    "click",
    () => {

      openModal(
        textModal
      );

    }
  );


$("saveTextSettings")
  ?.addEventListener(
    "click",
    () => {

      closeModal(
        textModal
      );

    }
  );


$("closeTextModal")
  ?.addEventListener(
    "click",
    () => {

      closeModal(
        textModal
      );

    }
  );


/* =========================================================
   RECITER MODAL
   ========================================================= */

$("audioMoreButton")
  ?.addEventListener(
    "click",
    () => {

      openModal(
        audioModal
      );

    }
  );


$("changeReciterFromAudio")
  ?.addEventListener(
    "click",
    () => {

      closeModal(
        audioModal
      );

      openModal(
        reciterModal
      );

    }
  );


$("closeReciterModal")
  ?.addEventListener(
    "click",
    () => {

      closeModal(
        reciterModal
      );

    }
  );


$("closeAudioModal")
  ?.addEventListener(
    "click",
    () => {

      closeModal(
        audioModal
      );

    }
  );


$("closeAudioOptions")
  ?.addEventListener(
    "click",
    () => {

      closeModal(
        audioModal
      );

    }
  );


$("reciterButton")
  ?.addEventListener(
    "click",
    () => {

      openModal(
        reciterModal
      );

    }
  );


/* =========================================================
   THEME SYSTEM
   ========================================================= */

function applyTheme(
  theme
) {

  const validThemes =
    [
      "night",
      "bright",
      "warm"
    ];


  if (
    !validThemes.includes(
      theme
    )
  ) {

    theme =
      "night";

  }


  state.theme =
    theme;


  document.body.dataset.theme =
    theme;


  document
    .querySelectorAll(
      ".theme-option"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.theme ===
          theme
        );

      }
    );


  showStatus(
    `${capitalize(theme)} theme selected.`
  );

}


themeButton
  ?.addEventListener(
    "click",
    () => {

      openModal(
        themeModal
      );

    }
  );


document
  .querySelectorAll(
    ".theme-option"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          applyTheme(
            button.dataset.theme
          );

        }
      );

    }
  );


$("closeThemeModal")
  ?.addEventListener(
    "click",
    () => {

      closeModal(
        themeModal
      );

    }
  );


/* =========================================================
   ENVIRONMENT SYSTEM
   ========================================================= */

function setEnvironment(
  environment
) {

  state.environment =
    environment;


  const option =
    document.querySelector(
      `.environment-option[data-environment="${environment}"]`
    );


  document
    .querySelectorAll(
      ".environment-option"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.environment ===
          environment
        );

      }
    );


  if (
    option &&
    environmentName
  ) {

    const label =
      option.querySelector(
        "span:nth-of-type(2)"
      );


    if (label) {

      environmentName.textContent =
        label.textContent;

    }

  }


  closeModal(
    environmentModal
  );


  showStatus(
    environmentName?.textContent ||
    "Environment changed."
  );

}


document
  .querySelectorAll(
    ".environment-option"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          /*
            Premium access will be enforced when
            the subscription system is connected.
          */

          setEnvironment(
            button.dataset.environment
          );

        }
      );

    }
  );


$("environmentButton")
  ?.addEventListener(
    "click",
    () => {

      openModal(
        environmentModal
      );

    }
  );


$("closeEnvironmentModal")
  ?.addEventListener(
    "click",
    () => {

      closeModal(
        environmentModal
      );

    }
  );


$("closeEnvironmentSettings")
  ?.addEventListener(
    "click",
    () => {

      closeModal(
        environmentModal
      );

    }
  );


/* =========================================================
   BOTTOM NAVIGATION
   ========================================================= */

document
  .querySelectorAll(
    ".nav-item"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".nav-item"
            )
            .forEach(
              item => {

                item.classList.remove(
                  "active"
                );

              }
            );


          button.classList.add(
            "active"
          );


          const tab =
            button.dataset.tab;


          if (
            tab === "reading"
          ) {

            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });

          }


          if (
            tab === "listen"
          ) {

            document
              .getElementById(
                "quranAudioPlayer"
              )
              ?.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });

          }


          if (
            tab === "settings"
          ) {

            openModal(
              textModal
            );

          }


          if (
            tab === "bookmarks"
          ) {

            showStatus(
              state.bookmarked
                ? "Current ayah is bookmarked."
                : "No bookmark on this ayah."
            );

          }

        }
      );

    }
  );


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

document
  .querySelectorAll(
    ".modal"
  )
  .forEach(
    modal => {

      modal.addEventListener(
        "click",
        event => {

          if (
            event.target ===
            modal
          ) {

            closeModal(
              modal
            );

          }

        }
      );

    }
  );


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key !== "Escape"
    ) {

      return;

    }


    document
      .querySelectorAll(
        ".modal:not(.hidden)"
      )
      .forEach(
        modal => {

          closeModal(
            modal
          );

        }
      );

  }
);


/* =========================================================
   UTILITY
   ========================================================= */

function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );

}


function capitalize(
  text
) {

  return text.charAt(0)
    .toUpperCase() +
    text.slice(1);

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeApp() {

  applyTheme(
    state.theme
  );

  applyFontScale(
    state.fontScale
  );

  applyBlur(
    state.blur
  );

  updateTransliteration();

  updateBookmarkUI();

  renderVerse();

  if (
    motionSpeedSlider
  ) {

    motionSpeedSlider.value =
      state.motionSpeed;

  }


  showStatus(
    "Qalbi Wasl is ready."
  );

}


initializeApp();
