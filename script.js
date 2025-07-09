let currentQuestionIndex = 0;
const totalQuestions = 5; // Ajuste conforme seu quiz
const userName = "Juliana"; // Substitua por input real se necessário

function atualizarDots(indexAtual) {
  const dots = document.querySelectorAll('.progress-dot');
  dots.forEach((dot, index) => {
    dot.classList.remove('active');
    if (index === indexAtual) dot.classList.add('active');
  });
}

document.getElementById('next-button').addEventListener('click', () => {
  if (currentQuestionIndex < totalQuestions - 1) {
    currentQuestionIndex++;
    atualizarDots(currentQuestionIndex);
  } else {
    mostrarBotaoFinal();
  }
});

function mostrarBotaoFinal() {
  const profile = "frutado"; // Substitua pela lógica real do quiz
  const phone = "5599999999999";
  const msg = encodeURIComponent(\`Oi Lucca! Meu nome é \${userName} e meu perfil sensorial é FRUTADO. Quero receber o PDF com dicas e começar essa jornada!\`);
  const link = \`https://wa.me/\${phone}?text=\${msg}&utm_source=quiz&utm_medium=whatsapp&utm_campaign=perfil_frutado\`;

  document.getElementById('cta-container').innerHTML = \`
    <a href="\${link}" target="_blank" class="cta-button">Quero experimentar os cafés frutados ☕🍓</a>
  \`;
}
