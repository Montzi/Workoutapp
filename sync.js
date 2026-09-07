/* Talks to the Google Apps Script web app.
   Everything is written locally first, then pushed. Nothing is lost if the phone drops signal. */

const SYNC_URL = 'https://script.google.com/macros/s/AKfycbzQjg4Y9UtO5RPVnd6PvoAlVgOFznJHgZI3vCRGfXoGYg1nCDz6qM72_gSOZMVWG8Yi/exec';

const store = {
  get(k, fallback) {
    try { const v = localStorage.getItem('rack.' + k); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set(k, v) {
    try { localStorage.setItem('rack.' + k, JSON.stringify(v)); } catch (e) { /* private mode */ }
  }
};

const sync = {
  status: 'idle',           // idle | sending | queued | offline
  onchange: null,

  queue() { return store.get('queue', []); },

  push(record) {
    const q = this.queue();
    q.push(Object.assign({ athlete: ATHLETE, at: new Date().toISOString() }, record));
    store.set('queue', q);
    this.flush();
  },

  async flush() {
    if (this.status === 'sending') return;
    let q = this.queue();
    if (!q.length) { this.set('idle'); return; }
    this.set('sending');
    while (q.length) {
      const ok = await this.send(q[0]);
      if (!ok) { this.set('queued'); return; }
      q = this.queue().slice(1);
      store.set('queue', q);
    }
    this.set('idle');
  },

  async send(record) {
    try {
      const res = await fetch(SYNC_URL, {
        method: 'POST',
        // text/plain keeps the browser from sending a preflight Apps Script cannot answer
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(record),
        redirect: 'follow'
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  set(s) {
    this.status = s;
    if (this.onchange) this.onchange(s);
  },

  label() {
    const n = this.queue().length;
    if (this.status === 'sending') return 'Saving';
    if (n) return n + ' to sync';
    return 'Saved';
  }
};

window.addEventListener('online', () => sync.flush());
