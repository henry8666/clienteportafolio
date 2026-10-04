/* =======================================================================
   PORTAFOLIO DE FOTOGRAFÍA — script.js  
   -----------------------------------------------------------------------


/* ---------- 1) TUS FOTOS  ---------- */
const fotos = [
  { src:"https://picsum.photos/id/1027/800/600", titulo:"Mirada",      categoria:"retratos" },
  { src:"https://picsum.photos/id/1025/800/600", titulo:"Compañía",    categoria:"retratos" },
  { src:"https://picsum.photos/id/177/800/600",  titulo:"Montaña",     categoria:"paisajes" },
  { src:"https://picsum.photos/id/1016/800/600", titulo:"Valle",       categoria:"paisajes" },
  { src:"https://picsum.photos/id/1043/800/600", titulo:"Bosque",      categoria:"paisajes" },
  { src:"https://picsum.photos/id/1062/800/600", titulo:"Celebración", categoria:"eventos"  },
  { src:"https://picsum.photos/id/338/800/600",  titulo:"Concierto",   categoria:"eventos"  },
  { src:"https://picsum.photos/id/823/800/600",  titulo:"Retrato urbano", categoria:"retratos" },
  { src:"https://picsum.photos/id/1039/800/600", titulo:"Cascada",     categoria:"paisajes" }
];

/* ---------- 2) TUS TESTIMONIOS  ---------- */
const testimonios = [
  { texto:"Las fotos superaron todas mis expectativas. Profesional y muy atento.",
    nombre:"María González", rol:"Boda", foto:"https://i.pravatar.cc/100?img=5" },
  { texto:"Captó la esencia de nuestra marca a la perfección. Repetiremos sin duda.",
    nombre:"Carlos Ruiz", rol:"Empresa", foto:"https://i.pravatar.cc/100?img=12" },
  { texto:"Un trato cálido y resultados espectaculares. Lo recomiendo totalmente.",
    nombre:"Lucía Méndez", rol:"Sesión familiar", foto:"https://i.pravatar.cc/100?img=32" }
];



/* ---------- Pintar la galería ---------- */
const galeriaEl = document.getElementById("galeria");
let fotosVisibles = [];

function pintarGaleria(cat = "todos"){
  if(!galeriaEl) return;
  fotosVisibles = fotos.filter(f => cat === "todos" || f.categoria === cat);
  galeriaEl.innerHTML = fotosVisibles.map((f, i) => `
    <div class="foto" data-index="${i}">
      <img src="${f.src}" alt="${f.titulo}" loading="lazy">
      <div class="foto-info">
        <h3>${f.titulo}</h3>
        <span>${f.categoria}</span>
      </div>
    </div>`).join("");
}
pintarGaleria();

/* ---------- Filtros ---------- */
document.getElementById("filtros")?.addEventListener("click", e => {
  if(!e.target.classList.contains("filtro")) return;
  document.querySelectorAll(".filtro").forEach(b => b.classList.remove("activo"));
  e.target.classList.add("activo");
  pintarGaleria(e.target.dataset.cat);
});

/* ---------- Lightbox (visor) ---------- */
const lightbox = document.getElementById("lightbox");
const lbImg    = document.getElementById("lbImg");
let lbActual = 0;

function abrirLightbox(){
  if(!lightbox || !lbImg) return;
  lbImg.src = fotosVisibles[lbActual].src;
  lbImg.alt = fotosVisibles[lbActual].titulo;
  lightbox.classList.add("abierto");
}
function mover(dir){
  lbActual = (lbActual + dir + fotosVisibles.length) % fotosVisibles.length;
  abrirLightbox();
}

if(galeriaEl){
  galeriaEl.addEventListener("click", e => {
    const foto = e.target.closest(".foto");
    if(!foto) return;
    lbActual = +foto.dataset.index;
    abrirLightbox();
  });
}
if(lightbox){
  document.getElementById("lbCerrar")?.addEventListener("click", () => lightbox.classList.remove("abierto"));
  document.getElementById("lbPrev")?.addEventListener("click", () => mover(-1));
  document.getElementById("lbNext")?.addEventListener("click", () => mover(1));
  lightbox.addEventListener("click", e => { if(e.target === lightbox) lightbox.classList.remove("abierto"); });
  document.addEventListener("keydown", e => {
    if(!lightbox.classList.contains("abierto")) return;
    if(e.key === "Escape") lightbox.classList.remove("abierto");
    if(e.key === "ArrowLeft") mover(-1);
    if(e.key === "ArrowRight") mover(1);
  });
}

/* ---------- Pintar testimonios ---------- */
const testiGrid = document.getElementById("testimonios-grid");
if(testiGrid){
  testiGrid.innerHTML = testimonios.map(t => `
    <div class="testi-card">
      <div class="testi-estrellas">★★★★★</div>
      <p class="testi-texto">“${t.texto}”</p>
      <div class="testi-autor">
        <img src="${t.foto}" alt="${t.nombre}" loading="lazy">
        <div><strong>${t.nombre}</strong><small>${t.rol}</small></div>
      </div>
    </div>`).join("");
}

/* ---------- Menú móvil ---------- */
const nav = document.getElementById("nav");
document.getElementById("navToggle")?.addEventListener("click", () => nav?.classList.toggle("abierto"));
nav?.querySelectorAll(".nav-link").forEach(a => a.addEventListener("click", () => nav.classList.remove("abierto")));

/* ---------- Encabezado al hacer scroll ---------- */
const header = document.getElementById("header");
window.addEventListener("scroll", () => header?.classList.toggle("scrolled", window.scrollY > 60));

/* ---------- Formulario de contacto (envío + confirmación) ---------- */
const form   = document.getElementById("form");
const estado = document.getElementById("formEstado");

if(form){
  form.addEventListener("submit", async e => {
    e.preventDefault();

    // Anti-spam: si la trampa oculta viene llena, es un robot -> no enviar
    if(form._gotcha && form._gotcha.value){ return; }

    // Guardamos los datos ANTES de limpiar el formulario
    const datos = new FormData(form);

    if(estado){ estado.textContent = "Enviando..."; estado.className = "form-estado"; }

    // Limpiamos los campos y subimos al inicio de inmediato
    form.reset();
    document.getElementById("inicio")?.scrollIntoView({ behavior:"smooth" });

    try{
      const resp = await fetch(form.action, {
        method:"POST",
        body:datos,
        headers:{ "Accept":"application/json" }
      });
      if(estado){
        if(resp.ok){
          estado.textContent = "¡Gracias! Tu mensaje fue enviado. Te responderé pronto.";
          estado.className = "form-estado ok";
        }else{
          estado.textContent = "Hubo un problema al enviar. Inténtalo de nuevo.";
          estado.className = "form-estado error";
        }
      }
    }catch(err){
      if(estado){
        estado.textContent = "Sin conexión. Revisa tu internet e inténtalo otra vez.";
        estado.className = "form-estado error";
      }
    }
  });
}

/* ---------- Red de seguridad ----------
  ), limpiamos el formulario igualmente. */
window.addEventListener("pageshow", () => { if(form) form.reset(); });
