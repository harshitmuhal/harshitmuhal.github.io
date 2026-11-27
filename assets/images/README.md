# Image Assets

This folder contains `midnight-castle.svg`, an original panoramic illustration used by the portfolio's cinematic hero, and this guide. The SVG is decorative (`alt=""`), has explicit dimensions, and is included in the portfolio service-worker cache. Its sky, mountains, towers, windows, bridge, and lake are original vector artwork, not downloaded franchise imagery. Other portfolio motifs use inline SVG and CSS.

The `/notes/` page uses inline SVG icons, a text Google sign-in mark, and the Quill editor; it does not require images in this folder. Notes UI assets live under `notes/`; see [the notes setup guide](../../notes/SETUP.md).

`favicon.svg` is the main portfolio's original dark-and-gold HM browser-tab monogram with a small lightning accent. It uses vector paths rather than a font or a franchise logo.

The homepage name is rendered as actual text in Cormorant Garamond, not an image. The experimental `name-wordmark.svg` has been removed; no font-logo asset is needed for the name.

## Optional Images

If you extend the portfolio with photos or project screenshots, these filenames are suggestions rather than existing or required assets:

### Profile Images
- `profile.jpg` - Your professional headshot (400x400px recommended)
- `favicon.ico` - Optional legacy-browser fallback; the current main page uses the existing `favicon.svg`

### Project Images
- `image-captioning.jpg` - Screenshot or illustration for Image Captioning project
- `sentiment-analysis.jpg` - Screenshot for IMDB Sentiment Analysis project  
- `face-detection.jpg` - Screenshot for Face Detection project
- `color-extraction.jpg` - Screenshot for Color Extraction project
- `music-player.jpg` - Screenshot for Music Player project
- `emoji-predictor.jpg` - Screenshot for Emoji Predictor project

## Image Guidelines

- **Format**: SVG for original vector illustrations; JPG or PNG for photos and screenshots
- **Size**: Optimize for web (under 500KB each)
- **Dimensions**: 
  - Project images: 600x400px (3:2 aspect ratio)
  - Profile image: 400x400px (square)
  - Favicon: 32x32px

## Tools for Image Optimization

- [TinyPNG](https://tinypng.com/) - For compression
- [Squoosh](https://squoosh.app/) - Google's image optimization tool
- [Canva](https://canva.com/) - For creating project mockups

## Placeholder Images

If you don't have images ready, you can use placeholder services:
- [Unsplash](https://unsplash.com/) - Free high-quality photos
- [Lorem Picsum](https://picsum.photos/) - Placeholder images
- [Placeholder.com](https://placeholder.com/) - Simple placeholder generator

## Adding Your Images

1. Add your images to this folder
2. Update the `src` attributes in `index.html` to match your image filenames
3. Ensure all images are optimized for web use
4. Use images you have permission to publish, and add meaningful `alt` text for content images
5. Do not commit screenshots showing private notes, sign-in tokens, or note backups to this public repository