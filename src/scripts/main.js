import gsap from "gsap";
import Lenis from "lenis";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 860px)").matches;

function initSmoothScroll() {
    if (reduceMotion) return;

    const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
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
        y: 36,
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
                    duration: 0.9,
                    ease: "power3.out",
                });

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -8% 0px",
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
            y: 16,
            duration: 0.7,
        });
    }

    if (titleSpans.length) {
        tl.from(
            titleSpans,
            {
                opacity: 0,
                yPercent: 110,
                rotate: 2,
                duration: 1,
                stagger: 0.12,
            },
            "-=0.35"
        );
    }

    if (desc) {
        tl.from(
            desc,
            {
                opacity: 0,
                y: 22,
                duration: 0.8,
            },
            "-=0.55"
        );
    }

    if (actions) {
        tl.from(
            actions.children,
            {
                opacity: 0,
                y: 16,
                duration: 0.65,
                stagger: 0.08,
            },
            "-=0.45"
        );
    }
}

function initAmbientCodeLayer() {
    if (reduceMotion || isMobile) return;

    const layer = document.createElement("div");
    layer.className = "ambient-code";
    layer.setAttribute("aria-hidden", "true");

    const rows = 12;
    const chars = ["0", "1"];

    for (let i = 0; i < rows; i += 1) {
        const line = document.createElement("div");
        line.className = "ambient-code__line";

        const text = Array.from({ length: 90 }, () => chars[Math.floor(Math.random() * chars.length)]).join(" ");

        line.textContent = text;
        line.style.top = `${8 + i * 8}%`;
        line.style.left = `${i % 2 === 0 ? "-8%" : "-22%"}`;

        layer.appendChild(line);

        gsap.to(line, {
            x: i % 2 === 0 ? 90 : 130,
            duration: 18 + i * 1.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
        });
    }

    document.body.prepend(layer);
}

function initMagneticHover() {
    if (reduceMotion || isMobile) return;

    const targets = gsap.utils.toArray(
        ".project-card, .skill-card, .belief-card, .contact-card, .button"
    );

    targets.forEach((target) => {
        target.addEventListener("mousemove", (event) => {
            const rect = target.getBoundingClientRect();
            const relX = event.clientX - rect.left;
            const relY = event.clientY - rect.top;

            const x = (relX / rect.width - 0.5) * 14;
            const y = (relY / rect.height - 0.5) * 14;

            gsap.to(target, {
                x,
                y,
                rotateX: -y * 0.35,
                rotateY: x * 0.35,
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
    if (reduceMotion || isMobile) return;

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    window.addEventListener("pointermove", (event) => {
        gsap.to(glow, {
            x: event.clientX,
            y: event.clientY,
            duration: 0.35,
            ease: "power3.out",
        });
    });
}

function scrambleText(element) {
    if (reduceMotion) return;

    const original = element.dataset.originalText || element.textContent;
    element.dataset.originalText = original;

    const chars = "01AI_DEMO";
    let frame = 0;
    const totalFrames = 18;

    const timer = setInterval(() => {
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
            clearInterval(timer);
            element.textContent = original;
        }
    }, 28);
}

function initScrambleLabels() {
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
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressValue = docHeight <= 0 ? 0 : scrollTop / docHeight;

        progress.style.transform = `scaleX(${progressValue})`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
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
    initScrambleLabels();
    initDetailsAnimation();
}

init();