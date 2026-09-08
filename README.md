# Rack

A dumbbell only training app that knows what day it is.

Version 4. **One file.** Everything is inside `index.html`, so an update means replacing a single file.

## The repo

    index.html    the whole app, upload this and nothing else
    Code.gs       the Google Sheet backend, paste into Apps Script, NOT part of the website
    README.md     this

Delete `app.css`, `app.js`, `exercises.js`, `muscles.js`, `figure.js`, `sync.js` and `runner.js`
from the repo. They are all folded into `index.html` now and stale copies only cause confusion.

From here on, every update is: replace `index.html`, wait for the green check in Actions, hard reload.

## Yes, you have to paste Code.gs

The Apps Script project behind your deployment URL is empty. Nothing is being saved until you fill it.

1. Open the Google Sheet you want the log in.
2. Extensions, Apps Script.
3. Delete whatever is in the editor, paste the whole of `Code.gs`, save.
4. Deploy, **Manage deployments**, click the pencil on the existing deployment, Version: New version, Deploy.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Editing the existing deployment keeps your URL. Creating a new deployment gives you a different
   URL, and then you would have to change `SYNC_URL` inside `index.html`.

Test it by opening this in a browser:

    https://script.google.com/macros/s/AKfycbzQjg4Y9UtO5RPVnd6PvoAlVgOFznJHgZI3vCRGfXoGYg1nCDz6qM72_gSOZMVWG8Yi/exec?action=ping

You want `{"ok":true,...}`. Anything else means the script is not deployed correctly.

Two tabs appear on the first save. **Sets** is one row per completed set. **Sessions** is one row
per finished workout.

## The week

**3 days**

| Day | Session | Groups |
|-----|---------|--------|
| Monday | Push | Chest, Shoulders, Triceps |
| Wednesday | Pull | Back, Biceps |
| Friday | Legs and core | Legs, Core |

**5 days**

| Day | Session |
|-----|---------|
| Monday | Chest and biceps |
| Tuesday | Back |
| Wednesday | Shoulders and triceps |
| Thursday | Arms |
| Friday | Legs and core |

These are only starting points. Every day's muscle groups are editable and the edits stick.

## Muscle groups per day

Every day card has a **Muscle groups** button. Eight chips: the seven muscle groups plus Cardio.
Tap one on and the day gains that group's first three exercises at three sets. Tap it off and
they go. The exercise count, set count and time estimate all recalculate as you go, because
they are read off the actual list rather than stored.

A day must keep at least one group. If you want nothing on a day, turn the day off instead.

## Cardio

Three presets sit under the muscle group chips: Zone 2 for 40 minutes, intervals for 30 minutes,
and Zone 2 for an hour. Below them is a free text field for your own, a name and a length in
minutes. Custom sessions are saved and reusable.

Cardio behaves differently inside a workout. No weight picker, no sets, no rest countdown. It
shows the target length, the session clock keeps running, and you log it when you come back.
In the time estimate a cardio block counts its full length plus the usual changeover minutes.

## Turning a day on and off

- A scheduled day has **Turn this day off**. It becomes a rest day for that date only, and the
  weekly schedule underneath is untouched.
- A day that is off, or a normal rest day, has **Activate this day**, which builds a session from
  the muscle groups you have not trained this week.
- A day you turned off also gets **Put the schedule back**.

Miss Monday, turn it off, activate Tuesday, and the week catches up.

## The week band

Under the wordmark: the ISO week number, how many of the seven days you have logged, and a row
of seven dates. A logged day gets a check mark and goes dark. Tap any date to see that day's log,
the total time, the set count, and every exercise with its set count and last weight used.
Sets you marked done rather than worked through are flagged as such.

## What you can change from inside the app

- **Move day** on any day card swaps that day's whole session with another weekday. Wednesday's
  workout can become Monday's. Swapping onto a rest day moves the session there and leaves a rest
  day behind.
- **Reset the week to defaults** is in the same panel.
- **Replace** on any exercise row swaps it for another lift in the same muscle group, cycling
  through all five. It never gives you a duplicate.
- **Arrows** on any exercise row move it up or down. The order is completely free, groups can
  interleave.
- **Tap any exercise** to open it, then **Start the session here** begins the workout on that
  exercise instead of the first one. **Replace** is there too.
- **New exercise** during a workout does the same swap mid session.
- **Mark as done** on any exercise during a session logs every set it still owes and moves straight
  to the next one. Use it when you did the work off the clock. Those rows land in the sheet with
  `marked done` in the Note column, so they are honest about how they got there. **Skip this
  exercise** is different, it logs nothing at all.
- Every edit is saved per split and per weekday, and survives a reload.

## Everything else

- 44 exercises. Five to seven per muscle group plus three cardio presets. A session takes 3 per
  group on the 3 day split, 4 on the 5 day. Everything from your printed A, B and C workouts is in
  there: neutral grip bench press, seated shoulder press, seated curl, hip thrust, sumo squat and
  bench reverse crunch were the six that were missing.
- Every exercise animates on a loop. The list keeps the simple figure. Open an exercise and you
  get a fuller anatomical figure with the working muscles lit up, primary in solid red and
  secondary faded.
- Description, front and back muscle map, and technique cues on every lift.
- Weight picker in 5 lb steps, capped at 55 per hand, remembered per exercise.
- Set counter, progress bar, rest countdown with a beep at 3, 2, 1, then the next set auto starts.
- A session clock that never pauses, rests included.
- Each day shows its expected length: work, plus rest, plus equipment changes, plus a 5 minute grace block.
- Rest days offer **Activate this day**, which builds a session from muscle groups you have not trained this week.
- **Screen wake lock.** The phone stops sleeping between sets while a session is open.
- **History.** Tap the date at the top right. Shows what is on this device and what is in the sheet.
- Offline queue. Sets are stored locally first and pushed to the sheet after. The header shows `Saved` or `3 to sync`.
- If anything ever fails to start, the page prints the error instead of going blank.

## Deploy

Replace `index.html` in the repo. Repo must be public on a free GitHub plan. Settings, Pages,
branch `main`, folder `/ (root)`.

    https://montzi.github.io/Workoutapp/

Capital W. Hard reload after an update, Shift Command R.

**Local storage does not work on `file://`.** Opening index.html by double clicking runs the app
but saves nothing. Use the Pages URL.

## Changing things by hand

Everything lives in the one `<script>` block in `index.html`. Search for:

- `DEFAULT_SPLITS` for the starting weekly schedule. `weekday` is 1 Monday through 7 Sunday.
- `PER_GROUP` for how many exercises each muscle group contributes.
- `ATHLETE` and `MAX_DUMBBELL` for your name and the dumbbell ceiling.
- `SYNC_URL` for the Apps Script endpoint.
- `WORK_SEC_PER_SET`, `TRANSITION_SEC`, `GRACE_SEC` for the time estimate.
- `MOTIVATION` for the lines shown during a session.
- `GROUPS` for rest length per muscle group.

Editing by hand and then asking for a rebuilt file will lose your edits. Tell me the change instead.

## Still to come

- Offline install as a home screen app. This needs two extra files, a service worker and a
  manifest, which is the one thing that cannot live inside a single HTML file.
- The muscle map on the exercise page is still the simple front and back diagram. The animated
  figure beside it now carries most of that job.
