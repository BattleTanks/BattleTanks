BattleTanks = (function(){
	BattleTanks = function(domelement){
		Application.call(this);
		
		this._previousState = undefined;
		this._state = new LaunchState();
		
		this.graphics = new Graphics({domelement:domelement, renderWidth:domelement.clientWidth, renderHeight:domelement.clientHeight});
		this.graphics.enableShadow();
		this.actionManager = new InputActionManager();
	};
	
	UTIL.inherits(BattleTanks, Application);
	
	proto = BattleTanks.prototype;
	
	proto.changeState = function(state){
		this._previousState = this._state;
		this._state = state;
	};
	
	proto.update = function(){
		this._state.update();
	};
	
	proto.render = function(){
		this._state.render();
	};
	
	return BattleTanks;
})();