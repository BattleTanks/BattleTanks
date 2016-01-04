function test(){
	var scene, graphics, camera, element;	
	var init = function(){
		element = BROUSER.getElementById("viewport");
		graphics = new Graphics({shadow:true, domelement:element, renderWidth:element.clientWidth, renderHeight:element.clientHeight });
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
		
	var box = O3DTemplate.createBox(1, 2, 1, new THREE.MeshLambertMaterial({color:O3DTemplate.COLOR.BLUE}), true, 0.8, 0.1, 10);
	box.name = "box";
	box.addEventListener( "collision", function( other_object, linear_velocity, angular_velocity ){console.log("yo", other_object.name); });
	box.addEventListener( "ready", function(){ console.log(name + "box ready!!");});
	box.translateY(3);
	scene.add(box);
	
	// move object
	var object = box;
	var floatObject = function(){
		var fV = new THREE.Vector3(0, 3, 0);
		object.setLinearVelocity(object.getLinearVelocity().add(fV));
	};
	var inputman = new InputActionManager(element);
	var actions = new ActionTable();
	actions.insertMouseButtonDownAction(floatObject);
	
	var hingePoint = O3DTemplate.createPoint(0, 0, 0, 0xa01234, 0.5, true);
	hingePoint.translateY(1);
	//hingePoint.add(box);
	
	scene.add(hingePoint);
	
	/*
	var constraint = ConstraintTemplate.hingeConstraint(
		scene, box,
		hingePoint.position, new THREE.Vector3(1, 0, 0),
		new Range(0, 2*Math.PI), 0.0, hingePoint)
	*/
	var constraint = ConstraintTemplate.wheelConstraint(scene, box, hingePoint.position, hingePoint)
	
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
	inputman.setActionTable(actions);
	
	var update = function() {
		graphics.render(scene, camera); // render the scene
		requestAnimationFrame( update );
	};
	update();
}