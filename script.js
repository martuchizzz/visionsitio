// Navbar toggle
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// Carousel
const track = document.getElementById('carouselTrack');
const cards = track.querySelectorAll('.app-card');
const dotsContainer = document.getElementById('carouselDots');
let current = 0;

const visibleCount = () => window.innerWidth <= 768 ? 1 : 3;

function maxIndex() {
  return cards.length - visibleCount();
}

// Create dots
cards.forEach((_, i) => {
  if (i > maxIndex()) return;
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function goTo(idx) {
  current = Math.max(0, Math.min(idx, maxIndex()));
  const cardW = cards[0].offsetWidth + 20;
  track.style.transform = `translateX(-${current * cardW}px)`;
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

// Accordion
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    document.querySelectorAll('.accordion-btn').forEach(b => {
      b.classList.remove('open');
      b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      btn.classList.add('open');
      content.classList.add('open');
    }
  });
});

// ── AUTH & PERFIL ──
let currentUser = JSON.parse(localStorage.getItem('aql_user') || 'null');

function openLogin() { document.getElementById('loginOverlay').classList.add('open'); }
function closeLogin() { document.getElementById('loginOverlay').classList.remove('open'); }
function openProfile() { loadProfileUI(); document.getElementById('profileOverlay').classList.add('open'); }
function closeProfile() { document.getElementById('profileOverlay').classList.remove('open'); }

document.getElementById('navPerfilBtn').addEventListener('click', e => {
  e.preventDefault();
  currentUser ? openProfile() : openLogin();
});
document.getElementById('closeLogin').addEventListener('click', closeLogin);
document.getElementById('closeProfile').addEventListener('click', closeProfile);
document.getElementById('loginOverlay').addEventListener('click', e => { if(e.target===e.currentTarget) closeLogin(); });
document.getElementById('profileOverlay').addEventListener('click', e => { if(e.target===e.currentTarget) closeProfile(); });

// Auth tabs
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('auth-' + tab.dataset.auth).classList.add('active');
  });
});

function fakeLogin(name, email) {
  currentUser = { name, email, profile: {} };
  localStorage.setItem('aql_user', JSON.stringify(currentUser));
  closeLogin();
  openProfile();
}

document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  if (!email || !pass) return alert('Completá tu email y contraseña.');
  fakeLogin(email.split('@')[0], email);
});

document.getElementById('registerBtn').addEventListener('click', () => {
  const name  = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass  = document.getElementById('regPass').value;
  if (!name || !email || !pass) return alert('Completá todos los campos.');
  if (pass.length < 8) return alert('La contraseña debe tener al menos 8 caracteres.');
  fakeLogin(name, email);
});

document.getElementById('googleLoginBtn').addEventListener('click', () => fakeLogin('Usuaria Google', 'usuaria@gmail.com'));
document.getElementById('googleRegisterBtn').addEventListener('click', () => fakeLogin('Usuaria Google', 'usuaria@gmail.com'));

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('aql_user');
  currentUser = null;
  closeProfile();
});

document.getElementById('saveProfileBtn').addEventListener('click', () => {
  if (!currentUser) return;
  currentUser.profile = {
    nombre: document.getElementById('pNombre').value,
    fecha: document.getElementById('pFecha').value,
    nacionalidad: document.getElementById('pNacionalidad').value,
    documento: document.getElementById('pDocumento').value,
    direccion: document.getElementById('pDireccion').value,
    sangre: document.getElementById('pSangre').value,
    vision: document.getElementById('pVision').value,
    condiciones: document.getElementById('pCondiciones').value,
    alojamiento: document.getElementById('pAlojamiento').value,
    pasaporte: document.getElementById('pPasaporte').value,
    pasaporteVenc: document.getElementById('pPasaporteVenc').value,
    seguro: document.getElementById('pSeguro').value,
    seguroTel: document.getElementById('pSeguroTel').value,
    notas: document.getElementById('pNotas').value,
    alergias: Array.from(document.querySelectorAll('#alergiasWrap .tag')).map(t => t.dataset.value),
    medicamentos: Array.from(document.querySelectorAll('#medicamentosWrap .tag')).map(t => t.dataset.value),
  };
  localStorage.setItem('aql_user', JSON.stringify(currentUser));
  generateQR();
  const btn = document.getElementById('saveProfileBtn');
  btn.textContent = '✓ Guardado';
  btn.style.background = 'var(--plum)';
  setTimeout(() => { btn.textContent = 'Guardar cambios'; btn.style.background = ''; }, 2000);
});

function loadProfileUI() {
  if (!currentUser) return;
  const initials = currentUser.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileName').textContent = currentUser.name;
  document.getElementById('profileEmailDisplay').textContent = currentUser.email;
  const p = currentUser.profile || {};
  const fields = ['pNombre','pFecha','pNacionalidad','pDocumento','pDireccion','pSangre','pVision','pCondiciones','pAlojamiento','pPasaporte','pPasaporteVenc','pSeguro','pSeguroTel','pNotas'];
  const keys   = ['nombre','fecha','nacionalidad','documento','direccion','sangre','vision','condiciones','alojamiento','pasaporte','pasaporteVenc','seguro','seguroTel','notas'];
  fields.forEach((id,i) => { const el = document.getElementById(id); if(el && p[keys[i]]) el.value = p[keys[i]]; });
  // tags
  (p.alergias||[]).forEach(v => addTag('alergiasWrap', v));
  (p.medicamentos||[]).forEach(v => addTag('medicamentosWrap', v));
  generateQR();
}

// Tags
function addTag(wrapId, value) {
  if (!value) return;
  const wrap = document.getElementById(wrapId);
  const existing = Array.from(wrap.querySelectorAll('.tag')).map(t=>t.dataset.value);
  if (existing.includes(value)) return;
  const tag = document.createElement('span');
  tag.className = 'tag'; tag.dataset.value = value;
  tag.innerHTML = value + ' <span class="tag-remove">✕</span>';
  tag.querySelector('.tag-remove').addEventListener('click', () => tag.remove());
  wrap.insertBefore(tag, wrap.querySelector('.tag-add-input'));
}

document.getElementById('alergiaInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') { addTag('alergiasWrap', e.target.value.trim()); e.target.value = ''; }
});
document.getElementById('medicamentoInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') { addTag('medicamentosWrap', e.target.value.trim()); e.target.value = ''; }
});

// Contactos
document.getElementById('addContactBtn').addEventListener('click', () => {
  const c = document.createElement('div');
  c.className = 'contact-card'; c.style.marginBottom = '0.5rem';
  c.innerHTML = `<div><label class="input-label">Nombre</label><input type="text" placeholder="Ej: Mamá" /></div>
    <div><label class="input-label">Teléfono</label><input type="tel" placeholder="+54 9 11..." /></div>
    <button class="btn-icon" onclick="this.parentElement.remove()" style="margin-top:1.2rem;">✕</button>`;
  document.getElementById('contactsContainer').appendChild(c);
});

// Ubicación
document.getElementById('getLocationBtn').addEventListener('click', () => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude.toFixed(4);
    const lng = pos.coords.longitude.toFixed(4);
    document.getElementById('locationText').textContent = `Lat: ${lat}, Lng: ${lng}`;
    if (currentUser) { currentUser.location = {lat, lng}; localStorage.setItem('aql_user', JSON.stringify(currentUser)); }
  }, () => {
    document.getElementById('locationText').textContent = 'No se pudo obtener la ubicación.';
  });
});

// QR
function generateQR() {
  const canvas = document.getElementById('qrCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,120,120);
  if (!currentUser) return;
  const p = currentUser.profile || {};
  const data = `EMERGENCIA\nNombre: ${p.nombre||currentUser.name}\nSangre: ${p.sangre||'N/D'}\nAlergias: ${(p.alergias||[]).join(', ')||'Ninguna'}\nMedicamentos: ${(p.medicamentos||[]).join(', ')||'Ninguno'}\nCondiciones: ${p.condiciones||'N/D'}`;
  // QR simple visual (representación)
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,120,120);
  ctx.fillStyle = '#552451';
  const size = 4;
  const hash = [...data].reduce((a,c) => a + c.charCodeAt(0), 0);
  for (let r=0;r<30;r++) for(let c=0;c<30;c++) {
    if (((r*31+c*7+hash)%3===0)||(r<7&&c<7&&!(r>1&&r<5&&c>1&&c<5))||(r<7&&c>22&&!(r>1&&r<5&&c>22&&c<26))||(r>22&&c<7&&!(r>22&&r<26&&c>1&&c<5)))
      ctx.fillRect(c*size, r*size, size, size);
  }
}

document.getElementById('downloadQrBtn').addEventListener('click', () => {
  const canvas = document.getElementById('qrCanvas');
  const link = document.createElement('a');
  link.download = 'mi-qr-emergencia.png';
  link.href = canvas.toDataURL();
  link.click();
});

// ── FORMULARIO DE COMENTARIOS ──
// Formulario
document.getElementById('commentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('userName').value.trim();
  const comment = document.getElementById('userComment').value.trim();
  let valid = true;
  document.getElementById('errorNombre').textContent = '';
  document.getElementById('errorComentario').textContent = '';
  if (!name) { document.getElementById('errorNombre').textContent = 'Por favor, ingresá tu nombre.'; valid = false; }
  if (!comment) { document.getElementById('errorComentario').textContent = 'Por favor, escribí tu consejo.'; valid = false; }
  if (valid) {
    this.style.display = 'none';
    document.getElementById('formSuccess').classList.remove('hidden');
  }
});
