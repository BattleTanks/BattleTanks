function test(){
	var scene, graphics, camera, element, assetman;
	var init = function(){
		element = BROUSER.getElementById("viewport");
		graphics = new Graphics({shadow:true, domelement:element, renderWidth:element.clientWidth, renderHeight:element.clientHeight });
		graphics.enableShadow();
		scene = graphics.createScene({physics:true, repoertSize : 30});

		camera = graphics.createCamera({fov : 35});
		camera.position.set( -10, 10, -10 );
		camera.lookAt( scene.position );
		scene.add(camera);

		var light = O3DTemplate.setLazyShadowSettings(new THREE.DirectionalLight(0xffffff,1));
		light.position.set(10, 10, 10);
		scene.add(light);
		
		scene.add(new THREE.HemisphereLight(0xafafff, 0x000000, 0.5));

		inputman = new InputActionManager(element);
		actions = new ActionTable();
		
		assetman = new AssetManager();
	};
	init();
	
	var objDir = "/BattleTanks/src/obj/";
	var objSources = [objDir+"test.obj", objDir+"terrain.obj"];
	
	var textureDir = "/BattleTanks/src/texture/";
	var textureSources = [textureDir+"test_tex.png"];
	
	var update = function(){
		// render
		graphics.render(scene, camera);
		requestAnimationFrame( update );
	};
	
	var whenAllObjLoaded = function(){
		console.log("all obj loaded");
		for(var src in assetman.loadedObj){
			console.log("adding " + src);
			scene.add(assetman.loadedObj[src]);
		}
		
		update();
	};
	
	var whenAllTextureLoaded = function(){
		console.log("all texture loaded");
		for(var src in assetman.loadedTexture){
			console.log("texturing " + src);
			assetman.loadedObj[objDir+"test.obj"].traverse(
				function(object){
					if(object instanceof THREE.Mesh){
						object.material = new THREE.MeshBasicMaterial({map:assetman.loadedTexture[textureDir + "test_tex.png"]});
					}
				}
			);
		}
	};

	assetman.loadObjs(objSources, whenAllObjLoaded);
	assetman.loadTextures(textureSources, whenAllTextureLoaded);
}