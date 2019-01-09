const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const n_pallete = 5
const n_target = 2

const min_distance = 100

const target_rad = 100

const eps = 0.001

let pallete = []
let targetColors = []

let targetColor = null
let paintColor = null

let anim_rad = target_rad

function blend(clrs) {
    return chroma.average(clrs, 'cmyk')
}

function gen() {
    pallete = []
    for (let i = 0; i < n_pallete;) {
        let blob = {
            clr: chroma.random(),
            x: (i - (n_pallete - 1) / 2) * 100,
            picked: false,
        }

		let keep = true
		for (let other of pallete) {
			if (chroma.distance(blob.clr, other.clr, 'rgb') < min_distance) {
				keep = false
				break
			}
		}
		
		if (keep) {
        	pallete.push(blob)
			i++
		}
    }

	paintColor = chroma('#fff')

	gen_target()
}

function gen_target() {	
    targetColors = []
    for (let i = 0; i < n_pallete; i++) {
        targetColors.push(i)
    }
    for (let i = 0; i < n_pallete - n_target; i++) {
        targetColors.splice(Math.floor(Math.random() * targetColors.length), 1)
    }

    targetColor = blend(targetColors.map(i => pallete[i].clr))

	// Reset the pallete
	for (let blob of pallete) {
		blob.picked = false
	}
	calc()

	anim_rad = target_rad
}

function calc() {
    let clrs = pallete.filter(blob => blob.picked).map(blob => blob.clr)
    paintColor = clrs.length? blend(pallete.filter(blob => blob.picked).map(blob => blob.clr)) : chroma('#fff')
}

function draw(ctx) {
    requestAnimationFrame(draw.bind(null, ctx))

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(canvas.width/2, canvas.height/2)


    // Target color

    ctx.fillStyle = targetColor.hex()

    ctx.beginPath()
    ctx.arc(0, 0, anim_rad, 0, Math.PI * 2)
    ctx.fill()

    // Paint Color

    ctx.fillStyle = paintColor.hex()

    ctx.beginPath()
    ctx.arc(0, 0, 80, 0, Math.PI * 2)
    ctx.fill()

    // Pallete

    for (let blob of pallete) {
        ctx.fillStyle = blob.clr.hex()

        if (blob.picked) {
            ctx.beginPath()
            ctx.arc(blob.x, 300, 30, 0, Math.PI * 2)
            ctx.fill()
        } else {
            ctx.beginPath()
            ctx.arc(blob.x, 300, 40, 0, Math.PI * 2)
            ctx.fill()
        }
        
    }

    // Animate

    const dist = chroma.distance(targetColor, paintColor)
    if (dist < eps) {
        // WIN!
        anim_rad += 30
    } else {
        anim_rad = target_rad
    }

    if (anim_rad > canvas.width * 0.5 * 1.5) {
        gen_target()
    }
}

document.addEventListener('mousedown', ev => {
    const rect = canvas.getBoundingClientRect()
    const x = ev.clientX - rect.left - canvas.width / 2

    for (let blob of pallete) {
        if (Math.abs(blob.x - x) < 40) {
            blob.picked = !blob.picked
            break
        }
    }

	calc()
})

document.addEventListener('keyup', ev => {
	if (ev.keyCode == 82) {
		gen_target()
		calc()
	}
})

window.onresize = () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}

window.onload = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    gen()
	calc()
    requestAnimationFrame(draw.bind(null, context))
}
