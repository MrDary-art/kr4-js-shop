# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static multi-page website built with semantic HTML, modular CSS and vanilla JavaScript ES modules. This follows the explicit coursework constraint to avoid UI frameworks and demonstrate DOM, events, forms and client-side state directly.

## Users

Primary users are people choosing a bouquet or floral gift for a personal occasion, often from a phone and under time pressure. Their main job is to understand the composition, price and delivery terms quickly, then place an order without calling the shop.

## Product Purpose

Flora is a fictional city flower shop and same-day bouquet ordering service. The website must make a complete catalogue easy to explore, help visitors choose by occasion and budget, and provide a clear order flow from product discovery to confirmation.

## Positioning

Flora organizes the catalogue around the occasion and the recipient's desired mood rather than around flower species alone. The live catalogue, bouquet details and checkout keep that choice visible throughout the journey.

## Operating Context

Visitors browse from mobile and desktop, search and filter a catalogue, open bouquet details, add items to a persistent cart, choose delivery details and submit a client-side order form. The project is evaluated through responsive layouts, keyboard use, accessibility checks, Lighthouse and explanation of the JavaScript architecture.

## Capabilities and Constraints

- Six full pages: home, catalogue, product, cart, order and contacts.
- Twelve products with consistent data, availability, categories, occasions, colors and prices.
- Search, filtering, sorting, result count and empty state.
- Safe DOM generation with `createElement`, `textContent`, `classList` and `append`.
- Cart totals, promo code, favorites and persistence in `localStorage`.
- Client-side order validation with inline errors and success states; there is no payment or backend submission.
- Responsive images, mobile-first breakpoints and a layout that works from 360 to 1440 pixels.
- Semantic HTML, visible focus, skip link, reduced-motion support, form labels and accessible native dialog behavior.
- Product names, prices, store hours, address and contact details are representative content for this fictional brand and must be confirmed before a real launch.

## Brand Commitments

- Name: Flora / «Флора».
- Subject: a professional flower and bouquet shop, not a page framed as a student exercise.
- The header remains available while scrolling and exposes at least four meaningful destinations.
- The footer closes with copyright language and «Все права защищены».
- Voice: warm, concise and confident; no exaggerated claims, fake reviews or invented awards.
- Visual direction: dusty white and powder pink fields, petal and dusty-orchid accents, khaki/sorbet greens and deep garnet ink. Volumetric floral photography may overlap oversized editorial type.
- Translucent liquid-glass material is reserved for sticky navigation, compact controls and review captions; text contrast must remain readable and a solid fallback is required when reduced transparency is preferred.
- Display typography must support Cyrillic and feel editorial rather than decorative; interface typography remains direct and highly legible.

## Evidence on Hand

The repository initially contains only a basic `css/style.css`. There are no supplied product photographs, testimonials, customer logos, business statistics or verified commercial claims. Product copy and operational details in the build are authored sample content for the fictional brand.

## Product Principles

- Let the bouquet and its practical details carry the decision.
- Keep selection and ordering fast on a phone.
- Make every state understandable without alerts or hidden behavior.
- Prefer real interaction and complete content over decorative UI.
- Treat accessibility and responsive behavior as core product quality.

## Accessibility & Inclusion

The finished project must support keyboard navigation, visible focus, semantic landmarks, descriptive alternative text, labeled form controls, readable contrast, live announcements for changing state and reduced motion. The target is WCAG 2.1 AA behavior for the implemented surfaces.
