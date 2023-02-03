/* 
    pointer.js was created by OwL for use on websites, 
     and can be found at https://seattleowl.com/pointer.
*/
import './pointer.css'

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