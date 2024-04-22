import { gsap } from "gsap";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* The following plugin is a Club GSAP perk */
import { ScrollSmoother } from "gsap/ScrollSmoother";


gsap.registerPlugin(ScrollTrigger,ScrollSmoother);

let isDevMode = false
//let href = window.location.href
if (href.search("webflow") >= 0) {
    console.log("DEVELOPMENT ENVIRONMENT")
    isDevMode = true;
}

let smoother

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", gsapInit);
  } else {
    gsapInit();
  }

  const DEFAULT_SMOOTH = 2;
  let effects
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
        effects: effects
    });
}

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

const spacers = gsap.utils.toArray([".spacer_small", ".spacer_medium"])

spacers.forEach((spacer) => {
    gsap.to(spacer,{
        scaleY:"1",
        duration:Math.round(spacer.offsetHeight / 50),
        delay:0.5,
        ease:"expo.out",
        scrollTrigger:{
            trigger:spacer,
            start:"clamp(top 60%)"     
        }
    })
})
