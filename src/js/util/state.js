State = (function(){
	State = function(owner){
		this.owner = owner;
		this.firstTime = true;
		this.rootModel = new RootModel();
	};

	proto = State.prototype;

	proto.enter = function(){
		// define method when entering state
	};

	proto.exit = function(){
		// define method when exiting state
	};

	proto.firstThingToDo = function(){
		// define method when entering for the frist time
	}

	proto._update = function(dt){
		BROUSER.warn("State._update is not defined!!");
	};

	proto._render = function(){
		if(UTIL.isUndefined(this.scene) || UTIL.isUndefined(this.camera)) return;
		this.owner.graphics.render(this.scene, this.camera);
	};

	proto.update = function(dt){
		this._update(dt);
		this.rootModel.update(dt);
		this._render();
	};

	return State;
})();
