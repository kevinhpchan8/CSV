(function () {
  const majorArcana = [
    {
      name: 'The Fool',
      keywords: 'beginnings, trust, innocence',
      meaning:
        'The Fool embodies a sacred leap into the unknown, trusting intuition more than any map. It invites curiosity, optimism, and freedom from limiting beliefs.',
      advice:
        'Approach the situation with an open mind and heart. Allow yourself to explore, experiment, and learn without the burden of perfection. Courageous play can be strategic when it is guided by awareness.',
    },
    {
      name: 'The Magician',
      keywords: 'resourcefulness, mastery, manifestation',
      meaning:
        'The Magician channels inspiration into tangible form, aligning thought, word, and deed. Power flows when skills, will, and awareness move in concert.',
      advice:
        'Inventory every asset available—from knowledge to allies—and orchestrate them toward a coherent intention. Confidence grows as you translate possibility into action.',
    },
    {
      name: 'The High Priestess',
      keywords: 'intuition, inner wisdom, mystery',
      meaning:
        'The High Priestess invites a descent into inner knowing, honoring dreams, symbols, and subtle cues. Insight emerges in quiet spaces beyond rational analysis.',
      advice:
        'Slow the conversation with yourself and others so you can sense what is unsaid. Let intuition co-lead the process and balance facts with felt truth.',
    },
    {
      name: 'The Empress',
      keywords: 'nurturing, abundance, creativity',
      meaning:
        'The Empress is fertile generosity, cultivating environments where people and ideas can flourish. She honors pleasure, care, and the beauty of interdependence.',
      advice:
        'Invest in nourishment—of body, mind, relationships, and resources. Growth follows when you protect your creative rhythm and extend compassion to yourself and others.',
    },
    {
      name: 'The Emperor',
      keywords: 'structure, leadership, stability',
      meaning:
        'The Emperor builds frameworks that sustain vision over time. He draws boundaries, clarifies roles, and ensures there is order to support ambition.',
      advice:
        'Clarify the rules of engagement and organize your strategy. Authority becomes empowering when it is rooted in integrity and responsive stewardship.',
    },
    {
      name: 'The Hierophant',
      keywords: 'tradition, mentorship, learning',
      meaning:
        'The Hierophant honors shared values and long-standing wisdom. He connects seekers to lineages, rituals, and communities that provide meaning.',
      advice:
        'Seek or offer guidance within trusted structures. Translate tradition into a living practice by aligning teachings with your authentic experience.',
    },
    {
      name: 'The Lovers',
      keywords: 'alignment, choice, relationships',
      meaning:
        'The Lovers highlight meaningful partnerships and pivotal choices that reveal personal values. Alignment asks for honesty about what and whom you truly cherish.',
      advice:
        'Let love and integrity co-author your decisions. When every voice—including your own—feels heard, commitments gain resilience.',
    },
    {
      name: 'The Chariot',
      keywords: 'momentum, willpower, victory',
      meaning:
        'The Chariot focuses determination toward a specific horizon. Mastery of opposing forces generates progress and a sense of purposeful drive.',
      advice:
        'Define the destination and hold your posture. Discipline and emotional intelligence working together make the journey smoother and the outcome sturdier.',
    },
    {
      name: 'Strength',
      keywords: 'courage, resilience, compassion',
      meaning:
        'Strength is the art of steady presence in the face of challenge. Gentle confidence tames fear and invites cooperation rather than domination.',
      advice:
        'Lead with compassion without relinquishing boundaries. A calm heart and grounded body create solutions that brute force cannot.',
    },
    {
      name: 'The Hermit',
      keywords: 'introspection, wisdom, solitude',
      meaning:
        'The Hermit withdraws to distill experience into wisdom. Stillness reveals the lantern light that can guide both yourself and others.',
      advice:
        'Carve out reflective space. Journal, meditate, or simply breathe before acting so your next step emerges from clarity rather than urgency.',
    },
    {
      name: 'Wheel of Fortune',
      keywords: 'cycles, destiny, turning point',
      meaning:
        'The Wheel of Fortune reminds that life rotates through seasons. Alignment with change allows you to seize the opportunities that revolve back into view.',
      advice:
        'Stay adaptable and present. What feels fated is often a conversation between preparation and timing, so move with the wheel rather than resisting it.',
    },
    {
      name: 'Justice',
      keywords: 'truth, fairness, accountability',
      meaning:
        'Justice seeks balance through honest evaluation. Consequences follow causes, and the situation calls for transparency and ethical choices.',
      advice:
        'Review agreements, communicate candidly, and stand in integrity even when it is inconvenient. Equilibrium is restored through honest recalibration.',
    },
    {
      name: 'The Hanged One',
      keywords: 'surrender, new perspective, pause',
      meaning:
        'The Hanged One suspends action to invite a paradigm shift. By releasing resistance, you see the situation upside-down and uncover hidden wisdom.',
      advice:
        'Embrace the pause. Reframe delays as invitations to rethink your approach and to let go of what no longer serves the emerging vision.',
    },
    {
      name: 'Death',
      keywords: 'transformation, endings, rebirth',
      meaning:
        'Death is dignified closure that clears space for renewal. It signals the composting of outgrown identities and the inevitability of change.',
      advice:
        'Honor what is concluding without clinging. Ritualize the ending, grieve honestly, and ready yourself for the new life that follows.',
    },
    {
      name: 'Temperance',
      keywords: 'balance, integration, patience',
      meaning:
        'Temperance alchemizes disparate elements into a harmonious whole. Measured pacing and mindful blending create sustainable results.',
      advice:
        'Moderate extremes and design rhythms that let you replenish as you advance. Integration is a daily practice, not a single event.',
    },
    {
      name: 'The Devil',
      keywords: 'attachment, shadow, liberation',
      meaning:
        'The Devil illuminates the habits, contracts, or fears that keep you feeling stuck. Awareness reveals where agency can be reclaimed.',
      advice:
        'Name the pattern without shaming yourself. Set clear boundaries, seek support, and choose the practices that restore your autonomy.',
    },
    {
      name: 'The Tower',
      keywords: 'revelation, upheaval, awakening',
      meaning:
        'The Tower shakes what is unstable so truth can surface. Though abrupt, the dismantling clears false foundations and liberates authenticity.',
      advice:
        'Anchor in your core values while the dust settles. Rebuild intentionally, using the insight of this rupture to design structures that will last.',
    },
    {
      name: 'The Star',
      keywords: 'hope, healing, inspiration',
      meaning:
        'The Star pours gentle light onto wounded places. It renews faith, invites vulnerability, and nurtures long-term healing.',
      advice:
        'Allow yourself to receive support and to dream again. Small rituals of care will amplify the quiet optimism already returning.',
    },
    {
      name: 'The Moon',
      keywords: 'intuition, uncertainty, subconscious',
      meaning:
        'The Moon bathes the path in mystery. Emotions surge, symbols whisper, and the way forward is revealed in phases rather than straight lines.',
      advice:
        'Trust your instincts and examine the stories you are telling yourself. Clarify fact from fear, yet respect your sensitivities as useful data.',
    },
    {
      name: 'The Sun',
      keywords: 'joy, vitality, success',
      meaning:
        'The Sun illuminates everything with warmth and clarity. Confidence, celebration, and authentic expression radiate outward.',
      advice:
        'Share your progress boldly and invite others into the light with you. Gratitude and transparency keep success sustainable.',
    },
    {
      name: 'Judgement',
      keywords: 'awakening, reckoning, renewal',
      meaning:
        'Judgement sounds the call to rise into a new chapter. Reflection and accountability lead to liberation from past limitations.',
      advice:
        'Review your story with compassion and decide what legacy you want this moment to leave. Let the insight transform your next commitments.',
    },
    {
      name: 'The World',
      keywords: 'completion, mastery, wholeness',
      meaning:
        'The World celebrates integration and the culmination of a cycle. You stand at a threshold where experience and wisdom dance together.',
      advice:
        'Honor the achievement, share what you have learned, and prepare to begin again from a place of greater confidence and connection.',
    },
  ].map((card, index) => ({
    id: `major-${index}`,
    arcana: 'Major',
    suit: null,
    number: index,
    ...card,
  }));

  const suitMeta = {
    Wands: {
      element: 'Fire',
      themes: 'initiative, courage, creativity, and spiritual drive',
      context: 'projects, leadership, and the actions that ignite change',
      emphasis: 'It fuels momentum and encourages you to take bold yet conscious strides.',
      actionCue: 'Channel passion into structured plans so the spark becomes a steady flame.',
      keywords: 'ambition, inspiration, momentum',
      palette: ['#ff8c42', '#ffbe76'],
    },
    Cups: {
      element: 'Water',
      themes: 'emotion, empathy, relationship, and imagination',
      context: 'connection, healing, and the emotional landscape of the heart',
      emphasis: 'It softens resistance and invites you to honor feeling as guidance.',
      actionCue: 'Prioritize honest conversations, receptive listening, and emotional care.',
      keywords: 'empathy, healing, connection',
      palette: ['#5dade2', '#85c1e9'],
    },
    Swords: {
      element: 'Air',
      themes: 'mindset, clarity, communication, and decisions',
      context: 'strategy, truth-telling, and the ideas that sculpt reality',
      emphasis: 'It brings discernment, urging you to articulate facts and choose wisely.',
      actionCue: 'Use precise language, question assumptions, and design intelligent next steps.',
      keywords: 'clarity, analysis, boundaries',
      palette: ['#a29bfe', '#6c5ce7'],
    },
    Pentacles: {
      element: 'Earth',
      themes: 'resources, body, work, and long-term security',
      context: 'stability, craftsmanship, and the material side of dreams',
      emphasis: 'It grounds you, asking for patience and practical stewardship.',
      actionCue: 'Invest in sustainable methods, consistent habits, and embodied presence.',
      keywords: 'stability, stewardship, prosperity',
      palette: ['#58d68d', '#82e0aa'],
    },
  };

  const rankMeta = [
    {
      name: 'Ace',
      keywords: 'beginnings, potential, spark',
      meaning: 'A fresh current of possibility arrives, ready to be shaped.',
      detail: 'It is raw energy asking you to choose how it will be directed.',
      action: 'Define your intention clearly and welcome first steps with enthusiasm.',
    },
    {
      name: 'Two',
      keywords: 'duality, decisions, partnership',
      meaning: 'Two points of view seek balance and cooperation.',
      detail: 'The moment asks you to weigh options and design alignment.',
      action: 'Map your choices, consult trusted allies, and commit to the path that feels congruent.',
    },
    {
      name: 'Three',
      keywords: 'expansion, collaboration, expression',
      meaning: 'The initial idea is ready for teamwork and broader impact.',
      detail: 'Momentum grows when you share the vision and orchestrate resources.',
      action: 'Coordinate timelines, celebrate small wins, and invite support.',
    },
    {
      name: 'Four',
      keywords: 'stability, structure, reflection',
      meaning: 'A pause invites consolidation and appreciation of progress.',
      detail: 'Foundations are being set; tend them with awareness.',
      action: 'Anchor routines, protect boundaries, and rest so the next stretch is grounded.',
    },
    {
      name: 'Five',
      keywords: 'challenge, tension, recalibration',
      meaning: 'Discomfort surfaces to spotlight misalignment or competition.',
      detail: 'This friction is a teacher, revealing where growth is needed.',
      action: 'Address the issue directly, renegotiate terms, and learn from the disruption.',
    },
    {
      name: 'Six',
      keywords: 'movement, generosity, harmony',
      meaning: 'The journey shifts toward equilibrium after recent tests.',
      detail: 'Aid and perspective are available when you receive and give wisely.',
      action: 'Share resources, practice gratitude, and allow support to flow both ways.',
    },
    {
      name: 'Seven',
      keywords: 'assessment, strategy, conviction',
      meaning: 'A reflective checkpoint encourages evaluating progress.',
      detail: 'Your values are being tested; reaffirm what matters most.',
      action: 'Refine the plan, defend your priorities, and stay steady under scrutiny.',
    },
    {
      name: 'Eight',
      keywords: 'mastery, evolution, focus',
      meaning: 'Dedication to craft and personal growth brings transformation.',
      detail: 'Consistency and intentional repetition refine skill and perspective.',
      action: 'Commit to disciplined practice and let purpose guide persistent effort.',
    },
    {
      name: 'Nine',
      keywords: 'fruition, resilience, culmination',
      meaning: 'You are near completion, holding the fruits and lessons of the journey.',
      detail: 'The atmosphere calls for perseverance paired with self-trust.',
      action: 'Protect your progress, stay mindful of limits, and savor the maturity gained.',
    },
    {
      name: 'Ten',
      keywords: 'completion, legacy, transition',
      meaning: 'A cycle closes, revealing both rewards and responsibilities.',
      detail: 'There is an inheritance—emotional, intellectual, or material—to steward.',
      action: 'Document the learning, honor collaborators, and prepare for a fresh chapter.',
    },
    {
      name: 'Page',
      keywords: 'curiosity, study, messenger',
      meaning: 'A youthful perspective brings news and opens new lines of inquiry.',
      detail: 'Beginner’s mind helps you absorb essential information.',
      action: 'Experiment, ask insightful questions, and stay teachable.',
    },
    {
      name: 'Knight',
      keywords: 'pursuit, momentum, exploration',
      meaning: 'Movement intensifies as you pursue a mission with vigor.',
      detail: 'Your style of engagement shapes the quality of the ride.',
      action: 'Advance boldly while adapting your speed to the terrain.',
    },
    {
      name: 'Queen',
      keywords: 'embodiment, compassion, influence',
      meaning: 'Integration and emotional intelligence create a magnetic presence.',
      detail: 'Leadership emerges through empathy, receptivity, and wisdom.',
      action: 'Nurture the environment, mentor others, and lead by modeling balance.',
    },
    {
      name: 'King',
      keywords: 'authority, mastery, stewardship',
      meaning: 'Vision and execution merge under steady leadership.',
      detail: 'Responsibility increases, calling you to govern with clarity.',
      action: 'Set direction, communicate decisively, and uphold ethical standards.',
    },
  ];

  const minorArcana = [];

  Object.entries(suitMeta).forEach(([suit, meta]) => {
    rankMeta.forEach((rank, index) => {
      const name = `${rank.name} of ${suit}`;
      const keywords = `${rank.keywords}; ${meta.keywords}`;
      const meaning = `${rank.meaning} in the realm of ${meta.context}. ${rank.detail} ${meta.emphasis}`;
      const advice = `${rank.action} ${meta.actionCue}`;
      minorArcana.push({
        id: `${suit.toLowerCase()}-${index}`,
        arcana: 'Minor',
        suit,
        number: index + 1,
        name,
        keywords,
        meaning,
        advice,
        element: meta.element,
        palette: meta.palette,
      });
    });
  });

  const deck = [...majorArcana, ...minorArcana];

  window.TAROT_DECK = deck;
})();
