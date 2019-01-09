const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const n = 5
const min_distance = 40

pallete = []
for (let i = 0; i < n;) {
    c = chroma.random()

    let keep = true
    for (let other of pallete) {
        if (chroma.distance(c, other, 'rgb') < min_distance) {
            keep = false
            break
        }
    }
    
    if (keep) {
        pallete.push(c)
        i++
    }
}

pallete = ['#f20', '#ef0', '#06f', '#eec', '#534']

const spacing = 100
const rad = 45

context.translate(100, 100)

for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
        //for (let k = 0; k < n; k++) {
            //let c = chroma.average([pallete[i], pallete[j], pallete[k]], 'cmyk')
            let c = chroma.average([pallete[i], pallete[j]], 'hsl')

            let k = 0

            context.fillStyle = c.hex()
            context.beginPath()
            context.arc(i * spacing, j * spacing, rad * (n - k) / n, 0, Math.PI * 2)
            context.fill()
        //}
    }
}