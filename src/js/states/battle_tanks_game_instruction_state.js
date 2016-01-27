BattleTanksGameInstructionState = (function(){
	BattleTanksGameInstructionState = function(owner){
		State.call(this, owner);
	};
	
	UTIL.inherits(BattleTanksGameInstructionState, State);
	
	proto = BattleTanksGameInstructionState.prototype;
	
	proto.firstThingToDo = function(){
		var init = function(){
			var graphics = this.owner.graphics;
			var scene = graphics.createScene({physics:false});

			var camera = graphics.createCamera({fov : 40});
			camera.position.set( 0, 1, 6);
			scene.add(camera);

			var light = new THREE.AmbientLight(0xffffff,1);
			light.position.set(10, 10, 10);
			scene.add(light);
			
			var assetman = new AssetManager();
			
			this.scene = scene;
			this.camera = camera;
			this.assetman = assetman;
			this.actions = new ActionTable();
		};
		
		init.call(this);
		
		var prepareControllSign = function(){
			var backGroundSource = "/BattleTanks/src/img/metal.png";
			var controllTextureSource = "/BattleTanks/src/img/controll.png";
			var assetman = this.assetman;
			var scene = this.scene;
			var camera = this.camera;
			var whenLoaded = function(){
				var backGroundSign = O3DTemplate.createTexturedPlane(10, 10, assetman.loadedTexture[backGroundSource]);
				backGroundSign.translateZ(-1.2);
				
				var controllSign = O3DTemplate.createTexturedPlane(5, 5, assetman.loadedTexture[controllTextureSource]);
				controllSign.translateY(1);
				
				camera.lookAt(controllSign);
				scene.add(backGroundSign);
				scene.add(controllSign);
			};
			assetman.loadTextures([controllTextureSource, backGroundSource], whenLoaded);
		};
		
		prepareControllSign.call(this);
		
		// set key action
		var stateMachine = this.owner;
		var nextState = this.owner.states.atGameStart;
		var changeState = function(){
			var startSound = new Audio("/BattleTanks/src/sound/biggun.mp3");
			startSound.volume -= 0.5;
			startSound.play();
			stateMachine.changeState(nextState);
		}
		this.actions.insertKeyDownAction(changeState);
		this.owner.actionManager.setActionTable(this.actions);
	};
	
	proto._update = function(dt){
	};
	
	return BattleTanksGameInstructionState;
})();