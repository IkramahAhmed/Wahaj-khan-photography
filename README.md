# wahaj-khan-photography
## Adding / replacing photos

1. Copy the original photos into `photos-source/` (not uploaded to GitHub).
2. `cd tools && npm install && npm run optimize`
3. This writes web-ready WebP files to `photos/` (lightbox) and `photos/thumbs/` (grid).
4. Add the new file names to the `works` list in `script.js`, then commit and push.

Use new file names when replacing a photo: images are cached for 30 days.
