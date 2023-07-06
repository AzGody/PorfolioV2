import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import LocomotiveScroll from 'locomotive-scroll';

const scroll = new LocomotiveScroll({
  el: document.querySelector('#js-scroll'),
  smooth: true,
  getSpeed: true,
  getDirection: true
});


const root = ReactDOM.createRoot(document.querySelector('#pc'))
root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 2000,
      position: [-3, 2, 5]
    }}
  >
    <Experience />
  </Canvas>
)

console.clear();

gsap.registerPlugin(ScrollTrigger);



// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
scroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#js-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#js-scroll", {
  scrollTop(value) {
    return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#js-scroll").style.transform ? "transform" : "fixed"
});



const sections = gsap.utils.toArray('section')

sections.forEach(function (section) {

  const inner = section.classList.contains('sectionLeftAndRight') ? section.querySelector('.leftText') : section.querySelector('.section-inner')

  if (!section.classList.contains('horizontalScrolling')) {

    ScrollTrigger.create({

      scroller: '#js-scroll',
      trigger: section,
      start: section.scrollHeight <= window.innerHeight ? 'top top' : 'bottom bottom',
      end: '+=100%',
      pin: inner,
      pinSpacing: false,
      pinType: 'transform'

    })

  } else {

    const scroll = section.querySelector('[data-scroll-in-section]');

    // the tween and the pinning have two different ScrollTriggers, because the will need different durations for that overlaying-effect to show

    ScrollTrigger.create({

      scroller: '#js-scroll',
      trigger: section,
      start: 'center center',
      end: () => `+=${section.scrollWidth + window.innerHeight}`, // added an extra window.innerHeight to the end here in comparison to the tween
      pin: inner,
      pinSpacing: true,
      pinType: 'transform',
      anticipatePin: 1,

    })

    gsap.to(scroll, {
      x: () => `${-(section.scrollWidth - document.documentElement.clientWidth)}px`,
      ease: 'none',
      scrollTrigger: {
        trigger: scroll,
        scroller: '#js-scroll',
        start: 'center center',
        end: () => `+=${section.scrollWidth}`,
        scrub: true,
      }
    });

  }


})



// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => scroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

// $(function () {

//     //Disable drgging the images
//     $('img').on('dragstart', function(event) { event.preventDefault(); });
//     // $('nav').addClass('desk');
//     var navPos = $('nav').position().top;
//     var testPos = $('.testtest').height()
//     var lastPos = 0;
//     console.log('salut')
//     $(window).on('scroll', function () {
//         var pos = $(window).scrollTop();

//         if (pos >= testPos + $('.skills li span span').height()+20 && lastPos < pos) {
//             // console.log('skills')
//             $('.skills li span span').addClass('active');
//         }
//         if (pos < testPos - 300 && lastPos > pos) {
//             // console.log('pas nav')
//             $('.skills li span span').removeClass('active');
//         }
//         // if (pos >= navPos + $('nav').height() && lastPos < pos) {
//         //     console.log('nav')
//         //     $('nav').addClass('fixed');
//         // }
//         // if (pos < navPos && lastPos > pos) {
//         //     console.log('pas nav')
//         //     $('nav').removeClass('fixed');
//         // }
//         lastPos = pos;
//     })
//     $(window).on('scroll', function () {
//         fnOnScroll();
//       });

//       $(window).on('resize', function () {
//         fnOnResize();
//       });


//       var agTimeline = $('.js-timeline'),
//         agTimelineLine = $('.js-timeline_line'),
//         agTimelineLineProgress = $('.js-timeline_line-progress'),
//         agTimelinePoint = $('.js-timeline-card_point-box'),
//         agTimelineItem = $('.js-timeline_item'),
//         agOuterHeight = $(window).outerHeight(),
//         agHeight = $(window).height(),
//         agPosY = null,
//         i = null,
//         a = null,
//         n = null,
//         f = -1,
//         agFlag = false;

//       function fnOnScroll() {
//         agPosY = $(window).scrollTop();

//         fnUpdateFrame();
//       }

//       function fnOnResize() {
//         agPosY = $(window).scrollTop();
//         agHeight = $(window).height();

//         fnUpdateFrame();
//       }

//       function fnUpdateWindow() {
//         agFlag = false;

//         agTimelineLine.css({
//           top: agTimelineItem.first().find(agTimelinePoint).offset().top - agTimelineItem.first().offset().top,
//           bottom: agTimeline.offset().top + agTimeline.outerHeight() - agTimelineItem.last().find(agTimelinePoint).offset().top
//         });

//         f !== agPosY && (f = agPosY, agHeight, fnUpdateProgress());
//       }

//       function fnUpdateProgress() {
//         var agTop = agTimelineItem.last().find(agTimelinePoint).offset().top;

//         i = agTop + agPosY - $(window).scrollTop();
//         a = agTimelineLineProgress.offset().top + agPosY - $(window).scrollTop();
//         n = agPosY - a + agOuterHeight / 2;
//         i <= agPosY + agOuterHeight / 2 && (n = i - a);
//         agTimelineLineProgress.css({height: n + "px"});

//         agTimelineItem.each(function () {
//           var agTop = $(this).find(agTimelinePoint).offset().top;

//           (agTop + agPosY - $(window).scrollTop()) < agPosY + .5 * agOuterHeight ? $(this).addClass('js-ag-active') : $(this).removeClass('js-ag-active');
//         })
//       }

//       function fnUpdateFrame() {
//         agFlag || requestAnimationFrame(fnUpdateWindow);
//         agFlag = true;
//       }

// })


/* 
    pointer.js was created by OwL for use on websites, 
     and can be found at https://seattleowl.com/pointer.
*/
// import './pointer.css'

const pointer = document.createElement("div")
pointer.id = "pointer-dot"
const ring = document.createElement("div")
ring.id = "pointer-ring"

document.body.insertBefore(pointer, document.body.children[0])
document.body.insertBefore(ring, document.body.children[0])

let mouseX = -100
let mouseY = -100
let ringX = -100
let ringY = -100
let isHover = false
let mouseDown = false
ring.style.transition = '0.15s'
const init_pointer = (options) => {

  window.onmousemove = (mouse) => {
    mouseX = mouse.clientX
    mouseY = mouse.clientY
  }

  window.onmousedown = (mouse) => {
    mouseDown = true
  }

  window.onmouseup = (mouse) => {
    mouseDown = false
  }

  const trace = (a, b, n) => {
    return (1 - n) * a + n * b;
  }
  window["trace"] = trace

  const getOption = (option) => {
    let defaultObj = {
      pointerColor: "#2994D1",
      ringSize: 25,
      ringClickSize: (options["ringSize"] || 25) - 5,
      hoverSize: 30
    }
    if (options[option] == undefined) {
      return defaultObj[option]
    } else {
      return options[option]
    }
  }

  const render = () => {
    ringX = trace(ringX, mouseX, 1)
    ringY = trace(ringY, mouseY, 1)

    if (document.querySelector(".page-link:hover")) {
      pointer.style.borderColor = getOption("pointerColor")
      ring.style.padding = getOption("hoverSize") + "px"
      isHover = true
    } else {
      pointer.style.borderColor = "white"
      isHover = false
      if (mouseDown) {

        ring.style.padding = getOption("ringClickSize") + "px"
      } else {
        ring.style.padding = getOption("ringSize") + "px"

      }
    }
    ring.style.borderColor = getOption("pointerColor")
    // if(isHover) {
    //     ring.style.padding = 100
    // }else {
    //     ring.style.padding = 25
    // }


    pointer.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    ring.style.transform = `translate(${ringX - (mouseDown ? getOption("ringClickSize") : getOption("ringSize"))}px, ${ringY - (mouseDown ? getOption("ringClickSize") : getOption("ringSize"))}px)`
    // ring.style.transform = `translate(${ringX - (isHover ? getOption("ringClickSize") : getOption("ringClickSize"))}px, ${ringY - (isHover ? getOption("ringClickSize") : getOption("ringClickSize"))}px)`

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}


//Top Scroll bar
window.onscroll = function () { myFunction() };


//Animation go to page from menu
function myFunction() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
}

//ParticleJs

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});



var w = window.innerWidth
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": w / 12,
      "density": {
        "enable": true,
        "value_area": 2500
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 2,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 10,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": w / 12,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 1,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": w / 12,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": w / 5,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});

// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}


const phrases = [
  'Rigoureux',
  'Automome',
  'Créatif',
  'Développeur full stack',];


const el = document.querySelector('.text');
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 1500);
  });
  counter = (counter + 1) % phrases.length;
};

next();

const projets = document.querySelectorAll('.item');


projets.forEach(projet => {
  projet.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const contenu = document.createElement('div');
    contenu.classList.add('contenu');
    contenu.innerHTML = `
      <h3>Titre du projet</h3>
      <p>Description complète du projet</p>
    `;

    overlay.appendChild(contenu);
    document.body.appendChild(overlay);

     // Animation d'ouverture avec GSAP
     gsap.fromTo(overlay, {opacity: 0}, {opacity: 1, duration: 0.25});
     gsap.fromTo(contenu, {opacity: 0}, {opacity: 1, duration: 0.25});

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        // Animation de fermeture avec GSAP
        gsap.to(contenu, {opacity: 0, duration: 0.25, onComplete: () => overlay.remove()});
        gsap.to(overlay, {opacity: 0, duration: 0.25});
      }
    });
  });
});

const timelineItems = document.querySelectorAll(".timeline-item");

timelineItems.forEach((item) => {
  scroll.on("scroll", () => {
    if (scroll.scroll.y > item.offsetTop - window.innerHeight / 2) {
      item.classList.add("animate");
    }
  });
});