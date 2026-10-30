/**
 * ==========================================================================
 * YAGO.EXE — Script Principal de Alta Performance (JavaScript Puro)
 * Controles de Cursor, Tema, Terminal, Relógio, Modais, Filtros,
 * Sintetizador Web Audio API, Command Palette (Ctrl+K), 3D Tilt, Sandbox,
 * Motor Three.js (Esfera, Portal & Torus Knot) e Cortina de Transição
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. CONFIGURAÇÃO PESSOAL CENTRALIZADA (FÁCIL DE EDITAR)
// --------------------------------------------------------------------------
const PORTFOLIO_CONFIG = {
  nome: "Yago Araujo Andrade",
  marca: "YAGO.EXE",
  email: "yago.araujo.dev@exemplo.com", // Substitua pelo seu e-mail real
  github: "https://github.com/",        // Substitua pelo seu perfil do GitHub
  linkedin: "https://linkedin.com/",    // Substitua pelo seu perfil do LinkedIn
  status: "2º Ano do Técnico em Informática",
  projetos: {
    "readeria": {
      numero: "01",
      nome: "ReaderIA",
      categoria: "IA & OCR / CONCEITO",
      tagline: "Interpretação inteligente de erros de computador e stack traces em tempo real.",
      imagem: "projects/readeria.jpg",
      stack: ["IA Generativa", "OCR", "Python", "FastAPI", "React / UI Editorial"],
      problema: "Mensagens de erro em terminais e IDEs costumam ser crípticas e assustadoras para quem está aprendendo a programar ou lidando com falhas de sistema, levando a horas de frustração e pesquisa dispersa.",
      solucao: "O ReaderIA captura prints de tela ou trechos de logs, isola as linhas críticas da exceção via OCR e consulta modelos de linguagem para gerar um diagnóstico claro em português, detalhando a causa raiz e sugerindo o trecho corrigido.",
      arquitetura: [
        "Módulo de captura e processamento óptico de caracteres para extração de logs",
        "Pipeline de enriquecimento de prompt com contexto de linguagem e ambiente",
        "Interface editorial minimalista com destaque de sintaxe e soluções passo a passo"
      ],
      contexto: "Projeto conceitual desenvolvido para explorar a aplicação prática de inteligência artificial em ferramentas educacionais para programadores iniciantes.",
      github: "",
      demo: ""
    },
    "api-cachorros": {
      numero: "02",
      nome: "API de Cachorros",
      categoria: "BACKEND & BANCO DE DADOS",
      tagline: "API RESTful para catalogação e consulta estruturada de raças caninas.",
      imagem: "projects/api_cachorros.jpg",
      stack: ["Python", "Flask", "SQLite", "SQLAlchemy", "RESTful API", "JSON"],
      problema: "Necessidade de consolidar os conceitos práticos de bancos de dados relacionais, mapeamento objeto-relacional (ORM) e desenvolvimento de serviços web REST na formação técnica.",
      solucao: "Desenvolvimento de uma API desacoplada com rotas padronizadas em padrão JSON, validação de payload, tratamento de status codes HTTP (200, 201, 400, 404) e persistência em banco SQLite.",
      arquitetura: [
        "Modelagem de dados com SQLAlchemy (tabelas de raças, grupos, características físicas e temperamento)",
        "Controladores modulares e rotas de consulta com suporte a filtros dinâmicos de busca",
        "Camada de serialização para respostas padronizadas e seguras",
        "Simulador de rotas interativo disponível para testes no modal de detalhes"
      ],
      contexto: "Desenvolvido como projeto prático no curso técnico em informática para solidificar arquitetura de back-end em Python.",
      github: "",
      demo: ""
    },
    "game-store": {
      numero: "03",
      nome: "Game Store",
      categoria: "UI & E-COMMERCE",
      tagline: "Interface moderna de e-commerce gamer com foco em usabilidade e estética contemporânea.",
      imagem: "projects/game_store.jpg",
      stack: ["CSS Moderno", "HTML5 Semântico", "JavaScript", "UX / UI Design", "Responsividade"],
      problema: "Muitas lojas gamers utilizam layouts escuros saturados com elementos visuais conflitantes, o que prejudica a legibilidade e torna a experiência de navegação pesada.",
      solucao: "Um conceito de design refinado que combina alto contraste editorial, cartões de produto espaçosos, tipografia limpa e micro-interações elegantes nos botões de compra e favoritos.",
      arquitetura: [
        "Sistema de grid responsivo que se adapta perfeitamente de telas widescreen a smartphones",
        "Gerenciamento de estado em JavaScript para filtragem de jogos e status do carrinho",
        "Componentes reutilizáveis de cartões, badges de preço e visualizadores de detalhes"
      ],
      contexto: "Estudo de caso de front-end explorando boas práticas de design de produto e design systems contemporâneos.",
      github: "",
      demo: ""
    }
  }
};

// --------------------------------------------------------------------------
// 2. SINTETIZADOR DE EFEITOS SONOROS (WEB AUDIO API - ZERO ARQUIVOS EXTERNOS)
// --------------------------------------------------------------------------
const SoundEngine = {
  ctx: null,
  enabled: false,

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    localStorage.setItem('yago_sfx', this.enabled ? '1' : '0');
    this.updateUI();
    if (this.enabled) this.playTone(880, 0.08, 'sine', 0.04);
  },

  updateUI() {
    const soundToggle = document.getElementById('soundToggle');
    const soundLabel = document.getElementById('soundLabel');
    const mobileSoundBtn = document.getElementById('mobileSoundBtn');
    const hudStatus = document.getElementById('hudSoundStatus');

    if (soundToggle) soundToggle.classList.toggle('is-active', this.enabled);
    if (soundLabel) soundLabel.textContent = this.enabled ? 'SFX: ON' : 'SFX: OFF';
    if (mobileSoundBtn) mobileSoundBtn.textContent = this.enabled ? 'SFX: LIGADO' : 'SFX Som';
    if (hudStatus) hudStatus.textContent = this.enabled ? 'ON' : 'OFF';
  },

  playTone(freq, duration, type = 'sine', gainVal = 0.03) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  },

  playHover() {
    this.playTone(1100, 0.03, 'sine', 0.015);
  },

  playClick() {
    this.playTone(280, 0.04, 'triangle', 0.03);
  },

  playTheme() {
    if (!this.enabled || !this.ctx) return;
    this.playTone(523.25, 0.08, 'sine', 0.03);
    setTimeout(() => this.playTone(659.25, 0.12, 'sine', 0.03), 70);
  },

  playTerminal() {
    this.playTone(1400, 0.02, 'sine', 0.02);
  },

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.14, 'sine', 0.03), idx * 80);
    });
  }
};

// --------------------------------------------------------------------------
// 3. CORTINA EDITORIAL DE TRANSIÇÃO DE PÁGINAS E SEÇÕES
// --------------------------------------------------------------------------
const PageTransition = {
  curtain: null,
  label: null,
  isAnimating: false,

  init() {
    this.curtain = document.getElementById('pageTransition');
    this.label = document.getElementById('transitionLabel');
    if (!this.curtain) return;

    // Intro reveal ao carregar a página
    this.curtain.classList.add('is-transitioning', 'is-active-in');
    setTimeout(() => {
      this.curtain.classList.remove('is-active-in');
      this.curtain.classList.add('is-active-out');
      setTimeout(() => {
        this.curtain.classList.remove('is-transitioning', 'is-active-out');
      }, 450);
    }, 280);

    // Intercepta todos os links âncora internos
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        if (hash && hash !== '#' && document.querySelector(hash)) {
          e.preventDefault();
          const cleanName = link.textContent.trim().replace(/^\d+\s*/, '') || hash.replace('#', '');
          this.navigate(hash, cleanName);
        }
      });
    });
  },

  navigate(targetHash, text = 'SEÇÃO') {
    const targetEl = document.querySelector(targetHash);
    if (!targetEl) return;

    if (this.isAnimating || !this.curtain) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    this.isAnimating = true;
    if (this.label) {
      this.label.textContent = `NAVEGANDO // ${text.toUpperCase()}`;
    }

    SoundEngine.playTone(600, 0.08, 'sine', 0.02);
    this.curtain.classList.add('is-transitioning', 'is-active-in');

    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        this.curtain.classList.remove('is-active-in');
        this.curtain.classList.add('is-active-out');
        setTimeout(() => {
          this.curtain.classList.remove('is-transitioning', 'is-active-out');
          this.isAnimating = false;
        }, 420);
      }, 160);
    }, 240);
  }
};

// --------------------------------------------------------------------------
// 4. MOTOR 3D INTERATIVO (THREE.JS ENGINE — ESFERA, PORTAL & TORUS KNOT)
// --------------------------------------------------------------------------
const ThreeEngine = {
  renderer: null,
  scene: null,
  camera: null,
  rootGroup: null,
  shapes: {},
  currentShapeName: 'sphere',
  animationId: null,
  isDragging: false,
  prevMouseX: 0,
  prevMouseY: 0,
  targetRotX: 0,
  targetRotY: 0,
  scrollRot: 0,

  init() {
    const canvas = document.getElementById('webglCanvas');
    const container = document.getElementById('webglContainer');
    if (!canvas || !container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 7.2;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    // Constrói os 3 modelos 3D
    this.buildSphere();
    this.buildPortal();
    this.buildTorus();

    this.switchShape('sphere');
    this.updateTheme(document.documentElement.getAttribute('data-theme') === 'dark');

    // Interação de Arraste / Rotação 360°
    container.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
      container.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.prevMouseX;
        const deltaY = e.clientY - this.prevMouseY;
        this.targetRotY += deltaX * 0.008;
        this.targetRotX += deltaY * 0.008;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      } else {
        const rect = container.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          this.targetRotY += (normX * 0.35 - this.rootGroup.rotation.y) * 0.02;
          this.targetRotX += (normY * 0.25 - this.rootGroup.rotation.x) * 0.02;
        }
      }
    });

    window.addEventListener('pointerup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        container.style.cursor = 'grab';
      }
    });

    // Reação sutil à rolagem da página
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const diff = scrollY - lastScrollY;
      this.scrollRot += diff * 0.003;
      lastScrollY = scrollY;
    }, { passive: true });

    // Redimensionamento responsivo
    window.addEventListener('resize', () => {
      if (!container || !this.camera || !this.renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    // Botões de seleção de geometria 3D
    const shapeBtns = document.querySelectorAll('.shape-btn');
    shapeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        shapeBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const shape = btn.getAttribute('data-shape');
        this.switchShape(shape);
        SoundEngine.playClick();
      });
    });

    this.animate();
  },

  buildSphere() {
    const group = new THREE.Group();

    // 1. Icosaedro wireframe multifacetado
    const icoGeo = new THREE.IcosahedronGeometry(2.1, 2);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xff4d00,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    group.add(icoMesh);
    group.userData.mainMesh = icoMesh;

    // 2. Nuvem de partículas esférica
    const particleCount = 380;
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.5 + Math.random() * 0.55;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x0f0f10,
      size: 0.05,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(partGeo, partMat);
    group.add(particles);
    group.userData.particles = particles;

    // 3. Anel orbital equatorial
    const ringGeo = new THREE.TorusGeometry(3.0, 0.02, 16, 90);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff4d00,
      transparent: true,
      opacity: 0.45
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    group.add(ring);
    group.userData.ring = ring;

    this.shapes['sphere'] = group;
  },

  buildPortal() {
    const group = new THREE.Group();

    // 3 Anéis concêntricos girando em eixos independentes
    const radii = [1.5, 2.15, 2.85];
    const rings = [];
    radii.forEach((r, idx) => {
      const geo = new THREE.TorusGeometry(r, 0.035, 16, 100);
      const mat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0xff4d00 : 0x0f0f10,
        wireframe: true,
        transparent: true,
        opacity: 0.9
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = (idx * Math.PI) / 3;
      mesh.rotation.y = (idx * Math.PI) / 4;
      group.add(mesh);
      rings.push(mesh);
    });
    group.userData.rings = rings;

    // Vórtice espiral de partículas no centro do portal
    const vortexCount = 420;
    const vPos = new Float32Array(vortexCount * 3);
    for (let i = 0; i < vortexCount; i++) {
      const angle = i * 0.12;
      const dist = (i / vortexCount) * 2.5;
      vPos[i * 3] = Math.cos(angle) * dist;
      vPos[i * 3 + 1] = Math.sin(angle) * dist;
      vPos[i * 3 + 2] = (Math.random() - 0.5) * 0.75;
    }
    const vGeo = new THREE.BufferGeometry();
    vGeo.setAttribute('position', new THREE.BufferAttribute(vPos, 3));
    const vMat = new THREE.PointsMaterial({
      color: 0xff4d00,
      size: 0.055,
      transparent: true,
      opacity: 0.85
    });
    const vPoints = new THREE.Points(vGeo, vMat);
    group.add(vPoints);
    group.userData.vortex = vPoints;

    this.shapes['portal'] = group;
  },

  buildTorus() {
    const group = new THREE.Group();

    // Nó toroidal matemático (Torus Knot)
    const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.42, 120, 16, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0xff4d00,
      wireframe: true,
      transparent: true,
      opacity: 0.88
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    group.add(knotMesh);
    group.userData.knot = knotMesh;

    // Halo de partículas em órbita
    const haloCount = 340;
    const hPos = new Float32Array(haloCount * 3);
    for (let i = 0; i < haloCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const rad = 2.3 + Math.random() * 0.75;
      hPos[i * 3] = Math.cos(a) * rad;
      hPos[i * 3 + 1] = Math.sin(a) * rad;
      hPos[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
    }
    const hGeo = new THREE.BufferGeometry();
    hGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
    const hMat = new THREE.PointsMaterial({
      color: 0x0f0f10,
      size: 0.045,
      transparent: true,
      opacity: 0.7
    });
    const halo = new THREE.Points(hGeo, hMat);
    group.add(halo);
    group.userData.halo = halo;

    this.shapes['torus'] = group;
  },

  switchShape(name) {
    if (!this.shapes[name] || !this.rootGroup) return;

    while (this.rootGroup.children.length > 0) {
      this.rootGroup.remove(this.rootGroup.children[0]);
    }

    this.currentShapeName = name;
    const newMesh = this.shapes[name];
    newMesh.scale.set(0.2, 0.2, 0.2);
    this.rootGroup.add(newMesh);

    // Transição elástica de escala ao trocar forma
    let scaleVal = 0.2;
    const popIn = () => {
      scaleVal += (1.0 - scaleVal) * 0.22;
      newMesh.scale.set(scaleVal, scaleVal, scaleVal);
      if (Math.abs(1.0 - scaleVal) > 0.01) {
        requestAnimationFrame(popIn);
      } else {
        newMesh.scale.set(1, 1, 1);
      }
    };
    popIn();

    const badge = document.getElementById('shapeBadge');
    if (badge) {
      const labels = {
        'sphere': 'ESFERA HOLOGRÁFICA',
        'portal': 'PORTAL ORBITAL',
        'torus': 'TORUS KNOT QUÂNTICO'
      };
      badge.textContent = labels[name] || name.toUpperCase();
    }
  },

  updateTheme(isDark) {
    const textColor = isDark ? 0xffffff : 0x0f0f10;
    const accentColor = 0xff4d00;

    if (this.shapes['sphere']) {
      const sp = this.shapes['sphere'];
      if (sp.userData.mainMesh) sp.userData.mainMesh.material.color.setHex(accentColor);
      if (sp.userData.particles) sp.userData.particles.material.color.setHex(textColor);
      if (sp.userData.ring) sp.userData.ring.material.color.setHex(accentColor);
    }

    if (this.shapes['portal']) {
      const pt = this.shapes['portal'];
      if (pt.userData.rings) {
        pt.userData.rings.forEach((ring, idx) => {
          ring.material.color.setHex(idx % 2 === 0 ? accentColor : textColor);
        });
      }
      if (pt.userData.vortex) pt.userData.vortex.material.color.setHex(accentColor);
    }

    if (this.shapes['torus']) {
      const tr = this.shapes['torus'];
      if (tr.userData.knot) tr.userData.knot.material.color.setHex(accentColor);
      if (tr.userData.halo) tr.userData.halo.material.color.setHex(textColor);
    }
  },

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.currentShapeName === 'sphere') {
      const sp = this.shapes['sphere'];
      if (sp) {
        if (sp.userData.mainMesh) {
          sp.userData.mainMesh.rotation.y += 0.005;
          sp.userData.mainMesh.rotation.x += 0.002;
        }
        if (sp.userData.particles) sp.userData.particles.rotation.y -= 0.003;
        if (sp.userData.ring) sp.userData.ring.rotation.z += 0.007;
      }
    } else if (this.currentShapeName === 'portal') {
      const pt = this.shapes['portal'];
      if (pt) {
        if (pt.userData.rings) {
          pt.userData.rings[0].rotation.z += 0.012;
          pt.userData.rings[1].rotation.x -= 0.009;
          pt.userData.rings[2].rotation.y += 0.007;
        }
        if (pt.userData.vortex) pt.userData.vortex.rotation.z -= 0.02;
      }
    } else if (this.currentShapeName === 'torus') {
      const tr = this.shapes['torus'];
      if (tr) {
        if (tr.userData.knot) {
          tr.userData.knot.rotation.x += 0.008;
          tr.userData.knot.rotation.y += 0.01;
        }
        if (tr.userData.halo) tr.userData.halo.rotation.z -= 0.004;
      }
    }

    if (this.rootGroup) {
      this.rootGroup.rotation.y += (this.targetRotY + this.scrollRot - this.rootGroup.rotation.y) * 0.06;
      this.rootGroup.rotation.x += (this.targetRotX - this.rootGroup.rotation.x) * 0.06;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
};

// --------------------------------------------------------------------------
// 5. MOTOR DE PARTÍCULAS / CONFETES (CANVAS PURO)
// --------------------------------------------------------------------------
const ConfettiEngine = {
  canvas: null,
  particles: [],
  running: false,

  init() {
    this.canvas = document.getElementById('fxCanvas');
    if (this.canvas) {
      window.addEventListener('resize', () => {
        if (this.canvas) {
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerHeight;
        }
      });
    }
  },

  blast(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
    if (!this.canvas) this.canvas = document.getElementById('fxCanvas');
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const ctx = this.canvas.getContext('2d');

    const colors = ['#ff4d00', '#0f0f10', '#ffffff', '#e6e5e0', '#ff8800'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    if (!this.running) {
      this.running = true;
      this.loop(ctx);
    }
  },

  loop(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = this.particles.filter((p) => p.alpha > 0);

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.rotation += p.rotSpeed;
      p.alpha -= p.decay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.loop(ctx));
    } else {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.running = false;
    }
  }
};

// --------------------------------------------------------------------------
// 6. EFEITO TEXT SCRAMBLE / DECODER HACKER EDITORIAL
// --------------------------------------------------------------------------
class TextScrambler {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 15);
      const end = start + Math.floor(Math.random() * 15);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color: var(--cor-destaque); opacity: 0.85;">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// --------------------------------------------------------------------------
// INICIALIZAÇÃO PRINCIPAL DO DOM
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

  // Inicializa motores de transição, Three.js e partículas
  PageTransition.init();
  ConfettiEngine.init();
  ThreeEngine.init();

  // Restaura preferência de som
  if (localStorage.getItem('yago_sfx') === '1') {
    SoundEngine.enabled = true;
    SoundEngine.updateUI();
  }

  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => SoundEngine.toggle());
  }

  const mobileSoundBtn = document.getElementById('mobileSoundBtn');
  if (mobileSoundBtn) {
    mobileSoundBtn.addEventListener('click', () => SoundEngine.toggle());
  }

  // --------------------------------------------------------------------------
  // 7. CURSOR PERSONALIZADO INTERATIVO (AWWWARDS TIER)
  // --------------------------------------------------------------------------
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const cursorLabel = document.querySelector('.cursor-label');

  if (cursor && cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    document.querySelectorAll('[data-cursor="hover"]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        SoundEngine.playHover();
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });

    document.querySelectorAll('[data-cursor="view"]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-view');
        if (cursorLabel) cursorLabel.textContent = 'VER';
        SoundEngine.playHover();
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-view');
        if (cursorLabel) cursorLabel.textContent = '';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. 3D TILT E SPOTLIGHT DINÂMICO NOS CARTÕES E PILARES
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.project-card, .pillar-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (window.matchMedia('(hover: hover)').matches && window.innerWidth > 768) {
        const xPercent = (x / rect.width) - 0.5;
        const yPercent = (y / rect.height) - 0.5;
        const rotX = (yPercent * -5).toFixed(2);
        const rotY = (xPercent * 5).toFixed(2);
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // --------------------------------------------------------------------------
  // 9. TEXT SCRAMBLE EM ELEMENTOS COM [data-scramble]
  // --------------------------------------------------------------------------
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    const originalText = el.getAttribute('data-scramble');
    const scrambler = new TextScrambler(el);
    scrambler.setText(originalText);

    el.addEventListener('mouseenter', () => {
      scrambler.setText(originalText);
    });
  });

  // --------------------------------------------------------------------------
  // 10. ALTERNADOR DE TEMA CLARO / ESCURO COM PERSISTÊNCIA & SOM
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  const currentTheme = localStorage.getItem('yago_theme') || 'light';
  htmlRoot.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active = htmlRoot.getAttribute('data-theme');
      const nextTheme = active === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', nextTheme);
      localStorage.setItem('yago_theme', nextTheme);
      SoundEngine.playTheme();
      ThreeEngine.updateTheme(nextTheme === 'dark');
    });
  }

  // --------------------------------------------------------------------------
  // 11. RELÓGIO AO VIVO DE SÃO PAULO [UTC-3]
  // --------------------------------------------------------------------------
  const heroLiveClock = document.getElementById('heroLiveClock');
  const mobileClock = document.getElementById('mobileClock');

  const updateClocks = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour12: false
    });
    if (heroLiveClock) {
      heroLiveClock.textContent = `SÃO PAULO [UTC-3] ${timeString}`;
    }
    if (mobileClock) {
      mobileClock.textContent = timeString;
    }
  };
  setInterval(updateClocks, 1000);
  updateClocks();

  // --------------------------------------------------------------------------
  // 12. CABEÇALHO DINÂMICO & BARRA DE PROGRESSO DE ROLAGEM
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const scrollProgressBar = document.getElementById('scrollProgress');
  const backToTopBtn = document.getElementById('backToTop');
  const progressRingCircle = document.getElementById('progressRingCircle');
  const circumference = 2 * Math.PI * 20;

  if (progressRingCircle) {
    progressRingCircle.style.strokeDasharray = `${circumference}`;
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) : 0;

    if (siteHeader) {
      if (scrollY > 40) siteHeader.classList.add('is-scrolled');
      else siteHeader.classList.remove('is-scrolled');
    }

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress * 100}%`;
    }

    if (backToTopBtn) {
      if (scrollY > 350) backToTopBtn.classList.add('is-visible');
      else backToTopBtn.classList.remove('is-visible');
    }

    if (progressRingCircle) {
      const offset = circumference - (progress * circumference);
      progressRingCircle.style.strokeDashoffset = offset;
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 13. MENU MOBILE DRAWER
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      SoundEngine.playClick();
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 14. FILTROS DA GALERIA DE PROJETOS
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      SoundEngine.playClick();
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = card.classList.contains('is-featured') && filterValue === 'all' ? 'grid' : 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 15. MODAL DE DETALHES DE PROJETO & SANDBOX DE API INTERATIVO
  // --------------------------------------------------------------------------
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalInnerCloseBtn = document.getElementById('modalInnerCloseBtn');
  const modalApiSandbox = document.getElementById('modalApiSandbox');

  const openProjectModal = (projectId) => {
    const project = PORTFOLIO_CONFIG.projetos[projectId];
    if (!project || !projectModal) return;

    SoundEngine.playClick();

    document.getElementById('modalProjectCategory').textContent = project.categoria;
    document.getElementById('modalProjectImage').src = project.imagem;
    document.getElementById('modalProjectImage').alt = project.nome;
    document.getElementById('modalImageBadge').textContent = `PROJETO #${project.numero} // ${project.nome}`;
    document.getElementById('modalProjectTitle').textContent = project.nome;
    document.getElementById('modalProjectTagline').textContent = project.tagline;

    // Tech Stack
    const stackContainer = document.getElementById('modalProjectStack');
    stackContainer.innerHTML = '';
    project.stack.forEach((tech) => {
      const pill = document.createElement('span');
      pill.className = 'badge-pill accent';
      pill.style.cssText = 'background-color: var(--cor-destaque-suave); color: var(--cor-destaque); border-color: rgba(255, 77, 0, 0.2);';
      pill.textContent = tech;
      stackContainer.appendChild(pill);
    });

    document.getElementById('modalProjectProblem').textContent = project.problema;
    document.getElementById('modalProjectSolution').textContent = project.solucao;

    // Arquitetura List
    const archContainer = document.getElementById('modalProjectArchitecture');
    archContainer.innerHTML = '';
    project.arquitetura.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      archContainer.appendChild(li);
    });

    document.getElementById('modalProjectContext').textContent = project.contexto;

    // Sandbox Interativo da API de Cachorros
    if (modalApiSandbox) {
      if (projectId === 'api-cachorros') {
        modalApiSandbox.style.display = 'block';
      } else {
        modalApiSandbox.style.display = 'none';
      }
    }

    // Abre Modal
    projectModal.classList.add('is-active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    SoundEngine.playClick();
    projectModal.classList.remove('is-active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  };

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-id');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalInnerCloseBtn) modalInnerCloseBtn.addEventListener('click', closeProjectModal);

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // Sandbox Interativo de rotas da API
  const sandboxRouteBtns = document.querySelectorAll('.sandbox-route-btn');
  const sandboxResponse = document.getElementById('sandboxResponse');
  const sandboxLatency = document.getElementById('sandboxLatency');

  const mockApiResponses = {
    'breeds': {
      status: 200,
      mensagem: "Consulta estruturada realizada com sucesso",
      data: [
        { id: 1, raca: "Vira-lata Caramelo", porte: "Médio", energia: "Alta" },
        { id: 2, raca: "Pastor Alemão", porte: "Grande", energia: "Alta" },
        { id: 3, raca: "Golden Retriever", porte: "Grande", energia: "Média" }
      ],
      total: 3,
      fonte: "SQLite + SQLAlchemy (Yago Araujo)"
    },
    'caramelo': {
      status: 200,
      mensagem: "Registro canino detalhado encontrado",
      data: {
        id: 1,
        raca: "Vira-lata Caramelo",
        porte: "Médio",
        origem: "Brasil",
        temperamento: ["Amigável", "Inteligente", "Resiliente"],
        popularidade: "100%",
        cuidados: "Amor, vacinação e passeios regulares"
      },
      fonte: "SQLite Database — Yago Araujo"
    },
    'stats': {
      status: 200,
      mensagem: "Métricas de desempenho da API canina",
      data: {
        throughput: "450 req/min (simulado)",
        tempo_resposta_medio: "12ms",
        status_servidor: "ONLINE",
        framework: "Python / Flask",
        banco: "SQLite Relacional",
        ambiente: "Laboratório 2º Ano Técnico"
      }
    }
  };

  sandboxRouteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sandboxRouteBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const routeKey = btn.getAttribute('data-route');
      const randomLatency = Math.floor(Math.random() * 8) + 10;
      if (sandboxLatency) sandboxLatency.textContent = `LATÊNCIA: ${randomLatency}ms`;
      SoundEngine.playTone(900, 0.04, 'sine', 0.02);

      if (sandboxResponse && mockApiResponses[routeKey]) {
        sandboxResponse.textContent = JSON.stringify(mockApiResponses[routeKey], null, 2);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 16. TERMINAL INTERATIVO YAGO.EXE AVANÇADO
  // --------------------------------------------------------------------------
  const terminalBody = document.getElementById('terminalBody');
  const terminalInput = document.getElementById('terminalInput');
  const terminalSubmit = document.getElementById('terminalSubmit');
  const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

  const cmdHistory = [];
  let historyIndex = -1;
  const availableCommands = [
    'help', 'skills', 'projetos', 'bio', 'contato', 'status',
    'dogapi', 'neofetch', 'matrix', 'clear', 'theme', 'sound', 'curriculo',
    'portal', 'sphere', 'torus', '3d'
  ];

  const executeCommand = (cmdText) => {
    const raw = cmdText.trim().toLowerCase();
    if (!raw) return;

    SoundEngine.playTerminal();
    cmdHistory.push(raw);
    historyIndex = -1;

    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line cmd-echo';
    echoLine.textContent = `yago@andrade:~$ ${raw}`;
    terminalBody.appendChild(echoLine);

    const outLine = document.createElement('div');
    outLine.className = 'terminal-line output-line';

    switch (raw) {
      case 'help':
        outLine.innerHTML = `
          Comandos disponíveis:<br>
          &nbsp;&nbsp;<span class="term-hl">skills</span> &nbsp;&nbsp;&nbsp;&nbsp;— Principais linguagens e competências<br>
          &nbsp;&nbsp;<span class="term-hl">projetos</span> &nbsp;&nbsp;— Lista dos 3 cases em destaque<br>
          &nbsp;&nbsp;<span class="term-hl">dogapi</span> &nbsp;&nbsp;&nbsp;&nbsp;— Teste rápido de endpoint simulado<br>
          &nbsp;&nbsp;<span class="term-hl">neofetch</span> &nbsp;&nbsp;— Especificações técnicas do desenvolvedor<br>
          &nbsp;&nbsp;<span class="term-hl">matrix</span> &nbsp;&nbsp;&nbsp;&nbsp;— Cascata de código no terminal<br>
          &nbsp;&nbsp;<span class="term-hl">portal</span> &nbsp;&nbsp;&nbsp;&nbsp;— Ativar Portal Orbital 3D (Three.js)<br>
          &nbsp;&nbsp;<span class="term-hl">sphere</span> &nbsp;&nbsp;&nbsp;&nbsp;— Ativar Esfera Holográfica 3D<br>
          &nbsp;&nbsp;<span class="term-hl">torus</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Ativar Torus Knot Quântico 3D<br>
          &nbsp;&nbsp;<span class="term-hl">bio</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Trajetória do estudante<br>
          &nbsp;&nbsp;<span class="term-hl">curriculo</span> — Resumo de formação e competências<br>
          &nbsp;&nbsp;<span class="term-hl">contato</span> &nbsp;&nbsp;— Canais de comunicação disponíveis<br>
          &nbsp;&nbsp;<span class="term-hl">theme</span> &nbsp;&nbsp;&nbsp;&nbsp;— Alternar tema claro/escuro<br>
          &nbsp;&nbsp;<span class="term-hl">sound</span> &nbsp;&nbsp;&nbsp;&nbsp;— Alternar efeitos sonoros SFX<br>
          &nbsp;&nbsp;<span class="term-hl">status</span> &nbsp;&nbsp;&nbsp;— Situação acadêmica atual<br>
          &nbsp;&nbsp;<span class="term-hl">clear</span> &nbsp;&nbsp;&nbsp;&nbsp;— Limpar o console
        `;
        break;

      case 'skills':
        outLine.innerHTML = `
          <strong>[FRONTEND]:</strong> HTML5 Semântico, CSS3 Moderno, JavaScript ES6+, UI Editorial<br>
          <strong>[BACKEND]:</strong> Python, Flask, SQLite, SQLAlchemy, RESTful APIs, JSON<br>
          <strong>[3D & INTERATIVIDADE]:</strong> Three.js, WebGL Shaders básicos, Web Audio API<br>
          <strong>[METODOLOGIA]:</strong> Git, GitHub, Clean Code, Lógica de Algoritmos
        `;
        break;

      case 'projetos':
        outLine.innerHTML = `
          1. <strong>ReaderIA</strong> — Conceito de IA e OCR para interpretar erros de código.<br>
          2. <strong>API de Cachorros</strong> — Backend Flask + SQLite com rotas e filtros.<br>
          3. <strong>Game Store</strong> — Interface web e-commerce com design contemporâneo.
        `;
        break;

      case 'portal':
        ThreeEngine.switchShape('portal');
        document.querySelectorAll('.shape-btn').forEach(b => b.classList.toggle('is-active', b.getAttribute('data-shape') === 'portal'));
        outLine.innerHTML = `[THREE.JS]: Portal Orbital ativado no showcase 3D do topo.`;
        break;

      case 'sphere':
      case 'esfera':
        ThreeEngine.switchShape('sphere');
        document.querySelectorAll('.shape-btn').forEach(b => b.classList.toggle('is-active', b.getAttribute('data-shape') === 'sphere'));
        outLine.innerHTML = `[THREE.JS]: Esfera Holográfica ativada no showcase 3D do topo.`;
        break;

      case 'torus':
        ThreeEngine.switchShape('torus');
        document.querySelectorAll('.shape-btn').forEach(b => b.classList.toggle('is-active', b.getAttribute('data-shape') === 'torus'));
        outLine.innerHTML = `[THREE.JS]: Torus Knot Quântico ativado no showcase 3D do topo.`;
        break;

      case '3d':
        outLine.innerHTML = `
          [NÚCLEO 3D THREE.JS]:<br>
          Objeto ativo: <strong>${ThreeEngine.currentShapeName.toUpperCase()}</strong><br>
          Comandos: <code>portal</code>, <code>sphere</code>, <code>torus</code>.<br>
          O objeto reage a arraste de cursor, clique e rolagem da página.
        `;
        break;

      case 'dogapi':
        outLine.innerHTML = `
          [API REQUEST]: GET /api/v1/breeds/caramelo HTTP/1.1<br>
          <span style="color: #10b981; font-weight: bold;">[200 OK] — 12ms — application/json</span><br>
          <pre style="margin-top: 0.5rem; color: #ff8800; font-family: var(--fonte-mono); font-size: 0.8rem;">{
  "raca": "Vira-lata Caramelo",
  "porte": "Médio",
  "origem": "Brasil",
  "temperamento": ["Amigável", "Inteligente", "Resiliente"],
  "banco": "SQLite / SQLAlchemy (Yago Araujo)"
}</pre>
        `;
        break;

      case 'neofetch':
      case 'specs':
        outLine.innerHTML = `
          <div class="terminal-ascii-art">
   __  __ ___   ____  ____    _______  ________
  / / / //   | / __ \\/ __ \\  / ____/ |/ / ____/
 / /_/ // /| |/ /_/ / / / / / __/  |   / __/   
 \\__, // ___ / ____/ /_/ / / /___ /   / /___   
/_/  /_/  |_/_/    \\____(_)_____//_/|_/_____/  
          </div>
          <table class="specs-table">
            <tr><td class="specs-key">DESENVOLVEDOR:</td><td class="specs-val">Yago Araujo Andrade</td></tr>
            <tr><td class="specs-key">FORMAÇÃO:</td><td class="specs-val">2º Ano do Técnico em Informática Integrado</td></tr>
            <tr><td class="specs-key">STACK PRINCIPAL:</td><td class="specs-val">HTML5, CSS3 Puro, JavaScript ES6+, Python, Flask, SQLite</td></tr>
            <tr><td class="specs-key">ENGINE 3D:</td><td class="specs-val">Three.js Local (WebGL Renderer)</td></tr>
            <tr><td class="specs-key">FRAMEWORKS:</td><td class="specs-val">0% Frameworks (Pure Vanilla Code)</td></tr>
            <tr><td class="specs-key">DESIGN SYSTEM:</td><td class="specs-val">Editorial Awwwards Market Inspired</td></tr>
            <tr><td class="specs-key">DISPONIBILIDADE:</td><td class="specs-val">Estágio & Projetos Práticos</td></tr>
          </table>
        `;
        break;

      case 'matrix':
        terminalBody.classList.add('is-matrix');
        outLine.innerHTML = `[MATRIX PROTOCOL]: Conexão neural ativada. Injetando fluxo de dados...`;
        SoundEngine.playTone(320, 0.35, 'sawtooth', 0.04);
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            const mLine = document.createElement('div');
            mLine.className = 'terminal-line';
            mLine.textContent = `01001001 01001110 01000110 01001111 01010010 01001101 01000001 01010100 01001001 01000011 01000001 [OK]`;
            terminalBody.appendChild(mLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
          }, (i + 1) * 250);
        }
        setTimeout(() => {
          terminalBody.classList.remove('is-matrix');
        }, 2500);
        break;

      case 'bio':
        outLine.innerHTML = `
          Yago Araujo Andrade, estudante do 2º ano do Ensino Médio integrado ao Técnico em Informática. Apaixonado por desenvolvimento limpo, arquitetura de sistemas e novas tecnologias.
        `;
        break;

      case 'curriculo':
        outLine.innerHTML = `
          <strong>FORMAÇÃO:</strong> 2º Ano do Ensino Médio Integrado ao Técnico em Informática.<br>
          <strong>COMPETÊNCIAS:</strong> Lógica de programação, modelagem relacional SQL, APIs RESTful com Python/Flask, desenvolvimento web front-end semântico com HTML/CSS/JS puros e Three.js.<br>
          <strong>OBJETIVO:</strong> Oportunidade de estágio para aplicar e expandir os conhecimentos práticos.
        `;
        break;

      case 'contato':
        outLine.innerHTML = `
          E-mail: ${PORTFOLIO_CONFIG.email}<br>
          GitHub: ${PORTFOLIO_CONFIG.github}<br>
          LinkedIn: ${PORTFOLIO_CONFIG.linkedin}
        `;
        break;

      case 'theme':
        if (themeToggle) themeToggle.click();
        outLine.innerHTML = `[SISTEMA]: Alternância de tema disparada.`;
        break;

      case 'sound':
        SoundEngine.toggle();
        outLine.innerHTML = `[SISTEMA]: Efeitos sonoros ${SoundEngine.enabled ? 'LIGADOS' : 'DESLIGADOS'}.`;
        break;

      case 'status':
        outLine.innerHTML = `
          [STATUS]: Disponível para estágios, iniciação prática e projetos acadêmicos.
        `;
        break;

      case 'easteregg':
        outLine.innerHTML = `
          🎉 <strong style="color: var(--cor-destaque);">[EASTER EGG DESBLOQUEADO]:</strong><br>
          Você é um desenvolvedor que ama explorar! Obrigado por conferir este portfólio 100% autoral.<br>
          <em>"A curiosidade prática transforma teoria em código de verdade." — Yago</em>
        `;
        break;

      case 'clear':
        terminalBody.innerHTML = `
          <div class="terminal-line system-line">[SISTEMA]: Console limpo. Digite <span class="term-hl">help</span> para comandos.</div>
        `;
        terminalInput.value = '';
        return;

      default:
        outLine.innerHTML = `Comando não reconhecido: "${raw}". Digite <span class="term-hl">help</span> para ver as opções.`;
        break;
    }

    terminalBody.appendChild(outLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    terminalInput.value = '';
  };

  if (terminalSubmit && terminalInput) {
    terminalSubmit.addEventListener('click', () => executeCommand(terminalInput.value));
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(terminalInput.value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
          historyIndex++;
          terminalInput.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
        } else if (historyIndex === 0) {
          historyIndex = -1;
          terminalInput.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const val = terminalInput.value.trim().toLowerCase();
        const match = availableCommands.find(c => c.startsWith(val));
        if (match) terminalInput.value = match;
      }
    });
  }

  quickCmdBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  // --------------------------------------------------------------------------
  // 17. COMMAND PALETTE (HUD DE COMANDOS RÁPIDOS - CTRL+K / ⌘K)
  // --------------------------------------------------------------------------
  const commandPalette = document.getElementById('commandPalette');
  const cmdPaletteInput = document.getElementById('cmdPaletteInput');
  const cmdPaletteResults = document.getElementById('cmdPaletteResults');
  const commandPaletteBtn = document.getElementById('commandPaletteBtn');
  const heroCmdPill = document.getElementById('heroCmdPill');
  const mobileCmdBtn = document.getElementById('mobileCmdBtn');

  const paletteActions = [
    { id: 'sobre', group: 'Navegação', title: 'Sobre mim', desc: 'Trajetória autêntica do 2º ano técnico', icon: '01', action: () => PageTransition.navigate('#sobre', 'Sobre mim') },
    { id: 'projetos', group: 'Navegação', title: 'Projetos em Destaque', desc: 'Explorar galeria de cases autorais', icon: '02', action: () => PageTransition.navigate('#projetos', 'Projetos') },
    { id: 'terminal', group: 'Navegação', title: 'Terminal Interativo', desc: 'Abrir o console YAGO.EXE CLI', icon: '03', action: () => PageTransition.navigate('#terminal', 'Terminal') },
    { id: 'contato', group: 'Navegação', title: 'Canais de Contato', desc: 'Mensagem, e-mail e redes sociais', icon: '04', action: () => PageTransition.navigate('#contato', 'Contato') },
    { id: 'case-readeria', group: 'Projetos', title: 'Abrir Case: ReaderIA', desc: 'IA generativa e OCR para stack traces', icon: '✦', action: () => openProjectModal('readeria') },
    { id: 'case-cachorros', group: 'Projetos', title: 'Abrir Case: API de Cachorros', desc: 'Backend Flask, SQLite e SQLAlchemy com Sandbox', icon: '✦', action: () => openProjectModal('api-cachorros') },
    { id: 'case-game', group: 'Projetos', title: 'Abrir Case: Game Store', desc: 'E-commerce contemporâneo e responsivo', icon: '✦', action: () => openProjectModal('game-store') },
    { id: '3d-portal', group: 'Visual 3D', title: 'Ativar 3D: Portal Orbital', desc: 'Conectar anéis cósmicos e partículas', icon: '🪐', action: () => { ThreeEngine.switchShape('portal'); PageTransition.navigate('#hero3DWrapper', 'Portal 3D'); } },
    { id: '3d-sphere', group: 'Visual 3D', title: 'Ativar 3D: Esfera Holográfica', desc: 'Icosaedro wireframe multifacetado', icon: '🌐', action: () => { ThreeEngine.switchShape('sphere'); PageTransition.navigate('#hero3DWrapper', 'Esfera 3D'); } },
    { id: '3d-torus', group: 'Visual 3D', title: 'Ativar 3D: Torus Knot Quântico', desc: 'Geometria matemática entrelaçada', icon: '♾️', action: () => { ThreeEngine.switchShape('torus'); PageTransition.navigate('#hero3DWrapper', 'Torus Knot'); } },
    { id: 'theme', group: 'Sistema', title: 'Alternar Tema', desc: 'Alternar entre Modo Claro e Dark Editorial', icon: '◐', action: () => themeToggle && themeToggle.click() },
    { id: 'sound', group: 'Sistema', title: 'Alternar Efeitos Sonoros (SFX)', desc: 'Ligar ou desligar sintetizador sonoro da UI', icon: '♬', action: () => SoundEngine.toggle() },
    { id: 'email', group: 'Ações Rápidas', title: 'Copiar E-mail Profissional', desc: PORTFOLIO_CONFIG.email, icon: '✉', action: () => copyEmailBtn && copyEmailBtn.click() },
    { id: 'matrix', group: 'Terminal', title: 'Modo Matrix', desc: 'Executar cascata de código no terminal', icon: '⌘', action: () => { PageTransition.navigate('#terminal', 'Terminal'); executeCommand('matrix'); } },
    { id: 'neofetch', group: 'Terminal', title: 'Specs do Desenvolvedor (Neofetch)', desc: 'Exibir especificações técnicas em ASCII', icon: '⚙', action: () => { PageTransition.navigate('#terminal', 'Terminal'); executeCommand('neofetch'); } },
    { id: 'sandbox', group: 'Projetos', title: 'Testador de Endpoints da API', desc: 'Abrir simulador interativo de rotas da API canina', icon: '⚡', action: () => { openProjectModal('api-cachorros'); } }
  ];

  let selectedIndex = 0;
  let filteredActions = [...paletteActions];

  const renderPaletteResults = () => {
    if (!cmdPaletteResults) return;
    cmdPaletteResults.innerHTML = '';
    if (filteredActions.length === 0) {
      cmdPaletteResults.innerHTML = '<div class="cmd-empty-state">Nenhum resultado encontrado para o termo.</div>';
      return;
    }

    const groups = {};
    filteredActions.forEach((item) => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });

    let currentFlatIdx = 0;
    Object.keys(groups).forEach((groupName) => {
      const groupEl = document.createElement('div');
      groupEl.className = 'cmd-category-group';
      groupEl.innerHTML = `<div class="cmd-category-title">${groupName}</div>`;

      groups[groupName].forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = `cmd-item ${currentFlatIdx === selectedIndex ? 'is-selected' : ''}`;
        itemEl.innerHTML = `
          <div class="cmd-item-left">
            <span class="cmd-item-icon">${item.icon}</span>
            <div>
              <div class="cmd-item-name">${item.title}</div>
              <div class="cmd-item-desc">${item.desc}</div>
            </div>
          </div>
          <span class="cmd-item-badge">ENTER</span>
        `;
        itemEl.addEventListener('click', () => {
          SoundEngine.playClick();
          closePalette();
          item.action();
        });
        groupEl.appendChild(itemEl);
        currentFlatIdx++;
      });
      cmdPaletteResults.appendChild(groupEl);
    });
  };

  const openPalette = () => {
    if (!commandPalette) return;
    SoundEngine.playHover();
    commandPalette.classList.add('is-active');
    commandPalette.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (cmdPaletteInput) cmdPaletteInput.value = '';
    filteredActions = [...paletteActions];
    selectedIndex = 0;
    renderPaletteResults();
    setTimeout(() => cmdPaletteInput && cmdPaletteInput.focus(), 60);
  };

  const closePalette = () => {
    if (!commandPalette) return;
    commandPalette.classList.remove('is-active');
    commandPalette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  };

  if (cmdPaletteInput) {
    cmdPaletteInput.addEventListener('input', () => {
      const q = cmdPaletteInput.value.trim().toLowerCase();
      filteredActions = paletteActions.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q)
      );
      selectedIndex = 0;
      renderPaletteResults();
    });

    cmdPaletteInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        SoundEngine.playTone(850, 0.02, 'sine', 0.01);
        selectedIndex = (selectedIndex + 1) % filteredActions.length;
        renderPaletteResults();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        SoundEngine.playTone(850, 0.02, 'sine', 0.01);
        selectedIndex = (selectedIndex - 1 + filteredActions.length) % filteredActions.length;
        renderPaletteResults();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          SoundEngine.playClick();
          closePalette();
          filteredActions[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        closePalette();
      }
    });
  }

  if (commandPaletteBtn) commandPaletteBtn.addEventListener('click', openPalette);
  if (heroCmdPill) heroCmdPill.addEventListener('click', openPalette);
  if (mobileCmdBtn) {
    mobileCmdBtn.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('is-open');
      openPalette();
    });
  }

  if (commandPalette) {
    commandPalette.addEventListener('click', (e) => {
      if (e.target === commandPalette) closePalette();
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (commandPalette && commandPalette.classList.contains('is-active')) closePalette();
      else openPalette();
    } else if (e.key === 'Escape') {
      if (commandPalette && commandPalette.classList.contains('is-active')) closePalette();
      if (projectModal && projectModal.classList.contains('is-active')) closeProjectModal();
    }
  });

  // --------------------------------------------------------------------------
  // 18. EASTER EGG DO KONAMI CODE (↑ ↑ ↓ ↓ ← → ← → B A)
  // --------------------------------------------------------------------------
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiPosition = 0;

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === konamiSequence[konamiPosition].toLowerCase()) {
      konamiPosition++;
      if (konamiPosition === konamiSequence.length) {
        konamiPosition = 0;
        ConfettiEngine.blast();
        SoundEngine.playSuccess();
        PageTransition.navigate('#terminal', 'Terminal');
        executeCommand('easteregg');
      }
    } else {
      konamiPosition = 0;
    }
  });

  // --------------------------------------------------------------------------
  // 19. COPIAR E-MAIL COM FEEDBACK INSTANTÂNEO & SOM
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      navigator.clipboard.writeText(PORTFOLIO_CONFIG.email).then(() => {
        const idle = copyEmailBtn.querySelector('.copy-idle');
        const success = copyEmailBtn.querySelector('.copy-success');

        if (idle && success) {
          idle.style.display = 'none';
          success.style.display = 'inline-flex';
          setTimeout(() => {
            idle.style.display = 'inline-flex';
            success.style.display = 'none';
          }, 2500);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 20. FORMULÁRIO DE CONTATO DIRETO COM EXPLOSÃO DE CELEBRAÇÃO
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  if (contactForm && formSuccessMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      SoundEngine.playSuccess();
      ConfettiEngine.blast(window.innerWidth / 2, window.innerHeight / 2);

      contactForm.style.display = 'none';
      formSuccessMessage.style.display = 'flex';

      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = 'flex';
        formSuccessMessage.style.display = 'none';
      }, 6000);
    });
  }

  // --------------------------------------------------------------------------
  // 21. MONITOR DE FPS & PERFORMANCE NO FOOTER HUD
  // --------------------------------------------------------------------------
  const fpsMeter = document.getElementById('fpsMeter');
  let frameCount = 0;
  let lastFpsTime = performance.now();

  const fpsTicker = (now) => {
    frameCount++;
    if (now - lastFpsTime >= 500) {
      const fps = Math.round((frameCount * 1000) / (now - lastFpsTime));
      if (fpsMeter) fpsMeter.textContent = Math.min(60, fps);
      frameCount = 0;
      lastFpsTime = now;
    }
    requestAnimationFrame(fpsTicker);
  };
  requestAnimationFrame(fpsTicker);

  // --------------------------------------------------------------------------
  // 22. ANO ATUAL NO RODAPÉ
  // --------------------------------------------------------------------------
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
