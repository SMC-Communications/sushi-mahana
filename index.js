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

document.addEventListener('DOMContentLoaded', (event)=> {
    let smoothContent = document.querySelector('#smooth-content');
    console.log("smoothContent:", smoothContent)
    let smooth = smoothContent.dataset.smooth;
    console.log("smooth:", smooth)

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches){
        createSmoother(Number(smooth))
    };
    mediaQuery.addEventListener('change', () => {
        console.log(mediaQuery.media, mediaQuery.matches);
        if (mediaQuery.matches && smoother) {
            smoother.kill();
        } else if (!mediaQuery.matches) {
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
                console.log(mutation.oldValue)
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
});

function createSmoother(smooth){
    console.log("Creating smoother...")
    smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: smooth,
        effects: true
    });
    console.log("Smoother:", smoother)
}