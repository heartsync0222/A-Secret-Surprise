document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const envelopeContainer = document.getElementById('envelope-container');
    const letter = document.getElementById('letter-content');
    const typewriterText = document.getElementById('typewriter-text');
    const instructionText = document.getElementById('instruction-text');
    const locketContainer = document.getElementById('locket-container');
    const locket = document.getElementById('locket');
    const bgMusic = document.getElementById('bg-music');
    const musicControl = document.getElementById('music-control');
    const finalMessage = document.getElementById('final-message');
    const topMessage = document.getElementById('top-message'); // Added topMessage reference
    const particlesContainer = document.getElementById('particles');

    const messageLines = [
        "Is letter mein ek simple si baat likhi hai.",
        "Tum ho, toh sab acha lagta hai,",
        "kyunki har feeling words mein explain nahi hoti...",
        "kuch bas saath jee jaati hain."
    ];

    let step = 0; // 0: Closed, 1: Open, 2: Locket Drop, 3: Locket Open

    // --- Particle System ---
    function createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random positioning
            const left = Math.random() * 100;
            const size = Math.random() * 5 + 2;
            const duration = Math.random() * 5 + 5;
            const delay = Math.random() * 5;

            particle.style.left = `${left}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;

            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // --- Text Writer ---
    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            typewriterText.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
            setTimeout(function () {
                typeWriter(text, i + 1, fnCallback)
            }, 50); // Typing speed
        } else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 700);
        }
    }

    function startTextSequence(index) {
        if (index < messageLines.length) {
            // Add new line break if not first line
            if (index > 0) typewriterText.innerHTML += "<br>";

            // Type the current line
            // We need to type only the NEW content to avoid re-typing everything
            // Actually, simpler to just append span for visual effect or
            // just fade in lines. Let's do fade in lines for elegance as typing might be too techy?
            // Prompt asked for "appear line by line with a fade-in effect".
            // Let's switch to fade-in.

            const p = document.createElement('p');
            p.innerText = messageLines[index];
            p.style.opacity = 0;
            p.style.transition = "opacity 1s ease-in";
            // Clear typewriterText initially if index 0
            if (index === 0) typewriterText.innerHTML = '';
            typewriterText.appendChild(p);

            // Trigger reflow
            void p.offsetWidth;
            p.style.opacity = 1;

            setTimeout(() => {
                startTextSequence(index + 1);
            }, 2000); // Wait 2s before next line
        } else {
            // Sequence complete
            setTimeout(transitionToLocket, 2000);
        }
    }

    // --- Unfolding ---
    envelopeContainer.addEventListener('click', () => {
        if (step !== 0) return;
        step = 1;

        envelope.classList.add('open');
        instructionText.classList.add('hidden');

        // Play gentle paper sound if available (mock logic)

        // Start text after envelope opens
        setTimeout(() => {
            startTextSequence(0);
        }, 1200);
    });

    // --- Transition ---
    function transitionToLocket() {
        envelopeContainer.classList.add('blurred'); // Fade out letter
        setTimeout(() => {
            locketContainer.classList.remove('hidden'); // Make sure it renders
            // Small delay to allow CSS transitions to catch the remove hidden
            requestAnimationFrame(() => {
                locketContainer.classList.add('drop'); // Drop animation
            });

            musicControl.classList.remove('hidden');
            step = 2;
        }, 1000);
    }

    // --- Locket Interaction ---
    locket.addEventListener('click', () => {
        if (step !== 2 && step !== 3) return; // Allow interaction in step 2 (drop) or 3 (open)

        // Toggle logic
        if (locket.classList.contains('open')) {
            // Close
            locket.classList.remove('open');
            step = 2; // Back to dropped state

            // Wait for close anim then zoom out
            setTimeout(() => {
                locketContainer.classList.remove('zoomed');
                finalMessage.classList.remove('visible');
                if (topMessage) {
                    topMessage.classList.remove('visible');
                    topMessage.classList.add('hidden'); // Re-hide
                }
            }, 500);

        } else {
            // Open
            step = 3;
            // Zoom in first
            locketContainer.classList.add('zoomed');

            // Open after zoom starts
            setTimeout(() => {
                locket.classList.add('open');
                // locket.classList.add('pulse');

                // Show final message
                setTimeout(() => {
                    finalMessage.classList.add('visible');
                    if (topMessage) {
                        topMessage.classList.remove('hidden'); // Ensure display:block
                        // Slight delay to allow display:block to apply before opacity transition
                        requestAnimationFrame(() => {
                            topMessage.classList.add('visible');
                        });
                    }
                    // Only play music if not already playing
                    if (!isPlaying) playMusic();
                }, 800);
            }, 1000);
        }
    });

    // --- Music ---
    let isPlaying = false;
    function playMusic() {
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => {
            isPlaying = true;
            musicControl.style.opacity = 1;
        }).catch(e => console.log("Autoplay prevented, waiting for user interaction"));
    }

    musicControl.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicControl.style.opacity = 0.5;
        } else {
            bgMusic.play();
            musicControl.style.opacity = 1;
        }
        isPlaying = !isPlaying;
    });

});
