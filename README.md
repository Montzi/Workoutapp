# Rack

A dumbbell only training app that knows what day it is.

Version 2. No build step, no dependencies, no server. Static files plus a Google Apps Script backend.

## What it does

- 3 day split by default: Push Monday, Pull Wednesday, Legs and core Friday
- One tap switches to 5 day: Chest, Back, Shoulders, Arms, Legs and core, Monday to Friday
- Reads the real date and opens on today, rest days included
- Rest days list the muscle groups you have not trained this week and offer **Activate this day**, which builds a session out of them
- 35 dumbbell exercises, 5 per muscle group. A session uses 3 per group on the 3 day split and 4 per group on the 5 day split
- Every exercise animates on a continuous loop, on the main list and inside the workout
- Every exercise has a short description, a front and back muscle map, and technique cues
- Weight picker in 5 lb steps, capped at 55 lb per hand, remembered per exercise
- **New exercise** swaps the proposed lift for another one in the same muscle group
- Set counter, progress bar, automatic rest countdown with a beep at 3, 2, 1, then the next set starts on its own
- A session clock that starts on Start and never pauses, rests included
- Each day shows its expected length, work plus rest plus equipment changes plus a grace block
- Everything is written to a Google Sheet through Apps Script, with an offline queue that retries

## Files

    index.html      entry point
    app.css         design tokens and layout
    exercises.js    35 exercises: poses, descriptions, muscles, cues
    muscles.js      front and back muscle map
    figure.js       animated SVG renderer
    sync.js         Apps Script client and offline queue
    runner.js       session state, timers, logging
    app.js          schedule, dates, screens
    Code.gs         the Apps Script backend, not part of the website

All eight web files sit at the repo root. Upload them flat, no folders.

## Deploy the site

Push these to your repo, then Settings, Pages, Source "Deploy from a branch", branch `main`, folder `/ (root)`.

Live at `https://montzi.github.io/Workoutapp/`.

The repo must be public unless you are on a paid GitHub plan.

**Local storage does not work on `file://`.** If you open index.html by double clicking it,
the app runs but nothing saves. Use the Pages URL.

## Set up the sheet

1. Open a new Google Sheet.
2. Extensions, Apps Script.
3. Delete whatever is there, paste in `Code.gs`, save.
4. Deploy, New deployment, type Web app.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the `/exec` URL it gives you.
6. If that URL is different from the one already in `sync.js`, replace `SYNC_URL` at the top of that file.

Two tabs get created on the first save:

- **Sets**, one row per completed set: date, session, exercise, muscle group, set number, reps, weight, time into the session
- **Sessions**, one row per finished workout: date, session, muscle groups, duration, total sets, exercises done

Check it is alive by opening `YOUR_EXEC_URL?action=ping` in a browser. You should see `{"ok":true,...}`.

If you redeploy the script later, use Manage deployments, edit the existing one, New version. Creating a
brand new deployment gives you a different URL and you would have to update `sync.js` again.

## Nothing is lost offline

Every set is written to local storage first and pushed to the sheet after. If the phone has no
signal the writes queue up and go out when it reconnects. The header shows `Saved` or `3 to sync`.

## Changing things

- Weekdays: `SPLITS` at the top of `app.js`. `weekday` is 1 for Monday through 7 for Sunday.
- How many exercises per group: `PER_GROUP` in `app.js`.
- Your name and the dumbbell ceiling: `ATHLETE` and `MAX_DUMBBELL` at the top of `exercises.js`.
- Time estimate: `WORK_SEC_PER_SET`, `TRANSITION_SEC` and `GRACE_SEC` at the top of `runner.js`.
- Motivating lines: `MOTIVATION` in `runner.js`.
- Rest per muscle group: `GROUPS` in `exercises.js`.

## How the animation works

Each exercise holds two poses. `pose` is one end of the rep, `end` is the other, and `end` only
lists the joints that move. The renderer interpolates between them on a smooth loop. Coordinates
sit in a 140 by 124 box with the floor at y 116. To retime a movement, change its `tempo` in seconds.

## Still to come

- Wake lock so the screen does not sleep between sets
- History screen reading back from the sheet
- Offline install as a home screen app
