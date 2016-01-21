TankBodyModel = (function(){
	TankBodyModel = function(data){
		ConstraintModel.call(this, data);
		
		this.controller = {
			rotateTurretRightButton : new MomentaryButton(),
			rotateTurretLeftButton : new MomentaryButton()
		}
	};

	UTIL.inherits(TankBodyModel, ConstraintModel);

	proto = TankBodyModel.prototype;

	proto.rotateTurretRight = function(){
		this.data.mount.turret.constraint.enableAngularMotor(2, 10);
	};
	
	proto.rotateTurretLeft = function(){
		this.data.mount.turret.constraint.enableAngularMotor(-2, 10);
	}
	
	proto.stopTurretRotation = function(){
		this.data.mount.turret.constraint.enableAngularMotor(0, 10);
	};

	proto.insertAction = function(actions, inputButton){
		var controller = this.controller;
		var pressRotateTurretRight		= function(){ controller.rotateTurretRightButton.down(); };
		var releaseRotateTurretRight	= function(){ controller.rotateTurretRightButton.up(); };
		var pressRotateTurretLeft		= function(){ controller.rotateTurretLeftButton.down(); };
		var releaseRotateTurretLeft		= function(){ controller.rotateTurretLeftButton.up(); };

		actions.insertKeyDownAction(pressRotateTurretRight, "L");
		actions.insertKeyUpAction(releaseRotateTurretRight, "L");
		actions.insertKeyDownAction(pressRotateTurretLeft, "J");
		actions.insertKeyUpAction(releaseRotateTurretLeft, "J");
	}

	proto._update = function(dt){
		if(this.controller.rotateTurretRightButton.isOn()){ this.rotateTurretRight(); }
		else if(this.controller.rotateTurretLeftButton.isOn()){ this.rotateTurretLeft(); }
		else this.stopTurretRotation();
	};

	return TankBodyModel;
})();