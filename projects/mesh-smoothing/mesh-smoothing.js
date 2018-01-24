"use strict";

class MeshSmoothing {
	constructor(geometry) {
		this.geometry = geometry;
	}

	onEdge(v) {
		for (let ne of v.adjacentEdges()) {
			if (ne.onBoundary()) {
				return false;
			}
		}
		return true;
	}

	apply(steps) {
		for (let i=0; i<steps; i++) {
			let positions = {};
			for (let v of this.geometry.mesh.vertices) {
				let position = new Vector(0, 0, 0);
				for (let nv of v.adjacentVertices()) {
					position = position.plus(this.geometry.positions[nv]);
				}
				position = position.over(v.degree());
				if (this.onEdge(v)) {
					positions[v] = position;
				} else {
					positions[v] = this.geometry.positions[v];
				}
			}
			this.geometry.positions = positions;
		}
	}
}