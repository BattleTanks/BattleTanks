TurretModel = (function(){
	TurretModel = function(data){
		ConstraintModel.call(this, data);
		
		this.controller = {
			aimUpButton : new MomentaryButton(),
			aimDownButton : new MomentaryButton()
		}
	};

	UTIL.inherits(TurretModel, ConstraintModel);

	proto = TurretModel.prototype;

	proto.insertAction = function(actionTable){
		
	}

	proto.rotateGunUp = function(){
		this.data.mount.gun.constraint.enableAngularMotor(2, 10);
	};
	
	proto.stopGunRotation = function(){
		this.data.mount.gun.constraint.enableAngularMotor(0, 10);
	};
	
	proto.rotateGunDown = function(){
		this.data.mount.gun.constraint.enableAngularMotor(-2, 10);
	};

	proto.insertAction = function(actions, inputButton){
		var controller = this.controller;
		var pressAimUp         = function(){ controller.aimUpButton.down(); };
		var releaseAimUp       = function(){ controller.aimUpButton.up(); };
		var pressAimDown       = function(){ controller.aimDownButton.down(); };
		var releaseAimDown     = function(){ controller.aimDownButton.up(); };

		actions.insertKeyDownAction(pressAimUp, "I");
		actions.insertKeyUpAction(releaseAimUp, "I");
		actions.insertKeyDownAction(pressAimDown, "K");
		actions.insertKeyUpAction(releaseAimDown, "K");
	}

	proto._update = function(dt){
		if(this.controller.aimUpButton.isOn()){ this.rotateGunUp(); }
		else if(this.controller.aimDownButton.isOn()){ this.rotateGunDown(); }
		else this.stopGunRotation();
	};

	return TurretModel;
})();
