# Dumbbelly

Simple workouts. Real results. A dumbbell only training app that knows what day it is.

Version 14. **One HTML file, plus your pictures as files.** Everything is inside `index.html`, so an update means replacing a single file.

## The repo

    index.html    the whole app, the only file that ever changes
    images/       your eight folders of exercise pictures, uploaded once

`Code.gs` has not changed since you pasted it. Leave it alone.

## Why the pictures cannot go inside index.html

Your 44 pictures are 8.8 MB. Text cannot hold raw image bytes, so embedding them means base64,
which inflates them by about a third: a 12 MB `index.html`.

That breaks three things. The app would show nothing until all 12 MB arrived, instead of drawing
the screen instantly and filling pictures in as they load. The browser could not cache pictures
separately from code, so every future update would re-download all 12 MB. And you would be
re-uploading 12 MB to GitHub for a one line change.

Kept as files, `index.html` is 137 KB and loads instantly, the browser caches each picture after
you see it once, and updates are a 137 KB upload. Pictures are uploaded once and never touched
again. So: one file that changes, one folder that does not.

## Uploading the pictures, once

1. On your Mac, rename the folder `Dumbbelly` to `images`. The eight folders stay inside it.
2. Go to the repo, **Add file**, **Upload files**.
3. Drag the whole `images` folder onto the page. GitHub keeps the folder structure.
4. Commit. It is 8.8 MB, so give it a minute.

If you upload it still named `Dumbbelly`, it also works. The app checks `images/` first and
`Dumbbelly/` second. `images` is tidier.

Folder names are case sensitive on GitHub Pages. Keep `back` and `shoulders` lower case and `ABS`
upper case, exactly as you have them.

All 44 pictures are wired in, including the seated shoulder press you just added. Every one of the
46 exercises now has a picture. `IMAGE-FOLDERS.md` is the full map.

Two of your pictures were for exercises the app did not have, so both are now in: **Preacher bench
curl** and a bodyweight **Leg raise** alongside the weighted one. The three cardio sessions share
`Combined_cardio.png`.

A missing picture never breaks anything and never shows an error. It falls back to the animated
figure.

The picture is the hero of the exercise screen. Tap **Expand** to see it full size. Underneath it
the app adds what the picture cannot: a looping motion figure showing the path of the weight, the
technique cues as a list, and the muscle map.

From here on, every code update is: replace `index.html`, wait for the green check in Actions,
hard reload. Images are separate and you only ever add to them.

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
| 1, Monday | Push | Chest, Shoulders, Triceps |
| 2, Wednesday | Pull | Back, Biceps |
| 3, Friday | Legs and core | Legs, Core |

Days are numbered rather than lettered. An existing A, B, C schedule migrates itself on first load.

**5 days**

| Day | Session |
|-----|---------|
| Monday | Chest and biceps |
| Tuesday | Back |
| Wednesday | Shoulders and triceps |
| Thursday | Arms |
| Friday | Legs and core |

These are only starting points. Every day's muscle groups are editable and the edits stick.

## The session is grouped

The session list is split into muscle group sections. Each section header carries its exercise
and set count and two controls:

- **Swap** exchanges the whole group for another one, in place. Chest becomes Back and the three
  chest exercises become three back exercises without moving anything else.
- **Remove** takes the group and its exercises out.

Inside a section the arrows reorder exercises within that group, and **Replace** swaps a single
exercise for another in the same group.

## Logging a day you missed

Tap any date in the week band. If nothing was logged, the app now offers **Add a past workout**
instead of a dead end. That screen prefills the muscle groups and exercises that were scheduled
for that day, lets you add or drop either, and takes a duration in five minute steps. Saving
writes it to the log and pushes it to the sheet flagged as `added later`, so the record stays
honest about how it got there. A saved log can also be deleted and redone.

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

## Getting out of a panel

**Muscle groups** and **Move day** both open a panel with a cross in the top right and a
"Back to the day" link at the bottom. Turning a day off also closes whatever panel was open, so you
land back on the day card rather than in a half open editor.

## Turning a day on and off

- A scheduled day has **Turn this day off**. It becomes a rest day for that date only, and the
  weekly schedule underneath is untouched.
- A day you turned off leads with **Turn this day back on**, and says plainly that the weekly
  schedule underneath is untouched.
- A normal rest day has **Activate this day**, which builds a session from the muscle groups you
  have not trained this week. A day that is off can be used that way too.

Miss Monday, turn it off, activate Tuesday, and the week catches up.

## The week band

Under the wordmark: the ISO week number, how many of the seven days you have logged, and a row
of seven dates. A logged day gets a check mark and goes dark.

**Days that have not happened yet are dimmed and cannot be tapped.** There is nothing to log for a
day that has not arrived. Planning happens in the numbered week strip lower down, which stays fully
clickable in both directions.

Tap any date up to today to see that day's log,
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

## Days number themselves

Days are not labelled with a fixed number any more. The number is simply where the day falls
among the training days of that week, counted Monday to Sunday.

Train Monday, Wednesday and Friday and they read 1, 2, 3. Activate Tuesday and it becomes 2,
Wednesday moves to 3, Friday to 4. Log a workout on a day that was not scheduled and that day
starts counting too. Nothing to maintain, it recalculates every time the screen draws.

## Three schedules

**3 days**, **5 days**, and now **Custom**. Custom starts empty and gives you a row of weekdays to
tap. Each day you turn on gets three exercises per muscle group from a rotation, and you edit its
muscle groups from the day itself like any other. The three schedules are stored separately, so
switching between them never loses your edits to the others.

## Adding and editing past workouts

Every exercise now has its own **sets** and **weight**, adjustable with steppers. Sets go 1 to 10,
weight in 5 lb steps up to 55. You can:

- add or remove a whole muscle group with the chips at the top
- add a single exercise with the **+ Chest**, **+ Back** buttons, which only offer exercises not
  already in the list
- remove any exercise with the cross
- set the duration in five minute steps

A day that already has a workout opens the same screen in edit mode, prefilled from the log, so
correcting a duration or a weight after the fact is the same flow. Edited entries reach your sheet
flagged `edited` rather than `added later`.

## The session names itself after what you did

If Tuesday was planned as Chest and Back and you only did chest, finishing the session titles it
**Chest**. The day card, the log, and the row in your sheet all say Chest. The planned title is
only a starting point.

## A finished day shows its work

Under the week strip, a completed day lists every exercise with its set count and the weight used,
plus buttons to edit the workout or open the full log.

## Starting a workout

Pressing **Start workout** gives you ten seconds before the first set, counting down on screen with
a beep each second and a higher tone at zero. **Start now** skips it, **Cancel** backs out without
starting a session. The session clock starts when the countdown ends, not when you press the button.

## Music

A player sits on the main screen, the countdown and the workout. You can start music without
starting a session, and starting a session while music is playing does not interrupt it. The audio
element lives outside the screen, so redrawing never touches playback. Play and pause, a skip button, a volume
slider, and a station list.

Five live stations, all from SomaFM, which is free and listener supported: **Fluid** for
instrumental hip hop, **Groove Salad** for ambient downtempo, **Beat Blender** for deep house,
**Secret Agent** for lounge, and **Drone Zone** for ambient with no beat. There is also a field to
paste any other stream address.

The sixth option is **Built in loop**. That one needs no connection at all. It generates a slow
seventy four beat per minute pad and beat on your phone with the Web Audio API, so it still works
in a basement gym with no signal.

Your station and volume are remembered. Music starts when you press Start workout, since browsers
only allow audio to begin from a tap.

Honest caveat: I could not reach those stream addresses from where this was built, so they are
unverified. If one does not connect, the bar says so, and skip moves to the next.

## Tester mode

Add `?tester` to the end of the address and send that link to anyone:

    https://montzi.github.io/Workoutapp/?tester

They get **Welcome, Tester** instead of your name, no avatar, and a notice explaining what they
are looking at. Everything in the app works, including workouts, logging and music. Nothing they
do is written to your sheet, and their data is kept in a completely separate area of their own
browser storage, so it cannot see or overwrite anything real. The sync indicator reads
**Not saving**.

There is also a **Switch to tester mode** link at the bottom of the home screen, so you can demo it
yourself, and a **Leave tester mode** button to come back out.

## During the set

Two things above the controls: the animated figure showing the path the weight travels, and your
infographic directly under it with the start, press and lower photos, the muscle map and the
mistakes list. Movement first, detail underneath.

## Finishing an exercise

Land the last set and the screen celebrates it. Confetti falls, one of six cheers comes up in big
blue type, and a crowd claps. The applause is generated on the phone, ninety short bursts of
filtered noise swelling and thinning out, with three rising notes over the top, so it needs no
sound file and works offline.

Under that, **Up next** shows the following exercise with its figure, sets, reps and muscle group,
and a ten second countdown before it starts on its own.

- **Start it now** goes straight there.
- **Hold on** stops the countdown, and the screen waits for you.
- **Undo** is still there, and takes the celebration back to the last set if you tapped too early.

On the final exercise it says **Last one** instead, and the button reads Finish the session.

## Resting

The exercise animation stops when the set does. Rest shows its own figure instead: someone sat on
the bench, breathing slowly, at about thirteen breaths a minute. It is a different picture, a
cooler colour, and a much slower rhythm, so a glance tells you whether you are working or waiting.

## During a set

The button now counts: **Next set (1/3)**, then **(2/3)**, then **(3/3)**.

Under it is **Undo**, which names the exact set and weight it will remove, for example
"Undo Flat bench press set 1 at 20 lb". It takes the set back out of the log and out of the queue
heading for your sheet, puts you back on that set, and lets you correct the weight before redoing
it. It works across exercises too, so if you marked something done by mistake it walks you back.

**Call it a day** appears once anything is logged. It finishes the session where it stands and
keeps only what you actually did. If Tuesday is chest and back and you only did chest, you do not
have to walk through back to end the session.

## The avatar

`avatar.png` goes in `images/`, or the repo root if you prefer. It sits in the top right of the day
card. If the file is not there, it removes itself and nothing looks broken.

## The look

Black, blue and white, matching the Dumbbelly logo. Dark by design: a gym is dim, your phone is
bright, and a white screen at arm's length between sets is unpleasant. Every control is at least
44 pixels tall so it works with chalky or sweaty hands.

## Still to come

- Offline install as a home screen app. This needs two extra files, a service worker and a
  manifest, which is the one thing that cannot live inside a single HTML file.
- The muscle map on the exercise page is still the simple front and back diagram. The animated
  figure beside it now carries most of that job.
