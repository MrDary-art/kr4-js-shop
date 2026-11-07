---
name: "Флора"
description: "Тактильный цветочный журнал с быстрым и понятным заказом букета"
colors:
  garnet-ink: "#4E0A0B"
  botanical-ink: "#2A1719"
  dusty-paper: "#F2EEE8"
  bright-paper: "#FFFDF9"
  powder-blush: "#FFE6F0"
  petal-pink: "#EA9CAF"
  dusty-orchid: "#D56989"
  khaki-leaf: "#9DAD71"
  sorbet-leaf: "#C2DC80"
  danger: "#9E263F"
  success: "#486330"
typography:
  display:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "clamp(2.7rem, 12vw, 6.7rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "clamp(2.25rem, 8vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.4
  script:
    fontFamily: "Allegretto Script Two, cursive"
    fontWeight: 400
    lineHeight: 0.8
rounded:
  compact: "0.75rem"
  surface: "1.4rem"
  editorial: "2.5rem"
  pill: "999px"
spacing:
  xxs: "0.25rem"
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "clamp(4rem, 10vw, 9rem)"
components:
  button-primary:
    backgroundColor: "{colors.garnet-ink}"
    textColor: "{colors.bright-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.15rem"
    height: "2.75rem"
  button-quiet:
    backgroundColor: "{colors.powder-blush}"
    textColor: "{colors.garnet-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.15rem"
    height: "2.75rem"
  input:
    backgroundColor: "{colors.bright-paper}"
    textColor: "{colors.botanical-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.compact}"
    padding: "0.78rem 0.9rem"
    height: "3rem"
  product-card-media:
    backgroundColor: "{colors.powder-blush}"
    textColor: "{colors.garnet-ink}"
    rounded: "{rounded.surface}"
---

# Design System: Флора

## Overview

**Creative North Star: "Тактильный ботанический журнал"**

«Флора» соединяет тактильность бумажного модного журнала и прямоту хорошего магазина. Объёмные цветы пересекают крупную типографику, а каталог, цены, состав и форма остаются практичными.

Полупрозрачный материал используется как функциональный слой: в навигации, фильтрах и подписях отзывов. Остальные секции строят глубину масштабом, цветом и фотографией, а не тяжёлыми рамками.

**Key Characteristics:**

- крупный редакционный Prata на контрасте с прямым Manrope;
- тёплые пудровые поля с тёмно-гранатовыми чернилами;
- фотографические букеты, которые перекрывают типографику;
- асимметричные сетки и свободный вертикальный ритм;
- короткое и отзывчивое движение с доступным reduced-motion режимом.

## Colors

Палитра собрана как пудровая бумага, тень лепестка и приглушённая зелень листа.

### Primary

- **Гранатовые чернила:** главные CTA, футер, заголовки и текст на светлых полях.

### Secondary

- **Пудровый румянец:** фон карточек, active-состояния и мягкие секции.
- **Хаки листа:** вторичные плашки и контрастные подсказки.

### Tertiary

- **Пыльная орхидея:** деликатные акценты, состояния и декоративные метки.
- **Сорбетная зелень:** числовые badge и редкие цветовые ответы.

### Neutral

- **Пыльная бумага:** базовое поле страницы.
- **Яркая бумага:** формы, модальное окно и текст на тёмном фоне.
- **Ботанические чернила:** основной наборный текст.

### Named Rules

**The Garnet Ink Rule.** Гранатовый цвет всегда работает как чернила или действие, а не как шумная заливка каждой секции.

## Typography

**Display Font:** Prata (with Georgia, serif)  
**Body Font:** Manrope (with system-ui, sans-serif)  
**Script Accent:** Allegretto Script Two (with cursive fallback)

**Character:** Prata даёт тихую редакционную роскошь и поддерживает кириллицу. Manrope оставляет каталог, цены и формы быстрыми для сканирования. Allegretto используется только в крупных декоративных подписях.

### Hierarchy

- **Display** (400, `clamp(2.7rem, 12vw, 6.7rem)`, 1.02): один `h1` и ключевые редакционные акценты.
- **Headline** (400, `clamp(2.25rem, 8vw, 5rem)`, 1.02): заголовки секций.
- **Title** (400, `1.35rem`, 1.15): названия товаров и локальных блоков.
- **Body** (400, `1rem`, 1.6): основной текст с предельной мерой около 65–75 знаков.
- **Label** (700, `0.875rem`, normal case): кнопки, подписи полей и служебные метки.
- **Script Accent** (400, responsive): декоративные слова и подписи; не используется для навигации или основного текста.

### Named Rules

**The Two-Voice Rule.** В функциональном интерфейсе есть два голоса: Prata для витрины и Manrope для действия. Allegretto остаётся редким декоративным акцентом.

## Layout

Контент ограничен `90rem` и окружён адаптивным полем `clamp(1rem, 4vw, 4rem)`. Макет mobile-first: одна колонка превращается в несимметричные split-сетки на 42, 56, 64 и 75 rem. Каталог на широком экране использует неравную редакционную сетку из четырёх колонок.

## Elevation & Depth

Система плоская по умолчанию. Глубину дают фотография, наложение, тон и только затем мягкая тень. Тени не обводят каждую карточку.

### Shadow Vocabulary

- **Overlay soft** (`0 10px 28px rgba(78, 10, 11, 0.08)`): закреплённая навигация и sticky-фильтры.
- **Overlay raised** (`0 24px 60px rgba(78, 10, 11, 0.14)`): меню и modal dialog.

### Named Rules

**The Functional Glass Rule.** Стекло допустимо только там, где оно отделяет контрол от движущегося или фотографического фона.

## Shapes

Малые поля используют радиус `0.75rem`, поверхности — `1.4rem`, крупные фотографические маски — до `2.5rem`. Кнопки и компактные счётчики собраны в pill-форме. Изображения могут выходить за границы сетки, но интерактивные цели остаются свободными.

## Components

### Buttons

- **Shape:** мягкая pill-форма (`999px`) с высотой не менее `2.75rem`.
- **Primary:** гранатовая заливка и светлый текст.
- **Hover / Focus:** лёгкий сдвиг на `-2px`, отдельная видимая focus-обводка; active-состояние сжимается до `0.97` за 140 ms.
- **Quiet:** пудровая полупрозрачная заливка с гранатовым текстом.

### Cards / Containers

- **Corner Style:** медиа обычно используют `1.25rem`; крупные истории — `2.5rem`.
- **Background:** карточка товара не имеет внешней рамки; цвет живёт в медиа-поле.
- **Shadow Strategy:** нет тени в состоянии покоя.
- **Internal Padding:** от `0.85rem` для карточки до `clamp(1.2rem, 4vw, 2.5rem)` для крупной поверхности.

### Inputs / Fields

- **Style:** светлое поле, радиус `0.75rem`, одна спокойная линия границы.
- **Focus:** явная гранатовая обводка с зазором.
- **Error:** тёмно-малиновая граница, `aria-invalid` и текстовая подсказка.

### Navigation

Навигация плавает над контентом как цельная glass-полоса. На mobile ссылки раскрываются из кнопки «Меню»; на desktop они всегда видимы. Текущая страница подсвечивается пудровым тоном.

### Signature Floral Overlap

Прозрачная цветочная вырезка может пересекать огромное типографическое слово, но не перекрывает цену, CTA или поля формы.

## Do's and Don'ts

### Do:

- **Do** оставлять вокруг крупного цветочного объекта достаточно бумажного поля.
- **Do** поддерживать все интерактивные состояния клавиатурой и видимым focus.
- **Do** сохранять движение на `transform` и `opacity`, а UI-отклик — короче 300 ms.
- **Do** оставлять непрозрачный fallback для glass-материала.

### Don't:

- **Don't** превращать каждый блок в одинаковую карточку с тенью.
- **Don't** добавлять третий display-шрифт, emoji-иконки или градиентный текст.
- **Don't** использовать glass как украшение обычной карточки.
- **Don't** перекрывать цветами интерактивный текст или ухудшать контраст ради коллажа.
