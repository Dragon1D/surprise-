/* Mesin simulasi chat "Kamu <-> Dompet" yang bisa dipasang di elemen mana pun.
   createChat(root, script, opts) -> { renderAt(t), items, audio, end }
   Semua tampilan dihitung dari waktu lokal t, jadi deterministik per frame. */
(function () {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const eout = k => 1 - Math.pow(1 - k, 3);
  const back = k => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
  const rp = n => 'Rp' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function wallet(fat, mood, t) {
    const w = lerp(58, 92, fat), h = lerp(46, 64, fat), x = 60 - w / 2, y = 64 - h / 2;
    const bob = Math.sin(t * 3) * 1.5;
    let s = `<svg viewBox="0 0 120 120" width="100%" height="100%"><g transform="translate(0 ${bob.toFixed(1)})">`;
    if (fat > .45) s += `<rect x="${60 - w * .3}" y="${y - 12}" width="${w * .55}" height="20" rx="3" fill="#7fc98f" stroke="#1d1b26" stroke-width="3" transform="rotate(-8 60 ${y})"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${10 + fat * 8}" fill="#d9782f" stroke="#1d1b26" stroke-width="4"/>`;
    s += `<path d="M${x + w * .55} ${y + h * .3} h${w * .45} v${h * .4} h-${w * .45} a${h * .2} ${h * .2} 0 0 1 0 -${h * .4}z" fill="#b85e1f" stroke="#1d1b26" stroke-width="3.5"/>`;
    s += `<circle cx="${x + w * .74}" cy="${y + h * .5}" r="3.5" fill="#ffd27a"/>`;
    const ex = x + w * .22, ey = y + h * .42;
    if (mood === 'happy') s += `<path d="M${ex - 7} ${ey + 2} q7 -9 14 0 M${ex + 13} ${ey + 2} q7 -9 14 0" stroke="#1d1b26" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M${ex} ${ey + 13} q10 10 20 0" stroke="#1d1b26" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    else {
      s += `<circle cx="${ex}" cy="${ey}" r="3.6" fill="#1d1b26"/><circle cx="${ex + 20}" cy="${ey}" r="3.6" fill="#1d1b26"/>`;
      s += mood === 'sad' ? `<path d="M${ex + 1} ${ey + 17} q9 -8 18 0" stroke="#1d1b26" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M${x + w + 4} ${y + 6} q-6 10 0 13 q6 -3 0 -13z" fill="#8fd3ff" stroke="#1d1b26" stroke-width="2" opacity="${(.5 + .5 * Math.sin(t * 4)).toFixed(2)}"/>`
        : `<path d="M${ex + 2} ${ey + 14} h16" stroke="#1d1b26" stroke-width="3.5" stroke-linecap="round"/>`;
    }
    return s + '</g></svg>';
  }

  window.createChat = function (root, SCRIPT, opts = {}) {
    const GAJI = opts.gaji ?? 8000000;   // patokan 'dompet penuh' untuk avatar, baterai & rekap
    root.classList.add('chatapp');
    root.innerHTML = `<div class="statusbar"><span class="clock">09.00</span><span class="bat"><i class="batfill"></i></span></div>
      <div class="header"><div class="back">‹</div><div class="avatar"></div><div class="who"><b>Dompet</b><small class="status">online</small></div><div class="saldo"><small>SALDO</small><span class="saldoval">Rp0</span></div></div>
      <div class="chat"><div class="list"></div></div>
      <div class="inputbar"><div class="field"></div><div class="send">➤</div></div>`;
    const q = s => root.querySelector(s);
    const list = q('.list'), field = q('.field'), send = q('.send');
    const ITEMS = [], AUDIO = [];
    let T = opts.start ?? .4, saldo = opts.saldo ?? 0, clockH = 9, clockM = 0;
    const nextClock = () => { clockM += 3; if (clockM >= 60) { clockM -= 60; clockH = (clockH + 1) % 24; } return String(clockH).padStart(2, '0') + '.' + String(clockM).padStart(2, '0'); };
    const readTime = s => Math.max(.8, .4 + s.length * .03);

    for (const it of SCRIPT) {
      const el = document.createElement('div');
      const item = { el, ...it };
      if (it.date) {
        [clockH, clockM] = it.clock.split('.').map(Number); clockM -= 3;
        el.className = 'date'; el.innerHTML = `<span>${esc(it.date)}</span>`;
        item.at = T; T += .4; AUDIO.push({ t: item.at, type: 'date' });
      } else if (it.card) {
        const c = nextClock();
        const kind = it.save ? 'save' : it.amt > 0 ? 'plus' : '';
        el.className = 'msg in';
        el.innerHTML = `<div class="card ${kind}"><div class="lbl">${it.label}</div><div class="ct">${esc(it.card)}</div><div class="amt">${it.amt > 0 ? '+' : '-'}${rp(Math.abs(it.amt))}<span class="meta">${c}</span></div></div>`;
        item.at = T; item.saldoFrom = saldo; saldo += it.amt; item.saldoTo = saldo; item.clock = c;
        AUDIO.push({ t: T, type: it.save ? 'save' : it.amt > 0 ? 'income' : 'minus' });
        T += it.fast ? .6 : 1.0;
      } else if (it.d || it.voice || it.rekap) {
        const c = nextClock();
        item.typFrom = T; T += (it.typ || .6) * .75; item.at = T; item.clock = c;
        el.className = 'msg in';
        if (it.d) { el.innerHTML = `<div class="bubble">${esc(it.d)}<span class="meta">${c}</span></div>`; T += readTime(it.d); }
        if (it.voice) {
          let bars = ''; for (let i = 0; i < 30; i++) bars += `<i style="height:${8 + Math.abs(Math.sin(i * 1.7) * 30 + Math.sin(i * .6) * 8)}px"></i>`;
          el.innerHTML = `<div class="bubble"><div class="voice"><div class="play"></div><div class="wave">${bars}</div><div class="dur">0:06</div></div><div class="vcap">${esc(it.voice)}</div></div>`;
          item.voiceDur = it.dur; T += it.dur + .4;
          AUDIO.push({ t: item.at + .2, type: 'voice', dur: it.dur });
        }
        if (it.rekap) {
          const butuh = 2500000, mau = GAJI - butuh - saldo;
          el.innerHTML = `<div class="rekap"><div class="rh">🧾 ${esc(it.title || 'REKAP')}</div>
            <div class="row"><span>Kebutuhan</span><b>${rp(butuh)}</b></div>
            <div class="row"><span>Keinginan &amp; cicilan</span><b>${rp(mau)}</b></div>
            <div class="row zero"><span>Tabungan</span><b>Rp0</b></div>
            <div class="bar"><span style="width:${butuh / GAJI * 100}%;background:#8a8173"></span><span style="width:${mau / GAJI * 100}%;background:var(--red)"></span></div></div>`;
        }
        T += it.wait || 0;
        AUDIO.push({ t: item.at, type: 'in' });
      } else if (it.k) {
        const c = nextClock(), s = it.k, dur = .3 + s.length * .026;
        item.typeFrom = T; item.typeText = s; T += dur; item.at = T; item.clock = c;
        for (let i = 0; i < s.length; i += 2) AUDIO.push({ t: item.typeFrom + (i / s.length) * (dur - .1), type: 'key' });
        el.className = 'msg out';
        el.innerHTML = `<div class="bubble">${esc(s)}<span class="meta">${c} ✓✓</span></div>`;
        T += readTime(s) * .7 + (it.wait || 0);
        AUDIO.push({ t: item.at, type: 'out' });
      }
      list.appendChild(el);
      ITEMS.push(item);
    }
    const typingEl = document.createElement('div');
    typingEl.className = 'msg in typing';
    typingEl.innerHTML = '<div class="bubble"><i></i><i></i><i></i></div>';
    list.appendChild(typingEl);

    let LAYOUT = null;
    const measure = () => {
      for (const it of ITEMS) it.el.style.visibility = 'visible';
      LAYOUT = ITEMS.map(it => ({ bottom: it.el.offsetTop + it.el.offsetHeight }));
      LAYOUT.viewH = q('.chat').clientHeight;
    };
    const lastVisible = t => { let i = -1; ITEMS.forEach((it, j) => { if (it.at <= t) i = j; }); return i; };
    const typingAt = t => ITEMS.find(it => it.typFrom !== undefined && t >= it.typFrom && t < it.at) || null;
    const targetScroll = t => {
      const i = lastVisible(t);
      let bottom = i >= 0 ? LAYOUT[i].bottom : 0;
      if (typingAt(t)) bottom += 84;
      return Math.max(0, bottom - LAYOUT.viewH + 26);
    };
    // smoothing disimulasikan dari 0 (deterministik); hasil disimpan supaya frame berurutan tidak menghitung ulang dari awal
    let sc = { x: 0, s: 0 };
    const scrollAt = t => {
      if (t < sc.x - 1 / 60) sc = { x: 0, s: 0 };
      let { x, s } = sc;
      for (; x <= t; x += 1 / 60) s += (targetScroll(x) - s) * .16;
      sc = { x, s }; return s;
    };

    function renderAt(t) {
      if (!LAYOUT) measure();
      ITEMS.forEach(it => {
        if (t < it.at) { it.el.style.visibility = 'hidden'; return; }
        const p = prog(t, it.at, it.at + .38);
        it.el.style.visibility = 'visible';
        const inner = it.el.firstElementChild;
        if (it.date) { inner.style.transform = `scale(${(.8 + .2 * eout(p)).toFixed(3)})`; inner.style.opacity = eout(p); return; }
        const out = it.el.classList.contains('out');
        inner.style.transformOrigin = out ? '100% 100%' : '0% 100%';
        inner.style.transform = `scale(${(.55 + .45 * back(p)).toFixed(3)}) translateY(${((1 - eout(p)) * 20).toFixed(1)}px)`;
        inner.style.opacity = Math.min(1, p * 3).toFixed(3);
        if (it.voiceDur) {
          const vp = prog(t, it.at + .2, it.at + .2 + it.voiceDur);
          inner.querySelectorAll('.wave i').forEach((b, j) => b.classList.toggle('on', j / 30 < vp));
          inner.querySelector('.dur').textContent = vp > 0 && vp < 1 ? `0:0${Math.floor(vp * 6)}` : '0:06';
        }
      });
      const typ = typingAt(t), li = lastVisible(t);
      typingEl.style.display = typ ? 'flex' : 'none';
      if (typ) {
        typingEl.style.top = (li >= 0 ? LAYOUT[li].bottom : 0) + 'px';
        typingEl.querySelectorAll('i').forEach((d, j) => { d.style.transform = `translateY(${(-6 * Math.max(0, Math.sin(t * 9 - j * .9))).toFixed(1)}px)`; });
      }
      list.style.transform = `translateY(${(-scrollAt(t)).toFixed(1)}px)`;

      let ftxt = '';
      for (const it of ITEMS) if (it.typeFrom !== undefined && t >= it.typeFrom && t < it.at)
        ftxt = it.typeText.slice(0, Math.ceil(it.typeText.length * prog(t, it.typeFrom, it.at - .12)));
      field.innerHTML = ftxt ? `${esc(ftxt)}<span class="caret"></span>` : '<span class="ph">Ketik pesan…</span>';
      send.classList.toggle('on', !!ftxt);

      let sv = opts.saldo ?? 0, flash = 0, clock = opts.clock || '09.00';
      for (const it of ITEMS) {
        if (it.clock && t >= (it.typeFrom ?? it.typFrom ?? it.at)) clock = it.clock;
        if (it.saldoTo !== undefined && t >= it.at) {
          sv = lerp(it.saldoFrom, it.saldoTo, eout(prog(t, it.at, it.at + .6)));
          flash = (1 - prog(t, it.at, it.at + .8)) * Math.sign(it.saldoTo - it.saldoFrom) * (it.save ? -0 : 1);
          if (it.save) flash = (1 - prog(t, it.at, it.at + .8)) * 1;
        }
      }
      const sEl = q('.saldoval');
      sEl.textContent = rp(sv);
      sEl.style.color = flash < 0 ? `rgba(229,72,59,${(.4 + Math.abs(flash) * .6).toFixed(2)})` : flash > 0 ? '#1fa971' : (sv < 1000000 && sv > 0 ? '#e5483b' : '#1d1b26');
      sEl.style.transform = `scale(${(1 + Math.abs(flash) * .12).toFixed(3)})`;
      q('.clock').textContent = clock;
      const fat = clamp(sv / GAJI);
      const bf = q('.batfill');
      bf.style.width = (Math.max(.06, fat) * 100).toFixed(1) + '%';
      bf.style.background = fat < .2 ? '#e5483b' : fat < .5 ? '#f0b23f' : '#1fa971';
      q('.avatar').innerHTML = wallet(fat, fat > .6 ? 'happy' : fat > .2 ? 'ok' : 'sad', t);
      const st = q('.status');
      if (typ) { st.textContent = typ.voice ? 'merekam suara…' : 'sedang mengetik…'; st.className = 'status'; }
      else { st.textContent = 'online'; st.className = 'status'; }
    }
    return { renderAt, items: ITEMS, audio: AUDIO, end: T };
  };
})();
