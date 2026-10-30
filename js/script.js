/* ==========================================================================
   Pousada Quinta do Ypuã — comportamentos da página
   JavaScript puro, sem bibliotecas.
   ========================================================================== */
(() => {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIGURAÇÃO — é aqui que se mexe no telefone e nas mensagens.
     ------------------------------------------------------------------ */
  const CONFIG = {
    fone: "5548999409732",
    msgPadrao: "Olá, vim pelo site da Quinta do Ypuã e gostaria de mais informações.",
    segundosSlide: 6500
  };

  const $  = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
  const enc = encodeURIComponent;

  const linkZap = (msg) => `https://wa.me/${CONFIG.fone}?text=${enc(msg || CONFIG.msgPadrao)}`;

  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==================================================================
     1. Links de WhatsApp
     Todo elemento com [data-zap] vira um link para a conversa.
     Use data-msg="..." para uma mensagem específica.
     ================================================================== */
  $$("[data-zap]").forEach((el) => {
    el.href = linkZap(el.dataset.msg);
    el.target = "_blank";
    el.rel = "noopener";
  });

  /* ==================================================================
     2. Topo: fundo sólido ao rolar + menu da versão celular
     ================================================================== */
  const topo = $("#topo");
  const nav = $("#nav");
  const menuBtn = $("#menuBtn");

  const aoRolar = () => topo.classList.toggle("is-solido", window.scrollY > 40);
  aoRolar();
  window.addEventListener("scroll", aoRolar, { passive: true });

  const abrirMenu = (abrir) => {
    nav.classList.toggle("is-aberto", abrir);
    topo.classList.toggle("is-aberto", abrir);
    menuBtn.setAttribute("aria-expanded", String(abrir));
    menuBtn.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  };

  menuBtn.addEventListener("click", () => abrirMenu(!nav.classList.contains("is-aberto")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) abrirMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") abrirMenu(false); });

  /* ==================================================================
     3. Menu: marca a seção em que a pessoa está
     ================================================================== */
  const itensMenu = $$(".nav > a[href^='#']");
  const secoes = itensMenu
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  if ("IntersectionObserver" in window && secoes.length) {
    const marcar = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        itensMenu.forEach((a) =>
          a.classList.toggle("is-atual", a.getAttribute("href") === `#${entrada.target.id}`)
        );
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secoes.forEach((s) => marcar.observe(s));
  }

  /* ==================================================================
     4. Slider do topo
     ================================================================== */
  const slides = $$("#slides .slide");
  const pontos = $("#pontos");
  let slideAtual = 0;
  let relogio;

  if (slides.length > 1) {
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Foto ${i + 1} de ${slides.length}`);
      b.addEventListener("click", () => { irPara(i); recomecar(); });
      pontos.appendChild(b);
    });
  }

  function irPara(i) {
    slideAtual = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-ativo", n === slideAtual));
    [...pontos.children].forEach((b, n) => b.setAttribute("aria-current", String(n === slideAtual)));
  }

  function recomecar() {
    clearInterval(relogio);
    if (!semMovimento && slides.length > 1) {
      relogio = setInterval(() => irPara(slideAtual + 1), CONFIG.segundosSlide);
    }
  }

  if (slides.length) { irPara(0); recomecar(); }

  // economiza recurso quando a aba não está visível
  document.addEventListener("visibilitychange", () => {
    document.hidden ? clearInterval(relogio) : recomecar();
  });

  /* ==================================================================
     5. Formulário de consulta → WhatsApp
     ================================================================== */
  const form = $("#formReserva");
  const entrada = $("#entrada");
  const saida = $("#saida");
  const aviso = $("#consultaAviso");

  const hojeISO = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };

  const paraBR = (iso) => iso.split("-").reverse().join("/");

  if (form) {
    const hoje = hojeISO();
    entrada.min = hoje;
    saida.min = hoje;

    entrada.addEventListener("change", () => {
      const minSaida = entrada.value || hoje;
      saida.min = minSaida;
      if (saida.value && saida.value <= minSaida) saida.value = "";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      aviso.classList.remove("is-erro");

      if (!entrada.value || !saida.value) {
        aviso.textContent = "Escolha a data de entrada e a de saída para a gente já consultar.";
        aviso.classList.add("is-erro");
        (!entrada.value ? entrada : saida).focus();
        return;
      }
      if (saida.value <= entrada.value) {
        aviso.textContent = "A data de saída precisa ser depois da data de entrada.";
        aviso.classList.add("is-erro");
        saida.focus();
        return;
      }

      const pessoas = $("#pessoas").value || "2";
      const noites = Math.round(
        (new Date(saida.value) - new Date(entrada.value)) / 86400000
      );

      const msg =
        "Olá, vim pelo site da Quinta do Ypuã e gostaria de consultar disponibilidade.\n" +
        `Entrada: ${paraBR(entrada.value)}\n` +
        `Saída: ${paraBR(saida.value)}\n` +
        `Pessoas: ${pessoas}`;

      aviso.textContent = "Abrindo o WhatsApp com os seus dados…";
      window.open(linkZap(msg), "_blank", "noopener");
    });
  }

  /* ==================================================================
     6. Acomodações: popup com os detalhes
     ================================================================== */
  const modal = $("#modalAcom");
  const modalTit = $("#modalTit");
  const modalTexto = $("#modalTexto");
  const modalZap = $("#modalZap");
  const slider = $("#modalSlider");
  const sliderAnt = $("#sliderAnt");
  const sliderProx = $("#sliderProx");
  const sliderConta = $("#sliderConta");
  let abriuDoCard = null;

  /* Monta o slide com as fotos de img/acomodacoes/<pasta>/
     capa.webp é a primeira; as seguintes são 02.webp, 03.webp … */
  function montarSlide(card) {
    const pasta = card.dataset.pasta;
    const total = Number(card.dataset.fotos) || 1;
    const nome = $("h3", card).textContent.trim();

    slider.replaceChildren();
    if (!pasta) return 0;

    for (let i = 1; i <= total; i++) {
      const arquivo = i === 1 ? "capa.webp" : String(i).padStart(2, "0") + ".webp";
      const img = document.createElement("img");
      img.src = `img/acomodacoes/${pasta}/${arquivo}`;
      img.alt = `${nome} — foto ${i} de ${total}`;
      img.loading = i === 1 ? "eager" : "lazy";
      img.draggable = false;
      slider.appendChild(img);
    }
    return total;
  }

  function atualizarContador() {
    const fotos = slider.children.length;
    if (!fotos) return;
    const largura = slider.clientWidth || 1;
    const atual = Math.min(fotos, Math.round(slider.scrollLeft / largura) + 1);
    sliderConta.textContent = `${atual} / ${fotos}`;
    sliderAnt.disabled = slider.scrollLeft <= 4;
    sliderProx.disabled = slider.scrollLeft >= slider.scrollWidth - largura - 4;
  }

  function abrirAcomodacao(card) {
    const nome = $("h3", card).textContent.trim();
    const detalhe = $(".acom__detalhe", card);

    modalTit.textContent = nome;

    modalTexto.replaceChildren();
    if (detalhe) {
      [...detalhe.children].forEach((filho) => modalTexto.appendChild(filho.cloneNode(true)));
    }

    const fotos = montarSlide(card);
    slider.scrollLeft = 0;
    const temSlide = fotos > 1;
    sliderAnt.hidden = !temSlide;
    sliderProx.hidden = !temSlide;
    sliderConta.hidden = !temSlide;

    modalZap.href = linkZap(
      `Olá, vim pelo site da Quinta do Ypuã e gostaria de informações sobre a acomodação "${nome}".`
    );

    abriuDoCard = card;
    modal.showModal();
    modal.scrollTop = 0;
    atualizarContador();
  }

  if (slider) {
    const passo = () => slider.clientWidth;
    sliderAnt.addEventListener("click", (e) => {
      e.stopPropagation();
      slider.scrollBy({ left: -passo(), behavior: "smooth" });
    });
    sliderProx.addEventListener("click", (e) => {
      e.stopPropagation();
      slider.scrollBy({ left: passo(), behavior: "smooth" });
    });
    slider.addEventListener("scroll", atualizarContador, { passive: true });
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); slider.scrollBy({ left: -passo(), behavior: "smooth" }); }
      if (e.key === "ArrowRight") { e.preventDefault(); slider.scrollBy({ left: passo(), behavior: "smooth" }); }
    });
  }

  $$(".acom").forEach((card) => {
    card.addEventListener("click", () => abrirAcomodacao(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrirAcomodacao(card);
      }
    });
  });

  if (modal) {
    $("#modalX").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
    modal.addEventListener("close", () => { if (abriuDoCard) abriuDoCard.focus(); });
    modal.addEventListener("keydown", (e) => {
      if (e.target === slider) return;             // o slide já trata as setas
      const larg = slider.clientWidth;
      if (e.key === "ArrowLeft") slider.scrollBy({ left: -larg, behavior: "smooth" });
      if (e.key === "ArrowRight") slider.scrollBy({ left: larg, behavior: "smooth" });
    });
    window.addEventListener("resize", atualizarContador);
  }

  /* ==================================================================
     7. Galeria de eventos com lightbox
     ================================================================== */
  const lb = $("#lb");
  const lbImg = $("#lbImg");
  const fotos = $$("#galeria img");
  let fotoAtual = 0;

  function mostrarFoto(i) {
    fotoAtual = (i + fotos.length) % fotos.length;
    lbImg.src = fotos[fotoAtual].dataset.grande || fotos[fotoAtual].src;
    lbImg.alt = fotos[fotoAtual].alt;
  }

  fotos.forEach((img, i) => {
    img.parentElement.addEventListener("click", () => { mostrarFoto(i); lb.showModal(); });
  });

  if (lb && fotos.length) {
    $("#lbX").addEventListener("click", () => lb.close());
    $("#lbAnt").addEventListener("click", () => mostrarFoto(fotoAtual - 1));
    $("#lbProx").addEventListener("click", () => mostrarFoto(fotoAtual + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") mostrarFoto(fotoAtual - 1);
      if (e.key === "ArrowRight") mostrarFoto(fotoAtual + 1);
    });
  }

  /* ==================================================================
     8. Revelar os blocos conforme a página rola
     ================================================================== */
  const reveláveis = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !semMovimento) {
    const olho = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("is-visivel");
        obs.unobserve(entrada.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    reveláveis.forEach((el) => olho.observe(el));
  } else {
    reveláveis.forEach((el) => el.classList.add("is-visivel"));
  }

  /* ==================================================================
     9. Ano do rodapé
     ================================================================== */
  const ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
