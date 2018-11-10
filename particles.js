class Particles {
	constructor() {
		this._particles = []
	}

	explode(clr) {
		const n = 30

		const min_v = 3
		const max_v = 8

		const max_rad = 12
		
		for (let i = 0; i < n; i++) {
			let p = {
				pos: [0, 0],
				vel: rand_vec(min_v, max_v),
				rad: max_rad,
				clr: clr
			}
		}
	}

	update() {
		const decay = 0.9
		const eps = 0.5

		for (let i = this._particles.length-1; i >= 0; i--) {
			let p = this._particles[i]
			p.pos[0] += p.vel[0]
			p.pos[1] += p.vel[1]
			p.rad *= decay

			if (p.rad < eps) {
				this._particles.splice(i, 1)
			}
		}
	}


}

function rand_vec(min, max) {
	const r = min + Math.random() * (max - min)
	const t = Math.random() * 2 * Math.PI
	return [r * Math.cos(t), r * Math.sin(t)]
}