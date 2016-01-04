BattleTanksLaunchState = (function(){
	BattleTanksLaunchState = function(owner){
		State.call(this);
		
		this._owner = owner;
		
		function __createScene(){
			var graphics = this._owner;
		}
		
	};
	
	UTIL.inherits(BattleTanksLaunchState, State);
	
	proto = BattleTanksLaunchState.prototype;
	
	proto.update = function(){
		
	};
	
	proto.render = function(){
		this.owner.graphics.render(this.scene, this.camera);
	};
	
	return BattleTanksLaunchState;
})();