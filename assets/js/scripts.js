
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
                Role: Video Editor | Specialist | Passionate Creator
                About: A passionate video editor and creative specialist with expertise in transforming raw footage into compelling visual stories. 5+ years of experience in editing software and techniques. Specializes in commercials, documentaries, and social media content. Combines creativity with technical precision.
                Location: Peshawar, Pakistan
                Skills:
                - Adobe Premiere Pro (95%)
                - After Effects (90%)
                - DaVinci Resolve (85%)
                - Color Grading (90%)
                - Sound Design (80%)
                - Storytelling (95%)
                Experience:
                - Senior Video Editor at Creative Solutions Inc. (2022-Present): Led a team, increased client engagement by 20%, specialized in high-end post-production.
                - Video Editor at Digital Storytellers LLC (2019-2022): Managed all projects, collaborated with clients, experienced in motion graphics and VFX.
                - Junior Editor at Media Hub (2017-2019): Assisted with editing, asset management, and developed foundational skills.
                Education:
                - Bachelor's in Communication Studies from University of Peshawar (2013-2017)
                - Advanced Post-Production Certificate from Online Media Academy (2018)
                - Professional DaVinci Resolve Training from DaVinci Certified (2023)
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
    