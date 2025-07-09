/**
 * @file The core logic for the Lucca Sensosç Quiz, meticulously crafted for an
 * intuitive and engaging user experience. Inspired by a pursuit of excellence,
 * this script handles question flow, user input, profile calculation, and
 * seamless integration with external services like Make.com webhooks.
 * @author Lucca Sensosç
 * @version 2.0.0
 * @license Unlicensed (for demonstration purposes)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Quiz Configuration: Data is King. Make it clear and extensible. ---
    const quizData = [
        {
            image: 'https://i.imgur.com/AA7G4bW.jpeg',
            title: "Qual dessas sobremesas fala mais com você?",
            subtitle: "Escolha com o paladar, não com a razão.",
            options: [
                { text: "Tiramissu", score: { achocolatado: 1 } },
                { text: "Cheesecake", score: { frutado: 1 } },
                { text: "Torta de Limão", score: { citrico: 1 } },
                { text: "Sorvete com passas ao rum", score: { fermentado: 1 } },
                { text: "Macaron de flor de laranjeira", score: { floral: 1 } }
            ],
            note: "Sua escolha doce revela muito sobre o que você busca num café."
        },
        {
            image: 'https://i.imgur.com/2SKcfZF.jpeg',
            title: "Como você começaria o dia perfeito?",
            subtitle: "Pense no que te faz bem, sem esforço.",
            options: [
                { text: "Pão quentinho e manteiga derretida", score: { achocolatado: 1 } },
                { text: "Frutas frescas e iogurte cremoso", score: { frutado: 1 } },
                { text: "Queijo curado e patê de azeitona", score: { fermentado: 1 } },
                { text: "Chá verde com cookie de banana e aveia", score: { floral: 1 } },
                { text: "Suco verde com ovos", score: { citrico: 1 } }
            ],
            note: "Seu café da manhã preferido é um espelho do seu gosto por energia, conforto ou leveza."
        },
        {
            image: 'https://i.imgur.com/nWoAt8c.jpeg',
            title: "Qual cenário você mais se identifica?", // Clarified the question for better user understanding
            subtitle: "Deixe sua intuição falar, sem pensar muito.",
            options: [
                { text: "Lençol macio e quentinho", score: { achocolatado: 1 } },
                { text: "Ir ao parque de diversões", score: { frutado: 1 } },
                { text: "Viajar para um país no exterior", score: { fermentado: 1 } },
                { text: "Fim de semana na casa de campo", score: { floral: 1 } },
                { text: "Brisa do mar na areia", score: { citrico: 1 } }
            ],
            note: "Às vezes, o café ideal não está no sabor, mas no cenário em que ele acontece dentro de você."
        },
        {
            image: 'https://i.imgur.com/EA7dbFE.jpeg',
            title: "O que te conquista no primeiro gole?",
            subtitle: "Aquela sensação que te faz parar por um segundo.",
            options: [
                { text: "Textura cremosa e intensa", score: { achocolatado: 1 } },
                { text: "Doçura limpa, leve e viva", score: { frutado: 1 } },
                { text: "Surpreendente e exótico", score: { fermentado: 1 } },
                { text: "Profundidade e camadas", score: { floral: 1 } },
                { text: "Frescor com clareza", score: { citrico: 1 } }
            ],
            note: "O primeiro impacto do café costuma ser o mais verdadeiro."
        },
        {
            image: 'https://i.imgur.com/4ftQqxb.jpeg',
            title: "Qual fruta você mais aprecia em um sabor?", // Rephrased for better clarity in context
            subtitle: "É sobre sabor, não rótulo.",
            options: [
                { text: "Cacau", score: { achocolatado: 1 } },
                { text: "Pêssego", score: { frutado: 1 } },
                { text: "Uva passa", score: { fermentado: 1 } },
                { text: "Maçã", score: { floral: 1 } },
                { text: "Limão", score: { citrico: 1 } }
            ],
            note: "Mesmo sem perceber, você busca no café ecos dos sabores naturais que mais te marcam."
        }
    ];

    // --- State Variables: Centralized and clearly defined. ---
    let currentQuestionIndex = 0;
    // Stores selected option *objects* to easily retrieve text and score later.
    let userAnswers = [];
    let finalProfileResult = null; // Store the full profile object (name, description)
    let userName = ''; // User's first name for a personal touch

    // --- DOM Element References: Cached for performance and readability. ---
    const elements = {
        quizWrapper: document.querySelector('.quiz-wrapper'),
        quizImage: document.querySelector('.quiz-image'),
        quizContent: document.querySelector('.quiz-content'),
        // These will be dynamically assigned later when the quiz container is rendered
        progressDotsContainer: null,
        questionTitle: null,
        questionSubtitle: null,
        optionsContainer: null,
        noteElement: null,
        nextButton: null,
        backButton: null
    };

    // --- Profile Definitions: A single source of truth for profile details. ---
    const profileDefinitions = {
        achocolatado: {
            name: "Achocolatado",
            description: "Você prefere cafés que acolhem. Profundos, densos e com calor no fundo da xícara."
        },
        frutado: {
            name: "Frutado",
            description: "Você sente prazer na leveza viva. Doce, natural, com energia que surpreende sem pesar."
        },
        citrico: {
            name: "Cítrico",
            description: "Você busca brilho. Frescor, foco, clareza. Um café que limpa a mente e acende o corpo."
        },
        fermentado: {
            name: "Fermentado",
            description: "Você prefere o incomum. Gosta de camadas, contrastes e histórias que ninguém contou antes."
        },
        floral: {
            name: "Floral",
            description: "Você sente o que poucos percebem. Gosta de elegância precisa, leveza real, beleza silenciosa."
        }
    };

    // --- Utility Functions: Small, focused, reusable. ---

    /**
     * Validates an email address.
     * @param {string} email - The email string to validate.
     * @returns {boolean} True if the email is valid, false otherwise.
     */
    const isValidEmail = (email) => {
        // Robust regex, but simple enough to understand
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    /**
     * Updates the quiz image with a subtle transition.
     * @param {string} imageUrl - The URL of the new image.
     */
    const updateQuizImage = (imageUrl) => {
        elements.quizImage.style.opacity = '0'; // Fade out
        setTimeout(() => {
            elements.quizImage.style.backgroundImage = `url('${imageUrl}')`;
            elements.quizImage.style.opacity = '1'; // Fade in
        }, 200); // Match CSS transition duration for smooth effect
    };

    // --- Core Quiz Logic: The engine of the experience. ---

    /**
     * Calculates the user's dominant sensory profile based on their answers.
     * Sets the `finalProfileResult` global variable.
     */
    const calculateProfile = () => {
        const profileScores = {
            achocolatado: 0,
            frutado: 0,
            citrico: 0,
            fermentado: 0,
            floral: 0
        };

        userAnswers.forEach(answer => {
            if (answer && answer.score) {
                for (const profile in answer.score) {
                    if (profileScores.hasOwnProperty(profile)) {
                        profileScores[profile] += answer.score[profile];
                    }
                }
            }
        });

        let dominantProfileKey = '';
        let maxScore = -1;
        let tiedProfilesKeys = [];

        // Determine dominant or tied profiles
        for (const profile in profileScores) {
            if (profileScores[profile] > maxScore) {
                maxScore = profileScores[profile];
                dominantProfileKey = profile;
                tiedProfilesKeys = [profile];
            } else if (profileScores[profile] === maxScore && maxScore > 0) {
                tiedProfilesKeys.push(profile);
            }
        }

        // Assign final profile result based on calculation
        if (maxScore === 0 || userAnswers.length < quizData.length) {
            finalProfileResult = {
                name: "Nada definido. E tudo bem.",
                description: "Às vezes, a ausência de rótulo é o começo da descoberta real."
            };
        } else if (tiedProfilesKeys.length > 1) {
            const formattedTiedNames = tiedProfilesKeys
                .map(key => profileDefinitions[key].name)
                .join(' e ');
            finalProfileResult = {
                name: "Entre perfis, um território só seu",
                description: `Seu gosto percorre caminhos múltiplos: ${formattedTiedNames}. Um convite a sentir mais, sem pressa de definir.`
            };
        } else {
            finalProfileResult = profileDefinitions[dominantProfileKey];
        }
    };

    /**
     * Handles the click event for the "Next" button.
     * Advances the quiz or finishes it.
     */
    const handleNextButtonClick = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
        } else {
            // End of quiz: calculate profile and proceed to contact form
            calculateProfile();
            renderContactFormPage();
        }
    };

    /**
     * Handles the click event for the "Back" button.
     * Navigates to the previous question or back to the landing page.
     */
    const handleBackButtonClick = () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion(currentQuestionIndex);
        } else {
            // If on the first question, go back to the landing page
            renderLandingPage();
        }
    };

    /**
     * Attaches event listeners to the quiz navigation buttons (Next/Back).
     * This function should be called once after the quiz container is rendered.
     */
    const attachQuizNavigationListeners = () => {
        elements.nextButton = document.querySelector('.next');
        elements.backButton = document.querySelector('.back');

        // Ensure listeners are only attached once to avoid duplicates
        if (!elements.nextButton.dataset.listenerAttached) {
            elements.nextButton.addEventListener('click', handleNextButtonClick);
            elements.nextButton.dataset.listenerAttached = 'true';
        }
        if (!elements.backButton.dataset.listenerAttached) {
            elements.backButton.addEventListener('click', handleBackButtonClick);
            elements.backButton.dataset.listenerAttached = 'true';
        }
    };

    /**
     * Render the current question on the screen.
     * @param {number} index - The index of the question to display.
     */
    const renderQuestion = (index) => {
        const question = quizData[index];

        // Update visibility of the "Back" button
        elements.backButton.style.visibility = index === 0 ? 'hidden' : 'visible';

        // Update quiz image with smooth transition
        updateQuizImage(question.image);

        elements.questionTitle.textContent = question.title;
        elements.questionSubtitle.textContent = question.subtitle;
        elements.noteElement.innerHTML = `<strong>Por que perguntamos isso:</strong><br>${question.note}`;
        elements.optionsContainer.innerHTML = ""; // Clear previous options

        // Create and append new options
        question.options.forEach(option => {
            const optionCard = document.createElement('div');
            optionCard.className = 'option-card';
            optionCard.textContent = option.text;
            optionCard.setAttribute('role', 'button'); // Improve accessibility
            optionCard.setAttribute('tabindex', '0'); // Make div focusable

            // Mark the option as 'selected' if it was previously chosen
            if (userAnswers[index] && userAnswers[index].text === option.text) {
                optionCard.classList.add('selected');
            }

            const selectOption = () => {
                userAnswers[index] = option; // Store the complete option object
                elements.nextButton.disabled = false; // Enable the button
                // Update visual selection: remove 'selected' from all, add to current
                document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
                optionCard.classList.add('selected');
            };

            optionCard.addEventListener('click', selectOption);
            optionCard.addEventListener('keydown', (e) => { // Keyboard accessibility
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Prevent scrolling for spacebar
                    selectOption();
                }
            });

            elements.optionsContainer.appendChild(optionCard);
        });

        // Ensure 'Continue' button is disabled if no answer selected for current question
        elements.nextButton.disabled = !userAnswers[index];

        // Update progress dots
        elements.progressDotsContainer.innerHTML = '';
        quizData.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `dot ${i === index ? 'active' : ''}`;
            elements.progressDotsContainer.appendChild(dot);
        });
    };

    // --- Page Rendering Functions: Dedicated for each major screen. ---

    /**
     * Renders the initial landing page of the quiz.
     */
    const renderLandingPage = () => {
        // Reset quiz state
        currentQuestionIndex = 0;
        userAnswers = [];
        finalProfileResult = null;
        userName = '';
      

        updateQuizImage('https://i.imgur.com/pVS7u6r.png'); // Set initial image

        elements.quizContent.innerHTML = `
            <div class="quiz-header"> <h1>Conheça o café que entende você.</h1>
                <p class="quiz-intro">
                    Cada escolha que você faz. Um doce, um gole, um silêncio revela algo sobre o seu paladar.
                </p>
                <p class="quiz-intro">
                    Descubra o café que combina com o seu jeito de sentir.
                </p>
                <p class="quiz-intro" style="font-style: italic; margin-bottom: 56px;">
                    Simples assim.
                </p>
                <button id="start-quiz-button" class="button button-primary">Começar</button>
            </div>
        `;
        document.getElementById('start-quiz-button').addEventListener('click', startQuiz);
        elements.quizContent.setAttribute('aria-live', 'polite'); // Announce content changes
    };

    /**
     * Initializes the quiz, rendering the first question.
     */
    const startQuiz = () => {
        elements.quizContent.innerHTML = `
            <div class="quiz-question-container">
                <div class="progress-dots"></div>
                <h2></h2>
                <p class="subtitle"></p>
                <div class="options"></div>
                <div class="note"></div>
                <div class="quiz-actions"> <button class="button button-secondary back">&larr; Voltar</button>
                    <button class="button button-primary next" disabled>Continuar</button>
                </div>
            </div>
        `;

        // Cache dynamically created elements
        elements.progressDotsContainer = document.querySelector('.progress-dots');
        elements.questionTitle = document.querySelector('h2');
        elements.questionSubtitle = document.querySelector('.subtitle');
        elements.optionsContainer = document.querySelector('.options');
        elements.noteElement = document.querySelector('.note');

        attachQuizNavigationListeners(); // Attach listeners once quiz elements exist
        renderQuestion(currentQuestionIndex);
        elements.quizContent.setAttribute('aria-live', 'polite'); // Announce content changes
    };

    /**
     * Renders the contact form screen for name, email, and WhatsApp collection.
     */
    const renderContactFormPage = () => {
        updateQuizImage('https://i.imgur.com/AA7G4bW.jpeg'); // Image for contact screen

        elements.quizContent.innerHTML = `
            <div class="contact-form-screen">
                <h2>Quase lá!</h2>
                <p>
                    Seu perfil sensorial já diz muito sobre você.
                    Agora é hora de receber experiências e cafés pensados especialmente pro seu gosto.
                </p>
                <input type="text" id="userName" placeholder="Nome" required autocomplete="name" aria-label="Seu nome completo">
                <input type="email" id="userEmail" placeholder="E-mail" required autocomplete="email" aria-label="Seu endereço de e-mail">
                <input type="tel" id="userWhatsapp" placeholder="WhatsApp (opcional)" pattern="[0-9]{10,11}"
                       title="Formato: DDD + número (10 ou 11 dígitos, apenas números)" autocomplete="tel" aria-label="Seu número de WhatsApp">
                <div class="form-buttons">
                    <button class="button button-primary submit-button" disabled>Seguinte</button>
                    <button class="button button-secondary skip-button">Pular por enquanto</button>
                </div>
            </div>
        `;
        elements.quizContent.setAttribute('aria-live', 'polite'); // Announce content changes

        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        const userWhatsappElement = document.getElementById('userWhatsapp');
        const submitButton = document.querySelector('.submit-button');
        const skipButton = document.querySelector('.skip-button');

        // Input validation and button enabling logic
        const validateForm = () => {
            const isNameValid = userNameElement.value.trim().length >= 2;
            const isEmailValid = isValidEmail(userEmailElement.value.trim());
            submitButton.disabled = !(isNameValid && isEmailValid);
        };

        userNameElement.addEventListener('input', validateForm);
        userEmailElement.addEventListener('input', validateForm);
        // Restrict WhatsApp input to numbers only
        userWhatsappElement.addEventListener('input', (event) => {
            event.target.value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        });

        submitButton.addEventListener('click', async () => {
            const name = userNameElement.value.trim();
            const email = userEmailElement.value.trim();
            const whatsapp = userWhatsappElement.value.trim();

            userName = name.split(' ')[0] || ''; // Save only first name for thank you page

            // IMPORTANT: REPLACE 'YOUR_MAKE_WEBHOOK_URL' with your actual Make.com webhook URL
            const webhookUrl = 'https://hook.us2.make.com/5b3cymm6y7gj9i8835p2hr3dxwu5h8wp'; // <-- Configure here!

            const payload = {
                nome: name,
                email: email,
                whatsapp: whatsapp,
                perfil_sensorial: finalProfileResult.name,
                perfil_descricao: finalProfileResult.description,
                origem: "Quiz Lucca Sensorial"
            };

            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                    // Use 'keepalive' to attempt sending even if page unloads (e.g., user closes tab)
                    keepalive: true
                });

                if (response.ok) {
                    console.log('Dados enviados com sucesso para o webhook!');
                    renderThankYouPage(true);
                } else {
                    console.error('Erro ao enviar dados para o webhook:', response.statusText);
                    // Provide a user-friendly error, but still proceed to thank you page
                    alert("Houve um problema ao salvar seu contato. Por favor, tente novamente ou pule esta etapa.");
                    renderThankYouPage(false);
                }
            } catch (error) {
                console.error('Erro de rede ao enviar dados:', error);
                alert("Houve um problema de conexão. Por favor, verifique sua internet e tente novamente.");
                renderThankYouPage(false);
            }
        });

        skipButton.addEventListener('click', () => {
            renderThankYouPage(false); // Skip data collection
        });
    };

    /**
     * Renders the final thank you page, displaying the user's profile.
     * @param {boolean} contactProvided - True if the user provided contact info, false otherwise.
     */
    const renderThankYouPage = (contactProvided) => {
        updateQuizImage('https://images.unsplash.com/photo-1543361515-5381a4a90899?auto=format&fit=crop&w=800&q=80'); // Thank you image

        const displayUserName = userName || "Entusiasta"; // Use captured name or default

        elements.quizContent.innerHTML = `
            <div class="result-screen">
                <h2>Parabéns, ${displayUserName}!</h2>
                <h3 style="color: var(--color-primary);">Você é ${finalProfileResult.name}!</h3>
                <p class="quiz-intro">
                    ${finalProfileResult.description}
                </p>
                ${contactProvided ? `
                    <p class="quiz-intro" style="font-size: 16px; margin-top: 15px;">
                        Seu acesso exclusivo e conteúdos especiais estão a caminho do seu e-mail! Fique de olho.
                    </p>
                ` : `
                    <p class="quiz-intro" style="font-size: 16px; margin-top: 15px;">
                        Esperamos que tenha gostado de descobrir um pouco mais sobre suas preferências sensoriais. Continue nos acompanhando!
                    </p>
                `}
                <div class="quiz-actions" style="margin-top: 40px;">
                    <button class="button button-primary" onclick="renderLandingPage();">Fazer o Quiz Novamente</button>
                </div>
            </div>
        `;
        elements.quizContent.setAttribute('aria-live', 'polite'); // Announce content changes
    };

    // --- Initialization: The starting point. ---
    renderLandingPage();
});