TurretData = {
	id : "",
	type : "turret",
	object3d : null,
	mounter : {
		point : new Three.Vector3(),
	},
	gun : {
		model : null,
		mount : {
			point : new Three.Vector3(),
			rotation : {
				axis : new Three.Vector3(),
				range : new Range(0, 0),
				bounce : 0.0
			},
			constraint : null
		}
	}
};

TurretModel = (function(){
	TurretModel = function(data){
		Model.call(this);
		this.data = data;
		this.controller = {
			aimUpButton : new MomentaryButton(),
			aimDownButton : new MomentaryButton()
		}
	};

	UTIL.inherits(TurretModel, Model);

	proto = TurretModel.prototype;

	proto.mountGun = function(gun){
		this.add(gun);
		PointTemplate.mount(gun.object3d, this.object3d, gun.mounterPoint, this.mountPoint);
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
