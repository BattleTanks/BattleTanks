GunModel = (function(){
	GunModel = function(data){
		MountModel.call(this, data);
		
		this.fireSound = new Audio(data.sound);
		
		this.controller = {
			trigger : new MomentaryButton()
		};
		
		this.reloadTimer = new Timer(data.reloadSpeed);
		this.reloadTimer.start();
	};

	UTIL.inherits(GunModel, MountModel);

	proto = GunModel.prototype;

	proto.fire = function(){
		console.log("fire!!");
		this.fireSound.play();
		this.reloadTimer.restart();
	};
	
	proto.insertAction = function(actions, inputButton){
		var controller = this.controller;
		var pullTrigger = function(){ controller.trigger.down(); };
		var releaseTrigger = function(){ controller.trigger.up(); };
		
		actions.insertKeyDownAction(pullTrigger, " ");
		actions.insertKeyUpAction(releaseTrigger, " ");
	};

	proto.isReloaded = function(dt){
		this.reloadTimer.update(dt);
		return this.reloadTimer.isTimeup();
	};
	
	proto._update = function(dt){
		if(this.isReloaded(dt)){
			if(this.controller.trigger.isOn()) this.fire();
		}
	};

	return GunModel;
})();
