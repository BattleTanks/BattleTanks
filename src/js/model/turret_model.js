ControllerButton = (function(){
	ControllerButton = function(button){
		this.button = button;
	};
	
	proto = ControllerButton.prototype;
	
	proto.press = function(){
		this.button.down();
	};
	
	proto.release = function(){
		this.button.up();
	};
	
	return ControllerButton;
})();

TurretModel = (function(){
	TurretModel = function(id){
		Model.call(this);

		this.id = id;

		function createTurretObject(){
			var size = {
				width: 1.0,
				height: 1.0,
				depth: 1.0
			};
			return O3DTemplate.createBox(size.width, size.height, size.depth, new THREE.MeshLambertMaterial({color:0x9f25f0}), true, 0.9, 0.0, 20);
		}

		this.object3d = createTurretObject();

		this.mounterPoint = new THREE.Vector3(0.0, -0.5, 0.0);

		this.mountPoint = new THREE.Vector3(0.0, 0.0, -0.6);
		this.rotationAxis = new THREE.Vector3(1.0, 0.0, 0.0);
		this.rotationRange = new Range(0, Math.PI/6);
		this.rotationBounce = 0.0;

		this.turret;
		this.gunConstraint;
		this.controller = {
			aimUpButton : new MomentaryButton(),
			aimDownButton : new MomentaryButton()
		}
	};

	UTIL.inherits(TurretModel, Model);

	proto = TurretModel.prototype;

	proto.mountGun = function(turret){
		PointTemplate.mount(turret.object3d, this.object3d, turret.mounterPoint, this.mountPoint);
	};

	proto.rotateGunUp = function(){
		this.gunConstraint.enableAngularMotor(2, 10);
	};
	
	proto.stopGunRotation = function(){
		this.gunConstraint.enableAngularMotor(0, 10);
	};
	
	proto.rotateGunDown = function(){
		this.gunConstraint.enableAngularMotor(-2, 10);
	};

	proto._update = function(){
		if(this.controller.aimUpButton.isOn()){ this.rotateGunUp(); }
		else if(this.controller.aimDownButton.isOn()){ this.rotateGunDown(); }
		else this.stopGunRotation();
	};

	return TurretModel;
})();
