/* ============================================================
   YONATHAN SETIAWAN — PORTFOLIO SCRIPT
   Features: Particles · Typewriter · Terminal · Radar Chart
             Market Widget · 3D Tilt · Scroll Reveal · Konami
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll progress bar ──────────────────────────────────
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.transform = `scaleX(${Math.min(p, 1)})`;
  }, { passive: true });


  // ── Mobile menu ──────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('hidden') === false;
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });


  // ── Smooth scroll with nav offset ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar').offsetHeight + 8;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navH, behavior: 'smooth' });
    });
  });


  // ── Active nav on scroll ─────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const getNavH   = () => document.getElementById('navbar').offsetHeight + 20;

  function updateActiveNav() {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - getNavH()) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active-nav', l.getAttribute('href') === `#${current}`));
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });


  // ── Navbar shadow ────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10 ? '0 4px 32px rgba(0,0,0,0.5)' : 'none';
  }, { passive: true });


  // ── Scroll Reveal (IntersectionObserver) ─────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));


  // ── Stat counters ────────────────────────────────────────
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.target;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur;
        if (cur >= target) clearInterval(timer);
      }, 18);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.count').forEach(el => countObs.observe(el));


  // ── 3D Card Tilt (desktop only) ──────────────────────────
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.01)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }


  // ── Hero Particle Network ────────────────────────────────
  initParticles();

  function initParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    const N        = isMobile ? 35 : 75;
    const MAX_DIST = isMobile ? 90 : 130;
    const dpr      = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, particles;
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width  = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      particles = Array.from({ length: N }, () => createParticle(W, H));
    }

    function createParticle(w, h) {
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.8,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Update
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        // Mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 80) { p.vx += dx / d * 0.3; p.vy += dy / d * 0.3; }
        // Speed cap
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 1.5) { p.vx /= spd; p.vy /= spd; }
      });

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(14,165,233,${alpha})`;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }

      // Dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14,165,233,0.55)';
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); }, { passive: true });
    canvas.closest('#hero').addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.closest('#hero').addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    resize();
    draw();
  }


  // ── Typewriter ───────────────────────────────────────────
  const phrases = [
    'trading infrastructure.',
    'AI systems.',
    'quant solutions.',
    'real-time platforms.',
    'Bloomberg pipelines.',
    'things that scale.',
  ];
  const twEl = document.getElementById('typewriterText');
  if (twEl) {
    let pi = 0, ci = 0, deleting = false;
    function tick() {
      const full = phrases[pi];
      if (deleting) {
        ci--;
      } else {
        ci++;
      }
      twEl.textContent = full.slice(0, ci);
      let delay = deleting ? 35 : 75;
      if (!deleting && ci === full.length)      { delay = 2200; deleting = true; }
      else if (deleting && ci === 0)             { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
      setTimeout(tick, delay);
    }
    tick();
  }


  // ── Fake Market Widget ───────────────────────────────────
  const TICKERS = [
    { sym: 'SPX',     base: 5842,    dec: 2, suffix: '' },
    { sym: 'BTC/USD', base: 94215,   dec: 0, suffix: '' },
    { sym: 'EUR/USD', base: 1.0847,  dec: 4, suffix: '' },
    { sym: 'BUND 10Y',base: 2.341,   dec: 3, suffix: '%' },
    { sym: 'WTI',     base: 78.42,   dec: 2, suffix: '' },
  ];

  const marketRows = document.getElementById('marketRows');
  if (marketRows) {
    const state = TICKERS.map(t => ({ ...t, val: t.base, chg: 0, hist: Array(20).fill(50) }));
    const canvases = [];

    state.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'market-row';
      const spark = document.createElement('canvas');
      spark.width = 60; spark.height = 20;
      spark.className = 'market-spark';
      row.innerHTML = `<span class="market-sym">${t.sym}</span>`;
      row.appendChild(spark);
      const chgEl = document.createElement('span');
      chgEl.className = 'market-chg up';
      chgEl.id = `mchg-${i}`;
      row.appendChild(chgEl);
      marketRows.appendChild(row);
      canvases.push(spark);
    });

    function drawSpark(canvas, hist, isUp) {
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      const step = w / (hist.length - 1);
      hist.forEach((v, i) => {
        const x = i * step;
        const y = h - (v / 100) * h;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = isUp ? '#10B981' : '#EF4444';
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    function updateMarket() {
      state.forEach((t, i) => {
        const change = (Math.random() - 0.49) * t.base * 0.002;
        t.val = Math.max(t.base * 0.8, t.val + change);
        t.chg += change;
        const pct  = ((t.val - t.base) / t.base * 100).toFixed(2);
        const isUp = t.chg >= 0;
        const chgEl = document.getElementById(`mchg-${i}`);
        if (chgEl) {
          chgEl.textContent = `${isUp ? '+' : ''}${pct}%`;
          chgEl.className = `market-chg ${isUp ? 'up' : 'dn'}`;
        }
        const h = Math.max(10, Math.min(90, 50 + (t.val - t.base) / t.base * 100));
        t.hist.push(h); t.hist.shift();
        drawSpark(canvases[i], t.hist, isUp);
      });
    }

    updateMarket();
    setInterval(updateMarket, 2800);
  }


  // ── Radar Chart ─────────────────────────────────────────
  initRadar();

  function initRadar() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const labels = ['Languages','App Dev','DevOps','AI / ML','Quant','Data'];
    const scores = [0.95, 0.92, 0.88, 0.87, 0.90, 0.91];
    const N = labels.length;
    let progress = 0, animating = false;

    const radarObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !animating) {
          animating = true;
          animate();
          radarObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    radarObs.observe(canvas);

    function animate() {
      progress += 0.025;
      drawRadar(Math.min(progress, 1));
      if (progress < 1) requestAnimationFrame(animate);
    }

    function drawRadar(t) {
      const size   = Math.min(canvas.width, canvas.height);
      const cx     = canvas.width  / 2;
      const cy     = canvas.height / 2;
      const maxR   = size * 0.36;
      const eased  = easeInOut(t);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.1);
      grd.addColorStop(0, 'rgba(14,165,233,0.04)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid rings
      [0.33, 0.66, 1].forEach(frac => {
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const angle = (Math.PI * 2 / N) * i - Math.PI / 2;
          const r = maxR * frac;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = frac === 1 ? 'rgba(30,41,59,0.9)' : 'rgba(30,41,59,0.5)';
        ctx.lineWidth = frac === 1 ? 1 : 0.6;
        ctx.stroke();
      });

      // Axes
      for (let i = 0; i < N; i++) {
        const angle = (Math.PI * 2 / N) * i - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
        ctx.strokeStyle = 'rgba(30,41,59,0.7)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Data polygon (animated)
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const angle = (Math.PI * 2 / N) * i - Math.PI / 2;
        const r = maxR * scores[i] * eased;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle   = 'rgba(14,165,233,0.12)';
      ctx.strokeStyle = 'rgba(14,165,233,0.8)';
      ctx.lineWidth   = 1.8;
      ctx.fill();
      ctx.stroke();

      // Data points
      for (let i = 0; i < N; i++) {
        const angle = (Math.PI * 2 / N) * i - Math.PI / 2;
        const r = maxR * scores[i] * eased;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0EA5E9';
        ctx.fill();
        ctx.strokeStyle = '#080B14';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Labels
      ctx.font = `600 11px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < N; i++) {
        const angle = (Math.PI * 2 / N) * i - Math.PI / 2;
        const r = maxR * 1.22;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        ctx.fillStyle = `rgba(148,163,184,${eased})`;
        ctx.fillText(labels[i], x, y);
        // Score
        ctx.font = `700 10px 'JetBrains Mono', monospace`;
        ctx.fillStyle = `rgba(14,165,233,${eased})`;
        ctx.fillText(`${Math.round(scores[i] * 100)}%`, x, y + 14);
        ctx.font = `600 11px 'Inter', sans-serif`;
      }
    }

    function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    // Draw static frame initially
    drawRadar(0);
  }


  // ── Skill Tabs ───────────────────────────────────────────
  document.querySelectorAll('.skill-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.skill-tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.stag').forEach(tag => {
        tag.classList.toggle('hidden', cat !== 'all' && tag.dataset.cat !== cat);
      });
    });
  });


  // ── Terminal ─────────────────────────────────────────────
  initTerminal();

  function initTerminal() {
    const output  = document.getElementById('termOutput');
    const input   = document.getElementById('termInput');
    const body    = document.getElementById('terminalBody');
    const clearBtn = document.getElementById('tClearBtn');
    if (!output || !input) return;

    let history = [], histIdx = -1;

    const COMMANDS = {
      help: () => `<span class="t-dim">────────────────────────────</span>
<span class="t-k">Available Commands</span>
<span class="t-dim">────────────────────────────</span>
  <span class="t-gld">whoami</span>           About Yonathan
  <span class="t-gld">skills</span>           Full tech stack
  <span class="t-gld">experience</span>       Career history
  <span class="t-gld">education</span>        Academic background
  <span class="t-gld">contact</span>          Get in touch
  <span class="t-gld">ls</span>               List sections
  <span class="t-gld">pwd</span>              Current path
  <span class="t-gld">neofetch</span>         System profile
  <span class="t-gld">ping</span>             Test connection
  <span class="t-gld">date</span>             Current date
  <span class="t-gld">matrix</span>           🌐 ???
  <span class="t-gld">open linkedin</span>    Open LinkedIn
  <span class="t-gld">sudo hire me</span>     👀
  <span class="t-gld">clear</span>            Clear terminal
<span class="t-dim">────────────────────────────</span>`,

      whoami: () => `<span class="t-k">name:</span>     <span class="t-v">Yonathan Setiawan</span>
<span class="t-k">alias:</span>    <span class="t-v">yonathanstwn</span>
<span class="t-k">role:</span>     <span class="t-v">Technical Project Manager &amp; Quant Developer</span>
<span class="t-k">company:</span>  <span class="t-v">Millennium (APAC Fixed Income &amp; Commodities)</span>
<span class="t-k">based:</span>    <span class="t-v">Singapore 🇸🇬  [prev: London, Bali]</span>
<span class="t-k">status:</span>   <span class="t-grn">● OPEN TO FREELANCE &amp; OPPORTUNITIES</span>`,

      skills: () => `<span class="t-k">languages:</span>  <span class="t-v">Python · C++ · Java · Scala · kdb+/q · SQL · TypeScript · Haskell</span>
<span class="t-k">app dev:</span>    <span class="t-v">Django · FastAPI · React · Angular · Spring · GraphQL · Kafka</span>
<span class="t-k">devops:</span>     <span class="t-v">AWS · Docker · Kubernetes · Terraform · ArgoCD · Airflow · Linux</span>
<span class="t-k">ai/ml:</span>      <span class="t-v">PyTorch · TensorFlow · RAG · VectorDB · LangChain · FastMCP</span>
<span class="t-k">quant:</span>      <span class="t-v">Bloomberg · kdb+/q · Murex · Fixed Income · LP Optimisation</span>
<span class="t-k">data:</span>       <span class="t-v">PostgreSQL · MongoDB · Redis · DuckDB · Pandas · Polars</span>`,

      experience: () => `<span class="t-grn">▸</span> <span class="t-gld">2026–now</span>  TPM @ Millennium (Singapore)
         APAC Lead, 11 PM pods, 50+ traders. MCP+RAG AI.
<span class="t-dim">▸</span> <span class="t-gld">2024–26</span>   Repo Trading Dev @ Millennium (London)
         Greenfield automation. 10K+ daily trades.
<span class="t-dim">▸</span> <span class="t-gld">2023–24</span>   SWE @ JPMorgan Chase (London)
         Macro Structuring, Pricing, Risk. Rising Star award.
<span class="t-dim">▸</span> <span class="t-gld">2022</span>      SWE Intern @ JPMorgan Chase (London)
<span class="t-dim">▸</span> <span class="t-gld">2021</span>      UG Research Fellow, AI @ King's College London`,

      education: () => `<span class="t-grn">▸</span> <span class="t-gld">BSc Computer Science</span> — King's College London
  First Class Honours · <span class="t-gld">81%</span> · 2020–2023
  90%+ in Maths, AI, Databases, Algorithms, OS

<span class="t-dim">▸</span> <span class="t-gld">IGCSE &amp; A-Levels</span> — Dyatmika High School, Bali
  <span class="t-grn">Top in Country Award (ICT)</span> · A*AAA A-Levels`,

      contact: () => `<span class="t-k">email:</span>    <a href="mailto:yonathanbali@gmail.com" class="t-lnk">yonathanbali@gmail.com</a>
<span class="t-k">linkedin:</span> <a href="https://uk.linkedin.com/in/yonathanstwn" class="t-lnk" target="_blank" rel="noopener">linkedin.com/in/yonathanstwn</a>
<span class="t-k">phone:</span>    <span class="t-v">+65 84317119</span>
<span class="t-k">response:</span> <span class="t-grn">&lt; 24 hours ⚡</span>`,

      ls: () => `<span class="t-dir">about/</span>       <span class="t-dir">experience/</span>    <span class="t-dir">skills/</span>
<span class="t-dir">services/</span>    <span class="t-dir">contact/</span>       <span class="t-dir">terminal/</span>
<span class="t-file">README.md</span>    <span class="t-file">resume.pdf</span>     <span class="t-file">linkedin.url</span>`,

      pwd:  () => `<span class="t-v">/home/yonathan/portfolio</span>`,
      date: () => `<span class="t-v">${new Date().toUTCString()}</span>`,

      neofetch: () => {
        const ua = navigator.userAgent;
        const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Unknown';
        return `<span class="t-cyan" style="color:var(--cyan)">
    ██╗   ██╗███████╗
    ╚██╗ ██╔╝██╔════╝
     ╚████╔╝ ███████╗
      ╚██╔╝  ╚════██║
       ██║   ███████║
       ╚═╝   ╚══════╝</span>
<span class="t-k">name:</span>     <span class="t-v">Yonathan Setiawan</span>
<span class="t-k">os:</span>       <span class="t-v">macOS · Singapore</span>
<span class="t-k">shell:</span>    <span class="t-v">zsh + python3.12</span>
<span class="t-k">browser:</span>  <span class="t-v">${browser}</span>
<span class="t-k">uptime:</span>   <span class="t-v">4+ years in finance</span>
<span class="t-k">packages:</span> <span class="t-v">50+ npm · 200+ pip</span>
<span class="t-k">status:</span>   <span class="t-grn">● OPEN TO FREELANCE</span>`,
      },

      ping: () => `PING portfolio.yonathanstwn.dev (127.0.0.1)
64 bytes: icmp_seq=1  time=<span class="t-grn">0.42 ms</span>
64 bytes: icmp_seq=2  time=<span class="t-grn">0.38 ms</span>
64 bytes: icmp_seq=3  time=<span class="t-grn">0.41 ms</span>
--- stats --- 3 sent, 3 received, <span class="t-grn">0% loss</span>
<span class="t-grn">PONG 🏓</span>`,

      'open linkedin': () => {
        setTimeout(() => window.open('https://uk.linkedin.com/in/yonathanstwn', '_blank'), 400);
        return `<span class="t-grn">Opening LinkedIn...</span> 🚀`;
      },

      'sudo hire me': () => `[sudo] password for recruiter: <span class="t-dim">••••••••</span>
<span class="t-grn">✓ Credentials verified</span>
<span class="t-grn">✓ Resume staged for delivery</span>
<span class="t-grn">✓ Initiating contact sequence...</span>
[<span class="t-grn">████████████████████</span>] 100%
→ <a href="mailto:yonathanbali@gmail.com" class="t-lnk">yonathanbali@gmail.com</a>
→ <a href="https://uk.linkedin.com/in/yonathanstwn" class="t-lnk" target="_blank">linkedin.com/in/yonathanstwn</a>
<span class="t-gld">⚡ Let's build something great.</span>`,

      matrix: () => {
        triggerMatrix();
        return `<span class="t-grn">Initiating matrix protocol...</span>`;
      },

      clear: () => null,

      'cat readme.md': () => `# <span class="t-gld">Yonathan Setiawan</span>
Quant developer &amp; TPM. Building AI + trading infrastructure.
Currently @ Millennium, Singapore.
→ Type <span class="t-k">help</span> for commands.`,
    };

    // Aliases
    COMMANDS.exp   = COMMANDS.experience;
    COMMANDS.edu   = COMMANDS.education;
    COMMANDS.info  = COMMANDS.whoami;

    function print(html) {
      const div = document.createElement('div');
      div.className = 't-line t-output';
      div.innerHTML = html;
      output.appendChild(div);
      scrollBottom();
    }

    function printPromptEcho(cmd) {
      const div = document.createElement('div');
      div.className = 't-line';
      div.innerHTML = `<span class="t-prompt" style="color:var(--green)">yonathan@portfolio:~$&nbsp;</span><span class="t-cmd-echo">${escapeHtml(cmd)}</span>`;
      output.appendChild(div);
    }

    function printBlank() {
      output.appendChild(Object.assign(document.createElement('div'), { className: 't-line t-empty' }));
    }

    function scrollBottom() {
      body.scrollTop = body.scrollHeight;
    }

    function escapeHtml(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function run(cmd) {
      const c = cmd.trim().toLowerCase();
      if (!c) return;
      history.unshift(c); histIdx = -1;
      printPromptEcho(c);

      if (c === 'clear') {
        output.innerHTML = '';
        return;
      }

      const fn = COMMANDS[c];
      if (fn) {
        const result = fn();
        if (result !== null && result !== undefined) {
          printBlank();
          print(result);
          printBlank();
        }
      } else if (c.startsWith('echo ')) {
        print(`<span class="t-v">${escapeHtml(c.slice(5))}</span>`);
        printBlank();
      } else {
        print(`<span class="t-red">zsh: command not found: ${escapeHtml(c)}</span>`);
        print(`<span class="t-dim">Type <span class="t-k">help</span> for available commands.</span>`);
        printBlank();
      }
      scrollBottom();
    }

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        run(input.value);
        input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
        else { histIdx = -1; input.value = ''; }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const v = input.value.toLowerCase();
        const match = Object.keys(COMMANDS).find(k => k.startsWith(v) && k !== v);
        if (match) input.value = match;
      }
    });

    // Click terminal to focus input
    document.getElementById('terminalBody').addEventListener('click', () => input.focus());
    clearBtn.addEventListener('click', () => { output.innerHTML = ''; input.focus(); });

    // Shortcut buttons
    document.querySelectorAll('.t-shortcut').forEach(btn => {
      btn.addEventListener('click', () => {
        run(btn.dataset.cmd);
        input.value = '';
        document.getElementById('terminal-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Welcome typing effect (initial command)
    setTimeout(() => {
      run('neofetch');
    }, 800);
  }


  // ── Matrix Rain (terminal easter egg) ───────────────────
  function triggerMatrix() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:9990;pointer-events:none;opacity:0;transition:opacity 0.3s';
    document.body.appendChild(canvas);
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx  = canvas.getContext('2d');
    const cols  = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = '01アイウエオカキクサシスセタチツテFIXEDINCOMEQUANT$%#@';
    let frame = 0;

    setTimeout(() => { canvas.style.opacity = '1'; }, 50);

    const animate = () => {
      if (frame++ > 200) {
        canvas.style.opacity = '0';
        setTimeout(() => canvas.remove(), 350);
        return;
      }
      ctx.fillStyle = 'rgba(8,11,20,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0EA5E9';
      ctx.font = '14px JetBrains Mono';
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      requestAnimationFrame(animate);
    };
    animate();
  }


  // ── Konami Code ─────────────────────────────────────────
  const KONAMI = [38,38,40,40,37,39,37,39,66,65];
  let ki = 0;
  document.addEventListener('keydown', e => {
    ki = e.keyCode === KONAMI[ki] ? ki + 1 : (e.keyCode === KONAMI[0] ? 1 : 0);
    if (ki === KONAMI.length) { ki = 0; showKonami(); }
  });

  function showKonami() {
    const overlay = document.getElementById('konamiOverlay');
    overlay.classList.add('show');
    const canvas = document.getElementById('konamiCanvas');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const confetti = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      color: ['#0EA5E9','#F59E0B','#10B981','#8B5CF6','#EF4444'][Math.floor(Math.random() * 5)],
      r: Math.random() * 6 + 3,
      rot: Math.random() * Math.PI * 2,
      rSpeed: (Math.random() - 0.5) * 0.15,
    }));
    let frame = 0;
    const draw = () => {
      if (frame++ > 200) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r);
        ctx.restore();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  document.getElementById('konamiClose').addEventListener('click', () => {
    document.getElementById('konamiOverlay').classList.remove('show');
  });

});
