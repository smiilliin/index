(() => {
  const latexInput = document.getElementById("latex-input");
  const latexDisplay = document.getElementById("latex-display");

  latexInput.addEventListener("input", () => {
    let latex = latexInput.value;

    latex = latex.replace(/\\\(|\\\)|\\\[|\\\]|\$/g, "");
    latexDisplay.textContent = `\\(f(z) = ${latex}\\)`;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDisplay]);
  });
})();
