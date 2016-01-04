Object3DTemplate = (function(){
	Object3DTemplate = function(){
		this.COLOR = {
			WHITE  : 0xeeeeee,
			RED    : 0xff0000,
			BLUE   : 0x0000ff,
			GREEN  : 0x11f2a9,
			YELLOW : 0xfffe24,
			PURPLE : 0xfe3ff4
		};
	};

	proto = Object3DTemplate.prototype;

	proto.setLazyShadowSettings = function(light){		
		light.castShadow = true;
		light.shadowCameraLeft   = -10;
		light.shadowCameraRight  = 10;
		light.shadowCameraBottom = 10;
		light.shadowCameraTop    = -10;
		light.shadowCameraNear   = 1;
		light.shadowCameraFar    = 60;
		light.shadowBias         = -0.0001;
		light.shadowMapWidth     = 2048;
		light.shadowMapHeight    = 2048;
		light.shadowDarkness     = 0.5;
		return light;
	};

	proto.createPhysicsMesh = function(type, geometry, material, friction, restitution, mass){
		friction    = UTIL.optional(0.8, friction);
		restitution = UTIL.optional(0.8, restitution);
		material = Physijs.createMaterial(material, friction, restitution);
		
		mass = UTIL.optional(0, mass);
	
		switch(type){
			case "box":
				return new Physijs.BoxMesh(geometry, material, mass);
			case "sphere":
				return new Physijs.SphereMesh(geometry, material, mass);
			case "cylinder":
				return new Physijs.CylinderMesh(geometry, material, mass);
			case "cone":
				return new Physijs.ConeMesh(geometry, material, mass);
			case "capsule":
				return new Physijs.CapsuleMesh(geometry, material, mass);
			case "convex":
				return new Physijs.ConvexMesh(geometry, material, mass);
			case "concave":
				return new Physijs.ConcaveMesh(geometry, material, mass);
			default:
				console.log("invalid physics mesh type");
				return new Physijs.BoxMesh(geometry, material, mass);
		}
	};

	proto.createWheel = function(radius, width, radiusSegments, material, physics, friction, restitution, mass){
		var geometry = new THREE.CylinderGeometry(radius, radius, width, radiusSegments);
		geometry.rotateZ(Math.PI/2);
		
		if(UTIL.isUndefined(material)) material = new THREE.MeshLambertMaterial({color:this.COLOR.YELLOW});
		
		var mesh = physics ? this.createPhysicsMesh("sphere", geometry, material, friction, restitution, mass) : new THREE.Mesh(geometry, material);
		
		mesh.castShadow = true;
		mesh.receiveShadow = false;
		
		return mesh;
	};

	proto.createCylinder = function(radius, height, radiusSegments, material, physics, friction, restitution, mass){
		var geometry = new THREE.CylinderGeometry(radius, radius, height, radiusSegments);
		
		if(UTIL.isUndefined(material)) material = new THREE.MeshLambertMaterial({color:this.COLOR.YELLOW});
		
		var mesh = physics ? this.createPhysicsMesh("cylinder", geometry, material, friction, restitution, mass) : new THREE.Mesh(geometry, material);
		
		mesh.castShadow = true;
		mesh.receiveShadow = false;
		
		return mesh;
	};

	proto.createBox = function(width, height, depth, material, physics, friction, restitution, mass){
		var geometry = new THREE.BoxGeometry(width, height, depth);
		
		if(UTIL.isUndefined(material)) material = new THREE.MeshLambertMaterial({color:this.COLOR.BLUE});
		
		var mesh = physics ? this.createPhysicsMesh("box", geometry, material, friction, restitution, mass) : new THREE.Mesh(geometry, material);
		
		mesh.castShadow = true;
		mesh.receiveShadow = false;
		
		return mesh;
	};

	proto.createFloor = function(width, depth, material, physics, friction, restitution, mass){
		var geometry = new THREE.BoxGeometry(width, 0.2, depth);
		
		if(UTIL.isUndefined(material)) material = new THREE.MeshLambertMaterial({color:this.COLOR.WHITE});
		
		var mesh = physics ? this.createPhysicsMesh("box", geometry, material, friction, restitution, mass) : new THREE.Mesh(geometry, material);
		
		mesh.castShadow = false;
		mesh.receiveShadow = true;
		
		return mesh;
	};

	proto.createPoint = function(x, y, z, color, radius, physics, friction, restitution, mass){
		var geometry = new THREE.SphereGeometry(UTIL.optional(0.1, radius));
		var material = new THREE.MeshLambertMaterial({color:UTIL.optional(this.COLOR.RED, color)});		
		var mesh = physics ? this.createPhysicsMesh("sphere", geometry, material, friction, restitution, mass) : new THREE.Mesh(geometry, material);	
		mesh.position.set(x, y, z);
		return mesh;
	};

	proto.createTexturedPlane = function(width, height, texture){
		var geometry = new THREE.PlaneGeometry(width, height);
		var material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide, map:texture, transparent:true, alphaTest:0.5});
		var mesh =  new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		mesh.receiveShadow = false;

		return mesh;
	};
	
	proto.createAxes = function(x, y, z, length){
		length = UTIL.optional(1, length);
		var xAxis = this.createBox(length, 0.1, 0.1, new THREE.MeshLambertMaterial({color:this.COLOR.RED}));
		var yAxis = this.createBox(0.1, length, 0.1, new THREE.MeshLambertMaterial({color:this.COLOR.GREEN}));
		var zAxis = this.createBox(0.1, 0.1, length, new THREE.MeshLambertMaterial({color:this.COLOR.BLUE}));
		var point = this.createPoint(x, y, z, this.COLOR.WHITE);
		
		point.add(xAxis);
		point.add(yAxis);
		point.add(zAxis);
		
		var offset = length / 2;
		xAxis.position.x = offset;
		yAxis.position.y = offset;
		zAxis.position.z = offset;
		
		return point;
	};

	return Object3DTemplate;
})();
var O3DTemplate = new Object3DTemplate();