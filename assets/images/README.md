# Image Assets

This folder is reserved for portfolio image assets. It currently contains this guide, not the optional image files listed below. The current portfolio uses CSS/icon-based visuals rather than `<img>` elements.

The `/notes/` page uses inline SVG icons, a text Google sign-in mark, and the Quill editor; it does not require images in this folder. Notes UI assets live under `notes/`; see [the notes setup guide](../../notes/SETUP.md).

## Optional Images

If you extend the portfolio with photos or project screenshots, these filenames are suggestions rather than existing or required assets:

### Profile Images
- `profile.jpg` - Your professional headshot (400x400px recommended)
- `favicon.ico` - Website favicon (32x32px); the link in the root `index.html` is currently commented out, so enable it only after adding the file

### Project Images
- `image-captioning.jpg` - Screenshot or illustration for Image Captioning project
- `sentiment-analysis.jpg` - Screenshot for IMDB Sentiment Analysis project  
- `face-detection.jpg` - Screenshot for Face Detection project
- `color-extraction.jpg` - Screenshot for Color Extraction project
- `music-player.jpg` - Screenshot for Music Player project
- `emoji-predictor.jpg` - Screenshot for Emoji Predictor project

## Image Guidelines

- **Format**: JPG or PNG
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