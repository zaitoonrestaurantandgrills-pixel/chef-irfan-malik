# Chef Irfan Malik - Editorial Culinary Design System
*Retrieved from Stitch (Project: The Culinary Marketplace / Culinary Heritage)*

## Design Tokens & Theme Specification

### Color Tokens
```yaml
Surface & Backgrounds:
  background: '#faf9f5'                 # Warm Ivory parchment base
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'   # Pure white for elevated cards/modals
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  surface-variant: '#e3e2df'

Typography & Text:
  on-surface: '#1b1c1a'                 # Deep charcoal / near black
  on-surface-variant: '#444748'         # Muted charcoal body text
  on-background: '#1b1c1a'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'

Brand & Action Colors:
  primary: '#000000'                    # Crisp charcoal / solid black
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  
  secondary: '#944925'                  # Earthy Terracotta accent
  on-secondary: '#ffffff'
  secondary-container: '#fe9e72'
  on-secondary-container: '#773310'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb596'
  
  tertiary: '#000000'                   # Muted Gold / Premium badge tone
  tertiary-container: '#261900'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#e9c176'         # Muted Gold highlight
  on-tertiary-container: '#a17f3b'

Borders & Outlines:
  outline: '#747878'
  outline-variant: '#c4c7c7'            # 1px delicate divider lines
  gold-divider: '#e9c176'
```

### Typography Scale
- **Headlines & Display:** Playfair Display (Serif)
  - `display-lg`: 64px / Line-Height: 72px / Letter-Spacing: -0.02em / Weight: 700
  - `display-lg-mobile`: 40px / Line-Height: 48px / Letter-Spacing: -0.01em / Weight: 700
  - `headline-lg`: 48px / Line-Height: 56px / Weight: 600
  - `headline-md`: 32px / Line-Height: 40px / Weight: 600
  - `headline-sm`: 24px / Line-Height: 32px / Weight: 500
- **Body & Interface:** Inter (Sans-Serif)
  - `body-lg`: 18px / Line-Height: 28px / Weight: 400
  - `body-md`: 16px / Line-Height: 24px / Weight: 400
  - `label-caps`: 12px / Line-Height: 16px / Letter-Spacing: 0.1em / Weight: 600 (Uppercase)

### Spacing & Grid
- **Base Unit:** 8px
- **Max Container Width:** 1280px
- **Gutter:** 24px
- **Desktop Margin:** 64px
- **Mobile Margin:** 20px

### Elevation & Shadows
- **Ambient Shadow:** `box-shadow: 0 4px 20px rgba(26, 26, 26, 0.04);`
- **Border Philosophy:** Delicate 1px borders (`#c4c7c7` or `#efeeea`) and tonal layering over heavy shadows.

---

## Stitch Screens Summary

| Screen Name | Screen ID | Type / Resolution | Key Sections |
|---|---|---|---|
| **Chef Irfan Malik \| Home** | `740dff546b824a04b6ecbe2f37d6ec5a` | Desktop (2560x6204) | Fixed TopAppBar, Editorial Hero with Portrait & CTA, Signature Recipes Grid (Appetizer, Premium with Lock Overlay, Dessert), Story / Philosophy, Stats, Editorial Footer |
| **Recipe Marketplace** | `4754e6fb54c14e2bbc783ba682876585` | Desktop (2560x3990) | Side Navigation Drawer, Search Bar, Cuisine & Tag Filter Pills (Pakistani, BBQ, Continental, Premium, Free), 4:5 Aspect Ratio Card Grid with Price/Badges |
| **Signature Chicken Karahi \| Detail** | `44dc131a385541d7a286973e23caa776` | Desktop (2560x3722) | Sticky Header & Meta Sidebar (Cuisine, Prep/Cook time, Servings), 4:5 Hero Shot, Culinary Story, Ingredient Checklist, Sticky Purchase/Paywall CTA Box |
| **Chef Admin \| Dashboard** | `b8de063601c1421d8deb888216995d53` | Desktop (2560x2048) | Dark/Light Accent Admin Sidebar, Topbar with Search & Live Revenue, KPI Cards with Trendlines, Sales & Recipe Table, Create Action |
