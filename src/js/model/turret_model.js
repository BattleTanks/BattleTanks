TurretData = {
	id : "",
	type : "turret",
	object3d : null,
	mounter : {
		point : new Three.Vector3(),
	},
 	mount : {
		gun : {
			type : GunModel,
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

	proto.mount = function(mount){
		for(var child = this.children.first(); child; this.children.next()){
			if(child instanceof mount.type) PointTemplate.mount(child.data.object3d, this.data.object3d, child.data.mounter.point, mount.point);
		}
	};

	proto.addToScene = function(scene){
		// mount
		for(var mount in this.data.mount){
			this.mount(this.data.mount[mountId]);
		}
		
		// add to scene
		for(var child = this.children.first(); child; this.children.next()){
			child.addToScene(scene);
		}
		
		// constrain
		for(var mount in this.data.mount){
			mount.constraint = for(var )
		}
		
		for(var child = this.children.frist(); child; this.children.next()){
			child.constraint();
		}
	}

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
