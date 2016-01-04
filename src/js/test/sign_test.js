function test(){
	var scene, graphics, camera;
	var init = function(){
		var element = BROUSER.getElementById("viewport");
		graphics = new Graphics({ domelement:element, renderWidth:element.clientWidth, renderHeight:element.clientHeight });
		graphics.enableShadow();
		scene = graphics.createScene({physics:false});
		
		camera = graphics.createCamera({fov : 35});
		camera.position.set( -10, 10, 10 );
		camera.lookAt( scene.position );
		scene.add(camera);
		
		var light = O3DTemplate.setLazyShadowSettings(new THREE.DirectionalLight(0xffffff,1));
		light.position.set(10, 10, 10);
		scene.add(light);
	};
	init();
	
	var canvasSign = O3DTemplate.createTexturedPlane(10, 10, TextureTemplate.createTextTexture("バトルたんくす!!", {textStartX : 10, textStartY : 512}));
	scene.add(canvasSign);
	
	var whenLoaded = function(texture){
		var sign = O3DTemplate.createTexturedPlane(10, 10, texture);
		scene.add(sign);
		console.log("loaded");
	};
	var textureLoader = new THREE.TextureLoader();
	textureLoader.load("/img/battle_tanks_logo.png", whenLoaded);
	
	var floor = O3DTemplate.createFloor(50, 50);
	floor.translateY(-5);
	scene.add(floor);
	
	var update = function(){
		canvasSign.rotation.y += 0.05;
		graphics.render(scene, camera); // render the scene
		requestAnimationFrame(update);
	};
	update();
}