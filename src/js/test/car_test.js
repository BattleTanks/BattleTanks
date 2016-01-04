function test(){
	var scene, graphics, camera, element, inputman, actions;	
	var init = function(){
		element = BROUSER.getElementById("viewport");
		graphics = new Graphics({shadow:true, domelement:element, renderWidth:element.clientWidth, renderHeight:element.clientHeight });
		graphics.enableShadow();
		scene = graphics.createScene({physics:true, repoertSize : 30});
		
		camera = graphics.createCamera({fov : 35});
		camera.position.set( -10, 10, 10 );
		camera.lookAt( scene.position );
		scene.add(camera);

		var light = O3DTemplate.setLazyShadowSettings(new THREE.DirectionalLight(0xffffff,1));
		light.position.set(10, 10, 10);
		scene.add(light);
		
		inputman = new InputActionManager(element);
		actions = new ActionTable();
	};
	init();
	
	var floor = O3DTemplate.createFloor(60, 60, new THREE.MeshLambertMaterial({color:0x88dd99}), true, 0.9, 1.0, 0);
	floor.translateY(-1);
	scene.add(floor);
	
	var axes = O3DTemplate.createAxes(0, 1, 0);
	scene.add(axes);
	
	//-----	
	wheelRadius = 0.7;
	wheelWidth = 0.5;
	//var wheel1 = O3DTemplate.createWheel(wheelRadius, wheelWidth, 12, new THREE.MeshLambertMaterial({color:0xdffff9}), true, 0.8, 1.0, 5);
	var wheel1 = O3DTemplate.createCylinder(wheelRadius, wheelWidth, 12, new THREE.MeshLambertMaterial({color:0xdffff9}), true, 0.8, 1.0, 5);
	wheel1.translateX(1 + 0.1);
	wheel1.rotateZ(Math.PI/2);
	scene.add(wheel1);
	
	var wheel2 = O3DTemplate.createWheel(wheelRadius, wheelWidth, 12, new THREE.MeshLambertMaterial({color:0xd018c9}), true, 0.8, 1.0, 5);
	wheel2.translateX(-1 - 0.1);
	scene.add(wheel2);
	
	var box =  O3DTemplate.createBox(1.0, 0.5, 2, new THREE.MeshLambertMaterial({color:0xd939f1}), true, 0.6, 1.0, 190);
	scene.add(box);
	
	var top = O3DTemplate.createBox(1.0, 1, 1.5, new THREE.MeshLambertMaterial({color:0xd939f1}), true, 0.6, 1.0, 100)
	top.translateY(1);
	
	scene.add(top);	// add a  mesh to the scene
	box.add(top);	// before making parent-child
	
	var constraint1 = ConstraintTemplate.wheelConstraint(scene, wheel1, wheel1.position, new THREE.Vector3(1, 0, 0), box);
	var constraint2 = ConstraintTemplate.wheelConstraint(scene, wheel2, wheel2.position, new THREE.Vector3(1, 0, 0), box);
	
	constraint1.enableAngularMotor(1, 10);
	constraint2.enableAngularMotor(1, 10);

	// move object
	
	var object = box;
	var floatObject = function(){
		var fV = new THREE.Vector3(0, 3, 0);
		object.setLinearVelocity(object.getLinearVelocity().add(fV));
	};
	actions.insertMouseButtonDownAction(floatObject);
	/*
	var button1 = new AlternateButton();
	var pressButton1 = function(){
		button1.down();
		if(button1.isOn()){
			constraint.enableAngularMotor( -10, 10 );
			console.log("vroom"); }
		else{ constraint.disableMotor(); console.log("creek"); }
	};
	var releaseButton1 = function(){
		button1.up();
	};
	var button2 = new AlternateButton();
	var pressButton2 = function(){
		button2.down();
		if(button2.isOn()){
			constraint.enableAngularMotor( 10, 10 );
			console.log("baaa"); }
		else{ constraint.disableMotor(); console.log("scrrech"); }
	};
	var releaseButton2 = function(){
		button2.up();
	};
	actions.insertKeyDownAction(pressButton1, "W");
	actions.insertKeyUpAction(releaseButton1, "W");
	actions.insertKeyDownAction(pressButton2, "S");
	actions.insertKeyUpAction(releaseButton2, "S");
	*/
	inputman.setActionTable(actions);
	
	// update scene
	var update = function() {
		graphics.render(scene, camera); // render the scene
		requestAnimationFrame( update );
	};
	update();
}