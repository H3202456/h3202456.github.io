import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
    const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.9,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();
            lenis.scrollTo(target, {
                offset: -40,
                duration: 1.15,
            });
        });
    });

    gsap.from("[data-hero-line]", {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
    });

    gsap.utils.toArray("[data-animate]").forEach((element) => {
        gsap.from(element, {
            y: 42,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 82%",
            },
        });
    });
}