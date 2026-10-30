# Pousada Quinta do Ypuã

Site institucional da **Pousada Quinta do Ypuã**, de frente para a Praia do Ipuã, em Laguna (SC).

Página única, estática e leve, feita com HTML, CSS e JavaScript puro — sem frameworks, sem build, sem dependências.

> ⚠️ **Versão de teste.** Este repositório é publicado no GitHub Pages apenas para avaliação e aprovação do layout. O site oficial é [quintadoypua.com](https://www.quintadoypua.com).

## O que o site tem

- **Consulta de datas** com envio direto para o WhatsApp da pousada
- **Acomodações** — Domo, Charrua (Bus), Suíte com Cozinha, Chalé Família, Cabana e Estacionamento para Overlanders, cada uma com galeria de fotos
- **Eventos** — casamentos, aniversários e confraternizações
- **Avaliações** de hóspedes em carrossel
- **Localização** e informações de contato
- Botão flutuante de WhatsApp em todas as seções

## Detalhes técnicos

- Layout responsivo, pensado primeiro para o celular
- Imagens em `.webp` e `.avif`, com carregamento preguiçoso
- Acessibilidade: navegação por teclado, foco visível e respeito a `prefers-reduced-motion`
- SEO: dados estruturados (`LodgingBusiness`), Open Graph, `sitemap.xml` e `robots.txt`

## Estrutura

```
.
├── index.html        # a página inteira
├── css/estilo.css    # estilos
├── js/script.js      # comportamentos (menu, galerias, carrossel, WhatsApp)
├── img/              # fotos, logo e favicon
├── robots.txt
└── sitemap.xml
```

## Rodando localmente

Não precisa instalar nada. Basta abrir o `index.html` no navegador ou subir um servidor simples:

```bash
python3 -m http.server 8000
```

E acessar `http://localhost:8000`.

## Configuração

O telefone e as mensagens padrão do WhatsApp ficam no topo do `js/script.js`, no objeto `CONFIG`.

## Contato

Pousada Quinta do Ypuã
Estrada Ipuã, nº 6 — Praia do Ipuã, Laguna/SC
(48) 99940-9732 · pousadaquintadoypua@gmail.com
[Instagram](https://www.instagram.com/pousadaquintadoypua) · [Facebook](https://www.facebook.com/pousadaquintadoypua)
