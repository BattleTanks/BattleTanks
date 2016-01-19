MountModelData = {
	id : "",
	type : "",
	object3d : null,
	mounter : {
		point : new THREE.Vector3()
	},
	mount : {
		mount1 : {
			type : "",
			point : new THREE.Vector3(),
			rotation : {
				axis : new THREE.Vector3(),
				range : new Range(),
				bounce : 0.0
			},
			constraint : null
		}
	}
}

TurretData = {
	id : "",
	type : "turret",
	object3d : null,
	mounter : {
		point : new Three.Vector3(),
	},
 	mount : {
		gun : {
			type : "gun",
			point : new Three.Vector3(),
			rotation : {
				axis : new Three.Vector3(),
				range : new Range(0, 0),
				bounce : 0.0
			},
			constraint : null
		},
		gun2 : {
			//
		}
	}
};

TurretModel = (function(){
	TurretModel = function(data){
		Model.call(this, data);
		
		this.controller = {
			aimUpButton : new MomentaryButton(),
			aimDownButton : new MomentaryButton()
		}
	};

	UTIL.inherits(TurretModel, Model);

	proto = TurretModel.prototype;

	proto.mount = function(mount){
		var target = this.findChild(function(child){ return child.data.type == mount.type; });
		if(target === null) return;
		PointTemplate.mount(target.data.object3d, this.data.object3d, target.data.mounter.point, mount.point);
	};
	
	proto.mountAll = function(){
		for(var mountId in this.data.mount){
			this.mount(this.data.mount[mountId]);
		}
	};

	proto.constrain = function(scene, mount){
		var target = this.findChild(function(child){ return child.data.type == mount.type; });
		if(target === null) return;
		
		var children = this.data.object3d.children;	// save children before constraining
		
		mount.constraint = ConstraintTemplate.createHingeConstraint(scene, target.data.object3d, mount.point, mount.rotation.axis, mount.rotation.range, mount.rotation.bounce, this.data.object3d);
		
		// restore children
		for(var i = 0; i < children.length; ++i){
			this.data.object3d.add(children[i]);
		}
	};
	
	proto.constarinAll = function(scene){
		for(var mountId in this.data.mount){
			this.constrain(scene, this.data.mount[mountId]);
		}
	};

	proto.addToScene = function(scene){
		// mount
		this.mountAll();
		
		// add to scene
		scene.add(this.data.object3d);
		
		// constrain
		this.constrainAll(scene);
	};

	proto.insertAction = function(actionTable){
		
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

	proto._update = function(dt){
		if(this.controller.aimUpButton.isOn()){ this.rotateGunUp(); }
		else if(this.controller.aimDownButton.isOn()){ this.rotateGunDown(); }
		else this.stopGunRotation();
	};

	return TurretModel;
})();
