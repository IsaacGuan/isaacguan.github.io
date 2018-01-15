"use strict";

class ModifiedMeshSmoothing {
	constructor(geometry) {
		this.geometry = geometry;
	}

	area(face) {
		let p = [];
		let area = 0;
		let i = 0;
		for (let v of face.adjacentVertices()) {
			p[i] = this.geometry.positions[v];
			i++;
		}
		area = Math.sqrt(Math.pow((p[1].x*p[2].y-p[2].x*p[1].y),2)+Math.pow((p[2].x*p[0].y-p[0].x*p[2].y),2)+Math.pow((p[0].x*p[1].y-p[1].x*p[0].y),2));
		return area;
	}

	apply(steps) {
		let vertices = this.geometry.mesh.vertices;
		for (let i=0; i<steps; i++) {
			for (let v of vertices) {
				let p = this.geometry.positions[v];
				let x = 0;
				let y = 0;
				let z = 0;
				let weight = 0;
				for (let nv of v.adjacentVertices()) {
					let weightv = 0
					for (let nf of nv.adjacentFaces()) {
						weightv = weightv + this.area(nf);
					}
					let pn = this.geometry.positions[nv];
					x = x + pn.x * weightv;
					y = y + pn.y * weightv;
					z = z + pn.z * weightv;
					weight = weight + weightv;
				}
				p.x = x / weight;
				p.y = y / weight;
				p.z = z / weight;
			}
		}
	}
}