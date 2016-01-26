BattleTanksLaunchState = (function(){
	BattleTanksLaunchState = function(owner){
		State.call(this, owner);
	};
	
	UTIL.inherits(BattleTanksLaunchState, State);
	
	proto = BattleTanksLaunchState.prototype;
	
	proto.firstThingToDo = function(){
		var init = function(){
			var graphics = this.owner.graphics;
			var scene = graphics.createScene({physics:true, reportSize : 5});

			var camera = graphics.createCamera({fov : 60});
			camera.position.set( -6, 1, 6);
			camera.lookAt( scene.position );
			scene.add(camera);

			var light = new THREE.AmbientLight(0xffffff,1);
			light.position.set(10, 10, 10);
			scene.add(light);
			
			var assetman = new AssetManager();
			
			this.scene = scene;
			this.camera = camera;
			this.assetman = assetman;
			this.gameStartTimer = new Timer(this.owner.time.secToMSec(5));
		};
		
		init.call(this);
		
		var createScene = function(){
			var box = O3DTemplate.createBox(5, 5, 5, new THREE.MeshBasicMaterial({color : 0xffffff}), true, 1.0, 1.0, 1.0);
			
			var logoTextureSource = "/BattleTanks/src/img/battle_tanks_logo.png";
			var assetman = this.assetman;
			var whenLoaded = function(){
				box.traverse(
					function(object){
						if(object instanceof THREE.Mesh){
							object.material = new THREE.MeshBasicMaterial({
								transparent: true,
								alphaTest:0.5,
								map:assetman.loadedTexture[logoTextureSource]
							});
						}
					}
				)
			};
			assetman.loadTexture(logoTextureSource, whenLoaded);
			box.translateY(20);
			box.rotateY(-Math.PI/6);
			box.rotateX(Math.PI/6);
			
			this.logoBox = box;
			
			var floor = O3DTemplate.createFloor(60, 60, new THREE.MeshBasicMaterial({color:0x000000}), true, 0.0, 0.1, 0.0);
			
			this.scene.add(box);
			this.scene.add(floor);
		};
		
		createScene.call(this);
		this.gameStartTimer.start();
	};
	
	proto._update = function(dt){
		this.camera.lookAt(this.logoBox.position);
		this.gameStartTimer.update(dt);
		if(this.gameStartTimer.isTimeup()){
			console.log("next state");
			this.owner.changeState(this.owner.states.atGameStart);
		}
	};
	
	return BattleTanksLaunchState;
})();