const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const mix_mode = 'darken'

const n_pallete = 6
const n_target = 3

const min_distance = 40

const target_rad = 100

const eps = 0.001

let pallete = []
let targetColors = []
let targetColor = null

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
			if (chroma.distance(blob.clr, other.clr) < min_distance) {
				keep = false
				break
			}
		}
		
		if (keep) {
        	pallete.push(blob)
			i++
		}
    }

    targetColors = []
    for (let i = 0; i < n_pallete; i++) {
        targetColors.push(i)
    }
    for (let i = 0; i < n_pallete - n_target; i++) {
        targetColors.splice(Math.floor(Math.random() * targetColors.length), 1)
    }


    targetColor = blend(targetColors.map(i => pallete[i].clr))

    anim_rad = target_rad

    /*targetColor = chroma('#FFF')
    for (let i = 0; i < targetColors.length; i++) {
        targetColor = chroma.blend(targetColor, pallete[targetColors[i]].clr, mix_mode)
    }*/
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

    /*let paintColor = chroma('#fff')
    for (let blob of pallete) {
        if (blob.picked) {
            paintColor = chroma.blend(paintColor, blob.clr, mix_mode)
        }
    }*/
    let clrs = pallete.filter(blob => blob.picked).map(blob => blob.clr)

    let paintColor = clrs.length? blend(pallete.filter(blob => blob.picked).map(blob => blob.clr)) : chroma('#fff')

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
        anim_rad += 5
    } else {
        anim_rad = target_rad
    }

    if (anim_rad > canvas.width) {
        gen()
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

    draw(context)
})

document.addEventListener('keyup', ev => {
	if (ev.keyCode == 82) {
		gen()	
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
    requestAnimationFrame(draw.bind(null, context))
}
