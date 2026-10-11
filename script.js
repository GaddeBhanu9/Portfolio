document.addEventListener('DOMContentLoaded', () => {
    const icons = () => { if (typeof lucide !== 'undefined') lucide.createIcons(); };
    icons();
    document.body.classList.add('js-enabled');

    // ===== Sticky header + active nav link =====
    const header = document.getElementById('site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        let current = '';
        const pos = window.scrollY + 200;
        sections.forEach(s => { if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) current = s.id; });
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    });

    // ===== Mobile nav =====
    const toggle = document.getElementById('mobile-nav-toggle');
    const nav = document.getElementById('main-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open);
        });
        nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }));
    }

    // ===== Scroll reveal =====
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('revealed');
                obs.unobserve(el);
                const cleanup = e => {
                    if (e.propertyName === 'transform') {
                        el.classList.remove('reveal', 'revealed');
                        el.removeEventListener('transitionend', cleanup);
                    }
                };
                el.addEventListener('transitionend', cleanup);
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.remove('reveal'));
    }

    // ===== Animated counters =====
    const counters = document.querySelectorAll('.highlight-num[data-count]');
    const fmt = (el, v) => (v).toFixed(parseInt(el.dataset.decimals || '0', 10)) + (el.dataset.suffix || '');
    counters.forEach(el => { el.textContent = fmt(el, 0); });
    if ('IntersectionObserver' in window && counters.length) {
        const co = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target, target = parseFloat(el.dataset.count), t0 = performance.now();
                const tick = now => {
                    const p = Math.min((now - t0) / 1400, 1);
                    el.textContent = fmt(el, target * (1 - Math.pow(1 - p, 3)));
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                obs.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => co.observe(c));
    } else {
        counters.forEach(c => { c.textContent = fmt(c, parseFloat(c.dataset.count)); });
    }

    // ===== Bhanu AI chatbot (knowledge synced with resume) =====
    const msgBox = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chips = document.querySelectorAll('.chat-chip');
    const clearBtn = document.getElementById('clear-chat');

    const KB = {
        omnirag: `<strong>OmniRAG: Multi-Agent Hybrid Research Assistant</strong>
            <ul><li>Self-correcting LangGraph pipeline with a Critique Agent that iteratively refines answers.</li>
            <li>Hybrid retrieval: dense (Gemini) + sparse (BM25 / FastEmbed) fused with Reciprocal Rank Fusion and BGE cross-encoder reranking, on Qdrant.</li>
            <li>Deployed on Streamlit Cloud with GitHub Actions CI/CD.</li></ul>
            <a href="https://github.com/GaddeBhanu9/OMNIRAG_AGENTIC_AI" target="_blank">GitHub</a> · <a href="https://omniragai.streamlit.app/" target="_blank">Live demo</a>`,
        vigil: `<strong>VIGIL: Autonomous AI Data Quality &amp; Observability Platform</strong> (Jun 2026)
            <ul><li>Isolation Forest + PyTorch Autoencoders detect anomalies; LangChain + Gemini generate corrective SQL.</li>
            <li>KS-Test and Chi-Squared drift detection plus 5 Great Expectations rules feed a Data Trust Score (0-100%).</li>
            <li>A safety-critic agent blocks destructive SQL (DELETE, DROP).</li></ul>
            <a href="https://github.com/GaddeBhanu9/vigil" target="_blank">GitHub</a> · <a href="https://vigildataengine.streamlit.app/" target="_blank">Live demo</a>`,
        synergyos: `<strong>SynergyOS: Cognitive Supply Chain Twin</strong> (May 2026)
            <ul><li>Hybrid Prophet + LightGBM forecasting with real-time weather APIs across 5+ warehouses for 4-week inventory planning.</li>
            <li>Multi-objective Google OR-Tools (Linear Programming) solver minimizing holding, stockout and transfer costs.</li>
            <li>GenAI Co-Pilot (LangChain + Mistral 7B) turns optimization results into plain-language alerts.</li></ul>
            <a href="https://github.com/GaddeBhanu9/SynergyOS" target="_blank">GitHub</a> · <a href="https://synergyos-supply-chain.streamlit.app/" target="_blank">Live demo</a>`,
        churn: `<strong>Bank Customer Churn Predictor:</strong> XGBoost on 50,000+ records with SMOTE for class imbalance (0.89 AUC-ROC) and SHAP for explainability.
            <br><a href="https://github.com/GaddeBhanu9/Bank-Churn-Predictor" target="_blank">GitHub</a> · <a href="https://bankcustomerchurnpredictapi.streamlit.app/" target="_blank">Live demo</a>`,
        research: `Bhanu co-authored <strong>"Deep Learning – Driven Visual Search and Image Recommendation"</strong> in IJMTST (Vol. 12, Issue 04, pp. 190-197, April 2026, UGC ID 43137).
            <br><br>It uses a pre-trained EfficientNetB4 CNN (1,792-dim features) with cosine similarity and a Flask interface. On about 1,000 images in 10 categories it reached roughly 91% precision, 88% recall, 93% Top-5 accuracy and 0.42 s per query.
            <br><br>📄 <a href="030IJMTST1204030.pdf" target="_blank">Read the paper</a> · <a href="https://doi.org/10.5281/zenodo.19324579" target="_blank">DOI</a> · <a href="https://github.com/GaddeBhanu9/Deep-Learning---Driven-Visual-Search-Based-Image-Recommendation" target="_blank">Code</a>`,
        experience: `Bhanu has two internships:
            <ul><li><strong>Data Science Intern, ExcelR Pvt Ltd</strong> (Jun 2026 – Present): hourly energy demand forecasting on 16 years of PJM data (143K+ records). Benchmarked LightGBM, XGBoost, Prophet, PatchTST and Chronos, reaching <strong>1.00% SMAPE</strong>; a LightGBM + XGBoost ensemble gave 1.0012% SMAPE and 77 MW RMSE. Deployed a Streamlit dashboard.</li>
            <li><strong>Data Analyst Intern, Mphasis</strong> (Oct 2024 – Mar 2026): Standard Chartered Bank Capital Markets project. Denodo base/derived views, Tableau dashboards and alerts, data reconciliation testing, root cause analysis, UAT and SIT.</li></ul>`,
        skills: `<ul>
            <li><strong>Generative AI &amp; LLMs:</strong> LangChain, LangGraph, Hugging Face, Gemini, Mistral 7B, Ollama, RAG, Hybrid Search, RRF, Cross-Encoder Reranking, Multi-Agent Systems, Text-to-SQL</li>
            <li><strong>ML &amp; Forecasting:</strong> LightGBM, XGBoost, Prophet, PatchTST, Chronos, PyTorch, Scikit-learn, Optuna, Isolation Forest, Autoencoders</li>
            <li><strong>Deep Learning &amp; Optimization:</strong> TensorFlow, Keras, EfficientNetB4, OpenCV, Google OR-Tools</li>
            <li><strong>Data &amp; Databases:</strong> Python, SQL, JavaScript, PostgreSQL, MySQL, Qdrant, Pandas, NumPy, Denodo, Great Expectations</li>
            <li><strong>BI &amp; DevOps:</strong> Tableau, Plotly, Streamlit, Excel, Docker, Git, GitHub, CI/CD, Render</li>
            <li><strong>Methodologies:</strong> SDLC, Agile, Code Reviews, UAT, SIT, Root Cause Analysis</li></ul>`,
        education: `<ul><li><strong>B.Tech in Computer Science (Artificial Intelligence)</strong>, PBR Visvodaya Institute of Technology and Science (Sep 2022 – Apr 2026), CGPA 8.0 / 10.0.</li>
            <li><strong>Data Science with AI</strong>, a course in collaboration with IIT Jammu (Jun 2026).</li></ul>`,
        certifications: `<ul><li><strong>IBM AI + Sustainability Certificate</strong> (IBM SkillsBuild): Agentic AI and RAG architectures.</li>
            <li><strong>Top 8, Megathon</strong> (IIIT Hyderabad).</li>
            <li><strong>Data Science with AI</strong> course with IIT Jammu (Jun 2026).</li>
            <li><strong>Published author</strong> in IJMTST (Apr 2026).</li></ul>`,
        contact: `<ul><li>📧 <a href="mailto:gaddebhanu111@gmail.com">gaddebhanu111@gmail.com</a></li>
            <li>📞 <a href="tel:+917396652709">+91 7396652709</a></li>
            <li>💼 <a href="https://www.linkedin.com/in/gadde-bhanu-prakash-26aa74389" target="_blank">LinkedIn</a></li>
            <li>🐙 <a href="https://github.com/GaddeBhanu9" target="_blank">GitHub</a></li></ul>Based in Bengaluru, Karnataka, India. Open to Data Scientist, Data Analyst and ML Engineer roles.`,
        resume: `📄 <a href="Gadde_Bhanu_Prakash_Resume.pdf" download>Download Resume (PDF)</a>`,
        greeting: `Hello! 👋 Ask me about Bhanu's projects (<strong>OmniRAG</strong>, <strong>SynergyOS</strong>, <strong>VIGIL</strong>, <strong>Churn Predictor</strong>), experience, skills, research, education or contact details.`,
        fallback: `I can answer questions on: <strong>OmniRAG</strong>, <strong>VIGIL</strong>, <strong>SynergyOS</strong>, <strong>churn</strong>, <strong>experience</strong>, <strong>skills</strong>, <strong>research paper</strong>, <strong>education</strong>, <strong>certifications</strong>, <strong>resume</strong> or <strong>contact</strong>.`
    };

    const rules = [
        ['omnirag', ['omnirag', 'omni rag', 'multi-agent', 'multi agent', 'research assistant']],
        ['vigil', ['vigil', 'data quality', 'observability', 'anomaly', 'data trust']],
        ['synergyos', ['synergyos', 'supply chain', 'twin']],
        ['churn', ['churn', 'bank customer']],
        ['research', ['paper', 'research', 'publication', 'visual search', 'ijmtst']],
        ['experience', ['experience', 'internship', 'intern', 'excelr', 'mphasis', 'standard chartered', 'work']],
        ['skills', ['skill', 'tech', 'language', 'stack']],
        ['certifications', ['certif', 'achievement', 'megathon', 'ibm', 'award']],
        ['education', ['education', 'college', 'b.tech', 'university', 'iit', 'degree', 'cgpa']],
        ['contact', ['contact', 'hire', 'email', 'phone', 'whatsapp', 'linkedin', 'github', 'reach']],
        ['resume', ['resume', 'cv', 'download']]
    ];

    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const bottom = () => { msgBox.scrollTop = msgBox.scrollHeight; };

    function addMessage(sender, html) {
        const bot = sender === 'bot';
        const div = document.createElement('div');
        div.className = 'message ' + (bot ? 'msg-bot' : 'msg-user');
        div.innerHTML = `<div class="msg-avatar"><i data-lucide="${bot ? 'bot' : 'user'}"></i></div><div class="msg-bubble">${html}</div>`;
        msgBox.appendChild(div);
        icons();
        bottom();
    }

    function answer(query) {
        const q = query.toLowerCase();
        let key = 'fallback';
        if (/^(hi|hello|hey)\b/.test(q)) key = 'greeting';
        for (const [k, words] of rules) { if (words.some(w => q.includes(w))) { key = k; break; } }
        const typing = document.createElement('div');
        typing.className = 'message msg-bot typing-indicator';
        typing.innerHTML = `<div class="msg-avatar"><i data-lucide="bot"></i></div><div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
        msgBox.appendChild(typing);
        icons();
        bottom();
        setTimeout(() => { typing.remove(); addMessage('bot', KB[key]); }, 900);
    }

    if (chatForm) chatForm.addEventListener('submit', e => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        addMessage('user', esc(text));
        chatInput.value = '';
        answer(text);
    });
    chips.forEach(chip => chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query');
        addMessage('user', esc(q));
        answer(q);
    }));
    if (clearBtn) clearBtn.addEventListener('click', () => {
        msgBox.innerHTML = `<div class="message msg-bot"><div class="msg-avatar"><i data-lucide="bot"></i></div><div class="msg-bubble">Chat cleared. 👋 Ask me about Bhanu's projects, experience, skills, research or contact details.</div></div>`;
        icons();
    });

    // ===== Contact form (mailto fallback until a Formspree URL is set) =====
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status-msg');
    if (form) form.addEventListener('submit', e => {
        const v = id => document.getElementById(id).value.trim();
        const name = v('form-name'), email = v('form-email'), subject = v('form-subject'), message = v('form-message');
        if (!name || !email || !subject || !message) {
            e.preventDefault();
            status.className = 'form-status-msg form-status-error';
            status.innerText = '⚠️ Please fill out all required fields.';
            return;
        }
        if (form.getAttribute('action').includes('placeholder')) {
            e.preventDefault();
            const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
            window.location.href = `mailto:gaddebhanu111@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            status.className = 'form-status-msg form-status-success';
            status.innerText = 'Opening your email app to send the message...';
        }
    });

    // ===== 3D tilt on glass cards =====
    document.querySelectorAll('.glass-card, .profile-card-wrapper').forEach(card => {
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        card.appendChild(shine);
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
            const rx = ((r.height / 2 - y) / (r.height / 2)) * 10, ry = ((x - r.width / 2) / (r.width / 2)) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // ===== Hero 3D mesh globe (canvas) =====
    const canvas = document.getElementById('hero-3d-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W = canvas.width = canvas.offsetWidth, H = canvas.height = canvas.offsetHeight;
        window.addEventListener('resize', () => {
            if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
        });
        const N = 80, R = 130, pts = [];
        for (let i = 0; i < N; i++) {
            const th = Math.acos(1 - 2 * (i + 0.5) / N), ph = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
            pts.push({ x: R * Math.sin(th) * Math.cos(ph), y: R * Math.sin(th) * Math.sin(ph), z: R * Math.cos(th) });
        }
        let ax = 0.003, ay = 0.005;
        window.addEventListener('mousemove', e => {
            const hero = document.getElementById('hero');
            if (!hero) return;
            const r = hero.getBoundingClientRect();
            if (e.clientY >= r.top && e.clientY <= r.bottom) {
                ay = (e.clientX - (r.left + r.width / 2)) * 0.00003;
                ax = (e.clientY - (r.top + r.height / 2)) * 0.00003;
            }
        });
        const loop = () => {
            ctx.clearRect(0, 0, W, H);
            const cX = Math.cos(ax), sX = Math.sin(ax), cY = Math.cos(ay), sY = Math.sin(ay), cx = W / 2, cy = H / 2;
            const proj = pts.map(p => {
                const x1 = p.x * cY - p.z * sY, z1 = p.z * cY + p.x * sY;
                const y2 = p.y * cX - z1 * sX, z2 = z1 * cX + p.y * sX;
                p.x = x1; p.y = y2; p.z = z2;
                const s = 300 / (300 + z2);
                return { sx: cx + x1 * s, sy: cy + y2 * s, sz: z2, s };
            });
            ctx.lineWidth = 0.6;
            for (let i = 0; i < proj.length; i++) {
                if (proj[i].sz > 80) continue;
                for (let j = i + 1; j < proj.length; j++) {
                    if (proj[j].sz > 80) continue;
                    const d = Math.hypot(proj[i].sx - proj[j].sx, proj[i].sy - proj[j].sy);
                    if (d < 65) {
                        ctx.strokeStyle = `rgba(0, 210, 255, ${(1 - d / 65) * 0.15})`;
                        ctx.beginPath(); ctx.moveTo(proj[i].sx, proj[i].sy); ctx.lineTo(proj[j].sx, proj[j].sy); ctx.stroke();
                    }
                }
            }
            proj.forEach(p => {
                const size = Math.max(1, 2.5 * p.s);
                ctx.fillStyle = p.sz > 0 ? `rgba(160, 68, 255, ${0.45 * (1 - p.sz / R)})` : `rgba(0, 210, 255, ${0.45 + 0.35 * (-p.sz / R)})`;
                ctx.beginPath(); ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2); ctx.fill();
                if (p.sz < -80) { ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; ctx.beginPath(); ctx.arc(p.sx, p.sy, size * 0.5, 0, Math.PI * 2); ctx.fill(); }
            });
            requestAnimationFrame(loop);
        };
        loop();
    }

    // ===== Custom cursor (only visible if enabled in style.css) =====
    const dot = document.getElementById('cursor-dot'), ring = document.getElementById('cursor-ring');
    if (dot && ring) {
        let mx = 0, my = 0, rx = 0, ry = 0;
        window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
        const follow = () => { rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(follow); };
        follow();
        document.body.addEventListener('mouseover', e => {
            const hit = e.target.closest('a, button, select, input, textarea, .chat-chip, .scroll-down-indicator, .logo-link');
            dot.classList.toggle('active-hover', !!hit);
            ring.classList.toggle('active-hover', !!hit);
        });
        document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    }
});
