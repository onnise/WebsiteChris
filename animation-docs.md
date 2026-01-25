# Animation Documentation

## CSS Animations
1. **Hero Fade Up**:
   - Elements in the hero section fade in and move up (`translateY(20px)` to `0`) sequentially.
   - Duration: 1s.
   - Delays: Staggered by 0.3s for title, description, and button.

2. **Hover Effects**:
   - **Buttons**: Background color change on hover.
   - **Nav Links**: Underline expands from left to right.
   - **Product Cards**: Card lifts up, shadow increases, and image scales up (zoom effect).

## JavaScript Interactions
1. **Header Scroll Effect**:
   - The header background becomes more opaque and padding reduces when scrolling down (> 50px) to maximize screen real estate.
   - Handled in `js/main.js`.

2. **Smooth Scrolling**:
   - Clicking anchor links smoothly scrolls to the target section instead of jumping.
   - Implemented using `scrollIntoView({ behavior: 'smooth' })`.
