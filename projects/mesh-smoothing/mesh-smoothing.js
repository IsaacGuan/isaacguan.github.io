"use strict";

class MeshSmoothing {
	constructor(geometry) {
		this.geometry = geometry;
	}

	apply(steps) {
		let vertices = this.geometry.mesh.vertices;
		for (let i=0; i<steps; i++) {
			for (let v of vertices) {
				let p = this.geometry.positions[v];
				let x = 0;
				let y = 0;
				let z = 0;
				let l = 0;
				for (let n of v.adjacentVertices()) {
					let pn = this.geometry.positions[n];
					x = x + pn.x;
					y = y + pn.y;
					z = z + pn.z;
					l = l + 1
				}
				p.x = x / l;
				p.y = y / l;
				p.z = z / l;
			}
		}
	}
}