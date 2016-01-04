function test(){
	var scene, graphics, camera, element, inputman, actions;	
	var time = new Time();
	var init = function(){
		element = BROUSER.getElementById("viewport");
		graphics = new Graphics({shadow:true, domelement:element, renderWidth:element.clientWidth, renderHeight:element.clientHeight });
		graphics.enableShadow();
		scene = graphics.createScene({physics:true, repoertSize : 30});
		
		camera = graphics.createCamera({fov : 35});
		//camera.position.set( 0, 3, 10 );
		camera.position.set(-10, 10, 10);
		camera.lookAt( scene.position );
		scene.add(camera);

		var light = O3DTemplate.setLazyShadowSettings(new THREE.DirectionalLight(0xffffff,1));
		light.position.set(10, 10, 10);
		scene.add(light);
		
		inputman = new InputActionManager(element);
		actions = new ActionTable();
	};
	init();
	
	var floor = O3DTemplate.createFloor(60, 60, new THREE.MeshLambertMaterial({color:0x88dd99}), true, 0.9, 0.0, 0);
	floor.translateY(0);
	scene.add(floor);
	
	var axes = O3DTemplate.createAxes(0, 2, 0);
	scene.add(axes);
	
	// set up objects
		
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
		turretRotationBounce : 0.0
	};
	
	var body = O3DTemplate.createBox(bodyData.width, bodyData.height, bodyData.depth, new THREE.MeshLambertMaterial({color:0xa992f0}), true, 0.9, 0.0, 100);
	var turret = O3DTemplate.createBox(turretData.width, turretData.height, turretData.depth, new THREE.MeshLambertMaterial({color:0x03349f}), true, 0.9, 0.0, 20);
	var gun = O3DTemplate.createBox(gunData.width, gunData.height, gunData.length, new THREE.MeshLambertMaterial({color:0x34f903}), true, 0.9, 0.0, 1);
	
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
	
	var spawnPoint = new THREE.Vector3(0.0, 1.0, 0.0);
	body.position.copy(spawnPoint);	// translate body to spawn point
	var constraints = ConstraintTemplate.createTurretConstraint(scene, baseData, mounterData, mountData);
	
	//turret.add(camera);
	
	var constraint = constraints.mounterToMount;
	var constraint2 = constraints.baseToMounter;
	
	//-----
	var enableMotors = function(constraint){
		constraint.enableAngularMotor(1, 10);
	};
	var disableMotors = function(constraint){
		constraint.enableAngularMotor(0, 10);
	};
	var reverseMotors = function(constraint){
		constraint.enableAngularMotor(-1, 10);
	};
	
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
	
	var button1 = new MomentaryButton();
	var pressButton1 = function(){
		button1.down();
		if(button1.isOn()){
			enableMotors(constraint);
			console.log("vroom");
		}
	};
	var releaseButton1 = function(){
		button1.up();
		disableMotors(constraint);
		console.log("creek");
	};
	var button2 = new AlternateButton();
	var pressButton2 = function(){
		button2.down();
		if(button2.isOn()){
			reverseMotors(constraint);
			console.log("baaa");
		}
	};
	var releaseButton2 = function(){
		button2.up();
		disableMotors(constraint);
		console.log("scrrech");
	};
	actions.insertKeyDownAction(pressButton1, "W");
	actions.insertKeyUpAction(releaseButton1, "W");
	actions.insertKeyDownAction(pressButton2, "S");
	actions.insertKeyUpAction(releaseButton2, "S");
	
	var button3 = new MomentaryButton();
	var pressButton3 = function(){
		button3.down();
		if(button3.isOn()){
			enableMotors(constraint2);
			console.log("breee");
		}
	};
	var releaseButton3 = function(){
		button3.up();
		disableMotors(constraint2);
		console.log("crachp");
	};
	var button4 = new AlternateButton();
	var pressButton4 = function(){
		button4.down();
		if(button4.isOn()){
			reverseMotors(constraint2);
			console.log("deerrr");
		}
	};
	var releaseButton4 = function(){
		button4.up();
		disableMotors(constraint2);
		console.log("gaaao");
	};
	actions.insertKeyDownAction(pressButton3, "A");
	actions.insertKeyUpAction(releaseButton3, "A");
	actions.insertKeyDownAction(pressButton4, "D");
	actions.insertKeyUpAction(releaseButton4, "D");
	
	var trigger = new MomentaryButton();
	var pullTrigger = function(){
		trigger.down();
		if(trigger.isOn()){
			fire();
			console.log("ratatata");
		}
	};
	var releaseTrigger = function(){
		trigger.up();
	};
	actions.insertMouseButtonDownAction(pullTrigger, BROUSER.inputs.LEFT_MOUSE_BUTTON);
	actions.insertMouseButtonUpAction(releaseTrigger, BROUSER.inputs.LEFT_MOUSE_BUTTON);
	
	inputman.setActionTable(actions);
	
	// update scene
	var stopTimer = new Timer(time.minToMSec(1));
	time.addTimer(stopTimer);
	stopTimer.start();
	var update = function() {
		if(stopTimer.isTimeup()){
			console.log("time's up yo!!")
			return;
		}
		time.update();
		worldBulletManager.update();
		graphics.render(scene, camera); // render the scene
		requestAnimationFrame( update );
	};
	update();
}