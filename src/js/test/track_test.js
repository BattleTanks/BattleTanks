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
	
	// set up object
	var holderData = {
		width : 0.2,
		height : 0.1,
		length : 5,
		mass : 1.0,
		friction : 1.0,
		restitution : 1.0,
		material : new THREE.MeshLambertMaterial({color : 0xdd8899})
	};
	
	var radius = 0.7;
	var wheelData = {
		total : holderData.length / (radius * 2 + 0.1),
		radius : radius,
		width : 0.2,
		segments : 12,
		mass : 1.0,
		friction : 1.0,
		restitution : 1.0,
		material : new THREE.MeshLambertMaterial({color : 0xdd0099})
	};
	
	var holder = O3DTemplate.createBox(
		holderData.width, holderData.height, holderData.length, holderData.material, true, holderData.friction, holderData.restitution, holderData.mass);
	
	var createWheels = function(count){
		var wheels = [];
		for(var i = 0; i < count; ++i){
			wheels.push(O3DTemplate.createWheel(
				wheelData.radius, wheelData.width, wheelData.segments, wheelData.material, true, wheelData.friction, wheelData.restitution, wheelData.mass));
		}
		return wheels;
	};
	var wheels = createWheels(wheelData.total);
	
	var trackModel = O3DTemplate.createBox(
		wheelData.radius*2, holderData.height + wheelData.radius * 2 + 0.1, holderData.length, new THREE.MeshBasicMaterial({color:0xff0000, wireframe:true}));
	
	
	// set constraint
	var spawnPoint = new THREE.Vector3(0, 2.0, 0);
	holder.position.copy(spawnPoint);
	
	var interval = (holderData.length - (2*wheelData.radius)) / (wheelData.total - 1);
	var wheelConnectionPoint = new THREE.Vector3(0, - (wheelData.radius + 0.1),  - holderData.length / 2);
	var wheelPoint = PointTemplate.getWorldPoint(holder, wheelConnectionPoint);
	
	var constraints = ConstraintTemplate.createTrackContraint(scene, wheels, wheelPoint, interval, PointTemplate.ZAXIS, holder);
	
	scene.add(trackModel);
	holder.add(trackModel);
	
	// controlls
	var enableMotors = function(constraints){
		for(var i = 0; i < constraints.length; ++i){
			constraints[i].enableAngularMotor(-1, 10);
		}
	};
	var disableMotors = function(constraints){
		for(var i = 0; i < constraints.length; ++i){
			constraints[i].enableAngularMotor(0, 0);
		}
	};
	var reverseMotors = function(constraints){
		for(var i = 0; i < constraints.length; ++i){
			constraints[i].enableAngularMotor(1, 10);
		}
	};
	
	var button1 = new AlternateButton();
	var pressButton1 = function(){
		button1.down();
		if(button1.isOn()){
			enableMotors(constraints);
			console.log("vroom");
		}
		else{
			disableMotors(constraints);
			console.log("creek");
		}
	};
	var releaseButton1 = function(){
		button1.up();
	};
	var button2 = new AlternateButton();
	var pressButton2 = function(){
		button2.down();
		if(button2.isOn()){
			reverseMotors(constraints);
			console.log("baaa");
		}
		else{
			disableMotors(constraints);
			console.log("scrrech");
		}
	};
	var releaseButton2 = function(){
		button2.up();
	};
	actions.insertKeyDownAction(pressButton1, "W");
	actions.insertKeyUpAction(releaseButton1, "W");
	actions.insertKeyDownAction(pressButton2, "S");
	actions.insertKeyUpAction(releaseButton2, "S");
	
	inputman.setActionTable(actions);
	
	// update scene
	var update = function() {
		graphics.render(scene, camera); // render the scene
		requestAnimationFrame( update );
	};
	update();
}