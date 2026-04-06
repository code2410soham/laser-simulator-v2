import './style.css';
import { initTheme } from './theme/theme.js';
import { initNavigation } from './ui/navigation.js';
import { initAnimations } from './ui/animations.js';
import { initSimulator } from './simulator/ui.js';
import { initCards } from './applications/cards.js';
import { initGraph } from './theory/graph.js';
import { initQuiz } from './quiz/QuizManager.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initAnimations();
  initSimulator();
  initCards();
  initGraph();
  initQuiz();
});
