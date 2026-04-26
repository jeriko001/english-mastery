import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// DATA — CEFR CONTENT (A1→C1)
// ============================================================
const GRAMMAR_RULES = {
  A1: [
    { id: "a1_present_simple", title: "Present Simple", explanation: "Use the present simple for habits, routines, and general truths. Add -s/-es for he/she/it.\n\nExamples:\n• I work every day.\n• She works at a hospital.\n• Water boils at 100°C." },
    { id: "a1_to_be", title: "To Be (am/is/are)", explanation: "Use 'am' with I, 'is' with he/she/it, 'are' with you/we/they.\n\nExamples:\n• I am a student.\n• She is happy.\n• They are friends." },
    { id: "a1_articles", title: "Articles: a / an / the", explanation: "Use 'a' before consonants, 'an' before vowels. Use 'the' for specific things.\n\nExamples:\n• I have a dog.\n• She ate an apple.\n• The sun is bright." },
  ],
  A2: [
    { id: "a2_past_simple", title: "Past Simple", explanation: "Use past simple for completed actions in the past. Regular verbs add -ed; irregular verbs have unique forms.\n\nExamples:\n• I walked to school yesterday.\n• She bought a new phone.\n• They went to Paris last summer." },
    { id: "a2_present_continuous", title: "Present Continuous", explanation: "Use present continuous (am/is/are + -ing) for actions happening right now or around now.\n\nExamples:\n• I am studying English.\n• She is sleeping.\n• They are playing soccer." },
  ],
  B1: [
    { id: "b1_present_perfect", title: "Present Perfect", explanation: "Use present perfect (have/has + past participle) to connect past to present — experience, recent events, unfinished time.\n\nExamples:\n• I have visited New York.\n• She has just finished her homework.\n• They haven't eaten yet." },
    { id: "b1_modals", title: "Modal Verbs", explanation: "Modals (can, could, should, must, might, would) add meaning to the main verb.\n\nExamples:\n• You should exercise more.\n• She might be late.\n• We must leave now." },
  ],
  B2: [
    { id: "b2_conditionals", title: "Conditionals (0, 1, 2, 3)", explanation: "0: general truths. 1: real future. 2: unreal present. 3: unreal past.\n\nExamples:\n• If you heat ice, it melts. (0)\n• If it rains, I'll stay home. (1)\n• If I were rich, I'd travel. (2)\n• If I had studied, I would have passed. (3)" },
    { id: "b2_passive", title: "Passive Voice", explanation: "Use passive (be + past participle) when the action is more important than who does it.\n\nExamples:\n• The book was written by Hemingway.\n• The report will be published tomorrow.\n• The window has been broken." },
  ],
  C1: [
    { id: "c1_inversion", title: "Inversion", explanation: "Inversion places the auxiliary before the subject for emphasis, especially after negative adverbs.\n\nExamples:\n• Never have I seen such beauty.\n• Not only did she win, but she also broke the record.\n• Rarely does he make mistakes." },
    { id: "c1_subjunctive", title: "Subjunctive", explanation: "The subjunctive expresses wishes, hypotheticals, or formal suggestions.\n\nExamples:\n• I suggest that he be present.\n• It is essential that she arrive on time.\n• If I were you, I would apologize." },
  ],
};

const EXERCISES_DB = {
  A1: [
    { id: "e_a1_1", type: "fill_blank", level: "A1", question: "She ___ a teacher.", options: ["am", "is", "are", "be", "been"], answer: "is", explanation: "He/She/It → 'is'" },
    { id: "e_a1_2", type: "fill_blank", level: "A1", question: "I ___ from the United States.", options: ["am", "is", "are", "be", "were"], answer: "am", explanation: "I → 'am'" },
    { id: "e_a1_3", type: "fill_blank", level: "A1", question: "They ___ good friends.", options: ["am", "is", "are", "be", "was"], answer: "are", explanation: "They → 'are'" },
    { id: "e_a1_4", type: "fill_blank", level: "A1", question: "He ___ to school every day.", options: ["go", "goes", "going", "gone", "went"], answer: "goes", explanation: "He/She/It → add -s to the verb" },
    { id: "e_a1_5", type: "fill_blank", level: "A1", question: "I have ___ apple for lunch.", options: ["a", "an", "the", "some", "any"], answer: "an", explanation: "'an' before vowel sounds" },
    { id: "e_a1_6", type: "multiple_choice", level: "A1", question: "What is the correct sentence?", options: ["She am happy.", "She is happy.", "She are happy.", "She be happy.", "She was happy now."], answer: "She is happy.", explanation: "He/She/It uses 'is'" },
    { id: "e_a1_7", type: "vocabulary", level: "A1", question: "What does 'beautiful' mean?", options: ["Ugly", "Small", "Pretty / Attractive", "Fast", "Loud"], answer: "Pretty / Attractive", explanation: "'Beautiful' means very attractive or pleasing to the eye." },
    { id: "e_a1_8", type: "fill_blank", level: "A1", question: "___ sun rises in the east.", options: ["A", "An", "The", "Some", "—"], answer: "The", explanation: "'The' for unique, specific things like the sun." },
  ],
  A2: [
    { id: "e_a2_1", type: "fill_blank", level: "A2", question: "Yesterday, she ___ to the store.", options: ["go", "goes", "went", "gone", "going"], answer: "went", explanation: "'Go' is irregular: go → went" },
    { id: "e_a2_2", type: "fill_blank", level: "A2", question: "Right now, I ___ a book.", options: ["read", "reads", "am reading", "have read", "will read"], answer: "am reading", explanation: "Present continuous for actions happening now" },
    { id: "e_a2_3", type: "fill_blank", level: "A2", question: "They ___ soccer when it started raining.", options: ["played", "were playing", "play", "are playing", "had played"], answer: "were playing", explanation: "Past continuous for an interrupted action" },
    { id: "e_a2_4", type: "vocabulary", level: "A2", question: "Choose the synonym of 'angry':", options: ["Happy", "Calm", "Furious", "Tired", "Bored"], answer: "Furious", explanation: "'Furious' is a strong synonym of 'angry'." },
    { id: "e_a2_5", type: "fill_blank", level: "A2", question: "She ___ her keys last night.", options: ["lose", "lost", "loses", "losing", "has lose"], answer: "lost", explanation: "'Lose' is irregular: lose → lost" },
    { id: "e_a2_6", type: "multiple_choice", level: "A2", question: "Which sentence uses present continuous correctly?", options: ["I am go to school.", "She is sleep now.", "They are running in the park.", "He are eating lunch.", "We is watching TV."], answer: "They are running in the park.", explanation: "am/is/are + verb-ing" },
    { id: "e_a2_7", type: "reading", level: "A2", passage: "Tom lives in New York. Every morning, he wakes up at 7 AM and drinks coffee. Yesterday, he was late for work because his alarm didn't go off.", question: "Why was Tom late for work?", options: ["He slept too much.", "His alarm didn't go off.", "He missed the bus.", "He forgot about work.", "He was sick."], answer: "His alarm didn't go off.", explanation: "The passage says 'his alarm didn't go off'." },
  ],
  B1: [
    { id: "e_b1_1", type: "fill_blank", level: "B1", question: "I ___ never ___ sushi before.", options: ["have / eaten", "had / eaten", "have / ate", "did / eat", "was / eating"], answer: "have / eaten", explanation: "Present perfect: have/has + past participle" },
    { id: "e_b1_2", type: "fill_blank", level: "B1", question: "You ___ study harder if you want to pass.", options: ["should", "shall", "will", "are", "have"], answer: "should", explanation: "'Should' gives advice or recommendation" },
    { id: "e_b1_3", type: "fill_blank", level: "B1", question: "She ___ be at home — her car is in the driveway.", options: ["must", "should", "can", "will", "shall"], answer: "must", explanation: "'Must' expresses logical certainty" },
    { id: "e_b1_4", type: "vocabulary", level: "B1", question: "What does 'ambiguous' mean?", options: ["Very clear", "Uncertain / having multiple meanings", "Extremely difficult", "Completely wrong", "Very old"], answer: "Uncertain / having multiple meanings", explanation: "'Ambiguous' describes something that can be understood in more than one way." },
    { id: "e_b1_5", type: "fill_blank", level: "B1", question: "By the time she arrived, we ___ already ___.", options: ["had / left", "have / left", "was / leaving", "did / leave", "were / left"], answer: "had / left", explanation: "Past perfect for an action before another past action" },
    { id: "e_b1_6", type: "reading", level: "B1", passage: "The concept of 'flow' was developed by psychologist Mihaly Csikszentmihalyi. It refers to a mental state of complete immersion and focus in an activity. People in flow often lose track of time and feel a sense of energized concentration.", question: "What happens when people are in a state of 'flow'?", options: ["They feel bored and distracted.", "They lose track of time and feel highly focused.", "They become anxious about the task.", "They work slowly and carefully.", "They feel physically exhausted."], answer: "They lose track of time and feel highly focused.", explanation: "The passage describes flow as 'complete immersion' where people 'lose track of time'." },
    { id: "e_b1_7", type: "multiple_choice", level: "B1", question: "Which sentence uses the present perfect correctly?", options: ["I have went to Paris last year.", "She has seen that movie yesterday.", "They have never tried sushi.", "He have finished his work.", "We has been waiting."], answer: "They have never tried sushi.", explanation: "Present perfect: have/has + past participle. 'Never' = unspecified time." },
  ],
  B2: [
    { id: "e_b2_1", type: "fill_blank", level: "B2", question: "If I ___ more time, I would travel the world.", options: ["had", "have", "would have", "has", "will have"], answer: "had", explanation: "Second conditional: If + past simple, would + base verb" },
    { id: "e_b2_2", type: "fill_blank", level: "B2", question: "The report ___ by the team last week.", options: ["was written", "wrote", "has written", "is writing", "been written"], answer: "was written", explanation: "Passive voice past simple: was/were + past participle" },
    { id: "e_b2_3", type: "vocabulary", level: "B2", question: "What is the best synonym for 'meticulous'?", options: ["Careless", "Extremely careful and precise", "Lazy", "Temporary", "Enthusiastic"], answer: "Extremely careful and precise", explanation: "'Meticulous' describes someone who pays great attention to detail." },
    { id: "e_b2_4", type: "fill_blank", level: "B2", question: "If she ___ studied harder, she ___ have passed.", options: ["had / would", "has / will", "would / had", "did / would", "was / could"], answer: "had / would", explanation: "Third conditional: If + past perfect, would have + past participle" },
    { id: "e_b2_5", type: "reading", level: "B2", passage: "Cognitive biases are systematic patterns of deviation from rationality in judgment. One well-known example is confirmation bias, where people tend to search for, interpret, and recall information that confirms their pre-existing beliefs. This can lead to poor decision-making and polarization in society.", question: "What is confirmation bias?", options: ["The tendency to change one's beliefs easily", "Searching for information that confirms existing beliefs", "Being unable to make decisions", "Ignoring all available information", "Seeking contradictory evidence"], answer: "Searching for information that confirms existing beliefs", explanation: "The passage defines confirmation bias as seeking information that 'confirms their pre-existing beliefs'." },
    { id: "e_b2_6", type: "multiple_choice", level: "B2", question: "Which uses passive voice correctly?", options: ["The cake was ate by children.", "The letter has been sended.", "The project will be completed by Friday.", "She was fell down the stairs.", "The book is write by a famous author."], answer: "The project will be completed by Friday.", explanation: "Future passive: will be + past participle" },
  ],
  C1: [
    { id: "e_c1_1", type: "fill_blank", level: "C1", question: "Never ___ I witnessed such dedication.", options: ["have", "had", "did", "was", "would"], answer: "have", explanation: "Inversion after 'Never': Never + auxiliary + subject + main verb" },
    { id: "e_c1_2", type: "vocabulary", level: "C1", question: "What does 'sycophantic' mean?", options: ["Extremely talented", "Excessively flattering to gain favor", "Deeply philosophical", "Aggressively competitive", "Silently observant"], answer: "Excessively flattering to gain favor", explanation: "A sycophant flatters powerful people insincerely for personal gain." },
    { id: "e_c1_3", type: "fill_blank", level: "C1", question: "I suggest that he ___ present at the meeting.", options: ["be", "is", "was", "will be", "being"], answer: "be", explanation: "Subjunctive after 'suggest': subject + base form of verb" },
    { id: "e_c1_4", type: "fill_blank", level: "C1", question: "Not only ___ she win, but she also broke the record.", options: ["did", "had", "has", "was", "would"], answer: "did", explanation: "Inversion after 'Not only': Not only + auxiliary + subject" },
    { id: "e_c1_5", type: "reading", level: "C1", passage: "The paradox of tolerance, formulated by Karl Popper, posits that if a society is tolerant without limit, its tolerance will eventually be seized and destroyed by the intolerant. Popper concluded that in order to maintain a tolerant society, it must be intolerant of intolerance itself — a seemingly self-contradictory but logically sound position.", question: "What is the core argument of Popper's paradox of tolerance?", options: ["All beliefs deserve equal tolerance.", "Unlimited tolerance leads to the destruction of tolerance.", "Intolerance should always be punished legally.", "Tolerance is impossible to define.", "Society should enforce a single set of values."], answer: "Unlimited tolerance leads to the destruction of tolerance.", explanation: "Popper argues that unlimited tolerance will be exploited by the intolerant, destroying tolerance itself." },
    { id: "e_c1_6", type: "multiple_choice", level: "C1", question: "Which sentence uses inversion correctly?", options: ["Rarely he makes such errors.", "Not only she finished first, but also won a prize.", "Hardly had she left when it started raining.", "Never I have seen such talent.", "Seldom does he is wrong."], answer: "Hardly had she left when it started raining.", explanation: "Inversion after 'Hardly': Hardly + had + subject + past participle" },
  ],
};

const PLACEMENT_QUESTIONS = [
  { id: "p1", level: "A1", question: "She ___ a doctor.", options: ["am", "is", "are", "be", "been"], answer: "is" },
  { id: "p2", level: "A1", question: "I ___ from Italy.", options: ["am", "is", "are", "be", "were"], answer: "am" },
  { id: "p3", level: "A2", question: "Yesterday, he ___ to the gym.", options: ["go", "goes", "went", "gone", "going"], answer: "went" },
  { id: "p4", level: "A2", question: "Right now, she ___ coffee.", options: ["drink", "drinks", "is drinking", "drank", "will drink"], answer: "is drinking" },
  { id: "p5", level: "B1", question: "I ___ never ___ Thai food before.", options: ["have / tried", "had / tried", "have / try", "did / try", "was / trying"], answer: "have / tried" },
  { id: "p6", level: "B1", question: "You ___ see a doctor about that cough.", options: ["should", "shall", "are", "have", "will"], answer: "should" },
  { id: "p7", level: "B2", question: "If she ___ more time, she would finish the project.", options: ["had", "have", "has", "would have", "will have"], answer: "had" },
  { id: "p8", level: "B2", question: "The letter ___ by the secretary.", options: ["was written", "wrote", "has written", "is writing", "been written"], answer: "was written" },
  { id: "p9", level: "C1", question: "Never ___ I seen such courage.", options: ["have", "had", "did", "was", "would"], answer: "have" },
  { id: "p10", level: "C1", question: "It is vital that she ___ on time.", options: ["be", "is", "was", "will be", "being"], answer: "be" },
];

const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1"];
const LEVEL_COLORS = { A1: "#4ade80", A2: "#60a5fa", B1: "#f59e0b", B2: "#f97316", C1: "#e879f9" };

// ============================================================
// SPACED REPETITION (SM-2 simplified)
// ============================================================
function getNextReview(easeFactor, interval, quality) {
  // quality: 0-5 (0-2 = fail, 3-5 = pass)
  if (quality < 3) {
    return { interval: 1, easeFactor: Math.max(1.3, easeFactor - 0.2) };
  }
  const newInterval = interval === 0 ? 1 : interval === 1 ? 6 : Math.round(interval * easeFactor);
  const newEF = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  return { interval: newInterval, easeFactor: newEF };
}

// ============================================================
// STYLES
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --surface2: #1a1a26;
    --border: #2a2a3a;
    --text: #e8e8f0;
    --text-dim: #7070a0;
    --accent: #7c6af7;
    --accent2: #c084fc;
    --green: #4ade80;
    --red: #f87171;
    --yellow: #fbbf24;
    --font-head: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --r: 14px;
    --r-sm: 8px;
  }

  html, body, #root {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-head);
    overflow: hidden;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }

  /* SCROLLABLE CONTENT */
  .screen {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px 20px 100px;
    scrollbar-width: none;
  }
  .screen::-webkit-scrollbar { display: none; }

  /* NAV */
  .nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: rgba(10,10,15,0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    display: flex;
    padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
    z-index: 100;
  }
  .nav-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-dim);
    font-family: var(--font-head);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }
  .nav-btn.active { color: var(--accent); }
  .nav-btn svg { width: 22px; height: 22px; }

  /* CARDS */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 20px;
    margin-bottom: 16px;
  }
  .card-sm {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    padding: 14px 16px;
    margin-bottom: 10px;
  }

  /* BUTTONS */
  .btn {
    width: 100%;
    padding: 16px;
    border-radius: var(--r);
    border: none;
    font-family: var(--font-head);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .btn-primary {
    background: var(--accent);
    color: #fff;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .btn-sm {
    padding: 10px 16px;
    border-radius: var(--r-sm);
    font-size: 13px;
    font-weight: 600;
    border: none;
    font-family: var(--font-head);
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-green { background: rgba(74,222,128,0.15); color: var(--green); }
  .btn-red { background: rgba(248,113,113,0.15); color: var(--red); }

  /* TYPOGRAPHY */
  h1 { font-size: 28px; font-weight: 800; line-height: 1.1; }
  h2 { font-size: 20px; font-weight: 700; }
  h3 { font-size: 16px; font-weight: 600; }
  .mono { font-family: var(--font-mono); }
  .dim { color: var(--text-dim); }
  .small { font-size: 12px; }
  .label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  /* LEVEL BADGE */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  /* PROGRESS BAR */
  .progress-track {
    height: 6px;
    background: var(--surface2);
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 3px;
    background: var(--accent);
    transition: width 0.4s ease;
  }

  /* OPTION BUTTONS */
  .option-btn {
    width: 100%;
    padding: 14px 16px;
    margin-bottom: 8px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: var(--r-sm);
    color: var(--text);
    font-family: var(--font-head);
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .option-btn:hover { border-color: var(--accent); color: var(--accent); }
  .option-btn.selected { border-color: var(--accent); background: rgba(124,106,247,0.15); color: var(--accent); }
  .option-btn.correct { border-color: var(--green); background: rgba(74,222,128,0.12); color: var(--green); }
  .option-btn.wrong { border-color: var(--red); background: rgba(248,113,113,0.12); color: var(--red); }
  .option-btn.reveal { border-color: var(--green); background: rgba(74,222,128,0.08); color: var(--green); }
  .option-btn:disabled { cursor: default; }

  /* SELECT DROPDOWN */
  .select-inline {
    display: inline-block;
    position: relative;
    margin: 0 4px;
  }
  .select-inline select {
    background: var(--surface2);
    border: 1.5px solid var(--accent);
    border-radius: 6px;
    color: var(--accent);
    font-family: var(--font-head);
    font-size: 14px;
    font-weight: 600;
    padding: 4px 28px 4px 10px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
  }
  .select-inline::after {
    content: '▾';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--accent);
    pointer-events: none;
    font-size: 12px;
  }

  /* FEEDBACK BOX */
  .feedback-box {
    border-radius: var(--r-sm);
    padding: 14px 16px;
    margin-top: 16px;
    font-size: 14px;
    line-height: 1.5;
  }
  .feedback-correct { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3); color: var(--green); }
  .feedback-wrong { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.3); color: var(--red); }

  /* PASSAGE BOX */
  .passage-box {
    background: var(--surface2);
    border-left: 3px solid var(--accent);
    border-radius: 0 var(--r-sm) var(--r-sm) 0;
    padding: 16px;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--text);
  }

  /* GRAMMAR RULE */
  .rule-box {
    background: var(--surface2);
    border-radius: var(--r);
    padding: 20px;
    margin-bottom: 16px;
    white-space: pre-wrap;
    font-size: 14px;
    line-height: 1.7;
  }

  /* HOME STATS */
  .stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .stat-number { font-size: 28px; font-weight: 800; font-family: var(--font-head); }

  /* REVIEW QUEUE */
  .queue-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: rgba(251,191,36,0.1);
    border: 1px solid rgba(251,191,36,0.3);
    border-radius: var(--r-sm);
    font-size: 13px;
    color: var(--yellow);
    margin-bottom: 16px;
    font-weight: 600;
  }

  /* SETTINGS */
  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }
  .setting-row:last-child { border-bottom: none; }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.3s ease forwards; }

  @keyframes pop {
    0% { transform: scale(0.95); opacity: 0; }
    60% { transform: scale(1.03); }
    100% { transform: scale(1); opacity: 1; }
  }
  .pop { animation: pop 0.25s ease forwards; }

  /* PLACEMENT SCREEN */
  .placement-header {
    text-align: center;
    padding: 32px 0 24px;
  }
  .step-dots {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin: 16px 0;
  }
  .dot {
    width: 8px; height: 8px;
    border-radius: 4px;
    background: var(--border);
    transition: all 0.3s;
  }
  .dot.done { background: var(--green); width: 20px; }
  .dot.active { background: var(--accent); width: 20px; }

  /* REVIEW SESSION */
  .session-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .session-progress {
    flex: 1;
  }

  /* RULE SELECTOR */
  .rule-list { display: flex; flex-direction: column; gap: 10px; }
  .rule-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .rule-item:hover { border-color: var(--accent); }

  /* AUDIO BUTTON */
  .audio-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: rgba(124,106,247,0.15);
    border: 1px solid var(--accent);
    border-radius: 20px;
    color: var(--accent);
    font-family: var(--font-head);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 16px;
    transition: all 0.15s;
  }
  .audio-btn:hover { background: rgba(124,106,247,0.25); }

  .section-title {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 12px;
    margin-top: 8px;
  }

  .empty-state {
    text-align: center;
    padding: 48px 20px;
    color: var(--text-dim);
  }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }

  .tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    background: var(--surface2);
    border-radius: 4px;
    font-size: 11px;
    color: var(--text-dim);
    font-family: var(--font-mono);
    margin-right: 6px;
  }
`;

// ============================================================
// ICONS
// ============================================================
const Icons = {
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  Book: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Volume: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Upload: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Arrow: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

// ============================================================
// UTILITY
// ============================================================
function getInitialState() {
  try {
    const saved = localStorage.getItem("engpwa_v1");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

function getLevelColor(level) {
  return LEVEL_COLORS[level] || "#7c6af7";
}

function getDueExercises(srData) {
  const now = Date.now();
  return Object.entries(srData)
    .filter(([, d]) => d.nextReview <= now)
    .map(([id]) => id);
}

function getExerciseById(id) {
  for (const lvl of LEVEL_ORDER) {
    const found = EXERCISES_DB[lvl]?.find(e => e.id === id);
    if (found) return found;
  }
  return null;
}

function getAllExercisesForLevel(level) {
  const idx = LEVEL_ORDER.indexOf(level);
  let result = [];
  for (let i = 0; i <= idx; i++) {
    result = result.concat(EXERCISES_DB[LEVEL_ORDER[i]] || []);
  }
  return result;
}

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const american = voices.find(v => v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Alex")));
  if (american) utterance.voice = american;
  window.speechSynthesis.speak(utterance);
}

// ============================================================
// PLACEMENT TEST
// ============================================================
function PlacementTest({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const q = PLACEMENT_QUESTIONS[step];
  const isLast = step === PLACEMENT_QUESTIONS.length - 1;

  function handleSelect(opt) {
    if (confirmed) return;
    setSelected(opt);
  }

  function handleConfirm() {
    if (!selected) return;
    setConfirmed(true);
    setAnswers(prev => ({ ...prev, [q.id]: { answer: selected, correct: selected === q.answer, level: q.level } }));
  }

  function handleNext() {
    if (isLast) {
      computeLevel();
    } else {
      setStep(s => s + 1);
      setSelected(null);
      setConfirmed(false);
    }
  }

  function computeLevel() {
    const scores = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
    Object.values(answers).forEach(a => { if (a.correct) scores[a.level]++; });
    // Current: correct last answer too
    const last = PLACEMENT_QUESTIONS[step];
    if (selected === last.answer) scores[last.level]++;

    // Determine level: must pass majority of level questions
    let finalLevel = "A1";
    const levelQCounts = { A1: 2, A2: 2, B1: 2, B2: 2, C1: 2 };
    for (const lvl of LEVEL_ORDER) {
      if (scores[lvl] >= Math.ceil(levelQCounts[lvl] / 2)) {
        finalLevel = lvl;
      }
    }
    onComplete(finalLevel);
  }

  const isCorrect = confirmed && selected === q.answer;

  return (
    <div className="screen fade-up">
      <div className="placement-header">
        <div className="label" style={{ marginBottom: 8 }}>Placement Test</div>
        <h2>What's your level?</h2>
        <p className="dim small" style={{ marginTop: 8 }}>The test adapts to your answers in real time.</p>
      </div>

      <div className="step-dots">
        {PLACEMENT_QUESTIONS.map((_, i) => (
          <div key={i} className={`dot ${i < step ? "done" : i === step ? "active" : ""}`} />
        ))}
      </div>

      <div style={{ marginTop: 8, marginBottom: 4 }} className="label">Question {step + 1} of {PLACEMENT_QUESTIONS.length}</div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, marginBottom: 20 }}>
          {q.question.includes("___") ? (
            q.question.split("___").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span style={{ color: "var(--accent)", borderBottom: "2px solid var(--accent)", padding: "0 4px" }}>___</span>}
              </span>
            ))
          ) : q.question}
        </div>

        {q.options.map((opt, i) => {
          let cls = "option-btn";
          if (confirmed) {
            if (opt === q.answer) cls += " correct";
            else if (opt === selected && selected !== q.answer) cls += " wrong";
          } else if (opt === selected) cls += " selected";
          return (
            <button key={i} className={cls} onClick={() => handleSelect(opt)} disabled={confirmed}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}

        {!confirmed && selected && (
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={handleConfirm}>Confirm</button>
        )}

        {confirmed && (
          <>
            <div className={`feedback-box ${isCorrect ? "feedback-correct" : "feedback-wrong"}`}>
              {isCorrect ? "✓ Correct!" : `✗ The correct answer is: ${q.answer}`}
            </div>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={handleNext}>
              {isLast ? "See My Level →" : "Next Question →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EXERCISE COMPONENT
// ============================================================
function ExerciseCard({ exercise, onResult, showHeader = true }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [fillAnswers, setFillAnswers] = useState({});

  const isMultiBlank = exercise.type === "fill_blank" && (exercise.answer || "").includes(" / ");
  const blanks = isMultiBlank ? exercise.answer.split(" / ") : [exercise.answer];
  const blankParts = exercise.question.split("___");

  const isCorrect = confirmed && (
    exercise.type === "fill_blank" && isMultiBlank
      ? blanks.every((b, i) => fillAnswers[i] === b)
      : selected === exercise.answer
  );

  function handleConfirm() {
    if (confirmed) return;
    if (exercise.type === "fill_blank" && isMultiBlank) {
      if (Object.keys(fillAnswers).length < blanks.length) return;
    } else {
      if (!selected) return;
    }
    setConfirmed(true);
    onResult && onResult(isCorrect ? 4 : 1);
  }

  function reset() {
    setSelected(null);
    setConfirmed(false);
    setFillAnswers({});
  }

  useEffect(() => { reset(); }, [exercise.id]);

  const typeLabel = { fill_blank: "Fill in the blank", multiple_choice: "Multiple choice", vocabulary: "Vocabulary", reading: "Reading comprehension" }[exercise.type] || exercise.type;

  return (
    <div className="fade-up">
      {showHeader && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span className="tag">{typeLabel}</span>
          <span className="badge" style={{ background: getLevelColor(exercise.level) + "22", color: getLevelColor(exercise.level) }}>{exercise.level}</span>
        </div>
      )}

      {exercise.type === "reading" && exercise.passage && (
        <div className="passage-box">{exercise.passage}</div>
      )}

      {/* Listening button if exercise has audio text */}
      {exercise.passage && (
        <button className="audio-btn" onClick={() => speak(exercise.passage)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
          Listen
        </button>
      )}

      <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.6, marginBottom: 20 }}>
        {exercise.type === "fill_blank" && isMultiBlank ? (
          blankParts.map((part, i) => (
            <span key={i}>
              {part}
              {i < blankParts.length - 1 && (
                <span className="select-inline">
                  <select
                    value={fillAnswers[i] || ""}
                    onChange={e => setFillAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                    disabled={confirmed}
                    style={confirmed ? { borderColor: fillAnswers[i] === blanks[i] ? "var(--green)" : "var(--red)", color: fillAnswers[i] === blanks[i] ? "var(--green)" : "var(--red)" } : {}}
                  >
                    <option value="">___</option>
                    {exercise.options.map((opt, j) => <option key={j} value={opt}>{opt}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "var(--accent)", pointerEvents: "none", fontSize: 12 }}>▾</span>
                </span>
              )}
            </span>
          ))
        ) : exercise.type === "fill_blank" ? (
          exercise.question.split("___").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="select-inline">
                  <select
                    value={selected || ""}
                    onChange={e => !confirmed && setSelected(e.target.value)}
                    disabled={confirmed}
                    style={confirmed ? { borderColor: selected === exercise.answer ? "var(--green)" : "var(--red)", color: selected === exercise.answer ? "var(--green)" : "var(--red)" } : {}}
                  >
                    <option value="">___</option>
                    {exercise.options.map((opt, j) => <option key={j} value={opt}>{opt}</option>)}
                  </select>
                </span>
              )}
            </span>
          ))
        ) : (
          exercise.question
        )}
      </div>

      {/* Options for non-fill types */}
      {exercise.type !== "fill_blank" && exercise.options.map((opt, i) => {
        let cls = "option-btn";
        if (confirmed) {
          if (opt === exercise.answer) cls += " correct";
          else if (opt === selected && selected !== exercise.answer) cls += " wrong";
        } else if (opt === selected) cls += " selected";
        return (
          <button key={i} className={cls} onClick={() => !confirmed && setSelected(opt)} disabled={confirmed}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
            <span style={{ flex: 1 }}>{opt}</span>
          </button>
        );
      })}

      {!confirmed && (
        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={handleConfirm}
          disabled={exercise.type === "fill_blank" && isMultiBlank
            ? Object.keys(fillAnswers).length < blanks.length
            : !selected}>
          Confirm
        </button>
      )}

      {confirmed && (
        <>
          <div className={`feedback-box ${isCorrect ? "feedback-correct" : "feedback-wrong"}`}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</div>
            {!isCorrect && <div style={{ marginBottom: 4 }}>Correct answer: <strong>{exercise.answer}</strong></div>}
            {exercise.explanation && <div style={{ opacity: 0.85 }}>{exercise.explanation}</div>}
          </div>
          <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => onResult && onResult(isCorrect ? 4 : 1, true)}>
            Next →
          </button>
        </>
      )}
    </div>
  );
}

// ============================================================
// HOME SCREEN
// ============================================================
function HomeScreen({ state, onStartSession, onStartPlacement }) {
  const { level, srData, totalAnswered, totalCorrect } = state;
  const dueCount = getDueExercises(srData).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  if (!level) {
    return (
      <div className="screen fade-up">
        <div style={{ paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🇺🇸</div>
          <h1 style={{ marginBottom: 8 }}>English<br />Mastery</h1>
          <p className="dim" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
            No lives. No streaks. Just learning.<br />American English, from A1 to C1.
          </p>
          <button className="btn btn-primary" onClick={onStartPlacement}>Take Placement Test →</button>
          <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => onStartSession("A1")}>Skip — Start at A1</button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen fade-up">
      <div style={{ paddingTop: 8 }}>
        <div className="label" style={{ marginBottom: 4 }}>Your level</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 36, fontWeight: 800, color: getLevelColor(level) }}>{level}</span>
          <span className="dim">American English</span>
        </div>

        {dueCount > 0 && (
          <div className="queue-indicator">
            <span>⏰</span>
            <span>{dueCount} exercise{dueCount !== 1 ? "s" : ""} due for review</span>
          </div>
        )}

        <div className="stat-grid">
          <div className="stat-card">
            <div className="label">Accuracy</div>
            <div className="stat-number" style={{ color: accuracy >= 70 ? "var(--green)" : "var(--red)" }}>{accuracy}%</div>
          </div>
          <div className="stat-card">
            <div className="label">Reviewed</div>
            <div className="stat-number">{totalAnswered}</div>
          </div>
          <div className="stat-card">
            <div className="label">Due</div>
            <div className="stat-number" style={{ color: dueCount > 0 ? "var(--yellow)" : "var(--text)" }}>{dueCount}</div>
          </div>
          <div className="stat-card">
            <div className="label">Level</div>
            <div className="stat-number" style={{ color: getLevelColor(level) }}>{level}</div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => onStartSession()} style={{ marginBottom: 12 }}>
          {dueCount > 0 ? `Start Review (${dueCount} due)` : "Practice Session →"}
        </button>
        <button className="btn btn-outline" onClick={() => onStartSession("free")}>
          Free Practice →
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PRACTICE SESSION
// ============================================================
function PracticeSession({ state, mode, onUpdateSR, onBack }) {
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    let exercises = [];
    if (mode === "free") {
      exercises = getAllExercisesForLevel(state.level);
      exercises = [...exercises].sort(() => Math.random() - 0.5).slice(0, 10);
    } else {
      const due = getDueExercises(state.srData);
      if (due.length > 0) {
        exercises = due.map(id => getExerciseById(id)).filter(Boolean);
      } else {
        exercises = getAllExercisesForLevel(state.level)
          .filter(e => !state.srData[e.id] || state.srData[e.id].nextReview <= Date.now())
          .slice(0, 8);
        if (exercises.length === 0) {
          exercises = getAllExercisesForLevel(state.level).sort(() => Math.random() - 0.5).slice(0, 8);
        }
      }
    }
    setQueue(exercises);
  }, []);

  if (queue.length === 0) return (
    <div className="screen">
      <div className="empty-state">
        <div className="empty-icon">🎉</div>
        <h3>All caught up!</h3>
        <p className="dim small" style={{ marginTop: 8 }}>No exercises due right now. Come back later.</p>
        <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={onBack}>Back to Home</button>
      </div>
    </div>
  );

  const current = queue[idx];

  function handleResult(quality, advance = false) {
    if (!advance) return; // wait for "Next" tap
    const prev = state.srData[current.id] || { interval: 0, easeFactor: 2.5, nextReview: 0 };
    const { interval, easeFactor } = getNextReview(prev.easeFactor, prev.interval, quality);
    const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;
    onUpdateSR(current.id, { interval, easeFactor, nextReview });
    setSessionStats(s => ({ correct: s.correct + (quality >= 3 ? 1 : 0), total: s.total + 1 }));

    if (idx + 1 >= queue.length) {
      setDone(true);
    } else {
      setIdx(i => i + 1);
    }
  }

  if (done) return (
    <div className="screen fade-up">
      <div style={{ textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {sessionStats.correct / sessionStats.total >= 0.7 ? "🎯" : "📚"}
        </div>
        <h2 style={{ marginBottom: 8 }}>Session Complete</h2>
        <p className="dim" style={{ marginBottom: 32 }}>
          {sessionStats.correct} / {sessionStats.total} correct
        </p>
        <div style={{ fontSize: 32, fontWeight: 800, color: sessionStats.correct / sessionStats.total >= 0.7 ? "var(--green)" : "var(--red)", marginBottom: 32 }}>
          {Math.round((sessionStats.correct / sessionStats.total) * 100)}%
        </div>
        <button className="btn btn-primary" onClick={onBack}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="screen">
      <div className="session-header">
        <button onClick={onBack} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: 20 }}>✕</button>
        <div className="session-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${((idx) / queue.length) * 100}%` }} />
          </div>
        </div>
        <span className="dim small mono">{idx + 1}/{queue.length}</span>
      </div>

      <ExerciseCard exercise={current} onResult={handleResult} />
    </div>
  );
}

// ============================================================
// GRAMMAR SCREEN
// ============================================================
function GrammarScreen({ state }) {
  const [selectedLevel, setSelectedLevel] = useState(state.level || "A1");
  const [selectedRule, setSelectedRule] = useState(null);

  const rules = GRAMMAR_RULES[selectedLevel] || [];

  if (selectedRule) return (
    <div className="screen fade-up">
      <button onClick={() => setSelectedRule(null)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← Back
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span className="badge" style={{ background: getLevelColor(selectedLevel) + "22", color: getLevelColor(selectedLevel) }}>{selectedLevel}</span>
        <h2>{selectedRule.title}</h2>
      </div>
      <div className="rule-box">{selectedRule.explanation}</div>
      <button className="audio-btn" onClick={() => speak(selectedRule.explanation.replace(/•/g, "").replace(/\n/g, " "))}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
        Listen to explanation
      </button>
    </div>
  );

  return (
    <div className="screen fade-up">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 4 }}>Grammar</h2>
        <p className="dim small">Rules and explanations by level.</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {LEVEL_ORDER.map(lvl => (
          <button key={lvl} onClick={() => setSelectedLevel(lvl)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "1.5px solid", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 13, cursor: "pointer", borderColor: selectedLevel === lvl ? getLevelColor(lvl) : "var(--border)", background: selectedLevel === lvl ? getLevelColor(lvl) + "22" : "transparent", color: selectedLevel === lvl ? getLevelColor(lvl) : "var(--text-dim)", transition: "all 0.15s" }}>
            {lvl}
          </button>
        ))}
      </div>

      <div className="rule-list">
        {rules.map(rule => (
          <div key={rule.id} className="rule-item" onClick={() => setSelectedRule(rule)}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{rule.title}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// EXERCISES SCREEN
// ============================================================
function ExercisesScreen({ state }) {
  const [filter, setFilter] = useState("all");
  const [activeExercise, setActiveExercise] = useState(null);

  const allExercises = getAllExercisesForLevel(state.level || "A1");
  const filtered = filter === "all" ? allExercises : allExercises.filter(e => e.type === filter);

  if (activeExercise) return (
    <div className="screen fade-up">
      <button onClick={() => setActiveExercise(null)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
        ← Exercises
      </button>
      <ExerciseCard exercise={activeExercise} onResult={() => {}} />
    </div>
  );

  const types = ["all", "fill_blank", "multiple_choice", "vocabulary", "reading"];
  const typeLabels = { all: "All", fill_blank: "Fill Blank", multiple_choice: "Multiple Choice", vocabulary: "Vocabulary", reading: "Reading" };

  return (
    <div className="screen fade-up">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 4 }}>Exercises</h2>
        <p className="dim small">Browse all exercises up to your level.</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "1.5px solid", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", borderColor: filter === t ? "var(--accent)" : "var(--border)", background: filter === t ? "rgba(124,106,247,0.15)" : "transparent", color: filter === t ? "var(--accent)" : "var(--text-dim)", transition: "all 0.15s" }}>
            {typeLabels[t]}
          </button>
        ))}
      </div>

      {filtered.map(ex => (
        <div key={ex.id} className="card-sm" style={{ cursor: "pointer" }} onClick={() => setActiveExercise(ex)}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <span className="tag">{typeLabels[ex.type] || ex.type}</span>
                <span className="badge" style={{ background: getLevelColor(ex.level) + "22", color: getLevelColor(ex.level) }}>{ex.level}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.4 }}>{ex.question.replace(/___/g, "___")}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" style={{ flexShrink: 0, marginLeft: 8 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// SETTINGS SCREEN
// ============================================================
function SettingsScreen({ state, onReset, onExport, onImport, onRetakeTest }) {
  const fileRef = useRef();

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        onImport(data);
      } catch {
        alert("Invalid file format.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="screen fade-up">
      <h2 style={{ marginBottom: 24 }}>Settings</h2>

      <div className="section-title">Profile</div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="setting-row">
          <div>
            <div style={{ fontWeight: 600 }}>Current Level</div>
            <div className="dim small">{state.level || "Not set"}</div>
          </div>
          <span className="badge" style={{ background: getLevelColor(state.level) + "22", color: getLevelColor(state.level) }}>{state.level || "—"}</span>
        </div>
        <div className="setting-row">
          <div>
            <div style={{ fontWeight: 600 }}>Total Reviewed</div>
          </div>
          <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{state.totalAnswered}</span>
        </div>
        <div className="setting-row">
          <div>
            <div style={{ fontWeight: 600 }}>Retake Placement Test</div>
            <div className="dim small">Reset your level</div>
          </div>
          <button className="btn-sm btn-outline" style={{ background: "none", border: "1px solid var(--border)", color: "var(--text)", padding: "6px 12px", borderRadius: 8, fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 12, cursor: "pointer" }} onClick={onRetakeTest}>Retake</button>
        </div>
      </div>

      <div className="section-title">Data</div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="setting-row">
          <div>
            <div style={{ fontWeight: 600 }}>Export Progress</div>
            <div className="dim small">Download your data as JSON</div>
          </div>
          <button className="btn-sm" style={{ background: "rgba(124,106,247,0.15)", color: "var(--accent)", padding: "8px 14px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }} onClick={onExport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
        <div className="setting-row">
          <div>
            <div style={{ fontWeight: 600 }}>Import Progress</div>
            <div className="dim small">Restore from a JSON file</div>
          </div>
          <button className="btn-sm" style={{ background: "rgba(74,222,128,0.15)", color: "var(--green)", padding: "8px 14px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }} onClick={() => fileRef.current.click()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import
          </button>
          <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleImport} />
        </div>
      </div>

      <div className="section-title">Danger Zone</div>
      <div className="card">
        <div className="setting-row">
          <div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>Reset All Data</div>
            <div className="dim small">Wipes all progress and SR data</div>
          </div>
          <button className="btn-sm" style={{ background: "rgba(248,113,113,0.15)", color: "var(--red)", padding: "8px 14px", borderRadius: 8, fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 12, cursor: "pointer" }} onClick={() => { if (confirm("Reset all progress? This cannot be undone.")) onReset(); }}>Reset</button>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 32, color: "var(--text-dim)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
        English Mastery v1.0 · Built for learning 🇺🇸
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
const DEFAULT_STATE = {
  level: null,
  srData: {},
  totalAnswered: 0,
  totalCorrect: 0,
};

export default function App() {
  const [appState, setAppState] = useState(() => getInitialState() || DEFAULT_STATE);
  const [screen, setScreen] = useState("home");
  const [sessionMode, setSessionMode] = useState(null);

  // Persist state
  useEffect(() => {
    try { localStorage.setItem("engpwa_v1", JSON.stringify(appState)); } catch (e) {}
  }, [appState]);

  function handlePlacementComplete(level) {
    setAppState(s => ({ ...s, level }));
    setScreen("home");
  }

  function handleStartSession(mode) {
    setSessionMode(mode || "review");
    setScreen("session");
  }

  function handleUpdateSR(exerciseId, srEntry) {
    setAppState(s => ({
      ...s,
      srData: { ...s.srData, [exerciseId]: srEntry },
      totalAnswered: s.totalAnswered + 1,
      totalCorrect: s.totalCorrect + (srEntry.interval > 0 ? 1 : 0),
    }));
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(appState, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "english_mastery_progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(data) {
    if (data && typeof data === "object" && "level" in data) {
      setAppState(data);
      alert("Progress imported successfully!");
    } else {
      alert("Invalid progress file.");
    }
  }

  const showNav = screen !== "session" && screen !== "placement";

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {screen === "placement" && (
          <PlacementTest onComplete={handlePlacementComplete} />
        )}

        {screen === "session" && (
          <PracticeSession
            state={appState}
            mode={sessionMode}
            onUpdateSR={handleUpdateSR}
            onBack={() => setScreen("home")}
          />
        )}

        {screen === "home" && showNav && (
          <HomeScreen
            state={appState}
            onStartSession={handleStartSession}
            onStartPlacement={() => setScreen("placement")}
          />
        )}

        {screen === "grammar" && showNav && (
          <GrammarScreen state={appState} />
        )}

        {screen === "exercises" && showNav && (
          <ExercisesScreen state={appState} />
        )}

        {screen === "settings" && showNav && (
          <SettingsScreen
            state={appState}
            onReset={() => setAppState(DEFAULT_STATE)}
            onExport={handleExport}
            onImport={handleImport}
            onRetakeTest={() => { setAppState(s => ({ ...s, level: null })); setScreen("placement"); }}
          />
        )}

        {showNav && (
          <nav className="nav">
            {[
              { id: "home", label: "Home", Icon: Icons.Home },
              { id: "exercises", label: "Exercises", Icon: Icons.Zap },
              { id: "grammar", label: "Grammar", Icon: Icons.Book },
              { id: "settings", label: "Settings", Icon: Icons.Settings },
            ].map(({ id, label, Icon }) => (
              <button key={id} className={`nav-btn ${screen === id ? "active" : ""}`} onClick={() => setScreen(id)}>
                <Icon />
                {label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
