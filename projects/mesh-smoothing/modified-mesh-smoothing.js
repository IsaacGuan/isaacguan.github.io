"use strict";

class ModifiedMeshSmoothing {
	constructor(geometry) {
		this.geometry = geometry;
	}

	apply(steps) {
		for (let i=0; i<steps; i++) {
			let positions = {};
			for (let v of this.geometry.mesh.vertices) {
				let position = new Vector(0, 0, 0);
				let weight = 0;
				for (let nv of v.adjacentVertices()) {
					let weightv = 0;
					for (let nf of v.adjacentFaces()) {
						for (let nfnv of nv.adjacentFaces()) {
							if (nf === nfnv) {
								weightv = weightv + this.geometry.area(nf);
							}
						}
					}
					position = position.plus(this.geometry.positions[nv].times(weightv));
					weight = weight + weightv;
				}
				position = position.over(weight);
				let flag = false;
				for (let ne of v.adjacentEdges()) {
					if (ne.onBoundary()) {
						flag = true;
					}
				}
				if (!flag) {
					positions[v] = position;
				} else {
					positions[v] = this.geometry.positions[v];
				}
			}
			this.geometry.positions = positions;
		}
	}
}