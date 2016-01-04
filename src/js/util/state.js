State = (function(){
	State = function(owner){
	};

	proto = State.prototype;
	
	proto.enter = function(){
		
	};
	
	proto.exit = function(){
		
	};
	
	proto.update = function(){ BROUSER.log("<!! WARNING !!> State.update is not defined"); };
	
	proto.render = function(){ BROUSER.log("<!! WARNING !!> State.render is not defined"); };

	return State;
})();