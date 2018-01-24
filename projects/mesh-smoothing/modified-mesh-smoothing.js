"use strict";

class ModifiedMeshSmoothing {
	constructor(geometry) {
		this.geometry = geometry;
	}

	determinant(v1, v2, v3) {
		let a = v3.minus(v1);
		let b = v3.minus(v2);
		return a.x*b.y - a.y*b.x;
	}

	isPositive(currentValue) {
		return currentValue > 0;
	}

	isNegative(currentValue) {
		return currentValue <= 0;
	}

	project(v, p) {
		let normal = this.geometry.vertexNormalEquallyWeighted(v);
		let a = normal.x;
		let b = normal.y;
		let c = normal.z;
		let t = (a*this.geometry.positions[v].x + b*this.geometry.positions[v].y + c*this.geometry.positions[v].z - (a*p.x + b*p.y + c*p.z)) / (a*a + b*b + c*c);
		let q = new Vector(0, 0, 0);
		q.x = p.x + a*t;
		q.y = p.y + b*t;
		q.z = p.z + c*t;
		return q;
	}

	insideBoundary(v, position) {
		let determinants = [];
		for (let nf of v.adjacentFaces()) {
			let edge = [];
			for (let nvnf of nf.adjacentVertices()) {
				if (nvnf !== v) {
					edge.push(this.project(v, this.geometry.positions[nvnf]));
				}
			}
			determinants.push(this.determinant(edge[0], edge[1], this.project(v, position)));
		}
		if (determinants.every(this.isPositive)) {
			return true;
		}
		if (determinants.every(this.isNegative)) {
			return true;
		}
		return false;
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
				if (!this.insideBoundary(v, position)) {
					position.x = 0;
					position.y = 0;
					position.z = 0;
					for (let nv of v.adjacentVertices()) {
						position = position.plus(this.geometry.positions[nv]);
					}
					position = position.over(v.degree());
				}
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