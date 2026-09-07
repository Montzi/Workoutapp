# Rack

A dumbbell only training app that knows what day it is.

Stage 1 of 5. No build step, no dependencies, no server. Static files only.

## What works now

- 3 day split by default: Push Monday, Pull Wednesday, Legs and core Friday
- One tap switches to 5 day: Chest, Back, Shoulders, Arms, Legs and core, Monday to Friday
- Reads the real date and opens on today, rest days included
- Rest days name the next session and jump to it
- Tap any weekday to look ahead or back
- 21 dumbbell exercises, 3 per muscle group, with sets, reps and rest
- A still figure per exercise, drawn as SVG from pose coordinates
- Detail screen with technique cues
- The split choice persists in local storage

The Start button is deliberately inert. The runner is Stage 2.

## Files

    index.html        entry point
    css/app.css       design tokens and layout
    js/exercises.js   exercise library and pose coordinates
    js/figure.js      SVG renderer
    js/app.js         schedule, dates, screens

## Deploy to GitHub Pages

    git init
    git add .
    git commit -m "Rack stage 1"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/rack.git
    git push -u origin main

Then in the repo: Settings, Pages, Source "Deploy from a branch", branch `main`, folder `/ (root)`, Save.

Live in about a minute at `https://YOUR_USERNAME.github.io/rack/`.

The `.nojekyll` file is already here. It stops GitHub from running Jekyll over the folder.

Open it on your phone and use Add to Home Screen. Offline caching arrives in Stage 5.

## Changing the schedule

Weekdays live in `SPLITS` at the top of `js/app.js`. `weekday` is 1 for Monday through 7 for Sunday.

## Changing exercises

Everything is in `js/exercises.js`. Each record holds name, group, sets, reps, cues and a
`pose`. Pose coordinates sit in a 140 by 124 box with the floor at y 116. Stage 3 adds a
second pose per exercise and tweens between them, so the still becomes the animation with
no change to the data shape.

## Next

- Stage 2: set counter, progress bar, rest timer, auto start
- Stage 3: looping animation
- Stage 4: weight and rep logging, history
- Stage 5: wake lock, sound cues, offline install
