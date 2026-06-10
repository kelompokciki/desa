const sampleDataPath = 'data/sample-data.json';
let siteData = null;

async function loadData() {
  if (siteData) {
    return siteData;
  }
  try {
    const response = await fetch(sampleDataPath);
    siteData = await response.json();
    return siteData;
  } catch (error) {
    console.warn('Data sample tidak dapat dimuat:', error);
    siteData = {
      profilDesa: {},
      penduduk: [],
      apbdes: [],
      berita: [],
      pengumuman: [],
      galeri: [],
      dokumen: [],
      agenda: [],
      aparatur: [],
      program: [],
      aktivitas: []
    };
    return siteData;
  }
}

function formatRupiah(value) {
  const amount = Number(value) || 0;
  return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
}

function safeText(text) {
  return text || '-';
}

async function loadHomepage() {
  const data = await loadData();
  const population = data.penduduk.length;
  const familyCount = Math.max(1, Math.ceil(population / 5));
  const programs = data.program.length;
  const newsCount = data.berita.length;

  document.getElementById('stat-penduduk').textContent = population;
  document.getElementById('stat-kk').textContent = familyCount;
  document.getElementById('stat-program').textContent = programs;
  document.getElementById('stat-berita').textContent = newsCount;
  document.getElementById('card-penduduk').textContent = population;
  document.getElementById('card-kk').textContent = familyCount;
  document.getElementById('card-pendidikan').textContent = new Set(data.penduduk.map((item) => item.pendidikan)).size;
  document.getElementById('card-pekerjaan').textContent = new Set(data.penduduk.map((item) => item.pekerjaan)).size;
  document.getElementById('sejarah').textContent = safeText(data.profilDesa.sejarah);
  document.getElementById('visi').textContent = safeText(data.profilDesa.visi);
  document.getElementById('misi-list').innerHTML = data.profilDesa.misi.map((item) => `<li class="list-group-item">${item}</li>`).join('');

  const beritaList = document.getElementById('berita-list');
  beritaList.innerHTML = data.berita.slice(0, 3).map((post) => `
    <div class="col-md-4">
      <div class="card shadow-sm">
        <img src="${post.gambar}" class="card-img-top" alt="${post.judul}" />
        <div class="card-body">
          <h5 class="card-title">${post.judul}</h5>
          <p class="card-text">${post.isi.substring(0, 100)}...</p>
          <a href="berita.html" class="btn btn-sm btn-success">Baca Selengkapnya</a>
        </div>
      </div>
    </div>
  `).join('');

  const agendaList = document.getElementById('agenda-list');
  agendaList.innerHTML = data.agenda.slice(0, 4).map((item) => `<li class="list-group-item"><strong>${item.tanggal}:</strong> ${item.kegiatan}</li>`).join('');

  const aparaturList = document.getElementById('aparatur-list');
  aparaturList.innerHTML = data.aparatur.map((person) => `
    <div class="col-md-3">
      <div class="card shadow-sm h-100">
        <div class="card-body text-center">
          <img src="${person.foto}" class="rounded-circle mb-3" width="100" height="100" alt="${person.nama}" />
          <h6>${person.nama}</h6>
          <p class="text-muted mb-1">${person.jabatan}</p>
        </div>
      </div>
    </div>
  `).join('');

  const galleryList = document.getElementById('galeri-list');
  galleryList.innerHTML = data.galeri.slice(0, 4).map((item) => `
    <div class="col-md-3">
      <div class="card shadow-sm overflow-hidden">
        <img src="${item.gambar}" class="card-img-top" alt="${item.judul}" />
        <div class="card-body">
          <h6 class="card-title">${item.judul}</h6>
          <p class="text-muted small">${item.tanggal}</p>
        </div>
      </div>
    </div>
  `).join('');

  const dokumenList = document.getElementById('dokumen-list');
  dokumenList.innerHTML = data.dokumen.slice(0, 3).map((doc) => `
    <div class="col-md-4">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5>${doc.nama}</h5>
          <p class="text-muted">${doc.kategori}</p>
          <a href="${doc.fileUrl}" class="btn btn-sm btn-success" target="_blank">Unduh</a>
        </div>
      </div>
    </div>
  `).join('');

  const totals = data.apbdes.reduce((acc, item) => {
    acc.pendapatan += item.pendapatan;
    acc.belanja += item.belanja;
    acc.realisasi += item.realisasi;
    return acc;
  }, { pendapatan: 0, belanja: 0, realisasi: 0 });
  document.getElementById('total-pendapatan').textContent = formatRupiah(totals.pendapatan);
  document.getElementById('total-belanja').textContent = formatRupiah(totals.belanja);
  document.getElementById('total-realisasi').textContent = formatRupiah(totals.realisasi);

  renderChart('pendudukChart', {
    labels: ['0-17', '18-30', '31-45', '46-60', '61+'],
    datasets: [{ label: 'Penduduk', data: [45, 68, 55, 33, 20], backgroundColor: ['#0b6623', '#2c8f3a', '#61a76b', '#8dc597', '#bad7b3'] }]
  });
  renderChart('pendidikanChart', {
    type: 'bar',
    labels: ['SD', 'SMP', 'SMA', 'Diploma', 'Sarjana'],
    datasets: [{ label: 'Pendidikan', data: [70, 54, 48, 28, 14], backgroundColor: '#0b6623' }]
  });
  renderChart('pekerjaanChart', {
    type: 'bar',
    labels: ['Petani', 'Guru', 'Pedagang', 'PNS', 'Lainnya'],
    datasets: [{ label: 'Pekerjaan', data: [50, 18, 40, 10, 25], backgroundColor: '#2c8f3a' }]
  });
  renderChart('keuanganChart', {
    type: 'line',
    labels: data.apbdes.map((item) => item.tahun),
    datasets: [
      { label: 'Pendapatan', data: data.apbdes.map((item) => item.pendapatan), borderColor: '#0b6623', fill: false },
      { label: 'Belanja', data: data.apbdes.map((item) => item.belanja), borderColor: '#d9534f', fill: false },
      { label: 'Realisasi', data: data.apbdes.map((item) => item.realisasi), borderColor: '#0275d8', fill: false }
    ]
  });
}

function renderChart(canvasId, config) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const chartConfig = {
    type: config.type || 'doughnut',
    data: {
      labels: config.labels,
      datasets: config.datasets
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  };
  new Chart(ctx, chartConfig);
}

async function loadProfilePage() {
  const data = await loadData();
  document.getElementById('profile-sejarah').textContent = safeText(data.profilDesa.sejarah);
  document.getElementById('profile-visi').textContent = safeText(data.profilDesa.visi);
  document.getElementById('profile-misi').innerHTML = data.profilDesa.misi.map((item) => `<li>${item}</li>`).join('');
  document.getElementById('profile-dokumen').innerHTML = data.dokumen.slice(0, 3).map((doc) => `<li><a href="${doc.fileUrl}" target="_blank">${doc.nama}</a></li>`).join('');
}

async function loadApbdesPage() {
  const data = await loadData();
  const tableBody = document.getElementById('apbdesRows');
  tableBody.innerHTML = data.apbdes.map((item) => `
    <tr>
      <td>${item.tahun}</td>
      <td>${formatRupiah(item.pendapatan)}</td>
      <td>${formatRupiah(item.belanja)}</td>
      <td>${formatRupiah(item.realisasi)}</td>
    </tr>
  `).join('');
  document.getElementById('apbdes-pendapatan').textContent = formatRupiah(data.apbdes.reduce((acc, item) => acc + item.pendapatan, 0));
  document.getElementById('apbdes-belanja').textContent = formatRupiah(data.apbdes.reduce((acc, item) => acc + item.belanja, 0));
  document.getElementById('apbdes-realisasi').textContent = formatRupiah(data.apbdes.reduce((acc, item) => acc + item.realisasi, 0));
  renderChart('apbdesChart', {
    type: 'bar',
    labels: data.apbdes.map((item) => item.tahun),
    datasets: [
      { label: 'Pendapatan', data: data.apbdes.map((item) => item.pendapatan), backgroundColor: '#0b6623' },
      { label: 'Belanja', data: data.apbdes.map((item) => item.belanja), backgroundColor: '#d9534f' },
      { label: 'Realisasi', data: data.apbdes.map((item) => item.realisasi), backgroundColor: '#0275d8' }
    ]
  });
  if (window.$ && window.$.fn.dataTable) {
    $('#apbdesTable').DataTable();
  }
}

async function loadNewsPage() {
  const data = await loadData();
  const newsCards = document.getElementById('newsCards');
  const renderCards = (items) => {
    newsCards.innerHTML = items.map((post) => `
      <div class="col-md-4">
        <div class="card shadow-sm h-100">
          <img src="${post.gambar}" class="card-img-top" alt="${post.judul}" />
          <div class="card-body">
            <h5 class="card-title">${post.judul}</h5>
            <p class="card-text">${post.isi.substring(0, 130)}...</p>
            <p class="text-muted small">${post.tanggal}</p>
          </div>
        </div>
      </div>
    `).join('');
  };

  renderCards(data.berita);
  const searchInput = document.getElementById('searchNews');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase();
      const filtered = data.berita.filter((post) => post.judul.toLowerCase().includes(query) || post.isi.toLowerCase().includes(query));
      renderCards(filtered);
    });
  }
}

async function loadAnnouncementPage() {
  const data = await loadData();
  const list = document.getElementById('announcementList');
  list.innerHTML = data.pengumuman.map((item) => `
    <a href="#" class="list-group-item list-group-item-action">
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">${item.judul}</h5>
        <small>${item.tanggal}</small>
      </div>
      <p class="mb-1">${item.isi}</p>
    </a>
  `).join('');
}

async function loadGalleryPage() {
  const data = await loadData();
  const galleryGrid = document.getElementById('galleryGrid');
  galleryGrid.innerHTML = data.galeri.map((item) => `
    <div class="col-md-4">
      <div class="card shadow-sm">
        <img src="${item.gambar}" class="card-img-top" alt="${item.judul}" />
        <div class="card-body">
          <h5 class="card-title">${item.judul}</h5>
          <p class="text-muted">${item.tanggal}</p>
        </div>
      </div>
    </div>
  `).join('');
}

async function loadDocumentsPage() {
  const data = await loadData();
  const list = document.getElementById('documentList');
  list.innerHTML = data.dokumen.map((doc) => `
    <div class="col-md-4">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5>${doc.nama}</h5>
          <p class="text-muted">${doc.kategori}</p>
          <a href="${doc.fileUrl}" target="_blank" class="btn btn-success btn-sm">Download</a>
        </div>
      </div>
    </div>
  `).join('');
}

async function loadAdminDashboard() {
  const data = await loadData();
  document.getElementById('adminTotalPenduduk').textContent = data.penduduk.length;
  document.getElementById('adminTotalDokumen').textContent = data.dokumen.length;
  document.getElementById('adminTotalBerita').textContent = data.berita.length;
  document.getElementById('adminTotalPengumuman').textContent = data.pengumuman.length;
  document.getElementById('adminActivityList').innerHTML = data.aktivitas.map((item) => `<li class="list-group-item">${item}</li>`).join('');
}

async function loadAdminPendudukPage() {
  const data = await loadData();
  const rows = document.getElementById('pendudukRows');
  rows.innerHTML = data.penduduk.map((person) => `
    <tr>
      <td>${person.nama}</td>
      <td>${person.nik}</td>
      <td>${person.jenisKelamin}</td>
      <td>${person.usia}</td>
      <td>${person.pendidikan}</td>
      <td>${person.pekerjaan}</td>
    </tr>
  `).join('');
  if (window.$ && window.$.fn.dataTable) {
    $('#pendudukTable').DataTable();
  }
}

async function loadAdminApbdesPage() {
  const data = await loadData();
  const rows = document.getElementById('adminApbdesRows');
  rows.innerHTML = data.apbdes.map((item) => `
    <tr>
      <td>${item.tahun}</td>
      <td>${formatRupiah(item.pendapatan)}</td>
      <td>${formatRupiah(item.belanja)}</td>
      <td>${formatRupiah(item.realisasi)}</td>
    </tr>
  `).join('');
  if (window.$ && window.$.fn.dataTable) {
    $('#adminApbdesTable').DataTable();
  }
}

async function loadAdminNewsPage() {
  const data = await loadData();
  const rows = document.getElementById('adminNewsRows');
  rows.innerHTML = data.berita.map((item) => `
    <tr>
      <td>${item.judul}</td>
      <td>${item.tanggal}</td>
      <td>${item.isi.substring(0, 80)}...</td>
    </tr>
  `).join('');
  if (window.$ && window.$.fn.dataTable) {
    $('#adminNewsTable').DataTable();
  }
}

async function loadAdminDocumentsPage() {
  const data = await loadData();
  const rows = document.getElementById('adminDocumentsRows');
  rows.innerHTML = data.dokumen.map((doc) => `
    <tr>
      <td>${doc.nama}</td>
      <td>${doc.kategori}</td>
      <td><a href="${doc.fileUrl}" target="_blank">Lihat</a></td>
    </tr>
  `).join('');
  if (window.$ && window.$.fn.dataTable) {
    $('#adminDocumentsTable').DataTable();
  }
}

async function loadAdminAnnouncementPage() {
  const data = await loadData();
  const rows = document.getElementById('adminAnnouncementRows');
  rows.innerHTML = data.pengumuman.map((item) => `
    <tr>
      <td>${item.judul}</td>
      <td>${item.tanggal}</td>
      <td>${item.isi}</td>
    </tr>
  `).join('');
  if (window.$ && window.$.fn.dataTable) {
    $('#adminAnnouncementTable').DataTable();
  }
}

async function loadAdminGalleryPage() {
  const data = await loadData();
  const rows = document.getElementById('adminGalleryRows');
  rows.innerHTML = data.galeri.map((item) => `
    <tr>
      <td>${item.judul}</td>
      <td>${item.tanggal}</td>
      <td><a href="${item.gambar}" target="_blank">Lihat</a></td>
    </tr>
  `).join('');
  if (window.$ && window.$.fn.dataTable) {
    $('#adminGalleryTable').DataTable();
  }
}

async function loadAdminComplaintsPage() {
  const data = await loadData();
  const rows = document.getElementById('adminComplaintsRows');
  rows.innerHTML = data.pengaduan.map((item) => `
    <tr>
      <td>${item.nama}</td>
      <td>${item.tanggal}</td>
      <td>${item.pesan}</td>
      <td>${item.status}</td>
    </tr>
  `).join('');
  if (window.$ && window.$.fn.dataTable) {
    $('#adminComplaintsTable').DataTable();
  }
}

async function loadAdminUsersPage() {
  const data = await loadData();
  const rows = document.getElementById('adminUsersRows');
  rows.innerHTML = data.pengguna.map((item) => `
    <tr>
      <td>${item.nama}</td>
      <td>${item.email}</td>
      <td>${item.role}</td>
    </tr>
  `).join('');
  if (window.$ && window.$.fn.dataTable) {
    $('#adminUsersTable').DataTable();
  }
}

window.loadHomepage = loadHomepage;
window.loadProfilePage = loadProfilePage;
window.loadApbdesPage = loadApbdesPage;
window.loadNewsPage = loadNewsPage;
window.loadAnnouncementPage = loadAnnouncementPage;
window.loadGalleryPage = loadGalleryPage;
window.loadDocumentsPage = loadDocumentsPage;
window.loadAdminDashboard = loadAdminDashboard;
window.loadAdminPendudukPage = loadAdminPendudukPage;
window.loadAdminApbdesPage = loadAdminApbdesPage;
window.loadAdminNewsPage = loadAdminNewsPage;
window.loadAdminDocumentsPage = loadAdminDocumentsPage;
window.loadAdminAnnouncementPage = loadAdminAnnouncementPage;
window.loadAdminGalleryPage = loadAdminGalleryPage;
window.loadAdminComplaintsPage = loadAdminComplaintsPage;
window.loadAdminUsersPage = loadAdminUsersPage;

if (document.body.contains(document.getElementById('pendudukChart')) || document.body.contains(document.getElementById('dashboardChart'))) {
  loadHomepage();
}
