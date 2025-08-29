(function () {
  const form = document.getElementById('convert-form');
  const inputEl = document.getElementById('input');
  const resultCard = document.getElementById('result');
  const jsonEl = document.getElementById('json');
  const exampleBtns = document.querySelectorAll('.example');

  exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      inputEl.value = btn.dataset.val;
      form.dispatchEvent(new Event('submit'));
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = inputEl.value.trim();
    if (!input) return;

    try {
      const res = await fetch(`/api/convert?input=${encodeURIComponent(input)}`);
      const text = await res.text();

      // Intentar parsear JSON; si falla, es texto plano (errores: invalid unit/number/both).
      let display;
      try {
        display = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        display = text; // "invalid unit", etc.
      }

      jsonEl.textContent = display;
      resultCard.classList.remove('hidden');
    } catch (err) {
      jsonEl.textContent = `Error: ${err.message}`;
      resultCard.classList.remove('hidden');
    }
  });
})();
