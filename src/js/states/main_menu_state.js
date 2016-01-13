MainMenuState = (function(){
	MainMenuState = function(owner){
		State.call(this, owner);

		this.rootModel.add(new GameTitleModel());
		//this.rootModel.add(new GameStartButtonModel());

		positionObject();
		addToScene();
	};

	UTIL.inherits(MainMenuState, State);

	proto = MainMenuState.prototype;

	proto._update = function(dt){

	};

	proto._render = function(renderer){
		renderer.render(this.scene, this.camera);
	};

	return MainMenuState;
})();
