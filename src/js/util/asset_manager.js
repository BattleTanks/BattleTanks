AssetManager = (function(){
	AssetManager = function(){
		this.loadedObj = {};
		this.loadedTexture = {};
		this.objLoader = new THREE.OBJLoader();
		this.textureLoader = new THREE.TextureLoader();
	};

	proto = AssetManager.prototype;

	proto.isAllLoaded = function(holder){
		for(var src in holder){
			if(holder[src] === null) return false;
		}
		return true;
	}

	proto.load = function(loader, source, holder, whenAllLoaded){
		var isAllLoaded = this.isAllLoaded;
		var whenLoaded = function(asset){
			holder[source] = asset;
			if(isAllLoaded(holder)) whenAllLoaded();
		};
		
		var whenLoading = function(){
			BROUSER.log("loading " + source);
		};
		
		var whenError = function(){
			BROUSER.error("failed to load " + source);
		};
		
		loader.load(source, whenLoaded, whenLoading, whenError);
	};

	proto.loadObj = function(source, whenAllLoaded){
		this.load(this.objLoader, source, this.loadedObj, whenAllLoaded);
	};
	
	proto.loadTexture = function(source, whenAllLoaded){
		this.load(this.textureLoader, source, this.loadedTexture, whenAllLoaded);
	};
	
	proto.loadObjs = function(sources, whenAllLoaded){
		for(var i = 0; i < sources.length; ++i){
			this.loadedObj[sources[i]] = null;
		}
		
		for(var i = 0; i < sources.length; ++i){
			this.loadObj(sources[i], whenAllLoaded);
		}
	};
	
	proto.loadTextures = function(sources, whenAllLoaded){
		for(var i = 0; i < sources.length; ++i){
			this.loadedTexture[sources[i]] = null;
		}
		
		for(var i = 0; i < sources.length; ++i){
			this.loadTexture(sources[i], whenAllLoaded);
		}
	};
	
	return AssetManager;
})();