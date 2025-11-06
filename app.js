(function () {
  const SPREAD_POOL_SIZE = 12;
  const shuffleButton = document.getElementById('shuffleButton');
  const resetButton = document.getElementById('resetButton');
  const deckElement = document.getElementById('deck');
  const deckInstruction = document.querySelector('.deck-instruction');
  const spreadPool = document.getElementById('spreadPool');
  const spreadSlots = Array.from(document.querySelectorAll('.spread-slot'));
  const adviceSection = document.getElementById('adviceSection');
  const adviceText = document.getElementById('adviceText');
  const speakButton = document.getElementById('speakButton');
  const stopSpeakButton = document.getElementById('stopSpeakButton');
  const voiceSelect = document.getElementById('voiceSelect');
  const questionInput = document.getElementById('questionInput');

  let workingDeck = [];
  let poolCards = [];
  let drawCursor = 0;
  let selectedCards = [];
  let isShuffling = false;
  let currentQuestion = '';
  let utterance = null;
  let audioContext;

  const ensureAudioContext = async () => {
    if (!window.AudioContext && !window.webkitAudioContext) {
      return null;
    }
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
      } catch (error) {
        console.warn('Unable to resume audio context', error);
      }
    }
    return audioContext;
  };

  const playShuffleSound = async (duration = 1500) => {
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    const seconds = duration / 1000;
    const bufferSize = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      const progress = i / bufferSize;
      const fade = Math.pow(1 - progress, 1.4);
      data[i] = (Math.random() * 2 - 1) * 0.6 * fade;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    const gain = ctx.createGain();
    gain.gain.value = 0.22;
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + seconds);
  };

  const playSelectSound = async () => {
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.55);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  };

  const shuffle = (array) => {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const paletteForCard = (card) => {
    if (card.palette) {
      return card.palette;
    }
    if (card.arcana === 'Major') {
      return ['#c1a8ff', '#f8d8ff'];
    }
    switch (card.suit) {
      case 'Wands':
        return ['#ff8c42', '#ffd29d'];
      case 'Cups':
        return ['#5dade2', '#aed6f1'];
      case 'Swords':
        return ['#8c7ae6', '#dcd6ff'];
      case 'Pentacles':
        return ['#58d68d', '#a9dfbf'];
      default:
        return ['#bbbbbb', '#eeeeee'];
    }
  };

  const buildCardArt = (card) => {
    const [primary, secondary] = paletteForCard(card);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 360'>
      <defs>
        <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stop-color='${primary}' />
          <stop offset='100%' stop-color='${secondary}' />
        </linearGradient>
      </defs>
      <rect x='0' y='0' width='220' height='360' rx='24' fill='url(#grad)' />
      <g fill='rgba(255,255,255,0.82)' font-family='Playfair Display' text-anchor='middle'>
        <text x='110' y='86' font-size='42'>${card.arcana === 'Major' ? '✶' : card.suit.charAt(0)}</text>
        <text x='110' y='190' font-size='28'>${card.name.replace('&', '&amp;')}</text>
        <text x='110' y='320' font-size='16' fill='rgba(255,255,255,0.7)'>${card.arcana === 'Major' ? card.keywords.split(',')[0].trim() : card.suit}</text>
      </g>
    </svg>`;
    const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/%20/g, ' ');
    return `url("data:image/svg+xml,${encoded}")`;
  };

  const positionNarrative = {
    Past: 'illuminates the experiences and decisions that shaped the foundation of this question',
    Present: 'describes the energy currently influencing your response options and mindset',
    Future: 'points toward the trajectory unfolding if you integrate the lesson now',
  };

  const buildContextualMeaning = (card, position, question) => {
    const focus = positionNarrative[position];
    const subject = question ? `your question "${question}"` : 'your current focus';
    return `${card.name} in the ${position.toLowerCase()} position ${focus}. ${card.meaning} In relation to ${subject}, ${card.advice}`;
  };

  const createCardElement = (card, position, question) => {
    const contextualMeaning = buildContextualMeaning(card, position, question);
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'tarot-card';
    cardWrapper.setAttribute('role', 'button');
    cardWrapper.setAttribute('tabindex', '0');
    cardWrapper.setAttribute('aria-pressed', 'false');

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    const back = document.createElement('div');
    back.className = 'card-face back';
    back.textContent = 'Tap to Reveal';

    const front = document.createElement('div');
    front.className = 'card-face front';

    const art = document.createElement('div');
    art.className = 'card-front-art';
    art.style.backgroundImage = buildCardArt(card);
    front.appendChild(art);

    const header = document.createElement('div');
    header.className = 'card-header';
    const title = document.createElement('h3');
    title.textContent = card.name;
    const keywords = document.createElement('span');
    keywords.className = 'keywords';
    keywords.textContent = card.keywords;
    header.appendChild(title);
    header.appendChild(keywords);
    front.appendChild(header);

    const meaning = document.createElement('p');
    meaning.className = 'meaning';
    meaning.textContent = card.meaning;
    front.appendChild(meaning);

    const context = document.createElement('p');
    context.className = 'context';
    context.textContent = contextualMeaning;
    front.appendChild(context);

    inner.appendChild(back);
    inner.appendChild(front);
    cardWrapper.appendChild(inner);

    const toggleReveal = () => {
      const isRevealed = cardWrapper.classList.toggle('revealed');
      cardWrapper.setAttribute('aria-pressed', String(isRevealed));
    };

    cardWrapper.addEventListener('click', () => {
      toggleReveal();
    });

    cardWrapper.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleReveal();
      }
    });

    return { element: cardWrapper, contextualMeaning };
  };

  const renderSpreadPool = () => {
    spreadPool.innerHTML = '';
    poolCards.forEach((card) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pool-card';
      button.setAttribute('aria-label', 'Face-down tarot card');
      if (selectedCards.length >= 3) {
        button.disabled = true;
        button.classList.add('disabled');
      }
      button.addEventListener('click', () => handlePoolCardSelection(card.id));
      spreadPool.appendChild(button);
    });

    if (poolCards.length === 0 && workingDeck.length === 0) {
      return;
    }
    if (poolCards.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'You have drawn every available card from this shuffle.';
      empty.className = 'spread-instruction';
      spreadPool.appendChild(empty);
    }
  };

  const resetSlots = () => {
    spreadSlots.forEach((slot) => {
      slot.classList.remove('filled');
      const existingCard = slot.querySelector('.tarot-card');
      if (existingCard) {
        existingCard.remove();
      }
    });
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (utterance) {
      utterance = null;
    }
    speakButton.disabled = !adviceText.textContent.trim();
    stopSpeakButton.disabled = true;
  };

  const chooseVoice = (voices, preference) => {
    if (!voices || voices.length === 0) return null;
    const normalizedPref = preference && preference !== 'auto' ? preference : null;

    const matchesPreference = (voice, pref) => {
      const name = voice.name.toLowerCase();
      if (pref === 'male') {
        return /male|man|david|alex|daniel|fred|barry|allan/.test(name);
      }
      if (pref === 'female') {
        return /female|woman|susan|victoria|samantha|karen|zira|ava|sara|olivia|emma|allison/.test(name);
      }
      return false;
    };

    const englishVoices = voices.filter((voice) => voice.lang && voice.lang.toLowerCase().startsWith('en'));

    if (normalizedPref) {
      const preferred = englishVoices.find((voice) => matchesPreference(voice, normalizedPref));
      if (preferred) return preferred;
      const anyPreferred = voices.find((voice) => matchesPreference(voice, normalizedPref));
      if (anyPreferred) return anyPreferred;
    }

    return englishVoices[0] || voices[0];
  };

  const readAdvice = () => {
    if (!('speechSynthesis' in window)) return;
    stopSpeaking();
    const text = adviceText.textContent.trim();
    if (!text) return;
    const voices = window.speechSynthesis.getVoices();
    const preference = voiceSelect.value;
    const voice = chooseVoice(voices, preference);
    utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 0.95;
    utterance.pitch = preference === 'male' ? 0.95 : preference === 'female' ? 1.05 : 1;
    utterance.onend = () => {
      stopSpeakButton.disabled = true;
      speakButton.disabled = false;
    };
    utterance.onerror = () => {
      stopSpeakButton.disabled = true;
      speakButton.disabled = false;
    };
    speakButton.disabled = true;
    stopSpeakButton.disabled = false;
    window.speechSynthesis.speak(utterance);
  };

  const composeAdvice = (cards, question) => {
    const subject = question ? `your question, "${question}"` : 'the matter on your heart';
    const cardSummary = cards
      .map(({ card, position }) => `${card.name} (${position.toLowerCase()})`)
      .join(', ');
    const paragraphOne = `You asked about ${subject}. The story unfolding through ${cardSummary} highlights the arc of learning available right now. Together these cards trace how past conditioning, present choices, and future momentum can weave into a steady, mindful response.`;

    const pastCard = cards.find((item) => item.position === 'Past');
    const presentCard = cards.find((item) => item.position === 'Present');
    const futureCard = cards.find((item) => item.position === 'Future');

    const paragraphTwo = pastCard
      ? `${pastCard.card.name} anchors the past position, reminding you that ${pastCard.contextualMeaning}`
      : '';

    const paragraphThree = presentCard
      ? `${presentCard.card.name} now holds the present mirror. ${presentCard.contextualMeaning} Notice which parts of your current plan can be softened or strengthened today.`
      : '';

    const paragraphFour = futureCard
      ? `${futureCard.card.name} completes the spread looking forward. ${futureCard.contextualMeaning} Treat this as a strategic forecast so you can take aligned, compassionate action.`
      : '';

    const keywords = cards
      .map(({ card }) => card.keywords.split(',').map((k) => k.trim())[0])
      .filter(Boolean)
      .join(', ');
    const paragraphFive = `Integrating these themes—${keywords}—creates a holistic response. Translate the insights into a grounded plan: articulate what you are releasing, define the choice you are embracing today, and outline the supportive habits that keep you resilient. Share the vision with collaborators and revisit the reading after small milestones so the wisdom stays alive.`;

    return [paragraphOne, paragraphTwo, paragraphThree, paragraphFour, paragraphFive]
      .filter((text) => text && text.trim())
      .map((text) => `<p>${text}</p>`) // ensures 4-5 paragraphs
      .join('');
  };

  const updateAdvice = () => {
    if (selectedCards.length < 3) {
      stopSpeaking();
      adviceSection.hidden = true;
      adviceText.innerHTML = '';
      speakButton.disabled = true;
      stopSpeakButton.disabled = true;
      return;
    }
    stopSpeaking();
    const adviceHtml = composeAdvice(selectedCards, currentQuestion);
    adviceText.innerHTML = adviceHtml;
    adviceSection.hidden = false;
    speakButton.disabled = false;
    stopSpeakButton.disabled = true;
  };

  const handlePoolCardSelection = async (cardId) => {
    if (selectedCards.length >= 3) {
      return;
    }
    const cardIndex = poolCards.findIndex((card) => card.id === cardId);
    if (cardIndex === -1) return;
    const [card] = poolCards.splice(cardIndex, 1);
    if (drawCursor < workingDeck.length) {
      poolCards.push(workingDeck[drawCursor]);
      drawCursor += 1;
    }
    renderSpreadPool();

    const slot = spreadSlots[selectedCards.length];
    if (!slot) return;
    const position = slot.dataset.position;
    const { element, contextualMeaning } = createCardElement(card, position, currentQuestion);
    slot.appendChild(element);
    slot.classList.add('filled');
    selectedCards.push({ card, position, contextualMeaning });
    await playSelectSound();
    if (selectedCards.length >= 3) {
      renderSpreadPool();
    }
    deckInstruction.textContent =
      selectedCards.length < 3
        ? 'Place the remaining cards, then tap each to reveal their messages.'
        : 'Flip your cards to explore their messages and read the guidance below.';
    updateAdvice();
  };

  const dealSpread = () => {
    workingDeck = shuffle(window.TAROT_DECK || []);
    drawCursor = 0;
    poolCards = [];
    while (poolCards.length < SPREAD_POOL_SIZE && drawCursor < workingDeck.length) {
      poolCards.push(workingDeck[drawCursor]);
      drawCursor += 1;
    }
    renderSpreadPool();
    deckInstruction.textContent = 'Select three cards to place into Past, Present, and Future.';
    resetButton.disabled = false;
  };

  const startShuffle = async () => {
    if (isShuffling) return;
    isShuffling = true;
    resetReading();
    currentQuestion = questionInput.value.trim();
    shuffleButton.disabled = true;
    deckInstruction.textContent = 'The deck is centering itself…';
    deckElement.classList.add('shuffle');
    await playShuffleSound();
    setTimeout(() => {
      deckElement.classList.remove('shuffle');
      dealSpread();
      shuffleButton.disabled = false;
      isShuffling = false;
    }, 1200);
  };

  const resetReading = () => {
    stopSpeaking();
    poolCards = [];
    workingDeck = [];
    drawCursor = 0;
    selectedCards = [];
    spreadPool.innerHTML = '';
    resetSlots();
    adviceSection.hidden = true;
    adviceText.innerHTML = '';
    deckInstruction.textContent = 'Click “Shuffle & Lay Out Cards” to begin.';
    shuffleButton.disabled = false;
    resetButton.disabled = true;
  };

  shuffleButton.addEventListener('click', () => {
    startShuffle();
  });

  resetButton.addEventListener('click', () => {
    resetReading();
  });

  speakButton.addEventListener('click', () => {
    readAdvice();
  });

  stopSpeakButton.addEventListener('click', () => {
    stopSpeaking();
  });

  voiceSelect.addEventListener('change', () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      stopSpeaking();
    }
  });

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        speakButton.disabled = adviceText.textContent.trim().length === 0;
      }
    };
  }

  resetReading();
})();
