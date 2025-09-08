// JS: relógio, regras de agendamento e validação
(function() {
  const relogio = document.getElementById('relogio');

  function tick() {
    const now = new Date();
    if (relogio) relogio.textContent = now.toLocaleTimeString('pt-BR', { hour12: false });
  }

  tick();
  setInterval(tick, 1000);

  const form = document.getElementById('formCadastro');
  if (!form) return;

  const entrega = document.getElementById('entrega');
  const retirada = document.getElementById('retirada');
  const blocoEndereco = document.getElementById('blocoEndereco');
  const enderecoFields = blocoEndereco ? blocoEndereco.querySelectorAll('input, select') : [];
  const data = document.getElementById('data');
  const hora = document.getElementById('hora');
  const retorno = document.getElementById('retorno');

  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm = String(hoje.getMonth() + 1).padStart(2,'0');
  const dd = String(hoje.getDate()).padStart(2,'0');
  if (data) data.min = `${yyyy}-${mm}-${dd}`;

  if (hora) {
    hora.min = '08:00';
    hora.max = '20:00';
    hora.step = 900; // 15 min
  }

  function atualizaEnderecoObrigatorio() {
    const precisaEndereco = entrega && entrega.checked;
    enderecoFields.forEach((el) => {
      if (el.id === 'complemento') return;
      el.required = precisaEndereco;
    });
    blocoEndereco.style.opacity = precisaEndereco ? 1 : 0.6;
  }

  if (entrega && retirada) {
    entrega.addEventListener('change', atualizaEnderecoObrigatorio);
    retirada.addEventListener('change', atualizaEnderecoObrigatorio);
    atualizaEnderecoObrigatorio();
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    let okHora = true;
    if (hora && hora.value) {
      okHora = hora.value >= hora.min && hora.value <= hora.max;
      if (!okHora) hora.setCustomValidity('Horário fora do intervalo permitido.');
      else hora.setCustomValidity('');
    }

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      if (retorno) {
        retorno.classList.remove('d-none', 'alert-success');
        retorno.classList.add('alert-warning');
        retorno.textContent = 'Verifique os campos destacados e tente novamente.';
      }
      return;
    }

    const nome = document.getElementById('nome')?.value || '';
    const forma = document.querySelector('input[name="forma"]:checked')?.value || '';
    const when = `${data?.value || ''} às ${hora?.value || ''}`;

    if (retorno) {
      retorno.classList.remove('d-none', 'alert-warning');
      retorno.classList.add('alert-success');
      retorno.innerHTML = `Obrigado, <strong>${nome}</strong>! Seu agendamento de <strong>${forma}</strong> foi registrado para <strong>${when}</strong>.`;
      retorno.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.reset();
    form.classList.remove('was-validated');
    atualizaEnderecoObrigatorio();
  }, false);
})();

