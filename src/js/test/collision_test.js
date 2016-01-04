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

		var light = O3DTemplate.setLazyShadowSettings(new THREE.DirectionalLight(0xffffff,1));
		light.position.set(10, 10, 10);
		scene.add(light);
	};
	init();
	
	var floor = O3DTemplate.createFloor(10, 10, new THREE.MeshLambertMaterial({color:0xffe24f}), true, 0.3, 0.2);
	floor.name = "da floor";
	
	floor.addEventListener( "collision", function( other_object, linear_velocity, angular_velocity ) {
		console.log("hit the flooooooor!!!", other_object.name);
	});
	
	floor.addEventListener( "ready", function(){
		console.log("floor ready!!");
	});
	
	var box = O3DTemplate.createBox(2, 2, 2, new THREE.MeshLambertMaterial({color:0xfffe24}), true, 0.8, 0.1, 100);
	box.name = "It's the booox maaaaaaaan!!";
	
	box.addEventListener( "collision", function( other_object, linear_velocity, angular_velocity ) {
		console.log("yo", other_object.name);
	});
	
	box.addEventListener( "ready", function(){
		console.log("box ready!!");
	});
	
	box.translateY(2);
	
	scene.add(box);
	scene.add(floor);
	
	var update = function() {
		graphics.render(scene, camera); // render the scene
		requestAnimationFrame( update );
	};
	update();
}