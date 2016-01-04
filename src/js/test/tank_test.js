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
	
	// datas
	var gunData = {
		width : 0.2,
		height : 0.2,
		length : 2.0,
		turretConnectPoint : new THREE.Vector3(0.0, 0.0, 1.0)
	};
	
	var turretData = {
		width : 1.0,
		height : 1.0,
		depth : 1.0,
		gunConnectPoint : new THREE.Vector3(0.0, 0.0, -0.6),
		gunRotationAxis : new THREE.Vector3(1.0, 0.0, 0.0),
		gunRotationRange : new Range(0, Math.PI/6),
		gunRotationBounce : 0.0,
		bodyConnectPoint : new THREE.Vector3(0.0, -0.5, 0.0)
	};
	
	var bodyData = {
		width : 1.0,
		height : 0.5,
		depth : 2.0,
		turretConnectPoint : new THREE.Vector3(0.0, 0.25, -0.7),
		turretRotationAxis : new THREE.Vector3(0.0, 1.0, 0.0),
		turretRotationRange : new Range(0, 2*Math.PI),
		turretRotationBounce : 0.0,
		frontRightWheelConnectPoint : new THREE.Vector3(0.5 + 0.1 + 0.5, 0.0, 1.0),
		frontLeftWheelConnectPoint  : new THREE.Vector3(- (0.5 + 0.1+ 0.5), 0.0, 1.0),
		backRightWheelConnectPoint  : new THREE.Vector3(0.5 + 0.1+ 0.5, 0.0, -1.0),
		backLeftWheelConnectPoint : new THREE.Vector3(- (0.5 + 0.1+ 0.5), 0.0, -1.0)
	};
	
	var radius = 0.5;
	var wheelData = {
		total : 4,
		radius : radius,
		width : 0.2,
		segments : 12,
		mass : 1.0,
		friction : 1.0,
		restitution : 1.0,
		material : new THREE.MeshLambertMaterial({color : 0xdd0099})
	};
	
	// create object
	var body   = O3DTemplate.createBox(bodyData.width, bodyData.height, bodyData.depth, new THREE.MeshLambertMaterial({color:0xa992f0}), true, 0.9, 0.0, 100);
	var turret = O3DTemplate.createBox(turretData.width, turretData.height, turretData.depth, new THREE.MeshLambertMaterial({color:0x03349f}), true, 0.9, 0.0, 20);
	var gun    = O3DTemplate.createBox(gunData.width, gunData.height, gunData.length, new THREE.MeshLambertMaterial({color:0x34f903}), true, 0.9, 0.0, 1);
	
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
		wheelData.radius*2, bodyData.height + wheelData.radius * 2 + 0.1, bodyData.depth, new THREE.MeshBasicMaterial({color:0xff0000, wireframe:true}));
	
	// setup constraint arguments
	var mountData = {
		object : gun,
		mounterPoint : gunData.turretConnectPoint,
	};
	
	var mounterData = {
		object : turret,
		mountPoint : turretData.gunConnectPoint,
		rotationAxis : turretData.gunRotationAxis,
		rotationRange : turretData.gunRotationRange,
		rotationBounce : turretData.gunRotationBounce,
		basePoint : turretData.bodyConnectPoint
	};
	
	var baseData = {
		object : body,
		mounterPoint : bodyData.turretConnectPoint,
		rotationAxis : bodyData.turretRotationAxis,
		rotationRange : bodyData.turretRotationRange,
		rotationBounce : bodyData.turretRotationBounce
	};
	
	// set constraint
	var spawnPoint = new THREE.Vector3(0.0, 1.0, 0.0);
	body.position.copy(spawnPoint);	// translate body to spawn point

//	var interval = (bodyData.length - (2*wheelData.radius)) / (wheelData.total - 1);
//	var wheelConnectionPoint = new THREE.Vector3(0, - (bodyData.height + wheelData.radius + 0.2),  - bodyData.depth / 2);
//	var wheelPoint = PointTemplate.getWorldPoint(body, wheelConnectionPoint);

	// position objects
	PointTemplate.mountTurret(baseData.object, mounterData.object, mountData.object, baseData.mounterPoint, mounterData.basePoint, mounterData.mountPoint, mountData.mounterPoint);
	
	var connectionPoints = [bodyData.frontRightWheelConnectPoint, bodyData.backRightWheelConnectPoint, bodyData.frontLeftWheelConnectPoint, bodyData.backLeftWheelConnectPoint];
	for(var i = 0; i < connectionPoints.length; ++i) wheels[i].position.copy(PointTemplate.getWorldPoint(body, connectionPoints[i]));
	
	// add to scene
	scene.add(gun);
	scene.add(turret);
	for(var i = 0; i < wheels.length; ++i) scene.add(wheels[i]);
	scene.add(body);
	
	// create constraints
	var turretConstraints = ConstraintTemplate.createTurretConstraint(scene, baseData, mounterData, mountData);
	
	//var constraints = ConstraintTemplate.createTrackContraint(scene, wheels, wheelPoint, interval, PointTemplate.ZAXIS, body);
	function createWheelConstraints(wheels, connectionPoints){
		var constraints = [];
		for(var i = 0; i < wheels.length; ++i){
			console.log(i, body.position);
			constraints.push(ConstraintTemplate.createWheelConstraint(scene, wheels[i], wheels[i].position, PointTemplate.XAXIS, body));
		}
		return constraints;
	}
	
	var wheelConstraints = createWheelConstraints(wheels, connectionPoints);
	
	scene.add(trackModel);
	body.add(trackModel);
	
	// controlls
	var enableMotors = function(constraint){
		constraint.enableAngularMotor(-5, 10);
	};
	var disableMotors = function(constraint){
		constraint.enableAngularMotor(0, 10);
	};
	var reverseMotors = function(constraint){
		constraint.enableAngularMotor(5, 10);
	};
	
	var enableRightEngine = function(){
		enableMotors(wheelConstraints[0]);
		enableMotors(wheelConstraints[1]);
	}
	var enableLeftEngine = function(){
		enableMotors(wheelConstraints[2]);
		enableMotors(wheelConstraints[3]);
	}
	var disableRightEngine = function(){
		disableMotors(wheelConstraints[0]);
		disableMotors(wheelConstraints[1]);
	}
	var disableLeftEngine = function(){
		disableMotors(wheelConstraints[2]);
		disableMotors(wheelConstraints[3]);
	}
	var breakEngine = function(){
		for(var i=0; i<wheelConstraints.length; ++i) reverseMotors(wheelConstraints[i]);
	}
	
	var rightButton = new MomentaryButton();
	var leftButton = new MomentaryButton();
	var backButton = new MomentaryButton();
	var pressRighButton = function(){
		rightButton.down();
	}
	var releaseRightButton = function(){
		rightButton.up();
	}
	var pressLeftButton = function(){
		leftButton.down();
	}
	var releaseLeftButton = function(){
		leftButton.up();
	}
	var pressBackButton = function(){
		backButton.down();
	}
	var releaseBackButton = function(){
		backButton.up();
	}
	var pressForwardButton = function(){
		pressRighButton();
		pressLeftButton();
	}
	var releaseForwardButton = function(){
		releaseRightButton();
		releaseLeftButton();
	}
	
	actions.insertKeyDownAction(pressForwardButton, "W");
	actions.insertKeyUpAction(releaseForwardButton, "W");
	actions.insertKeyDownAction(pressRighButton, "A");
	actions.insertKeyDownAction(pressLeftButton, "D");
	actions.insertKeyUpAction(releaseRightButton, "A");
	actions.insertKeyUpAction(releaseLeftButton, "D");
	actions.insertKeyDownAction(pressBackButton, "S");
	actions.insertKeyUpAction(releaseBackButton, "S");
	inputman.setActionTable(actions);

	var updateTank = function(){
		if(rightButton.isOn()) enableRightEngine();
		else disableRightEngine();
		if(leftButton.isOn()) enableLeftEngine();
		else disableLeftEngine();
		if(backButton.isOn()) breakEngine();
	}

	// update scene
	var update = function() {
		updateTank();
		graphics.render(scene, camera); // render the scene
		requestAnimationFrame( update );
	};
	update();
}