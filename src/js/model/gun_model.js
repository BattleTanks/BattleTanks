GunModel = (function(){
	GunModel = function(data){
		MountModel.call(this, data);
		
		this.fireSound = new Audio(data.fireSound);
		this.reloadSound = new Audio(data.reloadSound);
		
		this.controller = {
			trigger : new MomentaryButton()
		};
		
		this.isLoaded = true;
		this.reloadTimer = new Timer(data.reloadSpeed);
	};

	UTIL.inherits(GunModel, MountModel);

	proto = GunModel.prototype;

	proto.fire = function(){
		console.log("fire!!");
		this.fireSound.play();
		this.isLoaded = false;
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
	
	proto.reload = function(dt){
		if(this.reloadTimer.isStoped()){
			this.reloadTimer.start();
		}
		
		this.reloadTimer.update(dt);
		
		if(this.reloadTimer.isTimeup()){
			console.log("reloaded!!");
			this.reloadSound.play();
			this.isLoaded = true;
			this.reloadTimer.reset();
		}
	};
	
	proto._update = function(dt){
		if(this.isLoaded){
			if(this.controller.trigger.isOn()) this.fire();
		}
		else{
			this.reload(dt);
		}
	};

	return GunModel;
})();
