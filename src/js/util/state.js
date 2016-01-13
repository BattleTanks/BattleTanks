State = (function(){
	State = function(owner){
		this.owner = owner;
		this.rootModel = new Model();
	};

	proto = State.prototype;

	proto.enter = function(){
		// define method when entering state
	};

	proto.exit = function(){
		// define method when exiting state
	};

	proto._update = function(dt){
		BROUSER.warn("State._update is not defined!!");
	};

	proto.update = function(dt){
		this._update(dt);
		this.rootModel.update(dt);
	};

	proto._render = function(renderer){
		BROUSER.warn("State._render is not defined!!");
	}

	proto.render = function(renderer){
		this._render(renderer);
	};

	return State;
})();
