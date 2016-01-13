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

	// 1. generate model
	var floor = new FloorModel("plane floor");
	var gun = new GunModel("a gun");
	var turret = new TurretModel("a turret");

	// 2. position object
	floor.object3d.translateY(-1);
	turret.mountGun(gun);

	// 3. add object to scene
	scene.add(floor.object3d);
	scene.add(gun.object3d);
	scene.add(turret.object3d);

	// 4. bind constraints
	turret.gunConstraint = ConstraintTemplate.createHingeConstraint(scene, gun.object3d, turret.mountPoint, turret.rotationAxis, turret.rotationRange, turret.rotationBounce, turret.object3d);

	// 5. add graphicalmesh to physimesh

	// 6. insert actions to action tabel
	var pressAimUp         = function(){ turret.controller.aimUpButton.down(); };
	var releaseAimUp       = function(){ turret.controller.aimUpButton.up(); };
	var pressAimDown       = function(){ turret.controller.aimDownButton.down(); };
	var releaseAimDown     = function(){ turret.controller.aimDownButton.up(); };

	actions.insertKeyDownAction(pressAimUp, "I");
	actions.insertKeyUpAction(releaseAimUp, "I");
	actions.insertKeyDownAction(pressAimDown, "K");
	actions.insertKeyUpAction(releaseAimDown, "K");

	// 7. setup actions
	inputman.setActionTable(actions);

	// 8. update
	var update = function() {
		// render
		turret.update();
		graphics.render(scene, camera);
		requestAnimationFrame( update );
	};
	update();
}
