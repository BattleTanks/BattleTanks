BattleTanks = (function(){
	BattleTanks = function(domelement){
		Application.call(this);
		
		this._previousState = undefined;
		
		this.graphics = new Graphics({
			shadow:true,
			domelement:domelement,
			renderWidth:domelement.clientWidth,
			renderHeight:domelement.clientHeight
		});
		this.graphics.enableShadow();
		
		this.actionManager = new InputActionManager();
		
		this.states = {
			"atLaunch" : new BattleTanksLaunchState(this),
			"afterLaunch" : new BattleTanksGameInstructionState(this),
			"atGameStart" : new BattleTanksGameState(this)
		}
		
		this._state = this.states.atLaunch;
		
		this.time = new Time();
	};
	
	UTIL.inherits(BattleTanks, Application);
	
	proto = BattleTanks.prototype;
	
	proto.changeState = function(state){
		this._previousState = this._state;
		this._state = state;
	};
	
	proto.update = function(){
		if(this._state.firstTime){
			this._state.firstThingToDo();
			this._state.firstTime = false;
		}
		this._state.update(this.time.update());
	};
	
	return BattleTanks;
})();