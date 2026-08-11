document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // STICKY HEADER & ACTIVE SECTION NAV INDICATOR
    // ==========================================================================
    const header = document.getElementById('site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header scroll styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active nav tracking
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // offset for nav height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if link matches current section ID
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

        // Close menu on click of nav items (for mobile layout scroll actions)
        const menuLinks = mainNav.querySelectorAll('.nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================================================
    // BHANU AI CO-PILOT CHATBOT TWIN SIMULATOR
    // ==========================================================================
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatChips = document.querySelectorAll('.chat-chip');
    const clearChatBtn = document.getElementById('clear-chat');

    // Bot Responses Knowledge Database
    const knowledgeBase = {
        synergyos: `
            <strong>SynergyOS — Cognitive Supply Chain Twin</strong> is one of Bhanu's major projects. Here are the core specifications:
            <ul>
                <li><strong>Demand Sensing:</strong> A hybrid Prophet + LightGBM engine forecasting over 5+ warehouses with a 4-week foresight.</li>
                <li><strong>Inventory Optimization:</strong> Built a linear programming optimizer (Google OR-Tools) to balance storage vs stockout costs.</li>
                <li><strong>AI Assistant:</strong> Integrated LangChain & local Llama/Mistral (Ollama) to let managers query system analytics in plain English.</li>
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
                <li><strong>Explainability:</strong> Utilized SHAP value calculations to show which individual factors (e.g. credit score, transaction frequency) drove each prediction.</li>
            </ul>
            GitHub: <a href="https://github.com/GaddeBhanu9/Bank-Churn-Predictor" target="_blank">GaddeBhanu9/Bank-Churn-Predictor</a>
            <br>Live Demo: <a href="https://bankcustomerchurnpredictapi.streamlit.app/" target="_blank">bankcustomerchurnpredictapi.streamlit.app</a>
        `,
        research: `
            Bhanu published a research article titled: 
            <strong>"Deep Learning – Driven Visual Search and Image Recommendation"</strong> in the <em>International Journal for Modern Trends in Science and Technology</em> (Volume 12, Issue 04, April 2026).
            <br><br>
            It proposes using deep CNN feature representations (EfficientNet-B4) to search product image catalogs and recommend items via cosine similarity vectors within 200ms.
            <br><br>
            📄 You can check the <a href="G.Bhanu Prakash certificate.pdf" target="_blank">Publication Certificate</a> or browse the <a href="https://github.com/GaddeBhanu9/Deep-Learning---Driven-Visual-Search-Based-Image-Recommendation" target="_blank">Project Code</a>.
        `,
        skills: `
            Here is Bhanu's technology stack:
            <ul>
                <li><strong>Languages:</strong> Python, JavaScript, SQL, CUDA (GPU Programming)</li>
                <li><strong>AI/ML & DL:</strong> TensorFlow, Scikit-learn, XGBoost, LightGBM, SHAP, Time-Series Forecasting</li>
                <li><strong>GenAI & LLMs:</strong> LangGraph, LangChain, Groq API (Llama 3.3/3.1), Ollama</li>
                <li><strong>Web & DevOps:</strong> FastAPI, Flask, Streamlit, Docker, CI/CD (GitHub Actions), PostgreSQL, Redis</li>
            </ul>
        `,
        contact: `
            You can reach G. Bhanu Prakash directly via:
            <ul>
                <li>📧 Email: <a href="mailto:gaddebhanu111@gmail.com">gaddebhanu111@gmail.com</a></li>
                <li>📞 Phone/WhatsApp: <a href="tel:+917396652709">+91 7396652709</a></li>
                <li>💼 LinkedIn: <a href="https://www.linkedin.com/in/gadde-bhanu-prakash-26aa74389" target="_blank">gadde-bhanu-prakash-26aa74389</a></li>
                <li>🐙 GitHub: <a href="https://github.com/GaddeBhanu9" target="_blank">GaddeBhanu9</a></li>
            </ul>
            He is based in Andhra Pradesh, India.
        `,
        education: `
            Bhanu is pursuing a <strong>B.Tech in CSE (Artificial Intelligence)</strong> at <em>PBR Visvodaya Institute of Technology and Science</em>. 
            <br>Academic Timeline: <strong>November 2022 – May 2026</strong>. 
            <br>Current Cumulative CGPA: <strong>8.0 / 10.0</strong>.
        `,
        resume: `
            You can download his official profile summary here:
            <br><br>
            📄 <a href="Gadde_BhanuPrakash_Resume.pdf" download class="btn btn-outline btn-sm" style="display:inline-flex; margin-top:5px;">
                <i data-lucide="download" style="width:14px;height:14px;"></i> Download Resume
            </a>
        `,
        default: `
            I'm a simulated agent, but I can help you with specific information! Try typing one of these keywords or clicking the buttons below:
            <strong>"skills"</strong>, <strong>"SynergyOS"</strong>, <strong>"research paper"</strong>, <strong>"churn"</strong>, <strong>"resume"</strong>, or <strong>"contact"</strong>.
        `
    };

    // Auto-scroll messages
    function scrollToBottom() {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    // Append Message to UI
    function appendMessage(sender, text) {
        const isBot = sender === 'bot';
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isBot ? 'msg-bot' : 'msg-user'}`;
        
        // Avatar HTML
        const avatarHTML = isBot 
            ? `<div class="msg-avatar"><i data-lucide="bot"></i></div>`
            : `<div class="msg-avatar"><i data-lucide="user"></i></div>`;
            
        msgDiv.innerHTML = `
            ${avatarHTML}
            <div class="msg-bubble">${text}</div>
        `;
        
        chatMessagesContainer.appendChild(msgDiv);
        
        // Re-trigger Lucide for the newly created icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        scrollToBottom();
    }

    // Show Typing Indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message msg-bot typing-indicator';
        typingDiv.innerHTML = `
            <div class="msg-avatar"><i data-lucide="bot"></i></div>
            <div class="msg-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessagesContainer.appendChild(typingDiv);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        scrollToBottom();
        return typingDiv;
    }

    // Process Bot Response Logic
    function processQuery(query) {
        const cleaned = query.toLowerCase();
        let response = '';

        if (cleaned.includes('synergyos') || cleaned.includes('supply chain') || cleaned.includes('twin')) {
            response = knowledgeBase.synergyos;
        } else if (cleaned.includes('churn') || cleaned.includes('bank') || cleaned.includes('customer')) {
            response = knowledgeBase.churn;
        } else if (cleaned.includes('paper') || cleaned.includes('research') || cleaned.includes('publication') || cleaned.includes('visual search')) {
            response = knowledgeBase.research;
        } else if (cleaned.includes('skill') || cleaned.includes('tech') || cleaned.includes('languages') || cleaned.includes('stack')) {
            response = knowledgeBase.skills;
        } else if (cleaned.includes('contact') || cleaned.includes('hire') || cleaned.includes('email') || cleaned.includes('phone') || cleaned.includes('whatsapp')) {
            response = knowledgeBase.contact;
        } else if (cleaned.includes('education') || cleaned.includes('college') || cleaned.includes('b.tech') || cleaned.includes('university')) {
            response = knowledgeBase.education;
        } else if (cleaned.includes('resume') || cleaned.includes('cv') || cleaned.includes('download')) {
            response = knowledgeBase.resume;
        } else {
            response = knowledgeBase.default;
        }

        // Simulate thinking latency
        const typingIndicator = showTypingIndicator();
        
        setTimeout(() => {
            typingIndicator.remove();
            appendMessage('bot', response);
        }, 1200);
    }

    // Chat submit handler
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

    // Chip click handler
    if (chatChips.length > 0) {
        chatChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const query = chip.getAttribute('data-query');
                appendMessage('user', query);
                processQuery(query);
            });
        });
    }

    // Clear Chat handler
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            chatMessagesContainer.innerHTML = `
                <div class="message msg-bot">
                    <div class="msg-avatar">
                        <i data-lucide="bot"></i>
                    </div>
                    <div class="msg-bubble">
                        Chat cleared. 👋 I am Bhanu's AI Co-Pilot twin. How can I assist you with details regarding his experience, B.Tech education, and AI developments?
                    </div>
                </div>
            `;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    // ==========================================================================
    // CONTACT FORM CLIENT-SIDE INTERCEPTOR (FOR VALIDATION AND EFFECTS)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formStatusMsg = document.getElementById('form-status-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Emulate client-side routing & styling validation before potential Formspree submit
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

            // If action is placeholder (i.e. local file preview or unconfigured backend), trigger dynamic simulation
            if (contactForm.getAttribute('action').includes('placeholder')) {
                e.preventDefault();
                formSubmitBtn.disabled = true;
                formSubmitBtn.innerHTML = `Sending... <i data-lucide="loader" class="animate-spin"></i>`;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                setTimeout(() => {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = `Send Message <i data-lucide="send"></i>`;
                    formStatusMsg.className = 'form-status-msg form-status-success';
                    formStatusMsg.innerHTML = '✨ Message sent successfully! (Simulation Mode: Please change form action in index.html to your own Formspree endpoint to receive emails.)';
                    contactForm.reset();
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 1500);
            }
        });
    }

    // ==========================================================================
    // 3D TILT EFFECT ON GLASS CARDS
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.glass-card, .profile-card-wrapper');

    tiltCards.forEach(card => {
        // Dynamically add a shine reflection overlay
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        card.appendChild(shine);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            // Set custom CSS variables for shine position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Calculate degrees based on coordinates
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - y) / centerY) * 10; // Max 10 deg rotation
            const rotateY = ((x - centerX) / centerX) * 10; // Max 10 deg rotation

            // Apply rotation
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

        // Handle window resizing
        window.addEventListener('resize', () => {
            if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
            }
        });

        // 3D Points Generator (Sphere coordinates)
        const numPoints = 80;
        const points = [];
        const radius = 130;

        for (let i = 0; i < numPoints; i++) {
            // Distribute points evenly on a sphere using Fibonacci lattice
            const theta = Math.acos(1 - 2 * (i + 0.5) / numPoints);
            const phi = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

            points.push({
                x: radius * Math.sin(theta) * Math.cos(phi),
                y: radius * Math.sin(theta) * Math.sin(phi),
                z: radius * Math.cos(theta),
                origX: radius * Math.sin(theta) * Math.cos(phi),
                origY: radius * Math.sin(theta) * Math.sin(phi),
                origZ: radius * Math.cos(theta)
            });
        }

        // Mouse movements affect rotation speed
        let angleX = 0.003;
        let angleY = 0.005;

        window.addEventListener('mousemove', (e) => {
            const heroSec = document.getElementById('hero');
            if (!heroSec) return;
            const rect = heroSec.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                // Scale speed based on mouse distance from center
                const cX = rect.left + rect.width / 2;
                const cY = rect.top + rect.height / 2;
                angleY = (e.clientX - cX) * 0.00003;
                angleX = (e.clientY - cY) * 0.00003;
            }
        });

        // Animation Loop
        function animate3D() {
            ctx.clearRect(0, 0, width, height);
            
            // Rotation matrices
            const cosX = Math.cos(angleX);
            const sinX = Math.sin(angleX);
            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);

            // Center of the canvas
            const cx = width / 2;
            const cy = height / 2;

            // Project and draw lines
            const projected = [];

            points.forEach(p => {
                // Rotate around Y axis
                let x1 = p.x * cosY - p.z * sinY;
                let z1 = p.z * cosY + p.x * sinY;

                // Rotate around X axis
                let y2 = p.y * cosX - z1 * sinX;
                let z2 = z1 * cosX + p.y * sinX;

                // Save rotated positions back to keep spinning
                p.x = x1;
                p.y = y2;
                p.z = z2;

                // Project onto 2D screen using perspective scaling
                const perspective = 300;
                const scale = perspective / (perspective + z2);
                const screenX = cx + x1 * scale;
                const screenY = cy + y2 * scale;

                projected.push({
                    sx: screenX,
                    sy: screenY,
                    sz: z2,
                    scale: scale
                });
            });

            // Draw connections (lines) between near points
            ctx.lineWidth = 0.6;
            for (let i = 0; i < projected.length; i++) {
                const p1 = projected[i];
                // Skip background points' lines to make it clean
                if (p1.sz > 80) continue;

                for (let j = i + 1; j < projected.length; j++) {
                    const p2 = projected[j];
                    if (p2.sz > 80) continue;

                    // Distance between coordinates
                    const dx = p1.sx - p2.sx;
                    const dy = p1.sy - p2.sy;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // If close enough, draw a faint glowing line
                    if (dist < 65) {
                        // Alpha fade based on distance
                        const alpha = (1 - dist / 65) * 0.15;
                        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.sx, p1.sy);
                        ctx.lineTo(p2.sx, p2.sy);
                        ctx.stroke();
                    }
                }
            }

            // Draw the nodes (particles)
            projected.forEach(p => {
                // Node sizes vary by perspective z depth
                const size = Math.max(1, 2.5 * p.scale);
                
                // Node color gradients from purple (back) to cyan (front)
                let color = 'rgba(0, 210, 255, 0.45)'; // cyan
                if (p.sz > 0) {
                    // Back nodes are purplish-magenta
                    color = `rgba(160, 68, 255, ${0.45 * (1 - p.sz / radius)})`;
                } else {
                    // Front nodes are bright cyan
                    color = `rgba(0, 210, 255, ${0.45 + 0.35 * (-p.sz / radius)})`;
                }

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
                ctx.fill();

                // Add a glow reflection to front-most points
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
        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        // Track cursor movement
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Direct mapping for the center dot (fast)
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Use linear interpolation (lerp) for the smooth ring lag
        function updateRingPosition() {
            // Lerp math: currentPosition += (targetPosition - currentPosition) * ease
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(updateRingPosition);
        }
        updateRingPosition();

        // Event delegation on hover: triggers scale action on interactive items (handles dynamic elements like chat chips automatically)
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

        // Hide cursor when leaving document window
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
