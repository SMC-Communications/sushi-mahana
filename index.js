import { gsap } from "gsap";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* The following plugin is a Club GSAP perk */
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger,ScrollSmoother);

/* === DEVELOPMENT FLAGS ===*/
let isDevMode = false
if (href.search("webflow") >= 0) {
    console.log("DEVELOPMENT ENVIRONMENT")
    isDevMode = true;
}

/* === GSAP ScrollSmoother === */
let smoother, effects
const DEFAULT_SMOOTH = 2;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", gsapInit);
  } else {
    gsapInit();
  }

function gsapInit() {
    let smoothContent = document.querySelector('.page-wrapper');
    let smooth = smoothContent.dataset.smooth;
    if (smooth === undefined) {
        smooth = Number(DEFAULT_SMOOTH);
    }
    effects = true
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!motionMediaQuery.matches){
        createSmoother(Number(smooth))
    };
    motionMediaQuery.addEventListener('change', () => {
        if (motionMediaQuery.matches && smoother) {
            smoother.kill();
            effects = false
        } else if (!motionMediaQuery.matches) {
            createSmoother(Number(smooth));
        }
    });

    // Observe changes to data-speed made in DevTools and restart the smoother
    const config = { attributeFilter: ['data-speed', 'data-smooth'], attributeOldValue: true, subtree: true };
    const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
            if(mutation.attributeName === "data-smooth"){
                smooth = smoothContent.dataset.smooth
                smoother.smooth(Number(smooth));
            }
            if(mutation.attributeName === "data-speed"){
                if ((isDevMode) && (mutation.oldValue != mutation.target.dataset.speed)) {
                    smoother.kill()
                    createSmoother(Number(smoothContent.dataset.smooth))
                }
            }
        }
    }
    };
    const observer = new MutationObserver(callback);
    observer.observe(smoothContent, config);
}

function createSmoother(smooth){
    smoother = ScrollSmoother.create({
        wrapper: ".site-wrapper",
        content: ".page-wrapper",
        smooth: smooth,
        smoothTouch: 0.1,
        effects: effects,
        normalizeScroll: true
    });
}

/* === Logo movment & color change === */
translate = window.innerHeight - document.querySelector(".navbar_brand").offsetHeight - (document.querySelector(".anouncement-bar").offsetHeight /2)

    gsap.to(".navbar_brand", {
        translateY: () => translate + "px",

        scrollTrigger:{
        trigger:".site-wrapper",
        start:"clamp(top top)",
        end: () => "+=" + document.querySelector("body").offsetHeight + "px + bottom",
        scrub:true,
        }
    })
    gsap.to(".navbar_brand", {
        color:"#000",
        scrollTrigger:{
            trigger:".footer",
            end: () => "+=" + document.querySelector(".navbar_brand").offsetHeight + "px",
            scrub:true,
        }
    })

/* === Animate spacers ===*/
const spacers = gsap.utils.toArray([".spacer_small", ".spacer_medium"])

spacers.forEach((spacer) => {
    gsap.to(spacer,{
        scaleY:"1",
        duration:Math.round(spacer.offsetHeight / 50),
        ease:"expo.out",
        scrollTrigger:{
            trigger:spacer,
            start:"clamp(top 40%)"     
        }
    })
})

/* === Smoth scroll to anchor links ===*/
window.onload = (event) => {
    let urlHash = window.location.href.split("#")[1];
    let scrollElem = document.querySelector("#" + urlHash);
  
    if (urlHash && scrollElem) {
      gsap.to(smoother, {
        scrollTop: smoother.offset(scrollElem, "top top"),
        duration: 1
      });
    }
  };

/* === Stop scroll while nav open === */
const overlay = document.querySelector(".w-nav-overlay")
let open = false
const config = { attributeFilter: ['style'], attributeOldValue: true };
    const checkOverlayState = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.oldValue && (mutation.oldValue.search("display") > -1)){
            if (!open){
                console.log("OPEN")
                open = true
                smoother.paused(true)
            } else if (open){
                console.log("CLOSED")
                open = false
                smoother.paused(false)
            }
        }
    }
    };

    const observer = new MutationObserver(checkOverlayState);
    observer.observe(overlay, config);