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
| **Grid e Flexbox** | As seções de projetos e de competências são `display: grid`, com as colunas declaradas em fração (`1fr`, `repeat(2, 1fr)`) e a quantidade delas decidida por media query em `em`. Os cartões, por dentro, são Flexbox em coluna. |
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

Dois casos fogem desse comportamento padrão, porque neles crescer em altura não
ajudaria:

- **Tira panorâmica** (`.shot--wide`, o fluxo do n8n em 1581 × 283) — a moldura
  assume a proporção da própria imagem em vez do corte 2:1, que engoliria
  metade dos nós. Ampliada, ela volta ao tamanho nativo e é a **moldura** que
  rola na horizontal (`overflow-x: auto`), porque ali o que interessa é ler o
  rótulo de cada nó, não ver a tira maior.
- **Captura dentro de cartão largo** — ampliada, ela larga a sua coluna com
  `grid-column: 1 / -1` e toma o cartão inteiro. Sem isso, "ampliar" devolveria
  a mesma imagem no mesmo tamanho.

### Colunas em fração, não em pixel

As grades declaram a coluna em `fr` e deixam a quantidade de colunas para a
media query. A alternativa comum — `repeat(auto-fit, minmax(300px, 1fr))` —
esconde a decisão dentro de uma largura mínima e produz o número de colunas que
couber, que nem sempre divide certo a quantidade de itens: em `.cards`, com
quatro caixas, o passo de três colunas deixava a segunda linha com um cartão e
dois buracos.

Vale registrar por que o `auto-fit` não se corrigia sozinho em `.projects`: ele
só recolhe trilha vazia quando **ninguém referencia a linha `-1`**, e é
exatamente o que os cartões `.project--wide` fazem para ocupar a linha inteira.

Os pontos de virada estão em `em` (não em `px`), então a coluna quebra quando o
texto pede — acompanhando quem aumentou a fonte padrão do navegador — e não
quando o dispositivo tem tantos pixels:

| grade | colunas |
| --- | --- |
| `.two-col` | 1 → 2 em `37.5em` |
| `.skills-grid` | 1 → 2 em `43.75em` → 3 em `63.75em` |
| `.projects` | 1 → 2 em `55.5em` |
| `.cards` | 1 → 2 em `35em` → 4 em `68em` |
| `.api-grid` | sempre 1 |

### O topo do cartão largo

Nos dois projetos de linha inteira a captura fica **ao lado** do texto, não
acima dele (`.project__top`, duas colunas a partir de `55.5em`). Empilhada, ela
crescia junto com o cartão: `aspect-ratio: 2/1` em 1130px dá 547px de altura —
metade do cartão — e o texto virava legenda da foto, enquanto nos cartões
estreitos a mesma captura ocupava um terço. Lado a lado, a largura que sobrava
vai para o texto e a imagem volta à escala dos vizinhos (538 × 269 contra
517 × 259). Abaixo do ponto de virada o cartão largo não tem largura sobrando
para dividir, então tudo volta a empilhar.

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

- **HTML** — Nu HTML Checker (W3C): 0 erros, 0 avisos.
- **CSS** — validador do W3C (perfil CSS3 + SVG), nos seis arquivos: 0 erros, 0 avisos.
- **Acessibilidade** — axe-core (WCAG 2.1 A e AA) em 1440px e 375px: 0 violações.
- **Contraste** — os fundos de vidro e degradê, que o axe não consegue medir,
  foram conferidos à mão contra os equivalentes opacos; todos passam em AA.
- **Responsivo** — sem rolagem horizontal em nenhuma largura de 320 a 1600px
  (varredura de 4 em 4 pixels, com todos os `<details>` abertos e as imagens
  carregadas, que é o estado em que a página fica mais larga).
- **Movimento** — `prefers-reduced-motion` desliga animações e rolagem suave.
- **Impressão** — `@media print` remove o cromo da janela e mantém o conteúdo legível.

O contraste é o único item da lista conferido à mão; os demais são reexecutáveis
e foram rodados de novo na versão atual dos arquivos.

---

## Conteúdo

Segue a estrutura mínima pedida no roteiro da disciplina: apresentação pessoal,
competências técnicas em escala declarada (1 a 5, sem percentuais), projetos
acadêmicos (API), projetos profissionais, projetos pessoais, informações
curriculares e contato.

### Dados e privacidade

Os projetos profissionais descrevem sistemas internos de uma empresa, então o
conteúdo obedece a três regras — que valem tanto para o texto quanto para as
imagens:

- **Nenhum dado real.** Valores, CPFs e acordos que aparecem em captura ou
  ilustração vêm de base de homologação ou são fictícios, e a própria página
  declara isso no texto de cada projeto.
- **O nome do sistema de cobrança não aparece.** No texto ele é chamado de
  "Sistema de Cobranças da empresa". Na captura do fluxo do n8n ele está
  borrado **dentro do próprio arquivo PNG** — mosaico com máscara suavizada, não
  um filtro CSS por cima, que qualquer pessoa desligaria pelo inspetor.
- **Nenhuma entrega de cliente é exibida.** O Web Studio é ilustrado por um
  diagrama do processo (`web-studio-processo.svg`), não pelo site de um cliente.
