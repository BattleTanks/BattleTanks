var Template = (function(){
	Template = function(){};
	
	proto = Template.prototype;
	
	proto.createLoadingSign = function(graphics, message){
		var __createLoadingSignTexture = function(){
			// create canvas bitmap
			var bitmap = document.createElement('canvas');
			var context = bitmap.getContext('2d');
			bitmap.width = 1024;
			bitmap.height = 1024;
			context.font = 'Bold 66px Arial';
			context.fillStyle = 'white';
			context.fillText(message, 0, 20);
			context.strokeStype = "black";
			context.strokeText(message, 0, 20);
			
			var texture = new THREE.Texture(bitmap);
			texture.needsUpdate = true;
			
			return texture;
		};
		
		var __createLoadingSign = function(){
			var geometry = new THREE.BoxGeometry(2, 2, 2);
			var texture = __createLoadingSignTexture();
			var material = new THREE.MeshBasicMaterial(texture);
			var mesh = new THREE.Mesh(geometry, material);
			mesh.name = "loading sign";
			return mesh;
		};
		
		return __createLoadingSign();
	};
	
	return Template;
})();
TEMPLATE = new Template();

AssetLoadingState = (function(){
	AssetLoadingState = function(owner){
		State.call(this);
		this._owner = owner;
		this._isLoaded = false;
		
		this._bridge = {};
		bridge.isLoaded = this._isLoaded;
		var whenLoaded = function(){
			bridge.isLoaded = true;
		};
		this._owner.loadAssetes();
		
		this._graphics = this._owner.getGraphicsManager();
		this._texts = this._owner.getTextManager();
		
		this._loadingSign = TEMPLATE.createLoadingSign(this._graphics, this._texts.getText("loading"));
		this._loadingScene = this._graphics.createScene();
		this._camera = this._graphics.createCamera();
		
		var __createLoadingScene = function(){
			this._loadingScene.add(this._loadingSign);
			this._loadingScene.add(new THREE.AmbientLight(0xffffff, 1));
			
			this._camera.translateZ(5);
			this._loadingScene.add(this._camera);
		};
	};
	
	UTIL.inherits(AssetLoadingState, State);
	
	proto = AssetLoadingState.prototype;
	
	proto.loadAssets(){
		
	};
	
	proto.update = function(){
		if(this._owner.loaded()) this._owner.changeState(new AssetCreateState(this._owner));
	};
	
	proto.render = function(){
		this._owner.graphics.render(this._loadingScene, this._camera);
	};
	
	return AssetLoadingState;
})();

AssetCreateState = (function(){
	AssetCreateState = function(owner){
		State.call(this);
		
		this._owner = owner;
	};
	
	UTIL.inherits(AssetCreateState, State);
	
	proto = AssetCreateState.prototype;
	
	proto.update = function(){
		if(this._loaded) this._owner.changeState(new AssetReadyState(this._owner));
	};
	
	proto.render = function(){
		this._owner.graphics.render(this._loadingScene, this._camera);
	};
	
	return AssetCreateState;
})();

AssetReadyState = (function(){
	AssetReadyState = function(owner){
		State.call(this);
		
		this._owner = owner;
	};
	
	UTIL.inherits(AssetReadyState, State);
	
	proto = AssetReadyState.prototype;
	
	proto.update = function(){
		
	};
	
	proto.render = function(){
		this._owner.graphics.render(this._scene, this._camera);
	};
	
	return AssetReadyState;
})();

var createTitleScene = function(graphics){
	var graphics;
	var scene = graphics.createScene();
	
	var __createLogoObject = function(){
		var geometry = new THREE.PlaneGeometry(10, 10);
		
		var logoImage;
		var textureLoader = new THREE.TextureLoader();
		var whenLoaded = function(texture){
			logoImage = texture;
		};
		textureLoader.load("/img/battle_tanks_logo.png", whenLoaded);
		
		var material = new THREE.MeshBasicMaterial({map:logoImage, alphamap:logoImage});
		
		var mesh =  THREE.Mesh(geometry, material);
		mesh.name = "battle tanks logo";
		
		return mesh;
	};
	
	var __createAmbientLight = function(){
		var light = new THREE.AmbientLight(0xffffff, 1);
		
		return light;
	};
	
	var light = __createAmbientLight();
	var logo = __createLogoObject();
	
	scene.add(light);
	scene.add(logo);
	
	return scene;
};


function test(){
	var scene, graphics, camera;
	var init = function(){
		var element = BROUSER.getElementById("viewport");
		graphics = new Graphics({ domelement:element, renderWidth:element.clientWidth, renderHeight:element.clientHeight });
		graphics.enableShadow();
		scene = graphics.createScene({physics:true});
		
		camera = graphics.createCamera({fov : 35});
		camera.position.set( -10, 10, 10 );
		camera.lookAt( scene.position );
		scene.add(camera);
	};
	init();
	
	var scene = createTitleScene(graphics);
	
	
	var update = function() {
		graphics.render(scene, camera); // render the scene
		requestAnimationFrame( update );
	};
	update();
}