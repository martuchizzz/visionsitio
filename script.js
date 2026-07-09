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
// CENTROS DE ATENCIÓN A LA MUJER
// LISTA DE CENTROS
// ===========================

const centros = [

{
nombre:"Comisaría de la Mujer y la Familia - Tres de Febrero",
tipo:"comisaria",
direccion:"Tres de Febrero, Buenos Aires",
telefono:"011 2194-2533"
},

{
nombre:"Comisaría de la Mujer y la Familia - San Martín",
tipo:"comisaria",
direccion:"San Martín, Buenos Aires",
telefono:"011 4512-6712"
},

{
nombre:"Comisaría de la Mujer y la Familia - San Justo",
tipo:"comisaria",
direccion:"San Justo, La Matanza, Buenos Aires",
telefono:"Consultar"
},

{
nombre:"Comisaría de la Mujer y la Familia - Morón",
tipo:"comisaria",
direccion:"Morón, Buenos Aires",
telefono:"Consultar"
},

{
nombre:"Comisaría de la Mujer y la Familia - José León Suárez",
tipo:"comisaria",
direccion:"José León Suárez, San Martín, Buenos Aires",
telefono:"Consultar"
},

{
nombre:"Comisaría de la Mujer y la Familia - Hurlingham",
tipo:"comisaria",
direccion:"Hurlingham, Buenos Aires",
telefono:"Consultar"
},

{
nombre:"Comisaría de la Mujer y la Familia - Gregorio de Laferrere",
tipo:"comisaria",
direccion:"Gregorio de Laferrere, La Matanza, Buenos Aires",
telefono:"011 2102-4555"
},

{
nombre:"Comisaría de la Mujer y la Familia - San Isidro",
tipo:"comisaria",
direccion:"San Isidro, Buenos Aires",
telefono:"Consultar"
},

{
nombre:"Comisaría de la Mujer y la Familia - San Fernando",
tipo:"comisaria",
direccion:"San Fernando, Buenos Aires",
telefono:"011 4519-9882"
},

{
nombre:"Comisaría de la Mujer y la Familia - Vicente López",
tipo:"comisaria",
direccion:"Vicente López, Buenos Aires",
telefono:"011 4711-7887"
},

{
nombre:"Comisaría de la Mujer y la Familia - Tigre",
tipo:"comisaria",
direccion:"Tigre, Buenos Aires",
telefono:"011 2121-6865"
},

{
nombre:"Comisaría de la Mujer y la Familia - Esteban Echeverría",
tipo:"comisaria",
direccion:"Esteban Echeverría, Buenos Aires",
telefono:"Consultar"
},

{
nombre:"Comisaría de la Mujer y la Familia - Lomas de Zamora",
tipo:"comisaria",
direccion:"Lomas de Zamora, Buenos Aires",
telefono:"011 4244-1474"
},

{
nombre:"Comisaría de la Mujer y la Familia - Florencio Varela",
tipo:"comisaria",
direccion:"Florencio Varela, Buenos Aires",
telefono:"Consultar"
},

{
nombre:"Comisaría de la Mujer y la Familia - Ituzaingó",
tipo:"comisaria",
direccion:"Ituzaingó, Buenos Aires",
telefono:"Consultar"
},

{
nombre:"Comisaría de la Mujer y la Familia - Merlo",
tipo:"comisaria",
direccion:"Merlo, Buenos Aires",
telefono:"(0220) 483-6060"
},

{
nombre:"Centro Integral de la Mujer Isabel Calvo",
tipo:"centro",
direccion:"Humberto 1° 250, San Telmo, CABA",
telefono:"Consultar"
},

{
nombre:"Centro Integral de la Mujer Alicia Moreau",
tipo:"centro",
direccion:"Presidente José Evaristo Uriburu 1022, Recoleta, CABA",
telefono:"Consultar"
},

{
nombre:"Centro Integral de la Mujer Margarita Malharro",
tipo:"centro",
direccion:"Agüero 301, Almagro, CABA",
telefono:"Consultar"
},

{
nombre:"Centro Integral de la Mujer Pepa Gaitán",
tipo:"centro",
direccion:"Pichincha 1765, Boedo, CABA",
telefono:"Consultar"
},

{
nombre:"Centro Integral de la Mujer Florentina Gómez Miranda",
tipo:"centro",
direccion:"Patricias Argentinas 277, Caballito, CABA",
telefono:"Consultar"
},

{
nombre:"Centro Integral de la Mujer Dignxs de Ser",
tipo:"centro",
direccion:"Lautaro 188, Flores, CABA",
telefono:"Consultar"
},

{
nombre:"Centro Integral de la Mujer Minerva Mirabal",
tipo:"centro",
direccion:"Av. Fernández de la Cruz 4208, Villa Lugano, CABA",
telefono:"Consultar"
},

{
nombre:"Centro Integral de la Mujer Carolina Muzzili",
tipo:"centro",
direccion:"Avellaneda 3751, Floresta, CABA",
telefono:"Consultar"
},

{
nombre:"Centro Integral de la Mujer María Gallego",
tipo:"centro",
direccion:"Av. Francisco Beiró 5229, Villa Devoto, CABA",
telefono:"011 4568-1245"
},

{
nombre:"Centro Integral de la Mujer Lohana Berkins",
tipo:"centro",
direccion:"Av. Triunvirato y Crisólogo Larralde, CABA",
telefono:"Consultar"
},

{
nombre:"Centro Integral de la Mujer Macacha Güemes",
tipo:"centro",
direccion:"Vuelta de Obligado 1524, Belgrano, CABA",
telefono:"Consultar"
},
{
nombre:"Centro de Justicia de la Mujer - La Boca",
tipo:"justicia",
direccion:"Av. Don Pedro de Mendoza 2689, La Boca, CABA",
telefono:"0800-999-68537"
},

{
nombre:"Centro de Justicia de la Mujer - Caballito",
tipo:"justicia",
direccion:"Yerbal 31, Caballito, CABA",
telefono:"0800-999-68537"
},

{
nombre:"Centro de Justicia de la Mujer - Microcentro",
tipo:"justicia",
direccion:"Av. de Mayo 654, CABA",
telefono:"0800-999-68537"
},

{
nombre:"Subsecretaría de Mujeres, Géneros y Diversidad",
tipo:"otro",
direccion:"Av. 53 N°653, La Plata, Buenos Aires",
telefono:"(221) 489-3960"
},

{
nombre:"Casa de la Mujer",
tipo:"otro",
direccion:"Av. Francisco Beiró 5229, Villa Devoto, CABA",
telefono:"(011) 4512-6712"
},

{
nombre:"Dirección General de Violencia de Género - Sede Central",
tipo:"otro",
direccion:"Rodney 301, Chacarita, CABA",
telefono:"Consultar"
},

{
nombre:"Dirección General de Violencia de Género - Sede Comuna 1",
tipo:"otro",
direccion:"Av. de los Inmigrantes 2250, Retiro, CABA",
telefono:"Consultar"
},

{
nombre:"Dirección General de Violencia de Género - Sede Comuna 4",
tipo:"otro",
direccion:"Zavaleta 425, Parque Patricios, CABA",
telefono:"Consultar"
},

{
nombre:"Dirección General de Violencia de Género - Sede Comuna 6",
tipo:"otro",
direccion:"Av. Patricias Argentinas 277, Caballito, CABA",
telefono:"Consultar"
},

{
nombre:"Dirección General de Violencia de Género - Sede Comuna 8",
tipo:"otro",
direccion:"Av. Roca 5252, Villa Lugano, CABA",
telefono:"Consultar"
},

{
nombre:"Violencia Familiar y de Género - Oficina de Atención",
tipo:"otro",
direccion:"Ciudad de Buenos Aires",
telefono:"Consultar"
}

];


// ===========================
// FUNCIONES DE CENTROS
// ===========================

const centrosGrid = document.getElementById("centrosGrid");
const buscarCentro = document.getElementById("buscarCentro");
const filtroTipo = document.getElementById("filtroTipo");
const centrosContador = document.getElementById("centrosContador");
// ===========================
// PAGINACIÓN
// ===========================

const tarjetasPorPagina = 9;

let paginaActual = 1;

let listaActual = centros;

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");


function crearLinkMaps(centro){

  const direccion = `${centro.nombre} ${centro.direccion}`;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;

}


function mostrarCentros(lista){

  if(!centrosGrid) return;

  centrosGrid.innerHTML = "";

centrosContador.textContent =
`${lista.length} centros encontrados | Página ${paginaActual} de ${Math.ceil(lista.length / tarjetasPorPagina)}`;

const inicio = (paginaActual - 1) * tarjetasPorPagina;

const fin = inicio + tarjetasPorPagina;

const pagina = lista.slice(inicio, fin);

pagina.forEach(centro=>

{const tipos = {
  comisaria: "COMISARÍA",
  centro: "CENTRO INTEGRAL",
  justicia: "JUSTICIA",
  otro: "ORGANISMO"
};

tarjeta.innerHTML = `

<div class="card-top">

    <img
        class="card-icon"
        src="imagenes/pin.png.jpeg"
        alt="Pin">

    <span class="card-tag">
        ${tipos[centro.tipo]}
    </span>

</div>

<div class="card-top">

  <span class="card-tag">
    ${tipos[centro.tipo]}
  </span>

</div>
<h3>${centro.nombre}</h3>

<hr>

<p class="card-info">
  📍 ${centro.direccion}
</p>

<p class="card-info">
  ☎ ${
    centro.telefono !== "Consultar"
    ? `<a href="tel:${centro.telefono}">${centro.telefono}</a>`
    : "Consultar"
  }
</p>

<a
class="btn-maps"
href="${crearLinkMaps(centro)}"
target="_blank">

Ver en Google Maps

</a>

`;


centrosGrid.appendChild(tarjeta);

  });

}



function filtrarCentros(){


const texto = buscarCentro.value.toLowerCase();

const tipo = filtroTipo.value;


const resultado = centros.filter(centro=>{


const coincideTexto =
centro.nombre.toLowerCase().includes(texto) ||
(centro.direccion &&
centro.direccion.toLowerCase().includes(texto));

const coincideTipo =
tipo === "todos" ||
centro.tipo === tipo;


return coincideTexto && coincideTipo;


});
listaActual = resultado;

paginaActual = 1;

mostrarCentros(resultado);


}



if(buscarCentro){

buscarCentro.addEventListener(
"input",
filtrarCentros
);

}


if(filtroTipo){

filtroTipo.addEventListener(
"change",
filtrarCentros
);

}
// ===========================
// BOTONES PAGINACIÓN
// ===========================

btnAnterior.addEventListener("click",()=>{

    if(paginaActual>1){

        paginaActual--;

        mostrarCentros(listaActual);

    }

});


btnSiguiente.addEventListener("click",()=>{

    if(paginaActual<Math.ceil(listaActual.length/tarjetasPorPagina)){

        paginaActual++;

        mostrarCentros(listaActual);

    }

});

// mostrar al cargar

mostrarCentros(centros);

// ── PDF DE EMERGENCIA ──
function generatePDF() {
  if (!currentUser) return alert('Primero iniciá sesión y completá tu perfil.');
  const p = currentUser.profile || {};
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;

  // Fondo header
  doc.setFillColor(85, 36, 81);
  doc.rect(0, 0, W, 45, 'F');

  // Nombre del sitio
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Avisa que llegué', 15, 20);

  // Subtítulo
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Perfil de Emergencia Personal', 15, 30);

  // Fecha
  const fecha = new Date().toLocaleDateString('es-AR', { day:'2-digit', month:'long', year:'numeric' });
  doc.setFontSize(9);
  doc.text(`Actualizado: ${fecha}`, 15, 39);

  // Línea fuchsia
  doc.setFillColor(158, 56, 105);
  doc.rect(0, 45, W, 4, 'F');

  let y = 58;

  function seccion(titulo, campos) {
    doc.setFillColor(232, 213, 232);
    doc.rect(10, y - 5, W - 20, 8, 'F');
    doc.setTextColor(85, 36, 81);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 14, y);
    y += 8;

    campos.forEach(([label, valor]) => {
      if (!valor) return;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(107, 72, 115);
      doc.text(label + ':', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(26, 26, 26);
      const lines = doc.splitTextToSize(valor, 130);
      doc.text(lines, 65, y);
      y += lines.length * 6;
    });
    y += 6;
  }

  seccion('DATOS PERSONALES', [
    ['Nombre',        p.nombre || currentUser.name],
    ['Fecha de nac.', p.fecha || '—'],
    ['Nacionalidad',  p.nacionalidad || '—'],
    ['Documento',     p.documento || '—'],
    ['Dirección',     p.direccion || '—'],
  ]);

  seccion('DATOS MÉDICOS', [
    ['Grupo sanguíneo', p.sangre || '—'],
    ['Visión',          p.vision || '—'],
    ['Alergias',        (p.alergias || []).join(', ') || 'Ninguna'],
    ['Medicamentos',    (p.medicamentos || []).join(', ') || 'Ninguno'],
    ['Condiciones',     p.condiciones || '—'],
  ]);

  seccion('DOCUMENTOS', [
    ['Pasaporte',       p.pasaporte || '—'],
    ['Vence',           p.pasaporteVenc || '—'],
    ['Seguro (póliza)', p.seguro || '—'],
    ['Tel. seguro',     p.seguroTel || '—'],
    ['Alojamiento',     p.alojamiento || '—'],
  ]);

  if (p.notas) {
    seccion('NOTAS ADICIONALES', [
      ['Notas', p.notas],
    ]);
  }

  // Pie de página
  doc.setFillColor(85, 36, 81);
  doc.rect(0, 280, W, 17, 'F');
  doc.setTextColor(216, 179, 212);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Avisa que llegué — Para las que viajan solas y llegan bien.', 15, 288);
  doc.text('Ante una emergencia real, llamá al 911.', 15, 293);

  const nombreArchivo = `perfil-emergencia-${(p.nombre || currentUser.name).replace(/\s+/g,'-').toLowerCase()}.pdf`;
  doc.save(nombreArchivo);
}

document.getElementById('downloadPdfBtn').addEventListener('click', generatePDF);