document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Flag that JS is active (enables reveal animations safely)
    document.body.classList.add('js-enabled');

    // ==========================================================================
    // STICKY HEADER & ACTIVE SECTION NAV INDICATOR
    // ==========================================================================
    const header = document.getElementById('site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // MOBILE MENU NAV DRAWER
    // ==========================================================================
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.contains('open');
            mainNav.classList.toggle('open');
            mobileNavToggle.setAttribute('aria-expanded', !isOpen);
        });
        const menuLinks = mainNav.querySelectorAll('.nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================================================
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('revealed');
                obs.unobserve(el);
                // Remove reveal classes after animation so hover transforms work normally
                const cleanup = (e) => {
                    if (e.propertyName === 'transform') {
                        el.classList.remove('reveal', 'revealed');
                        el.removeEventListener('transitionend', cleanup);
                    }
                };
                el.addEventListener('transitionend', cleanup);
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.remove('reveal'));
    }

    // ==========================================================================
    // ANIMATED STAT COUNTERS
    // ==========================================================================
    const counters = document.querySelectorAll('.highlight-num[data-count]');
    counters.forEach(el => {
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        el.textContent = (0).toFixed(decimals) + suffix; // reset start value
    });
    if ('IntersectionObserver' in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const decimals = parseInt(el.dataset.decimals || '0', 10);
                const suffix = el.dataset.suffix || '';
                const duration = 1400;
                const startTime = performance.now();
                function tick(now) {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    el.textContent = (target * eased).toFixed(decimals) + suffix;
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                obs.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => counterObserver.observe(c));
    }

    // ==========================================================================
    // BHANU AI CO-PILOT CHATBOT TWIN SIMULATOR
    // ==========================================================================
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatChips = document.querySelectorAll('.chat-chip');
    const clearChatBtn = document.getElementById('clear-chat');

    // Bot Responses Knowledge Database (synced with resume)
    const knowledgeBase = {
        omnirag: `
            <strong>OmniRAG — Multi-Agent Hybrid Research Assistant</strong> is Bhanu's flagship GenAI project:
            <ul>
                <li><strong>Self-Correcting Agents:</strong> Architected a LangGraph pipeline with a Critique Agent that iteratively refines outputs — reducing hallucinations by <strong>90%</strong>.</li>
                <li><strong>Hybrid Retrieval:</strong> Dense (Gemini 3072-dim) + sparse (BM25 / FastEmbed) embeddings fused with Reciprocal Rank Fusion and BGE Cross-Encoder reranking — boosting retrieval precision by <strong>40%</strong>.</li>
                <li><strong>Production-Ready:</strong> Migrated deprecated Google API packages for Python 3.13 and shipped zero-cost deployment via Streamlit Cloud + GitHub Actions CI/CD.</li>
            </ul>
            Stack: LangGraph · Google Gemini · Qdrant · FastEmbed · Streamlit · Docker
        `,
        vigil: `
            <strong>VIGIL — Autonomous AI Data Quality &amp; Observability Platform:</strong>
            <ul>
                <li><strong>Autonomous Healing:</strong> Isolation Forest + PyTorch Autoencoders detect anomalies, while LangChain + Gemini auto-generate corrective SQL queries.</li>
                <li><strong>Drift Detection:</strong> KS-Test &amp; Chi-Squared monitoring plus 5 Great Expectations validation rules feed a unified <strong>Data Trust Score (0–100%)</strong>.</li>
                <li><strong>Safety-Critic Agent:</strong> Intercepts and blocks destructive SQL (DELETE / DROP), keeping autonomous remediation production-safe.</li>
            </ul>
            Stack: PyTorch · FastAPI · Great Expectations · Gemini · Docker · Render
        `,
        synergyos: `
            <strong>SynergyOS — Cognitive Supply Chain Twin</strong> is one of Bhanu's major projects:
            <ul>
                <li><strong>Demand Sensing:</strong> A hybrid Prophet + LightGBM engine forecasting over 5+ warehouses with a 4-week foresight.</li>
                <li><strong>Inventory Optimization:</strong> A linear programming optimizer (Google OR-Tools) balancing holding, stockout &amp; transfer costs.</li>
                <li><strong>AI Co-Pilot:</strong> LangChain + local Mistral 7B (Ollama) lets managers query optimization results in plain English — cutting decision time by 80%.</li>
            </ul>
            GitHub: <a href="https://github.com/GaddeBhanu9/SynergyOS" target="_blank">GaddeBhanu9/SynergyOS</a>
            <br>Live Demo: <a href="https://synergyos-supply-chain.streamlit.app/" target="_blank">synergyos-supply-chain.streamlit.app</a>
        `,
        churn: `
            <strong>Bank Customer Churn Predictor:</strong>
            A machine learning classification pipeline designed to retain customers.
            <ul>
                <li><strong>Model:</strong> Trained an XGBoost model on 50,000+ customer records.</li>
                <li><strong>Techniques:</strong> SMOTE upsampling to handle dataset imbalances, resulting in a <strong>0.89 AUC-ROC</strong> score.</li>
                <li><strong>Explainability:</strong> SHAP value calculations show which individual factors drove each prediction.</li>
            </ul>
            GitHub: <a href="https://github.com/GaddeBhanu9/Bank-Churn-Predictor" target="_blank">GaddeBhanu9/Bank-Churn-Predictor</a>
            <br>Live Demo: <a href="https://bankcustomerchurnpredictapi.streamlit.app/" target="_blank">bankcustomerchurnpredictapi.streamlit.app</a>
        `,
        research: `
            Bhanu published a research article titled
            <strong>"Deep Learning – Driven Visual Search and Image Recommendation"</strong> in the <em>International Journal for Modern Trends in Science and Technology</em> (Vol. 12, Issue 04, April 2026). UGC Approved (ID: 43137) · DOI: 10.5281/zenodo.19324579.
            <br><br>
            It uses deep CNN feature representations (EfficientNet-B4) to search product image catalogs and recommend items via cosine similarity within 200ms.
            <br><br>
            📄 You can check the <a href="G.Bhanu Prakash certificate.pdf" target="_blank">Publication Certificate</a> or browse the <a href="https://github.com/GaddeBhanu9/Deep-Learning---Driven-Visual-Search-Based-Image-Recommendation" target="_blank">Project Code</a>.
        `,
        experience: `
            Bhanu has two professional experiences:
            <ul>
                <li><strong>Data Analyst Intern — The Website Makers</strong> (Dec 2025 – Mar 2026): Automated GA4 &amp; server-log validation pipelines → <strong>100% reporting accuracy</strong>, 25% less manual QA, and 20% faster weekly reports.</li>
                <li><strong>AI Engineering Fellow (Sustainability) — IBM · 1M1B</strong> (Dec 2025 – Jan 2026): Built production-grade RAG &amp; Agentic AI solutions for climate data under IBM Labs mentorship, and presented the architecture to an industry panel.</li>
            </ul>
        `,
        skills: `
            Here is Bhanu's technology stack:
            <ul>
                <li><strong>GenAI &amp; Agentic Systems:</strong> LangGraph, LangChain, RAG (Hybrid Search, RRF, BGE Reranker), FastEmbed (BM25), Google Gemini, Ollama (Mistral), Groq (Llama 3.1), Tavily, LangSmith, Qdrant, Prompt Engineering</li>
                <li><strong>ML &amp; Deep Learning:</strong> PyTorch, TensorFlow, Scikit-learn, CNN (EfficientNet-B4), XGBoost, LightGBM, Prophet, Google OR-Tools (LP), PyOD, Autoencoders, Isolation Forest</li>
                <li><strong>Data Engineering &amp; Backend:</strong> Python, SQL, FastAPI, PostgreSQL (Neon), SQLAlchemy, Pandas, NumPy, Great Expectations, Docker, CI/CD (GitHub Actions)</li>
                <li><strong>Visualization &amp; Tools:</strong> Streamlit, Tableau, Power BI, Seaborn, Matplotlib, MLflow, SHAP, A/B Testing, Azure, Render</li>
            </ul>
        `,
        contact: `
            You can reach G. Bhanu Prakash directly via:
            <ul>
                <li>📧 Email: <a href="mailto:gaddebhanu333@gmail.com">gaddebhanu333@gmail.com</a></li>
                <li>📞 Phone/WhatsApp: <a href="tel:+917396652709">+91 7396652709</a></li>
                <li>💼 LinkedIn: <a href="https://www.linkedin.com/in/gadde-bhanu-prakash-26aa74389" target="_blank">gadde-bhanu-prakash-26aa74389</a></li>
                <li>🐙 GitHub: <a href="https://github.com/GaddeBhanu9" target="_blank">GaddeBhanu9</a></li>
            </ul>
            He is based in Andhra Pradesh, India.
        `,
        education: `
            Bhanu is pursuing:
            <ul>
                <li><strong>B.Tech in CSE (Artificial Intelligence)</strong> — PBR Visvodaya Institute of Technology and Science (Nov 2022 – May 2026). CGPA: <strong>8.0 / 10.0</strong>.</li>
                <li><strong>Advanced Certification in Data Science with AI</strong> — IIT Jammu (2026 – Present).</li>
            </ul>
        `,
        resume: `
            You can download his official profile summary here:
            <br><br>
            📄 <a href="Gadde_Bhanu_Prakash_Resume.pdf" download class="btn btn-outline btn-sm" style="display:inline-flex; margin-top:5px;">
                <i data-lucide="download" style="width:14px;height:14px;"></i> Download Resume
            </a>
        `,
        greeting: `
            Hello! 👋 I can tell you about Bhanu's projects (<strong>OmniRAG</strong>, <strong>SynergyOS</strong>, <strong>VIGIL</strong>, <strong>Churn Predictor</strong>),
            his work experience, skills, research publication, education, or how to contact him. What would you like to explore?
        `,
        default: `
            I'm a simulated agent, but I can help you with specific information! Try keywords like:
            <strong>"OmniRAG"</strong>, <strong>"VIGIL"</strong>, <strong>"SynergyOS"</strong>, <strong>"churn"</strong>,
            <strong>"experience"</strong>, <strong>"skills"</strong>, <strong>"research paper"</strong>,
            <strong>"education"</strong>, <strong>"resume"</strong>, or <strong>"contact"</strong>.
        `
    };

    function scrollToBottom() {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function appendMessage(sender, text) {
        const isBot = sender === 'bot';
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isBot ? 'msg-bot' : 'msg-user'}`;
        const avatarHTML = isBot
            ? `<div class="msg-avatar"><i data-lucide="bot"></i></div>`
            : `<div class="msg-avatar"><i data-lucide="user"></i></div>`;
        msgDiv.innerHTML = `
            ${avatarHTML}
            <div class="msg-bubble">${text}</div>
        `;
        chatMessagesContainer.appendChild(msgDiv);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message msg-bot typing-indicator';
        typingDiv.innerHTML = `
            <div class="msg-avatar"><i data-lucide="bot"></i></div>
            <div class="msg-bubble">
                <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
        `;
        chatMessagesContainer.appendChild(typDiv = typingDiv);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        scrollToBottom();
        return typingDiv;
    }

    function processQuery(query) {
        const cleaned = query.toLowerCase();
        let response = '';

        if (cleaned.includes('omnirag') || cleaned.includes('omni rag') || cleaned.includes('multi-agent') || cleaned.includes('multi agent') || cleaned.includes('research assistant')) {
            response = knowledgeBase.omnirag;
        } else if (cleaned.includes('vigil') || cleaned.includes('data quality') || cleaned.includes('observability') || cleaned.includes('anomaly') || cleaned.includes('data trust')) {
            response = knowledgeBase.vigil;
        } else if (cleaned.includes('synergyos') || cleaned.includes('supply chain') || cleaned.includes('twin')) {
            response = knowledgeBase.synergyos;
        } else if (cleaned.includes('churn') || cleaned.includes('bank') || cleaned.includes('customer')) {
            response = knowledgeBase.churn;
        } else if (cleaned.includes('paper') || cleaned.includes('research') || cleaned.includes('publication') || cleaned.includes('visual search')) {
            response = knowledgeBase.research;
        } else if (cleaned.includes('experience') || cleaned.includes('internship') || cleaned.includes('intern') || cleaned.includes('fellow') || cleaned.includes('ibm') || cleaned.includes('website makers')) {
            response = knowledgeBase.experience;
        } else if (cleaned.includes('skill') || cleaned.includes('tech') || cleaned.includes('languages') || cleaned.includes('stack')) {
            response = knowledgeBase.skills;
        } else if (cleaned.includes('education') || cleaned.includes('college') || cleaned.includes('b.tech') || cleaned.includes('university') || cleaned.includes('iit') || cleaned.includes('degree')) {
            response = knowledgeBase.education;
        } else if (cleaned.includes('contact') || cleaned.includes('hire') || cleaned.includes('email') || cleaned.includes('phone') || cleaned.includes('whatsapp') || cleaned.includes('linkedin')) {
            response = knowledgeBase.contact;
        } else if (cleaned.includes('resume') || cleaned.includes('cv') || cleaned.includes('download')) {
            response = knowledgeBase.resume;
        } else if (/^(hi|hello|hey)\b/.test(cleaned)) {
            response = knowledgeBase.greeting;
        } else {
            response = knowledgeBase.default;
        }

        const typingIndicator = showTypingIndicator();
        setTimeout(() => {
            typingIndicator.remove();
            appendMessage('bot', response);
        }, 1200);
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            appendMessage('user', text);
            chatInput.value = '';
            processQuery(text);
        });
    }

    if (chatChips.length > 0) {
        chatChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const query = chip.getAttribute('data-query');
                appendMessage('user', query);
                processQuery(query);
            });
        });
    }

    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            chatMessagesContainer.innerHTML = `
                <div class="message msg-bot">
                    <div class="msg-avatar"><i data-lucide="bot"></i></div>
                    <div class="msg-bubble">
                        Chat cleared. 👋 I am Bhanu's AI Co-Pilot twin. Ask me about his projects, work experience, education, skills, or research publications!
                    </div>
                </div>
            `;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    // ==========================================================================
    // CONTACT FORM CLIENT-SIDE INTERCEPTOR
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formStatusMsg = document.getElementById('form-status-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                e.preventDefault();
                formStatusMsg.className = 'form-status-msg form-status-error';
                formStatusMsg.innerText = '⚠️ Please fill out all required fields.';
                return;
            }

            if (contactForm.getAttribute('action').includes('placeholder')) {
                e.preventDefault();
                formSubmitBtn.disabled = true;
                formSubmitBtn.innerHTML = `Sending... <i data-lucide="loader" class="animate-spin"></i>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                setTimeout(() => {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = `Send Message <i data-lucide="send"></i>`;
                    formStatusMsg.className = 'form-status-msg form-status-success';
                    formStatusMsg.innerHTML = '✨ Message sent successfully! (Simulation Mode: Please change the form action in index.html to your own Formspree endpoint to receive emails.)';
                    contactForm.reset();
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }, 1500);
            }
        });
    }

    // ==========================================================================
    // 3D TILT EFFECT ON GLASS CARDS
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.glass-card, .profile-card-wrapper');
    tiltCards.forEach(card => {
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        card.appendChild(shine);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        });
    });

    // ==========================================================================
    // HERO INTERACTIVE 3D GLOBE / MESH ANIMATION (CANVAS-BASED)
    // ==========================================================================
    const canvas = document.getElementById('hero-3d-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        window.addEventListener('resize', () => {
            if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
            }
        });

        const numPoints = 80;
        const points = [];
        const radius = 130;
        for (let i = 0; i < numPoints; i++) {
            const theta = Math.acos(1 - 2 * (i + 0.5) / numPoints);
            const phi = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
            points.push({
                x: radius * Math.sin(theta) * Math.cos(phi),
                y: radius * Math.sin(theta) * Math.sin(phi),
                z: radius * Math.cos(theta)
            });
        }

        let angleX = 0.003;
        let angleY = 0.005;
        window.addEventListener('mousemove', (e) => {
            const heroSec = document.getElementById('hero');
            if (!heroSec) return;
            const rect = heroSec.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const cX = rect.left + rect.width / 2;
                const cY = rect.top + rect.height / 2;
                angleY = (e.clientX - cX) * 0.00003;
                angleX = (e.clientY - cY) * 0.00003;
            }
        });

        function animate3D() {
            ctx.clearRect(0, 0, width, height);
            const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
            const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
            const cx = width / 2, cy = height / 2;
            const projected = [];

            points.forEach(p => {
                let x1 = p.x * cosY - p.z * sinY;
                let z1 = p.z * cosY + p.x * sinY;
                let y2 = p.y * cosX - z1 * sinX;
                let z2 = z1 * cosX + p.y * sinX;
                p.x = x1; p.y = y2; p.z = z2;
                const perspective = 300;
                const scale = perspective / (perspective + z2);
                projected.push({
                    sx: cx + x1 * scale,
                    sy: cy + y2 * scale,
                    sz: z2,
                    scale: scale
                });
            });

            ctx.lineWidth = 0.6;
            for (let i = 0; i < projected.length; i++) {
                const p1 = projected[i];
                if (p1.sz > 80) continue;
                for (let j = i + 1; j < projected.length; j++) {
                    const p2 = projected[j];
                    if (p2.sz > 80) continue;
                    const dx = p1.sx - p2.sx;
                    const dy = p1.sy - p2.sy;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 65) {
                        const alpha = (1 - dist / 65) * 0.15;
                        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.sx, p1.sy);
                        ctx.lineTo(p2.sx, p2.sy);
                        ctx.stroke();
                    }
                }
            }

            projected.forEach(p => {
                const size = Math.max(1, 2.5 * p.scale);
                let color;
                if (p.sz > 0) {
                    color = `rgba(160, 68, 255, ${0.45 * (1 - p.sz / radius)})`;
                } else {
                    color = `rgba(0, 210, 255, ${0.45 + 0.35 * (-p.sz / radius)})`;
                }
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
                ctx.fill();
                if (p.sz < -80) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(p.sx, p.sy, size * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            requestAnimationFrame(animate3D);
        }
        animate3D();
    }

    // ==========================================================================
    // CUSTOM CURSOR ACTION FOLLOW LOGIC
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        function updateRingPosition() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(updateRingPosition);
        }
        updateRingPosition();
        document.body.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, select, input, textarea, .chat-chip, .scroll-down-indicator, .logo-link');
            if (target) {
                cursorDot.classList.add('active-hover');
                cursorRing.classList.add('active-hover');
            } else {
                cursorDot.classList.remove('active-hover');
                cursorRing.classList.remove('active-hover');
            }
        });
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        });
    }
});
