StateMachine = (function(){
	StateMachine = function(startingState){
		this._currentState = startingState;
		this._previousState = undefined;
	};

	proto = StateMachine.prototype;

	proto.revert = function(){
		var temp = this._previousState;
		this._previousState = this._currentState;
		this._currentState = this._previousState;
	}

	proto.change = function(state){
		this._currentState.exit();
		this._previousState = this._currentState;
		this._currentState = state;
		this._currentState.enter();
	};

	proto.update = function(dt){
		this._currentState.update(dt);
	};

	proto.render = function(renderer){
		this._currentState.render(renderer);
	};

	return StateMachine;
})();
