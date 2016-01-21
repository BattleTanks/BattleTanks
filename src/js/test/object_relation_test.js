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
	
	var update = function(){
		// render
		graphics.render(scene, camera);
		requestAnimationFrame( update );
	};
	
	// library for "/BattleTanks/src/obj/relation_test.obj"
	var meshLibrary = {
		"baseP" : {
			name : "baseP",
			parent : "root",
			type : "base",
			physics : true,
			physicsMeshType : "box",
			visible : true,
			friction : 0,
			restitution : 0,
			mass : 0,
			mesh : null
		},
		"base" : {
			name : "base",
			parent : "baseP",
			type : "base",
			physics : false
		},
		"top" : {
			name : "top",
			parent : "base",
			type : "top",
			physics : true,
			physicsMeshType : "convex",
			visible : true,
			friction : 0,
			restitution : 0,
			mass : 0,
			mesh : null
		}
	}
	
	var objDir = "/BattleTanks/src/obj/";
	var objSources = [objDir+"relation_test.obj"];
	var objRelator = new ObjectRelator(meshLibrary);
	
	var whenAllObjLoaded = function(){
		console.log("all obj loaded");
		var datas = {};
		for(var src in assetman.loadedObj){
			datas[src] = objRelator.createData(assetman.loadedObj[src]);
			console.log(datas);
		}
		
		scene.add((datas[src]).object3d);
		
		scene.add(O3DTemplate.createAxes(0,0,0, 5));
		
		update();
	};

	assetman.loadObjs(objSources, whenAllObjLoaded);
}