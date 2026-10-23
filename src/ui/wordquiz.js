// Word Quiz overlay: 20 vocabulary questions, one at a time. Each right answer gives coins.
import { h } from './dom.js';
import { pickVocabRound, VOCAB_COINS_PER_CORRECT } from '../data/vocab.js';

const TYPE_HINT = {
  meaning: 'Pick the meaning',
  word: 'Pick the word',
  gap: 'Fill the gap',
};

function cheer(correct, total) {
  const r = correct / total;
  if (r >= 0.9) return 'Wow! You are a word star! ⭐';
  if (r >= 0.6) return 'Great job! Your words are getting strong.';
  if (r >= 0.3) return 'Good try! You learned new words today.';
  return 'Nice try! Every new word helps you. You can read them in "Words to know".';
}

export class WordQuiz {
  // handlers: onCoins(amount) after each right answer, onClose({ correct, total, coins, finished })
  constructor(parent, { onCoins, onClose, budgetText }) {
    this.parent = parent;
    this.onCoins = onCoins;
    this.onClose = onClose;
    this.budgetText = budgetText || (() => '');
    this.el = null;
    this.round = [];
    this.index = 0;
    this.correct = 0;
    this.phase = 'closed'; // closed | asking | answered | finished
    this.onKey = (e) => this.key(e);
  }

  get isOpen() { return this.phase !== 'closed'; }
  get coins() { return this.correct * VOCAB_COINS_PER_CORRECT; } // this round
  get current() { return this.round[this.index] || null; }

  open(rng) {
    if (this.isOpen) return false;
    this.rng = rng;
    this.phase = 'asking';
    this.el = h('div', { class: 'screen wordquiz', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Word Quiz' });
    this.parent.append(this.el);
    window.addEventListener('keydown', this.onKey, true);
    return this.startRound();
  }

  playAgain() {
    if (this.phase !== 'finished') return false;
    return this.startRound();
  }

  startRound() {
    this.round = pickVocabRound(this.rng);
    this.index = 0;
    this.correct = 0;
    this.phase = 'asking';
    this.render();
    return true;
  }

  close(finished) {
    if (!this.isOpen) return;
    window.removeEventListener('keydown', this.onKey, true);
    const summary = { correct: this.correct, total: this.round.length, coins: this.coins, finished };
    this.phase = 'closed';
    if (this.el) this.el.remove();
    this.el = null;
    this.onClose(summary);
  }

  key(e) {
    if (!this.isOpen) return;
    // the quiz owns the keyboard while it is open
    const k = e.key;
    let used = false;
    if (k >= '1' && k <= '4') { used = true; if (!e.repeat) this.answer(Number(k) - 1); }
    else if (k === 'Enter' || k === ' ') { used = true; if (!e.repeat) this.next(); }
    else if (k === 'Escape') { used = true; this.close(this.phase === 'finished'); }
    if (used) e.preventDefault();
    e.stopPropagation();
  }

  answer(idx) {
    if (this.phase !== 'asking' || !(idx >= 0 && idx < 4)) return false;
    const q = this.current;
    this.phase = 'answered';
    const right = idx === q.answer;
    const btns = this.optBtns;
    btns.forEach((b, i) => {
      b.disabled = true;
      b.blur();
      if (i === q.answer) b.classList.add('right');
    });
    if (right) {
      this.correct++;
      this.onCoins(VOCAB_COINS_PER_CORRECT);
      this.updateCoins(true);
      this.popCoins();
    } else {
      btns[idx].classList.add('wrong');
    }
    this.feedback.className = 'wq-feedback ' + (right ? 'good' : 'bad');
    this.feedback.replaceChildren(
      h('b', {}, right ? '✅ Correct!' : '❌ Not quite.'),
      ' ',
      right ? '' : h('span', {}, `The answer is "${q.options[q.answer]}". `),
      q.explain);
    this.nextBtn.textContent = this.index === this.round.length - 1 ? 'See my score' : 'Next →';
    this.nextBtn.classList.remove('hidden');
    this.stopBtn.classList.add('hidden');
    return true;
  }

  next() {
    if (this.phase === 'answered') {
      this.index++;
      if (this.index >= this.round.length) { this.phase = 'finished'; this.renderEnd(); }
      else { this.phase = 'asking'; this.render(); }
      return true;
    }
    if (this.phase === 'finished') { this.close(true); return true; }
    return false;
  }

  updateCoins(bump) {
    this.coinEl.replaceChildren(h('span', { class: 'ci' }, '🪙'), h('b', {}, String(this.coins)));
    if (bump) {
      this.coinEl.classList.remove('bump');
      void this.coinEl.offsetWidth;
      this.coinEl.classList.add('bump');
    }
  }

  popCoins() {
    const pop = h('div', { class: 'coin-pop', 'aria-hidden': 'true' }, `+${VOCAB_COINS_PER_CORRECT} 🪙`);
    this.card.append(pop);
    setTimeout(() => pop.remove(), 1200);
  }

  render() {
    const q = this.current;
    const total = this.round.length;
    this.coinEl = h('div', { class: 'wq-coins', 'aria-live': 'polite', title: 'Coins you won in this quiz' });
    this.updateCoins(false);
    this.optBtns = q.options.map((o, idx) => h('button', {
      class: 'opt wq-opt', type: 'button', 'data-index': idx,
      onclick: () => this.answer(idx),
    }, h('span', { class: 'letter' }, idx + 1), h('span', { class: 'otext' }, o)));
    this.feedback = h('div', { class: 'wq-feedback hidden', role: 'status' });
    this.nextBtn = h('button', { class: 'btn primary big wq-next hidden', type: 'button', onclick: () => this.next() }, 'Next →');
    this.stopBtn = h('button', { class: 'btn soft', type: 'button', onclick: () => this.close(false) }, 'Stop quiz');
    this.card = h('div', { class: 'card wq' },
      h('div', { class: 'wq-head' },
        h('div', { class: 'qprog' }, `Question ${this.index + 1} of ${total}`),
        this.coinEl),
      h('div', { class: 'wq-bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': this.index },
        h('i', { style: { width: (this.index / total) * 100 + '%' } })),
      h('div', { class: 'wq-type' }, '🧠 ' + TYPE_HINT[q.type]),
      h('h2', { class: 'wq-q' }, q.q),
      h('div', { class: 'opts' }, this.optBtns),
      this.feedback,
      h('div', { class: 'row wq-row' }, this.stopBtn, this.nextBtn));
    this.el.replaceChildren(this.card);
  }

  renderEnd() {
    const total = this.round.length;
    this.card = h('div', { class: 'card wq wq-end' },
      h('div', { class: 'wq-trophy', 'aria-hidden': 'true' }, this.correct >= total * 0.9 ? '🏆' : this.correct >= total * 0.6 ? '🎉' : '🧠'),
      h('h2', {}, 'Quiz done!'),
      h('div', { class: 'wq-result' }, `You got ${this.correct} of ${total} right!`),
      h('div', { class: 'wq-earned' }, `+${this.coins} coins`),
      h('p', { class: 'kind' }, cheer(this.correct, total)),
      h('p', { class: 'small' }, this.budgetText()),
      h('div', { class: 'row wq-row center wrap' },
        h('button', { class: 'btn primary big', type: 'button', onclick: () => this.playAgain() }, 'Play again'),
        h('button', { class: 'btn soft big', type: 'button', onclick: () => this.close(true) }, 'Back to building')));
    this.el.replaceChildren(this.card);
  }
}
