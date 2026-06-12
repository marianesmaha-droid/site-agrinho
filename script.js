/**
 * AGRO FORTE, FUTURO SUSTENTÁVEL — script.js
 * Projeto Agrinho 2024 — Programação Front-End
 * JavaScript puro (sem frameworks ou bibliotecas externas)
 *
 * Funcionalidades:
 *  1. Menu hambúrguer responsivo
 *  2. Animação de contadores nas estatísticas (Intersection Observer)
 *  3. Animação das barras gráficas (Intersection Observer)
 *  4. Quiz interativo com perguntas e respostas
 *  5. Destaque do link ativo na navbar ao rolar
 */

'use strict';

/* ============================================================
   1. MENU HAMBÚRGUER
   ============================================================ */
(function initNavMenu() {
  const toggle  = document.getElementById('navToggle');
  const menu    = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha ao clicar em qualquer link do menu
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ============================================================
   2. CONTADOR ANIMADO NAS ESTATÍSTICAS
   Cada .stat-number tem data-target (valor final) e data-suffix
   ============================================================ */
(function initCounters() {
  const cards = document.querySelectorAll('.stat-number[data-target]');
  if (!cards.length) return;

  /**
   * Anima um número de 0 até target em ~1,8 s com easing cúbico
   * @param {HTMLElement} el
   * @param {number} target
   * @param {string} suffix
   */
  function animateCounter(el, target, suffix) {
    var start     = null;
    var duration  = 1800; // ms
    var isFloat   = !Number.isInteger(target);
    var decimals  = isFloat ? String(target).split('.')[1].length : 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // easing: ease-out cubic
      var ease     = 1 - Math.pow(1 - progress, 3);
      var current  = target * ease;

      if (isFloat) {
        el.textContent = 'R$ ' + current.toFixed(decimals) + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Garante valor final exato
        if (isFloat) {
          el.textContent = 'R$ ' + target.toFixed(decimals) + suffix;
        } else {
          el.textContent = target + suffix;
        }
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el     = entry.target;
        var target = parseFloat(el.dataset.target);
        var suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el); // anima apenas uma vez
      }
    });
  }, { threshold: 0.4 });

  cards.forEach(function (card) { observer.observe(card); });
})();


/* ============================================================
   3. ANIMAÇÃO DAS BARRAS GRÁFICAS
   .bar-fill tem data-width com o valor final em %
   .tl-bar   tem data-width com o valor final em %
   ============================================================ */
(function initBars() {
  var bars = document.querySelectorAll('.bar-fill[data-width], .tl-bar[data-width]');
  if (!bars.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(function (bar) { observer.observe(bar); });
})();


/* ============================================================
   4. QUIZ INTERATIVO
   Perguntas com respostas corretas e fontes comentadas no HTML
   ============================================================ */
(function initQuiz() {
  var area = document.getElementById('quiz-area');
  if (!area) return;

  /**
   * Banco de questões
   * Todas as afirmações têm fontes oficiais referenciadas nos comentários.
   */
  var questoes = [
    {
      pergunta: 'Qual bioma foi responsável por mais da metade (52,5%) de todo o desmatamento do Brasil em 2024, segundo o MapBiomas?',
      opcoes: ['Amazônia', 'Cerrado', 'Mata Atlântica', 'Pantanal'],
      correta: 1,
      // Fonte: CNN Brasil – Dia do Cerrado, set. 2025. Disponível em: https://www.cnnbrasil.com.br/nacional/brasil/dia-do-cerrado-o-bioma-mais-desmatado-do-brasil-vive-sob-ameaca/
      explicacao: '✅ O Cerrado foi responsável por 52,5% de todo o desmatamento do Brasil em 2024, liderando o ranking pelo segundo ano consecutivo (MapBiomas/RAD 2024).'
    },
    {
      pergunta: 'Quanto o PIB do agronegócio representou do PIB nacional brasileiro em 2024?',
      opcoes: ['10,5%', '17,3%', '23,2%', '35,8%'],
      correta: 2,
      // Fonte: CNA/CEPEA – PIB do Agronegócio, 4º trimestre de 2024. Disponível em: https://www.cnabrasil.org.br/noticias/pib-do-agronegocio-fecha-2024-com-crescimento-de-1-81
      explicacao: '✅ O agronegócio representou 23,2% do PIB nacional em 2024, atingindo R$ 2,72 trilhões (CNA/CEPEA, abr. 2025).'
    },
    {
      pergunta: 'Quantas das 12 bacias hidrográficas brasileiras têm origem no Cerrado?',
      opcoes: ['2', '4', '6', '8'],
      correta: 3,
      // Fonte: Agência Brasil – Dia do Cerrado, set. 2024. Disponível em: https://agenciabrasil.ebc.com.br/geral/noticia/2024-09/dia-do-cerrado-bioma-e-o-segundo-mais-ameacado-no-pais-0
      explicacao: '✅ 8 das 12 bacias hidrográficas brasileiras têm origem no Cerrado, o "Coração das Águas" do Brasil (Agência Brasil, set. 2024).'
    },
    {
      pergunta: 'Qual porcentagem da vegetação original do Cerrado já foi destruída?',
      opcoes: ['Menos de 20%', 'Cerca de 35%', 'Cerca de 45%', 'Mais de 55%'],
      correta: 3,
      // Fonte: Conexão Planeta – "Mais de 55% da vegetação nativa do Cerrado já foi perdida", jan. 2026. Disponível em: https://conexaoplaneta.com.br/blog/mais-de-55-da-vegetacao-nativa-do-cerrado-ja-foi-perdida/
      explicacao: '✅ Mais de 55% da vegetação nativa do Cerrado já foi perdida, principalmente para pastagens e cultivo agrícola (Conexão Planeta, jan. 2026).'
    },
    {
      pergunta: 'Qual é a porcentagem do desmatamento no Cerrado concentrada na região MATOPIBA (MA, TO, PI e BA)?',
      opcoes: ['Cerca de 30%', 'Cerca de 50%', 'Cerca de 76%', 'Mais de 90%'],
      correta: 2,
      // Fonte: Agência Brasil – "Após cinco anos de aumento, desmatamento no Cerrado tem queda", nov. 2024. Disponível em: https://agenciabrasil.ebc.com.br/meio-ambiente/noticia/2024-11/apos-cinco-anos-de-aumento-desmatamento-no-cerrado-tem-queda
      explicacao: '✅ Cerca de 76% do desmatamento no Cerrado está concentrado nos estados do MATOPIBA: Maranhão, Tocantins, Piauí e Bahia (INPE/PRODES, nov. 2024).'
    },
    {
      pergunta: 'Qual é a meta do Governo Federal para o desmatamento em todos os biomas brasileiros até 2030?',
      opcoes: ['Reduzir 50%', 'Reduzir 80%', 'Desmatamento zero', 'Manter o nível atual'],
      correta: 2,
      // Fonte: Agência Gov – "Desmatamento cai 30,6% na Amazônia", nov. 2024. Disponível em: https://agenciagov.ebc.com.br/noticias/202411/desmatamento-cai-30-6-na-amazonia-e-25-8-no-cerrado-em-2024
      explicacao: '✅ A meta do Governo Federal, anunciada em nov. 2024, é alcançar desmatamento zero em todos os biomas do país até 2030 (Agência Gov, nov. 2024).'
    },
    {
      pergunta: 'O princípio da "intensificação sustentável" no agronegócio significa:',
      opcoes: [
        'Usar mais agrotóxicos para aumentar a produção',
        'Produzir mais no mesmo espaço, sem desmatar novas áreas',
        'Exportar toda a produção sem consumo interno',
        'Reduzir a produção para preservar o meio ambiente'
      ],
      correta: 1,
      // Fonte: MAPA/Embrapa – Projeções do Agronegócio 2023/2024 a 2033/2034
      explicacao: '✅ Intensificação sustentável significa produzir mais por hectare, usando tecnologia e manejo responsável, sem precisar desmatar novas áreas (Embrapa/MAPA, 2024).'
    }
  ];

  var atual   = 0;
  var pontos  = 0;
  var respondida = false;

  function renderPergunta() {
    respondida = false;
    var q = questoes[atual];
    var total = questoes.length;

    area.innerHTML =
      '<p class="quiz-progress">Pergunta ' + (atual + 1) + ' de ' + total + '</p>' +
      '<p class="quiz-question">' + q.pergunta + '</p>' +
      '<div class="quiz-options" role="list">' +
        q.opcoes.map(function (opcao, i) {
          return '<button class="quiz-option" role="listitem" data-index="' + i + '" aria-label="Opção ' + (i + 1) + ': ' + opcao + '">' + opcao + '</button>';
        }).join('') +
      '</div>' +
      '<p class="quiz-feedback" id="feedbackMsg" aria-live="assertive"></p>';

    // Adiciona listeners nas opções
    area.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (respondida) return;
        respondida = true;
        var idx = parseInt(this.dataset.index, 10);
        var feedback = document.getElementById('feedbackMsg');

        // Bloqueia todos os botões
        area.querySelectorAll('.quiz-option').forEach(function (b) {
          b.disabled = true;
        });

        if (idx === q.correta) {
          this.classList.add('correta');
          feedback.textContent = q.explicacao;
          feedback.className = 'quiz-feedback ok';
          pontos++;
        } else {
          this.classList.add('errada');
          area.querySelectorAll('.quiz-option')[q.correta].classList.add('correta');
          feedback.textContent = '❌ Incorreto. ' + q.explicacao;
          feedback.className = 'quiz-feedback nao';
        }

        // Botão de avançar
        var btnNext = document.createElement('button');
        btnNext.className = 'quiz-next';
        btnNext.textContent = (atual + 1 < total) ? 'Próxima pergunta →' : 'Ver resultado';
        btnNext.addEventListener('click', function () {
          atual++;
          if (atual < total) {
            renderPergunta();
          } else {
            renderResultado();
          }
        });
        area.appendChild(btnNext);
        btnNext.focus();
      });
    });
  }

  function renderResultado() {
    var total = questoes.length;
    var pct   = Math.round((pontos / total) * 100);

    var mensagem;
    if (pct >= 90) {
      mensagem = '🏆 Excelente! Você é um especialista em agro sustentável!';
    } else if (pct >= 70) {
      mensagem = '🌿 Muito bem! Você conhece bem o tema.';
    } else if (pct >= 50) {
      mensagem = '🌾 Bom início! Releia as seções e tente novamente.';
    } else {
      mensagem = '📚 Continue estudando! Explore o conteúdo do site.';
    }

    area.innerHTML =
      '<div class="quiz-resultado">' +
        '<h3>Resultado final</h3>' +
        '<div class="quiz-score" aria-label="Pontuação: ' + pontos + ' de ' + total + '">' + pontos + '/' + total + '</div>' +
        '<p>' + pct + '% de acertos</p>' +
        '<p>' + mensagem + '</p>' +
        '<button class="quiz-refazer" id="btnRefazer">Refazer o quiz</button>' +
      '</div>';

    document.getElementById('btnRefazer').addEventListener('click', function () {
      atual  = 0;
      pontos = 0;
      renderPergunta();
    });
  }

  // Inicia o quiz
  renderPergunta();
})();


/* ============================================================
   5. NAVBAR ATIVA AO ROLAR (destaca link da seção visível)
   ============================================================ */
(function initNavHighlight() {
  var sections = document.querySelectorAll('section[id]');
  var links    = document.querySelectorAll('.nav-menu a[href^="#"]');
  if (!sections.length || !links.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        links.forEach(function (link) {
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === '#' + id) {
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(function (sec) { observer.observe(sec); });
})();


/* ============================================================
   6. NAVBAR — SOMBRA AO ROLAR
   ============================================================ */
(function initNavShadow() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
    } else {
      navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
    }
  }, { passive: true });
})();
