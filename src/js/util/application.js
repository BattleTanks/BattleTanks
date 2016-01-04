Application = (function(){
	Application = function(){
		this._running = true;
	};

	proto = Application.prototype;

	proto.update = function(){};
	
	proto.render = function(){};
	
	proto.quit = function(){
		this._running = false;
	};
	
	proto.isRunning = function(){
		return this._running;
	};

	return Application;
})();