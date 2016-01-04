var assetman = {};
assetman.assets = {};
assetman.allLoaded = false;
assetman.error = false;
function loadObj(src){
	if(UTIL.isUndefined(this.objLoader)) this.objLoader = new THREE.OBJLoader();

	var whenLoaded = function(object){
		console.log("loaded " + src);
		assetman.assets[src] = object;
		console.log(assetman);
		assetman.allLoaded = true;
	}
	
	var whenError = function(){
		console.log(src + " is undefined!!");
		assetman.error = true;
	}
	this.objLoader.load(src, whenLoaded, undefined, whenError);
}

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
	
	var axes = O3DTemplate.createAxes(0, 5, 0);
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
	// vehicle control
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
	
	var vehicleButtons = {
		right : new MomentaryButton(),
		left : new MomentaryButton(),
		back : new MomentaryButton()
	}
	var pressRighButton = function(){ vehicleButtons.right.down(); }
	var releaseRightButton = function(){ vehicleButtons.right.up(); }
	var pressLeftButton = function(){ vehicleButtons.left.down(); }
	var releaseLeftButton = function(){ vehicleButtons.left.up(); }
	var pressBackButton = function(){ vehicleButtons.back.down(); }
	var releaseBackButton = function(){ vehicleButtons.back.up(); }
	var pressForwardButton = function(){ pressRighButton(); pressLeftButton(); }
	var releaseForwardButton = function(){ releaseRightButton(); releaseLeftButton(); }
	
	actions.insertKeyDownAction(pressForwardButton, "W");
	actions.insertKeyUpAction(releaseForwardButton, "W");
	actions.insertKeyDownAction(pressRighButton, "A");
	actions.insertKeyDownAction(pressLeftButton, "D");
	actions.insertKeyUpAction(releaseRightButton, "A");
	actions.insertKeyUpAction(releaseLeftButton, "D");
	actions.insertKeyDownAction(pressBackButton, "S");
	actions.insertKeyUpAction(releaseBackButton, "S");

	// turret controll
	var enableTurretMotors = function(constraint){ constraint.enableAngularMotor(-2, 10); };
	var disableTurretMotors = function(constraint){ constraint.enableAngularMotor(0, 10); };
	var reverseTurretMotors = function(constraint){ constraint.enableAngularMotor(2, 10); };
	
	var enableGunMotors = function(constraint){ constraint.enableAngularMotor(1, 10); };
	var disableGunMotors = function(constraint){ constraint.enableAngularMotor(0, 10); };
	var reverseGunMotors = function(constraint){ constraint.enableAngularMotor(-1, 10); };
	
	var rotateTurretRight = function(){ enableTurretMotors(turretConstraints["baseToMounter"]); };
	var rotateTurretLeft = function(){ reverseTurretMotors(turretConstraints["baseToMounter"]); };
	var disableTurret = function(){ disableTurretMotors(turretConstraints["baseToMounter"]) };
	
	var rotateGunUp = function(){ enableGunMotors(turretConstraints["mounterToMount"]); };
	var rotateGunDown = function(){ reverseGunMotors(turretConstraints["mounterToMount"]); };
	var disableGun = function(){ disableGunMotors(turretConstraints["mounterToMount"]) };
	
	var turretButtons = {
		right : new MomentaryButton(),
		left : new MomentaryButton(),
		up : new MomentaryButton(),
		down : new MomentaryButton()
	};
	var pressRotateRight   = function(){ turretButtons.right.down(); };
	var releaseRotateRight = function(){ turretButtons.right.up(); };
	var pressRotateLeft    = function(){ turretButtons.left.down(); };
	var releaseRotateLeft  = function(){ turretButtons.left.up(); };
	var pressAimUp         = function(){ turretButtons.up.down(); };
	var releaseAimUp       = function(){ turretButtons.up.up(); };
	var pressAimDown       = function(){ turretButtons.down.down(); };
	var releaseAimDown     = function(){ turretButtons.down.up(); };
	
	actions.insertKeyDownAction(pressRotateRight, "L");
	actions.insertKeyUpAction(releaseRotateRight, "L");
	actions.insertKeyDownAction(pressRotateLeft, "J");
	actions.insertKeyUpAction(releaseRotateLeft, "J");
	actions.insertKeyDownAction(pressAimUp, "I");
	actions.insertKeyUpAction(releaseAimUp, "I");
	actions.insertKeyDownAction(pressAimDown, "K");
	actions.insertKeyUpAction(releaseAimDown, "K");
	
	// gun controll
	var time = new Time();
	var timer = new Timer(10000);
	time.addTimer(timer);
	var worldBulletManager = {max:10, bullets:[]};
	worldBulletManager.isFull = function(){
		console.log(this.bullets.length);
		return (this.bullets.length >= this.max);
	};
	worldBulletManager.pushBullet = function(bullet){
		(this.isFull()) ? scene.remove(this.bullets.shift(bullet)) : this.bullets.push(bullet);
	};
	worldBulletManager.update = function(){
		if(timer.isStoped()){
			timer.start();
		}
		if(timer.isTimeup()){
			var old = this.bullets.shift();
			if(old){scene.remove(old);}
			timer.restart();
		}
	}
	
	var gunButtons = {
		trigger : new MomentaryButton()
	};
	var pullTrigger = function(){ gunButtons.trigger.down(); };
	var releaseTrigger = function(){ gunButtons.trigger.up(); };
	var fire = function(){
		var position = new THREE.Vector3(0, 0, 0);
		position.copy(gun.position);
		gun.localToWorld(position);
		
		var gunPoint = new THREE.Vector3(0, 0, 0); 
		gunPoint.copy(gun.rotation);
		gun.localToWorld(gunPoint);
		
		var bullet = BattleTanksO3DTemplate.createBullet(0.2, 0.4, 3, new THREE.MeshBasicMaterial({color:0xffffff}), 0.8, 20);
		bullet.addEventListener( 'collision', function(otherObject, linearVelocity, angularVelocity){
				console.log("hit with " + otherObject.name + " : damage = " + linearVelocity.length()*20);
				scene.remove(this);
			}
		);
		bullet.position.set(position.x, position.y, position.z);
		//bullet.rotation.copy(gunPoint);
		
		scene.add(bullet);
		worldBulletManager.pushBullet(bullet);
		
		var muzzleSpeed = 10;
		var localLinearV = new Vector3(0, 0, -muzzleSpeed);
		localLinearV.applyEuler(gun.rotation);
		bullet.setLinearVelocity((bullet.getLinearVelocity()).add(localLinearV));
	};
	
	actions.insertKeyDownAction(pullTrigger, " ");
	actions.insertKeyUpAction(releaseTrigger, " ");
	
	inputman.setActionTable(actions);

	var updateTank = function(){
		if(vehicleButtons.right.isOn()) enableRightEngine();
		else disableRightEngine();
		if(vehicleButtons.left.isOn()) enableLeftEngine();
		else disableLeftEngine();
		if(vehicleButtons.back.isOn()) breakEngine();
	}
	
	var updateTurret = function(){
		if(turretButtons.right.isOn()) rotateTurretRight();
		else if(turretButtons.left.isOn()) rotateTurretLeft();
		else disableTurret();
		
		if(turretButtons.up.isOn()) rotateGunUp();
		else if(turretButtons.down.isOn()) rotateGunDown();
		else disableGun();
	}
	
	var updateGun = function(){
		if(gunButtons.trigger.isOn()) fire();
	}
	
	// wait for assets to load
	// load obj
	loadObj("/BattleTanks/src/obj/plane.obj");
	
	var loadingCamera = graphics.createCamera({fov : 35});
	loadingCamera.position.set( -10, 10, 10 );
	loadingCamera.lookAt( scene.position );
	
	var loadingScene = graphics.createScene({physics:false});
	loadingScene.add(camera);
	
	var loadingSign = O3DTemplate.createTexturedPlane(10, 10, TextureTemplate.createTextTexture("ロード中...", {textStartX : 210, textStartY : 300}));
	loadingScene.add(loadingSign);
	
	var loadingLight = new THREE.AmbientLight(0xffffff,1);
	loadingScene.add(loadingLight);
	
	// update
	// update scene
	var update = function() {
		updateTank();
		updateTurret();
		updateGun();
		worldBulletManager.update();
		graphics.render(scene, camera); // render the scene
		requestAnimationFrame( update );
	};
	
	// crate terrain
	var createTerrain = function(){
		console.log(assetman.assets);
		var terrain = assetman.assets["/BattleTanks/src/obj/plane.obj"];
		var terrainMesh;
		var findMesh = function(child){ if(child instanceof THREE.Mesh){ terrainMesh = child; console.log("found mesh");} };
		terrain.traverse(findMesh);
		var terrainGeometry = new THREE.Geometry().fromBufferGeometry(terrainMesh.geometry);
		var terrainPhysicsMesh = O3DTemplate.createPhysicsMesh("convex", terrainGeometry, new THREE.MeshLambertMaterial({color:0xa0e389}), 0.8, 0.6, 0);
		terrain = terrainPhysicsMesh;
		console.log(terrain);
		
		//terrain.position.set(new THREE.Vector3(0, 0, 0))
		
		var stopCreating = false;
		
		var whenReady = function(){ stopCreating = true; update(); };
		terrain.addEventListener('ready', whenReady);
		scene.add(terrain);
		
		scene.remove(floor);
		
		// add camea to turret
		camera.position.copy((new THREE.Vector3(0, 0, 10)).add(turret.position));
		camera.lookAt(turret.position);
		turret.add(camera);
		
		var creating = function(){
			if(stopCreating) return;
			console.log("creating scene...");
			loadingSign.rotation.y += 0.05;
			graphics.render(loadingScene, camera);
			requestAnimationFrame(creating);
		}
		creating();
	}
	
	/*
	createTerrain = function(){
		var terrain = floor;
		for(var i=0; i < 20; ++i){
			var height = Math.random()%5+1;
			var block = O3DTemplate.createBox(Math.random()%5+1, height, Math.random()%5+1, new THREE.MeshLambertMaterial({color:0xa0e389}), true, 0.8, 0.6, 0);
			block.position.set(new THREE.Vector3(Math.random()%20+2, height/2, Math.random()%20+2))
			terrain.add(block);
		}

		
		update();
	}
	*/
	
	// load obj
	var load = function(){
		console.log("loading...");
		if(assetman.allLoaded){
			createTerrain();
			return;
		}
		if(assetman.error) return;
		loadingSign.rotation.y += 0.05;
		graphics.render(loadingScene, camera);
		requestAnimationFrame(load);
	};
	load();
}