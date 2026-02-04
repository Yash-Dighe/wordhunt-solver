(function () {
  const gridEl = document.getElementById('grid');
  const wordsList = document.getElementById('wordsList');
  const resultsMeta = document.getElementById('resultsMeta');
  const resultsEmpty = document.getElementById('resultsEmpty');
  const resultsSection = document.getElementById('resultsSection');
  const solveBtn = document.getElementById('solveBtn');
  const clearBtn = document.getElementById('clearBtn');

  const API_BASE = ''; // same origin when served by backend server

  const inputs = [];
  for (let i = 0; i < 16; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.className = 'cell';
    input.setAttribute('aria-label', `Cell ${Math.floor(i / 4) + 1}, ${(i % 4) + 1}`);
    input.dataset.index = String(i);
    inputs.push(input);
    gridEl.appendChild(input);
  }

  function getLetters() {
    return inputs.map((inp) => (inp.value || '').trim().toLowerCase()).join('');
  }

  function setLetters(letters) {
    const s = String(letters).replace(/\s/g, '').toLowerCase().slice(0, 16);
    inputs.forEach((inp, i) => {
      inp.value = s[i] || '';
    });
  }

  function focusNext(idx) {
    if (idx < 15) inputs[idx + 1].focus();
  }

  function focusPrev(idx) {
    if (idx > 0) inputs[idx - 1].focus();
  }

  gridEl.addEventListener('input', (e) => {
    const inp = e.target;
    if (!inp.classList.contains('cell')) return;
    const v = inp.value.replace(/[^a-zA-Z]/g, '').slice(-1).toUpperCase();
    inp.value = v;
    const idx = parseInt(inp.dataset.index, 10);
    if (v) focusNext(idx);
  });

  gridEl.addEventListener('keydown', (e) => {
    const inp = e.target;
    if (!inp.classList.contains('cell')) return;
    const idx = parseInt(inp.dataset.index, 10);
    if (e.key === 'Enter') {
      if (getLetters().length === 16) {
        e.preventDefault();
        runSolve();
      }
      return;
    }
    if (e.key === 'Backspace' && !inp.value) {
      e.preventDefault();
      focusPrev(idx);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusNext(idx);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusPrev(idx);
    }
  });

  gridEl.addEventListener('paste', (e) => {
    e.preventDefault();
    const raw = (e.clipboardData || window.clipboardData).getData('text');
    const letters = raw.replace(/[^a-zA-Z]/g, '').toLowerCase().slice(0, 16);
    setLetters(letters);
    const filled = letters.length;
    if (filled <= 16) inputs[Math.min(filled, 15)].focus();
  });

  function setLoading(loading) {
    resultsSection.classList.toggle('loading', loading);
    solveBtn.disabled = loading;
    if (loading) {
      resultsEmpty.textContent = 'Solving…';
      resultsEmpty.classList.remove('hidden');
      wordsList.innerHTML = '';
      resultsMeta.textContent = '';
    }
  }

  function showError(msg) {
    resultsMeta.innerHTML = '';
    resultsMeta.classList.remove('hidden');
    resultsMeta.innerHTML = '<span class="error-msg">' + escapeHtml(msg) + '</span>';
    resultsEmpty.classList.add('hidden');
    wordsList.innerHTML = '';
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function showWords(words) {
    resultsMeta.classList.remove('hidden');
    resultsMeta.innerHTML = '';
    resultsMeta.textContent = words.length + ' word' + (words.length !== 1 ? 's' : '') + ' found';
    wordsList.innerHTML = '';
    words.forEach((w) => {
      const li = document.createElement('li');
      li.textContent = w;
      wordsList.appendChild(li);
    });
    resultsEmpty.classList.toggle('hidden', words.length > 0);
    if (words.length === 0) resultsEmpty.textContent = 'No words found for this board.';
  }

  async function runSolve() {
    resultsSection.classList.remove('hidden');
    const letters = getLetters();
    if (letters.length !== 16) {
      showError('Please enter exactly 16 letters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_BASE + '/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letters }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(data.error || 'Request failed.');
        return;
      }
      showWords(data.words || []);
    } catch (err) {
      showError('Network error. Is the server running? Start it from the backend folder.');
    } finally {
      setLoading(false);
    }
  }

  solveBtn.addEventListener('click', runSolve);

  clearBtn.addEventListener('click', () => {
    setLetters('');
    inputs[0].focus();
    resultsSection.classList.add('hidden');
    wordsList.innerHTML = '';
    resultsMeta.textContent = '';
    resultsMeta.classList.add('hidden');
    resultsEmpty.textContent = 'Enter 16 letters and hit Solve.';
    resultsEmpty.classList.remove('hidden');
  });
})();
