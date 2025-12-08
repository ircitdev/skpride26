# SK PRIDE 2026 Website

Modern website for SK PRIDE sports and wellness complex in Volgograd, Russia.

## Features

### Core
- **Single Page Application** - smooth navigation with modal-based pages
- **GSAP Animations** - premium transitions and scroll effects
- **Responsive Design** - optimized for all devices
- **Performance Optimized** - lazy loading, video optimization

### Modals System
- Full-page modals with GSAP animations
- URL hash navigation (`#about`, `#relax`, `#ice`, etc.)
- Scroll progress indicator
- "Back to top" button
- Modal stacking support

### Horizontal Scroll Hero Sections
- Swipe-based navigation for touch devices
- Keyboard navigation (arrows)
- Progress indicators
- Video/image backgrounds

### Text Animations Collection
- 20+ GSAP text animations
- SplitType integration
- ScrollTrigger effects

## Tech Stack

- **HTML5** - semantic markup
- **CSS3** - custom properties, flexbox, grid
- **JavaScript ES6+** - classes, modules
- **GSAP 3** - animations, ScrollTrigger, SplitText
- **Vanilla Tilt** - 3D card effects

## Project Structure

```
slide7/
├── index.html              # Main entry point
├── style.css               # Core styles
├── theme-styles.css        # Theme variables
│
├── Modals
│   ├── aboutModal.html     # About club
│   ├── relaxModal.html     # SPA & wellness
│   ├── iceModal.html       # Ice arena
│   ├── sportModal.html     # Sports
│   ├── pricingModal.html   # Pricing
│   ├── reviewModal.html    # Reviews
│   └── ...
│
├── Modal System
│   ├── modal-fullpage.css  # Fullpage modal styles
│   ├── modal-fullpage.js   # Modal enhancements
│   ├── modal-animations-premium.css
│   └── modal-animations-premium.js
│
├── Horizontal Scroll
│   ├── horizontal-scroll.css
│   └── horizontal-scroll.js
│
├── Text Animations
│   ├── text-animation-collection.html
│   ├── text-animation-collection.css
│   └── text-animation-collection.js
│
├── Components
│   ├── components-collection.html
│   ├── styleguide.html
│   └── styleguide.css
│
├── img/                    # Images
├── video/                  # Video files
└── docs/                   # Documentation
```

## URL Hash Navigation

Open specific modals directly via URL:

| Hash | Modal |
|------|-------|
| `#sport` | Sports section |
| `#about` | About the club |
| `#relax` | SPA & Wellness |
| `#ice` | Ice arena |
| `#pricing` | Pricing & memberships |
| `#review` | Reviews |
| `#rest` | Rest section |
| `#kids` | Kids programs |
| `#events` | Events |
| `#contacts` | Contacts |

## Modal Animations

Each modal supports different GSAP animations:
- `slide-up` - slides from bottom
- `slide-left` - slides from left
- `slide-right` - slides from right
- `scale` - scales from center
- `flip` - 3D flip effect
- `zoom-blur` - zoom with blur
- `split` - splits from center
- `curtain` - curtain from top
- `reveal` - circular reveal

## Development

### Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

### GSAP Plugins
The project uses GSAP with the following plugins:
- ScrollTrigger
- ScrollSmoother
- SplitText
- Flip
- Draggable
- Observer

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Credits

- **Design & Development**: SK PRIDE Team
- **Animations**: GSAP by GreenSock
- **Icons**: Custom SVG

## License

This project is proprietary. All rights reserved by SK PRIDE.

---

**SK PRIDE** - Sports and wellness for the whole family
Volgograd, Khabarovskaya st. 10
[pride34.ru](https://pride34.ru)
