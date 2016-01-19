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

	// define data
	var stageData = {
		id : "test stage",
		type : "stage",
		object3d : null,
		mounter : {
			point : new Three.Vector3(0, 0, 0)
		},
		mount : {
			tank : {
				type : "turret",
				point : new Three.Vector3(0, 1, 0)
			}
		}
	};
	
	var gunData = {
		id : "",
		type : "gun",
		object3d : null,
		mounter : {
			point : new Three.Vector3()
		}
	};

	var turretData = {
		id : "",
		type : "turret",
		object3d : null,
		mounter : {
			point : new Three.Vector3(),
		},
	 	mount : {
			gun : {
				type : "gun",
				point : new Three.Vector3(),
				rotation : {
					axis : new Three.Vector3(),
					range : new Range(0, 0),
					bounce : 0.0
				},
				constraint : null
			}
		}
	};

	// generate model
	var root = new RootModel();
	var stage = new StageModel(stageData);
	var gun = new GunModel(gunData);
	var turret = new TurretModel(turretData);
	
	rootModel.add(stage);
	stage.add(turret);
	turret.add(gun);

	// add object to scene
	rootModel.traverse(function(model){
		if(UTIL.isUndefined(model.addToScene)) return;
		model.addToScene(scene);
	});

	// insert action
	rootModel.traverse(function(model){
		if(UTIL.isUndefined(model.insertAction)) return;
		model.insertAction(actions);
	});

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
