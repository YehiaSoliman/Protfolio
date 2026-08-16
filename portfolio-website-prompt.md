# Portfolio Website Build Prompt

Copy and paste this into your AI coding tool of choice.

---

Build me a personal portfolio website with premium, iOS-inspired UI/UX. Follow these specifications:

## Design Language
- Follow Apple's Human Interface Guidelines aesthetic: generous whitespace, soft depth, restrained color palette (1 accent color + neutrals), SF Pro–style typography (use "Inter" or "Manrope" as the web-safe substitute).
- Use frosted-glass / glassmorphism panels (backdrop-blur + translucent backgrounds) for navbars, cards, and modals — like iOS Control Center.
- Rounded corners everywhere (16–28px radius on cards, 12px on buttons/pills).
- Soft, layered shadows instead of hard borders to create depth (elevation system: subtle → medium → prominent).
- Support both light and dark mode, with an iOS-style toggle (segmented control or animated sun/moon switch).
- Use a consistent 8px spacing grid.

## Structure / Sections
1. **Hero** — animated intro with name, role/title, short tagline, and a subtle floating/parallax visual (gradient blob, 3D object, or animated avatar).
2. **About** — short bio, skills as animated pill/tag chips.
3. **Projects** — card grid, each card with hover-lift animation, project thumbnail, tags, and a "View Project" link that opens a smooth modal or detail page (not a hard page reload).
4. **Experience/Timeline** — vertical timeline with scroll-triggered reveal animations.
5. **Skills/Tech Stack** — icon grid or animated progress rings.
6. **Contact** — minimal form with floating labels (iOS-style input fields) and a success animation on submit.
7. **Footer** — social links as icon buttons with subtle bounce/scale on hover.

## Motion & Interaction
- Use scroll-triggered fade/slide-up reveals (Framer Motion or CSS scroll-driven animations) for each section.
- Buttons and cards should have iOS-style tactile feedback: slight scale-down (0.96) on tap/click, spring easing (not linear).
- Page transitions should feel fluid — use spring physics (e.g., Framer Motion's `type: "spring", stiffness: 300, damping: 25`) rather than default ease-in-out.
- Sticky/floating navbar that shrinks and blurs on scroll (like iOS Safari's collapsing header).
- Cursor-follow or magnetic hover effects on primary buttons (subtle, not gimmicky).
- Micro-interactions everywhere: icon nudges, ripple/scale on tap, animated underline on nav links.

## Modern Visualization
- Use subtle animated gradients or mesh gradients as background accents (not full-page, just behind hero/section breaks).
- Optional: animated SVG line-drawing or morphing blob shapes as decorative elements.
- If displaying stats/skills, use animated circular progress rings or bar charts that fill on scroll into view.
- Optional dark "bento grid" layout for the projects or skills section (like Apple's product pages) — asymmetric grid of rounded cards of varying sizes.

## Tech Preferences
- React + Tailwind CSS + Framer Motion (or specify your stack if different).
- Fully responsive: mobile-first, with the iOS aesthetic translating well to small screens (tab-bar style bottom nav on mobile is a nice touch).
- Optimize for performance: lazy-load images, avoid layout shift, keep animations GPU-accelerated (transform/opacity only).

## Content Placeholders
Use placeholder content for: [Your Name], [Your Role/Title], [3–4 project case studies with title, description, tags, image], [skills list], [experience/timeline entries], [contact email/socials] — I will replace with real content after.

---

**Deliverable:** A single cohesive, production-ready site (or component set) matching this spec, with clean, well-commented code so I can customize content and colors easily.
