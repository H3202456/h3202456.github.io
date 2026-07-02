import gsap from "gsap";
import Lenis from "lenis";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 860px)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function initSmoothScroll() {
    if (reduceMotion || isMobile) return;

    const lenis = new Lenis({
        duration: 1.08,
        smoothWheel: true,
        wheelMultiplier: 0.88,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

function initScrollReveal() {
    const items = gsap.utils.toArray("[data-animate]");
    if (!items.length) return;

    if (reduceMotion) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    gsap.set(items, {
        opacity: 0,
        y: 32,
        filter: "blur(8px)",
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.85,
                    ease: "power3.out",
                });

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -10% 0px",
        }
    );

    items.forEach((item) => observer.observe(item));
}

function initHeroIntro() {
    if (reduceMotion) return;

    const eyebrow = document.querySelector(".hero__eyebrow");
    const titleSpans = gsap.utils.toArray(".hero__title span");
    const desc = document.querySelector(".hero__desc");
    const actions = document.querySelector(".hero__actions");

    const tl = gsap.timeline({
        defaults: {
            ease: "power4.out",
        },
    });

    if (eyebrow) {
        tl.from(eyebrow, {
            opacity: 0,
            y: 14,
            duration: 0.65,
        });
    }

    if (titleSpans.length) {
        tl.from(
            titleSpans,
            {
                opacity: 0,
                yPercent: 105,
                rotate: 1.5,
                duration: 0.95,
                stagger: 0.1,
            },
            "-=0.32"
        );
    }

    if (desc) {
        tl.from(
            desc,
            {
                opacity: 0,
                y: 20,
                duration: 0.75,
            },
            "-=0.52"
        );
    }

    if (actions) {
        tl.from(
            actions.children,
            {
                opacity: 0,
                y: 14,
                duration: 0.6,
                stagger: 0.07,
            },
            "-=0.4"
        );
    }
}

function initAmbientCodeLayer() {
    if (reduceMotion || isMobile) return;

    const existingLayer = document.querySelector(".ambient-code");
    if (existingLayer) existingLayer.remove();

    const layer = document.createElement("div");
    layer.className = "ambient-code";
    layer.setAttribute("aria-hidden", "true");

    const rows = 10;
    const chars = ["0", "1"];

    for (let i = 0; i < rows; i += 1) {
        const line = document.createElement("div");
        line.className = "ambient-code__line";

        line.textContent = Array.from({ length: 76 }, () => {
            return chars[Math.floor(Math.random() * chars.length)];
        }).join(" ");

        line.style.top = `${10 + i * 8}%`;
        line.style.left = `${i % 2 === 0 ? "-12%" : "-24%"}`;

        layer.appendChild(line);

        gsap.to(line, {
            x: i % 2 === 0 ? 70 : 110,
            duration: 22 + i * 1.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.16,
        });
    }

    document.body.prepend(layer);
}

function initMagneticHover() {
    if (reduceMotion || !canHover || isMobile) return;

    const targets = gsap.utils.toArray(
        ".project-card, .skill-card, .belief-card, .contact-card, .button"
    );

    targets.forEach((target) => {
        target.addEventListener("mousemove", (event) => {
            const rect = target.getBoundingClientRect();
            const relX = event.clientX - rect.left;
            const relY = event.clientY - rect.top;

            const x = (relX / rect.width - 0.5) * 10;
            const y = (relY / rect.height - 0.5) * 10;

            target.style.setProperty("--mx", `${relX}px`);
            target.style.setProperty("--my", `${relY}px`);

            gsap.to(target, {
                x,
                y,
                rotateX: -y * 0.22,
                rotateY: x * 0.22,
                duration: 0.45,
                ease: "power3.out",
            });
        });

        target.addEventListener("mouseleave", () => {
            gsap.to(target, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.55,
                ease: "elastic.out(1, 0.45)",
            });
        });
    });
}

function initCursorGlow() {
    if (reduceMotion || !canHover || isMobile) return;

    const existingGlow = document.querySelector(".cursor-glow");
    if (existingGlow) existingGlow.remove();

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    window.addEventListener(
        "pointermove",
        (event) => {
            gsap.to(glow, {
                x: event.clientX,
                y: event.clientY,
                duration: 0.35,
                ease: "power3.out",
            });
        },
        { passive: true }
    );
}

function scrambleText(element) {
    if (reduceMotion) return;
    if (element.dataset.scrambling === "true") return;

    const original = element.dataset.originalText || element.textContent;
    element.dataset.originalText = original;
    element.dataset.scrambling = "true";

    const chars = "01AI_DEMO";
    let frame = 0;
    const totalFrames = 18;

    const timer = window.setInterval(() => {
        element.textContent = original
            .split("")
            .map((char, index) => {
                if (char === " ") return " ";
                if (index < frame / 2) return original[index];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

        frame += 1;

        if (frame >= totalFrames) {
            window.clearInterval(timer);
            element.textContent = original;
            element.dataset.scrambling = "false";
        }
    }, 28);
}

function initScrambleLabels() {
    if (!canHover || isMobile) return;

    const labels = document.querySelectorAll(".brand, .section-label");

    labels.forEach((label) => {
        label.addEventListener("mouseenter", () => scrambleText(label));
    });
}

function initDetailsAnimation() {
    const detailsBlocks = document.querySelectorAll(".more-projects");

    detailsBlocks.forEach((details) => {
        details.addEventListener("toggle", () => {
            if (!details.open || reduceMotion) return;

            const cards = details.querySelectorAll(".project-card");

            gsap.fromTo(
                cards,
                {
                    opacity: 0,
                    y: 24,
                    filter: "blur(6px)",
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.55,
                    stagger: 0.06,
                    ease: "power3.out",
                }
            );
        });
    });
}

function initScrollProgress() {
    let progress = document.querySelector(".scroll-progress");

    if (!progress) {
        progress = document.createElement("div");
        progress.className = "scroll-progress";
        document.body.appendChild(progress);
    }

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressValue = docHeight <= 0 ? 0 : scrollTop / docHeight;

        progress.style.transform = `scaleX(${progressValue})`;
    };

    updateProgress();

    window.addEventListener("scroll", updateProgress, {
        passive: true,
    });
}

function initCardLight() {
    if (reduceMotion || !canHover || isMobile) return;

    const cards = document.querySelectorAll(
        ".project-card, .skill-card, .belief-card, .contact-card"
    );

    cards.forEach((card) => {
        card.addEventListener(
            "pointermove",
            (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                card.style.setProperty("--mx", `${x}px`);
                card.style.setProperty("--my", `${y}px`);
            },
            { passive: true }
        );
    });
}

function init() {
    document.documentElement.classList.add("motion-ready");

    initSmoothScroll();
    initAmbientCodeLayer();
    initCursorGlow();
    initScrollProgress();
    initHeroIntro();
    initScrollReveal();
    initMagneticHover();
    initCardLight();
    initScrambleLabels();
    initDetailsAnimation();
}

init();