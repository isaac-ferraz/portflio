# Portfólio Acadêmico — Isaac Ferraz de Oliveira

Portfólio acadêmico digital do curso de **Análise e Desenvolvimento de Sistemas**
da **FATEC São José dos Campos — Prof. Jessen Vidal**.

- **No ar:** <https://isaac-ferraz.github.io>
- **RA:** 1460482611003

---

## Sobre a construção

O portfólio é avaliado também pela técnica de construção, então ele foi feito à
mão, sem framework:

| Restrição | Como foi resolvido |
| --- | --- |
| **Zero JavaScript** | Nenhuma tag `<script>` no projeto. A navegação usa âncoras e `:target`; o menu Iniciar, o botão de minimizar de cada janela e o zoom das capturas usam o *checkbox hack* (`:checked +`); as seções expansíveis usam `<details>`/`<summary>` nativos. |
| **Só HTML e CSS** | Sem Bootstrap, sem build, sem dependências. O site é servido como está. |
| **Grid e Flexbox** | As seções de projetos são `display: grid` com `repeat(auto-fit, minmax(...))`; os cartões por dentro são Flexbox em coluna. |
| **Identidade visual** | Frutiger Aero + Windows XP (Luna) + Windows 7 (Aero Glass): janelas com barra de título de vidro, barra de tarefas, botões *gel* e papel de parede vetorial. |

### Estrutura

```
.
├── index.html          # página única, HTML semântico
├── css/
│   ├── tokens.css      # cores, gradientes, sombras, escala tipográfica
│   ├── reset.css
│   ├── chrome.css      # janelas, barra de título, barra de tarefas, menu Iniciar
│   ├── components.css  # botões gel, etiquetas, selos, escala de competências
│   ├── layout.css      # grid/flex das seções + responsivo
│   └── main.css        # único <link> do HTML; importa os demais
└── img/
    ├── perfil-*.jpg    # foto de perfil (quadrada, 512 e 1024)
    ├── wallpaper.svg   # papel de parede Aero, vetorial
    ├── icons/          # ícones das barras de título
    └── projetos/       # capturas e diagramas dos projetos
```

O contato é feito por botões (e-mail, LinkedIn, GitHub) — não há PDF de
currículo para baixar; as informações curriculares ficam na própria página.

O CSS é dividido por responsabilidade e reunido em `main.css` com `@import`, para
o HTML carregar uma folha só.

### Minimizar e ampliar, sem JavaScript

Os dois usam o mesmo padrão do menu Iniciar: um `<input type="checkbox">`
escondido logo antes do elemento, e um `<label>` que serve de botão.

- **Minimizar** — o `_` da barra de título é um `<label>`; com
  `.min-toggle:checked + .window .window__body { display: none }` sobra só a
  barra, como uma janela enrolada. O botão fica âmbar enquanto está minimizada.
- **Ampliar a captura** — o `<label>` envolve a imagem; ao marcar, a imagem
  larga o corte `aspect-ratio: 2/1` e cresce até `min(78vh, 820px)`.

A ampliação acontece **no lugar**, e não numa sobreposição em tela cheia: uma
*lightbox* exigiria um bloco de markup duplicado por captura, e o
`position: fixed` não sobreviveria dentro do cartão de qualquer forma —
`.window` usa `backdrop-filter` e `.project:hover` usa `transform`, e os dois
criam bloco de contenção para descendentes fixos.

---

## Rodar localmente

Não há build. Qualquer servidor estático serve:

```bash
python3 -m http.server 5500
# abra http://localhost:5500
```

Abrir o `index.html` direto pelo `file://` também funciona.

---

## Qualidade verificada

- **HTML** — validador do W3C: 0 erros, 0 avisos.
- **CSS** — validador do W3C (CSS3 + SVG): 0 erros, 0 avisos.
- **Acessibilidade** — axe-core (WCAG 2.1 A e AA) em 1440px e 375px: 0 violações.
- **Contraste** — os fundos de vidro e degradê, que o axe não consegue medir,
  foram conferidos à mão contra os equivalentes opacos; todos passam em AA.
- **Responsivo** — sem rolagem horizontal em 1440, 768, 375 e 320px.
- **Movimento** — `prefers-reduced-motion` desliga animações e rolagem suave.
- **Impressão** — `@media print` remove o cromo da janela e mantém o conteúdo legível.

---

## Conteúdo

Segue a estrutura mínima pedida no roteiro da disciplina: apresentação pessoal,
competências técnicas em escala declarada (1 a 5, sem percentuais), projetos
acadêmicos (API), projetos profissionais, projetos pessoais, informações
curriculares e contato.
