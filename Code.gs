/**
 * Rack backend.
 * Paste this into the Apps Script project bound to your deployment, save, then
 * Deploy > Manage deployments > edit > New version > Deploy.
 *
 * Deploy settings that matter:
 *   Execute as:      Me
 *   Who has access:  Anyone
 *
 * It writes to two tabs, creating them on first use:
 *   Sets      one row per completed set
 *   Sessions  one row per finished workout
 */

var SETS_HEADER = ['Timestamp', 'Athlete', 'Date', 'Session', 'Exercise', 'Muscle group',
                   'Set', 'Reps', 'Weight (lb each)', 'Elapsed in session'];

var SESSIONS_HEADER = ['Timestamp', 'Athlete', 'Date', 'Session', 'Muscle groups',
                       'Duration', 'Duration (sec)', 'Total sets', 'Exercises'];

function sheet_(name, header) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
    sh.getRange(1, 1, 1, header.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function hms_(sec) {
  sec = Math.max(0, Math.round(Number(sec) || 0));
  var h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return h + ':' + p(m) + ':' + p(s);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var body = JSON.parse(e.postData.contents);
    var stamp = new Date();

    if (body.type === 'set') {
      sheet_('Sets', SETS_HEADER).appendRow([
        stamp, body.athlete || '', body.dateKey || '', body.sessionTitle || '',
        body.exerciseName || '', body.group || '',
        body.set || '', body.reps || '', body.weight || '', hms_(body.elapsedSec)
      ]);
    } else if (body.type === 'session') {
      sheet_('Sessions', SESSIONS_HEADER).appendRow([
        stamp, body.athlete || '', body.dateKey || '', body.title || '',
        (body.groups || '').split('|').join(', '),
        hms_(body.durationSec), body.durationSec || 0,
        body.sets || 0, (body.exercises || '').split('|').join(', ')
      ]);
    } else {
      return json_({ ok: false, error: 'unknown type' });
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'history';

  if (action === 'ping') return json_({ ok: true, at: new Date().toISOString() });

  if (action === 'history') {
    var sh = sheet_('Sessions', SESSIONS_HEADER);
    var last = sh.getLastRow();
    if (last < 2) return json_({ ok: true, sessions: [] });
    var take = Math.min(60, last - 1);
    var rows = sh.getRange(last - take + 1, 1, take, SESSIONS_HEADER.length).getValues();
    var out = rows.map(function (r) {
      return {
        date: r[2], title: r[3], groups: r[4],
        duration: r[5], durationSec: r[6], sets: r[7], exercises: r[8]
      };
    });
    return json_({ ok: true, sessions: out });
  }

  return json_({ ok: false, error: 'unknown action' });
}
