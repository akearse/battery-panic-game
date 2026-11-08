---
name: Game Boy Arcade
description: A tactile pocket arcade with cream cartridges and LCD screens.
colors:
  berry: "#843653"
  berry-hover: "#67283f"
  paper: "#eeede3"
  ink: "#303e36"
  muted: "#586451"
  lcd: "#b3c88d"
  shell: "#e0dfd3"
  label: "#f7f5e9"
  screen-bezel: "#536054"
  button-text: "#fff8ec"
typography:
  display:
    fontFamily: "Sora, Arial, Helvetica, sans-serif"
    fontSize: "clamp(40px, 4.6vw, 65px)"
    fontWeight: 800
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Sora, Arial, Helvetica, sans-serif"
    fontSize: "20px"
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Sora, Arial, Helvetica, sans-serif"
    fontSize: "13px"
    lineHeight: 1.65
  label:
    fontFamily: "Courier New, monospace"
    fontSize: "11px"
    fontWeight: 700
rounded:
  button: "6px"
  cartridge: "12px 12px 25px 12px"
  screen: "5px 5px 13px 5px"
  label: "3px"
spacing:
  card-gap: "22px"
  card-inset: "12px"
components:
  button-primary:
    backgroundColor: "{colors.berry}"
    textColor: "{colors.button-text}"
    rounded: "{rounded.button}"
    padding: "0 13px"
  button-primary-hover:
    backgroundColor: "{colors.berry-hover}"
  cartridge:
    backgroundColor: "{colors.shell}"
    rounded: "{rounded.cartridge}"
    padding: "12px 12px 0"
---

# Design System: Game Boy Arcade

## Overview

**Creative North Star: "The Pocket Cartridge Collection"**

The hub feels like a small collection of physical handheld cartridges: warm cream plastic, berry controls, inset green screens and compact printed labels. Sora gives the collection a clear contemporary reading hierarchy, while monospace lettering supplies the hardware character.

This system describes the arcade hub and its shared return navigation. Battery Panic, Pattern Matching, SOAP and Matching retain their original visual designs, controls and game behavior. Shared chrome must remain separate from each game's visual world.

**Key Characteristics:**
- Tactile cream cartridge shells and inset LCD previews.
- Berry play controls with clear keyboard focus.
- Responsive collection with locally served typography.
- Isolated shared navigation around preserved game designs.

## Colors

Warm neutrals carry the physical shell; berry marks action and LCD greens distinguish the screen surfaces. Frontmatter records the actual reusable values.

### Primary
- **Cartridge Berry:** play buttons, hero emphasis, genre lettering and hub focus outlines. Its darker hover companion provides action feedback.

### Secondary
- **LCD Green:** preview screens and the decorative console display.
- **Screen Bezel:** dark framing around inset screens.

### Neutral
- **Warm Paper:** page background.
- **Cream Shell:** cartridge body.
- **Printed Label:** lighter cartridge label and shared return-link surface.
- **Forest Ink:** primary text.
- **Muted Olive:** supporting text and hardware lettering.

**The Screen Boundary Rule.** Keep LCD color concentrated in screens and previews; use cream surfaces for the collection shell.

## Typography

**Display Font:** locally hosted Sora, with Arial, Helvetica and sans-serif fallbacks.
**Body Font:** the same Sora stack.
**Label/Mono Font:** Courier New, monospace.

The variable font is served from `assets/fonts/Sora-Variable.ttf`, declares weights 100–800 and uses `font-display: swap`. The wordmark requests weight 900 in CSS; that request lies above the declared font range. Do not describe it as a separate bundled face.

### Hierarchy
- **Display:** the frontmatter display token governs the hero. At widths up to 540px it changes to `clamp(31px, 9.6vw, 42px)`.
- **Collection heading:** 18px by default, 17px on narrow screens.
- **Game title:** the title token is the default; 17px at 901–1100px and 24px at up to 900px.
- **Body:** card copy uses the body token, becoming 14px at up to 540px. Intro copy is 15px with 1.75 line-height, becoming 14px at up to 900px.
- **Hardware labels:** the final stylesheet overrides establish 11px for most small lettering; mobile wordmark subtitle, power label and collection count use 10px. Screen captions have no added letter spacing.

## Layout

The hub container is capped at 1380px with horizontal padding of 56px, reduced to 32px at up to 1100px and 20px at up to 540px. The cartridge grid has four columns above 900px, two at up to 900px, and one at up to 540px. Grid gaps are 22px normally, 14px at 901–1100px, 24px for the two-column layout and 26px for the single-column layout.

Single-column cartridges are centered and capped at 380px. The decorative console disappears at up to 540px; supporting header and footer content wraps rather than requiring a fixed desktop composition. The hero uses a flexible two-part composition and a fluid heading.

## Elevation & Depth

Depth represents molded plastic and recessed screens. Bright inset highlights and muted inset shadows shape the shell; a soft outer shadow separates cartridges from the paper. Hover raises a cartridge by 5px and deepens its outer shadow over 0.22s. The decorative console has a 7-degree resting rotation and a 0.7s entrance animation only at widths of at least 1100px.

### Shadow Vocabulary
- **Cartridge at rest:** `inset 1px 2px 1px #fbfaf0, inset -1px -2px 2px #bac0b0, 0 9px 18px -14px #3f4e3e70`.
- **Cartridge hover:** `inset 1px 2px 1px #fbfaf0, inset -1px -2px 2px #bac0b0, 0 17px 23px -15px #3f4e3e70`.
- **Return navigation:** `0 3px 10px #18261d24`.

Reduced-motion preferences disable hub animation and transitions and restore automatic scrolling. The hub otherwise uses smooth scrolling. The cartridge hover position and button active displacement are state changes, not removed transforms.

## Shapes

Asymmetric lower-right corners make the shells recognizable as cartridges and handheld hardware. The frontmatter records cartridge, screen, label and play-button radii. Grip ridges, a six-pixel screen bezel and small triangular cartridge-foot marks reinforce the physical silhouette without external image assets.

## Components

### Buttons

Play links are compact berry controls with a 44px minimum height, centered label and inline arrow. Default minimum width is 83px, falling to 70px at up to 1100px and becoming 95px at up to 900px. Hover darkens the berry fill with a 0.15s transition; active state shifts down 1px. Hub links receive a 3px berry focus outline with 5px offset.

### Cards / Containers

A cartridge contains grip ridges, an SVG screen preview, printed label, genre, game title, description, control hint and Play link. The preview is also a pointer link but is excluded from keyboard focus and assistive technology to avoid duplicating the labeled Play action. Cartridge lift responds to a hovered descendant link.

### Navigation

The hub provides a wordmark home link, a focus-revealed skip link to the game collection and footer navigation. Shared game return navigation is defined independently in `assets/arcade-nav.css`, scoped to the return element and explicit integration classes. It uses Arial rather than importing the hub type system into games.

The return link is fixed at the upper right with safe-area-aware offsets, a 44px minimum height, cream fill and an 8px radius. Hover uses a pale green surface; keyboard focus uses a 3px berry outline with 3px offset. Integration reserves a safe-area-aware top row, including a separate SOAP HUD offset; short viewports reduce the reserved row from 64px to 54px. Preserve these isolation and spacing provisions when adding shared navigation.

### Console Stamp

The decorative handheld echoes cartridge materials with an inset green screen, inline SVG controls, speaker slots and a curved lower-right corner. It is hidden from assistive technology and omitted from the smallest layout.

## Do's and Don'ts

### Do:
- **Do** preserve original game visuals and behavior while extending the hub.
- **Do** keep shared return navigation scoped in its separate stylesheet.
- **Do** maintain the four/two/one-column cartridge layout and visible keyboard focus.
- **Do** retain 44px minimum heights for Play and return links and honor reduced-motion preferences.
- **Do** serve Sora locally and retain readable fallback fonts.

### Don't:
- **Don't** apply hub-wide selectors or typography to game pages.
- **Don't** remove the integration row that separates return navigation from existing game HUDs.
- **Don't** turn decorative cartridge previews into duplicate keyboard stops.
