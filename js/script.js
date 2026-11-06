(function () {
  'use strict';
  var DATA_URL = 'data/jadwal.json';
  var data = null;
  var $ = function (id) { return document.getElementById(id); };
  var ICON_CLOCK = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var ICON_USER = '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>';
  var ICON_CHEV = '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>';
  var NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  function esc(s) { var d = document.createElement('div'); d.textContent = String(s == null ? '' : s); return d.innerHTML; }
  function fmt(t) { return String(t).replace(':', '.'); }
  function findDay(nama) {
    for (var i = 0; i < data.hari.length; i++) if (data.hari[i].nama === nama) return data.hari[i];
    return null;
  }
  function show(id, back) {
    ['view-home', 'view-schedule'].forEach(function (v) {
      var el = $(v);
      el.classList.remove('active', 'back');
      if (v === id) { el.classList.add('active'); if (back) el.classList.add('back'); }
    });
    window.scrollTo(0, 0);
  }

  function renderHome() {
    var today = NAMA_HARI[new Date().getDay()];
    if (data.sekolah) $('subtitle').textContent = data.sekolah;
    $('day-list').innerHTML = data.hari.map(function (h) {
      var isToday = h.nama === today;
      return '<li><button class="day-btn' + (isToday ? ' today' : '') + '" data-day="' + esc(h.nama) + '">' +
        '<span class="ico">' + esc(h.nama.charAt(0)) + '</span>' +
        '<span class="info"><span class="name">' + esc(h.nama) + (isToday ? '<span class="badge">Hari ini</span>' : '') + '</span><br>' +
        '<span class="count">' + h.daftarMapel.length + ' mata pelajaran</span></span>' +
        '<span class="chev">' + ICON_CHEV + '</span></button></li>';
    }).join('');
  }

  function renderSchedule(nama) {
    var h = findDay(nama);
    $('title-day').textContent = 'Jadwal Hari ' + h.nama;
    $('tabs').innerHTML = data.hari.map(function (d) {
      return '<button class="tab' + (d.nama === nama ? ' active' : '') + '" data-day="' + esc(d.nama) + '">' + esc(d.nama) + '</button>';
    }).join('');
    var list = h.daftarMapel;
    $('summary').innerHTML = '<span>Total</span><strong>' + list.length + ' Mata Pelajaran</strong>';
    $('empty').hidden = list.length > 0;
    $('mapel-list').innerHTML = list.map(function (m, i) {
      return '<li class="card" style="animation-delay:' + (i * 40) + 'ms"><span class="no">' + (i + 1) + '</span><div>' +
        '<h3>' + esc(m.nama) + '</h3>' +
        '<div class="row">' + ICON_CLOCK + '<span>Jam: <b>' + fmt(m.jamMulai) + '–' + fmt(m.jamSelesai) + '</b>' +
        (m.jamKe ? ' (jam ke-' + esc(m.jamKe) + ')' : '') + '</span></div>' +
        '<div class="row">' + ICON_USER + '<span>Guru: <b>' + esc(m.guru) + '</b></span></div></div></li>';
    }).join('');
  }

  function route() {
    var nama = decodeURIComponent((location.hash || '').replace('#', ''));
    if (nama && findDay(nama)) { renderSchedule(nama); show('view-schedule'); }
    else { show('view-home', true); }
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-day]');
    if (b) { location.hash = encodeURIComponent(b.getAttribute('data-day')); return; }
    if (e.target.closest('#btn-back')) { location.hash = ''; }
  });
  window.addEventListener('hashchange', function () { if (data) route(); });

  fetch(DATA_URL).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function (j) {
    if (!j || !Array.isArray(j.hari)) throw new Error('Format jadwal.json tidak valid');
    data = j;
    renderHome();
    route();
  }).catch(function (err) {
    var el = $('error');
    el.textContent = 'Gagal memuat data/jadwal.json (' + err.message + '). Jalankan lewat server lokal (mis. Live Server) atau dari aplikasi Android.';
    el.hidden = false;
  });
})();
