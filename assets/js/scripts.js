
        document.addEventListener('DOMContentLoaded', () => {
            // --- General Website Functionality ---
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            const sections = document.querySelectorAll('section');
            const header = document.querySelector('header');
            
            // Toggle mobile navigation
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
            
            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Close mobile menu after clicking a link
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                    }
                });
            });

            // Set active class on nav links based on scroll position
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const id = entry.target.getAttribute('id');
                    const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                    if (entry.isIntersecting) {
                        navLink.classList.add('active');
                    } else {
                        navLink.classList.remove('active');
                    }
                });
            }, { rootMargin: '-50% 0px -50% 0px' }); // Adjusted root margin

            sections.forEach(section => {
                observer.observe(section);
            });

            // Portfolio filtering
            const filterBtns = document.querySelectorAll('.portfolio-filter .filter-btn');
            const portfolioItems = document.querySelectorAll('.portfolio-container .portfolio-item');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelector('.portfolio-filter .filter-btn.active').classList.remove('active');
                    btn.classList.add('active');
                    const filterValue = btn.getAttribute('data-filter');

                    portfolioItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    });
                });
            });

            // --- AI Chatbot SnailBot Functionality ---
           const portfolioData = `
Portfolio Owner: Nisar Khan

Role:
🎬 Video Editor | 🎨 Creative Specialist | 💻 Website Developer | 📈 Marketing Enthusiast

About:
I’m Nisar Khan, a passionate and versatile creative professional with a proven ability to turn ideas into stunning visuals and functional websites. With over 5 years of experience in professional video editing and an expanding portfolio in website design & development, I combine artistic vision with technical mastery to help brands stand out.

Services & Specializations:
- Professional Video Editing for Social Media, Commercials, Documentaries, and Cinematic Projects.
- Motion Graphics, VFX, and Storytelling.
- Website Development (HTML, CSS, JavaScript, Responsive Design).
- Social Media Marketing Strategies to boost engagement and brand reach.
- Complete Post-Production Solutions: Color Grading, Sound Design, and Creative Direction.

Location:
📍 Peshawar, Pakistan

Skills & Proficiency:
- Adobe Premiere Pro (95%)
- Adobe After Effects (90%)
- DaVinci Resolve (85%)
- Color Grading & Correction (90%)
- Sound Design & Mixing (80%)
- Storytelling & Script Editing (95%)
- Website Development (HTML/CSS/JS) (85%)
- Responsive Web Design (80%)
- SEO & Social Media Marketing (85%)

Experience:
- Senior Video Editor | Creative Solutions Inc. (2022–Present) — Led a creative team, improved client engagement by 20%, specialized in high-end post-production.
- Video Editor | Digital Storytellers LLC (2019–2022) — Managed client projects from start to finish, delivered visually compelling and brand-aligned content.
- Junior Editor | Media Hub (2017–2019) — Assisted senior editors, managed media assets, and built strong foundational skills in editing.

Education & Training:
- Bachelor's in Communication Studies | University of Peshawar (2013–2017)
- Advanced Post-Production Certificate | Online Media Academy (2018)
- Professional DaVinci Resolve Training | DaVinci Certified (2023)

Contact Information:
📧 Email: nisar.khan@example.com
📞 Phone: +92 348 9174398
💬 WhatsApp: +92 348 9174398

Fun Facts:
- I approach every project as if it’s my own brand’s story.
- My mission is to make clients say “WOW” at first sight.
- I’m open to side jobs, freelance gigs, and long-term collaborations.

Ideal For:
✅ Businesses seeking professional video editing that converts.
✅ Brands in need of an engaging and responsive website.
✅ Clients wanting a creative partner who understands both design and marketing.

`;


            const chatbotBtn = document.getElementById('chatbot-btn');
            const chatbotWindow = document.getElementById('chatbot-window');
            const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
            const chatbotInput = document.getElementById('chatbot-input');
            const chatbotSendBtn = document.getElementById('chatbot-input-btn');
            const chatbotMessages = document.getElementById('chatbot-messages');

            let isChatbotOpen = false;

            // Toggle chatbot window
            chatbotBtn.addEventListener('click', () => {
                isChatbotOpen = !isChatbotOpen;
                chatbotWindow.style.display = isChatbotOpen ? 'flex' : 'none';
                if (isChatbotOpen && chatbotMessages.children.length === 0) {
                    addSnailBotMessage("Hello! I'm SnailBot, your personal assistant. I can tell you about Nisar's skills, experience, and education. What would you like to know?");
                }
            });

            chatbotCloseBtn.addEventListener('click', () => {
                isChatbotOpen = false;
                chatbotWindow.style.display = 'none';
            });
            
            // Handle sending a message
            chatbotSendBtn.addEventListener('click', sendMessage);
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            async function sendMessage() {
                const userMessage = chatbotInput.value.trim();
                if (userMessage === '') return;

                addUserMessage(userMessage);
                chatbotInput.value = '';
                addSnailBotMessage('', true); // Add loading dots

                const prompt = `
                You are SnailBot, an AI assistant for Nisar Khan's portfolio website. Your purpose is to provide information and helpful suggestions based *only* on the provided portfolio data. Do not make up information or refer to external sources. Use a helpful and concise tone.

                Nisar's Portfolio Data:
                ${portfolioData}

                User's question: ${userMessage}

                Based on the provided portfolio data, please respond to the user's question. If you are asked for a suggestion about a skill, provide a helpful tip based on the context of professional video editing. If the user asks something you can't answer with the provided data, politely state that you can't help with that.
                `;

                try {
                    const apiKey = "AIzaSyAhOs2qEO-NZlwOE1k3PR0Kb-p8UjnSIyE";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                    
                    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                    const payload = { contents: chatHistory };

                    let response = null;
                    const maxRetries = 3;
                    let retryCount = 0;
                    const baseDelay = 1000;

                    while (retryCount < maxRetries) {
                        try {
                            response = await fetch(apiUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });
                            
                            if (response.status === 429) {
                                retryCount++;
                                const delay = baseDelay * (2 ** retryCount) + Math.random() * 1000;
                                await new Promise(res => setTimeout(res, delay));
                                continue;
                            }

                            if (!response.ok) {
                                throw new Error(`API error: ${response.statusText}`);
                            }

                            const result = await response.json();
                            const botResponse = result.candidates[0].content.parts[0].text;
                            updateSnailBotMessage(botResponse);
                            break; // Exit the loop on success
                        } catch (error) {
                            console.error(`Attempt ${retryCount + 1} failed: ${error}`);
                            retryCount++;
                            if (retryCount >= maxRetries) {
                                updateSnailBotMessage("Oops, I'm having trouble connecting right now. Please try again later!");
                            } else {
                                const delay = baseDelay * (2 ** retryCount) + Math.random() * 1000;
                                await new Promise(res => setTimeout(res, delay));
                            }
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch from API:', error);
                    updateSnailBotMessage("Oops, something went wrong. Please try again!");
                }
            }

            function addUserMessage(message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message user';
                messageDiv.textContent = message;
                chatbotMessages.appendChild(messageDiv);
                scrollToBottom();
            }

            function addSnailBotMessage(message, isLoading = false) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message snail';
                
                if (isLoading) {
                    const loadingDots = document.createElement('div');
                    loadingDots.className = 'loading-dots visible';
                    loadingDots.innerHTML = '<span></span><span></span><span></span>';
                    messageDiv.appendChild(loadingDots);
                } else {
                    messageDiv.textContent = message;
                }
                
                chatbotMessages.appendChild(messageDiv);
                scrollToBottom();
            }

            function updateSnailBotMessage(message) {
                const lastMessage = chatbotMessages.lastChild;
                if (lastMessage && lastMessage.classList.contains('snail')) {
                    lastMessage.innerHTML = ''; // Clear loading dots
                    lastMessage.textContent = message;
                }
                scrollToBottom();
            }

            function scrollToBottom() {
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        });
    