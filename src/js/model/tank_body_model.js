TankBodyModel = (function(){
	TankBodyModel = function(data){
		ConstraintModel.call(this, data);
		
		this.controller = {
			rotateTurretRightButton : new MomentaryButton(),
			rotateTurretLeftButton : new MomentaryButton(),
			runRightWheelButton : new MomentaryButton(),
			runLeftWheelButton : new MomentaryButton(),
			reverseRightWheelButton : new MomentaryButton(),
			reverseLeftWheelButton : new MomentaryButton()
		}
	};

	UTIL.inherits(TankBodyModel, ConstraintModel);

	proto = TankBodyModel.prototype;

	proto.rotateTurretRight = function(){
		this.data.mount.mainTurret.constraint.enableAngularMotor(-this.data.mount.mainTurret.motorSpeed, 10);
	};
	
	proto.rotateTurretLeft = function(){
		this.data.mount.mainTurret.constraint.enableAngularMotor(this.data.mount.mainTurret.motorSpeed, 10);
	}
	
	proto.stopTurretRotation = function(){
		this.data.mount.mainTurret.constraint.enableAngularMotor(0, 10);
	};
	
	proto.rotateRightWheel = function(){
		this.data.mount.frontRightWheel.constraint.enableAngularMotor(-this.data.mount.frontRightWheel.motorSpeed, 10);
		this.data.mount.backRightWheel.constraint.enableAngularMotor(-this.data.mount.backRightWheel.motorSpeed, 10);
	};
	
	proto.rotateLeftWheel = function(){
		this.data.mount.frontLeftWheel.constraint.enableAngularMotor(-this.data.mount.frontLeftWheel.motorSpeed, 10);
		this.data.mount.backLeftWheel.constraint.enableAngularMotor(-this.data.mount.backLeftWheel.motorSpeed, 10);
	};
	
	proto.stopRightWheel = function(){
		this.data.mount.frontRightWheel.constraint.enableAngularMotor(0, 10);
		this.data.mount.backRightWheel.constraint.enableAngularMotor(0, 10);
	};
	
	proto.stopLeftWheel = function(){
		this.data.mount.frontLeftWheel.constraint.enableAngularMotor(0, 10);
		this.data.mount.backLeftWheel.constraint.enableAngularMotor(0, 10);
	};
	
	proto.reverseRightWheel = function(){
		this.data.mount.frontRightWheel.constraint.enableAngularMotor(this.data.mount.frontRightWheel.motorSpeed, 10);
		this.data.mount.backRightWheel.constraint.enableAngularMotor(this.data.mount.backRightWheel.motorSpeed, 10);
	};
	
	proto.reverseLeftWheel = function(){
		this.data.mount.frontLeftWheel.constraint.enableAngularMotor(this.data.mount.frontLeftWheel.motorSpeed, 10);
		this.data.mount.backLeftWheel.constraint.enableAngularMotor(this.data.mount.backLeftWheel.motorSpeed, 10);
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
		
		var pressRotateRightWheel = function(){ controller.runRightWheelButton.down(); };
		var releaseRotateRightWheel = function(){ controller.runRightWheelButton.up(); };
		var pressRotateLeftWheel = function(){ controller.runLeftWheelButton.down(); };
		var releaseRotateLeftWheel = function(){ controller.runLeftWheelButton.up(); };
		var pressReverseRightWheel = function(){ controller.reverseRightWheelButton.down(); };
		var releaseReverseRightWheel = function(){ controller.reverseRightWheelButton.up(); };
		var pressReverseLeftWheel = function(){ controller.reverseLeftWheelButton.down(); };
		var releaseReverseLeftWheel = function(){ controller.reverseLeftWheelButton.up(); };
		
		actions.insertKeyDownAction(pressRotateRightWheel, "Q");
		actions.insertKeyUpAction(releaseRotateRightWheel, "Q");
		actions.insertKeyDownAction(pressRotateLeftWheel, "E");
		actions.insertKeyUpAction(releaseRotateLeftWheel, "E");
		actions.insertKeyDownAction(pressReverseRightWheel, "A");
		actions.insertKeyUpAction(releaseReverseRightWheel, "A");
		actions.insertKeyDownAction(pressReverseLeftWheel, "D");
		actions.insertKeyUpAction(releaseReverseLeftWheel, "D");
	}

	proto._update = function(dt){
		if(this.controller.rotateTurretRightButton.isOn()){ this.rotateTurretRight(); }
		else if(this.controller.rotateTurretLeftButton.isOn()){ this.rotateTurretLeft(); }
		else this.stopTurretRotation();
		
		if(this.controller.runRightWheelButton.isOn()){ this.rotateRightWheel(); }
		else if(this.controller.reverseRightWheelButton.isOn()){ this.reverseRightWheel(); }
		else this.stopRightWheel();
		if(this.controller.runLeftWheelButton.isOn()){ this.rotateLeftWheel(); }
		else if(this.controller.reverseLeftWheelButton.isOn()){ this.reverseLeftWheel(); }
		else this.stopLeftWheel();
	};

	return TankBodyModel;
})();