Vector3 = THREE.Vector3;

function test(){
	var scene, graphics, camera, element, inputman, actions;
	var init = function(){
		element = BROUSER.getElementById("viewport");
		graphics = new Graphics({shadow:true, domelement:element, renderWidth:element.clientWidth, renderHeight:element.clientHeight });
		graphics.enableShadow();
		scene = graphics.createScene({physics:true, repoertSize : 30});

		camera = graphics.createCamera({fov : 35});
		camera.position.set( -10, 10, -10 );
		camera.lookAt( scene.position );
		scene.add(camera);

		var light = O3DTemplate.setLazyShadowSettings(new THREE.DirectionalLight(0xffffff,1));
		light.position.set(10, 10, 10);
		scene.add(light);

		inputman = new InputActionManager(element);
		actions = new ActionTable();
	};
	init();

	var stageObj = O3DTemplate.createFloor(60, 60, new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true}), true, 0.9, 1.0, 0);
	stageObj.add(O3DTemplate.createFloor(60, 60, new THREE.MeshLambertMaterial({color:0x88dd99})));
	var gunObj = O3DTemplate.createBox(0.2, 0.2, 2.0, new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true}), true, 0.9, 0.0, 1);
	gunObj.add(O3DTemplate.createBox(0.2, 0.2, 2.0, new THREE.MeshLambertMaterial({color:0x34f903})));
	var turretObj = O3DTemplate.createBox(1.0, 1.0, 1.0, new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true}), true, 0.9, 0.0, 20);
	turretObj.add(O3DTemplate.createBox(1.0, 1.0, 1.0, new THREE.MeshLambertMaterial({color:0x03349f})));
	
	// define data
	var stageData = {
		id : "test stage",
		type : "stage",
		object3d : stageObj,
		mounter : {
			point : new Vector3(0, 0, 0)
		},
		mount : {
			tank : {
				type : "turret",
				point : new Vector3(0, 1, 0)
			}
		}
	};
	
	var gunData = {
		id : "test gun",
		type : "gun",
		object3d : gunObj,
		mounter : {
			point : new Vector3(0.0, 0.0, 1.0)
		}
	};

	var turretData = {
		id : "test turret",
		type : "turret",
		object3d : turretObj,
		mounter : {
			point : new Vector3(0.0, -0.5, 0.0),
		},
	 	mount : {
			gun : {
				type : "gun",
				point : new Vector3(0.0, 0.0, -0.6),
				rotation : {
					axis : new Vector3(1.0, 0.0, 0.0),
					range : new Range(0, Math.PI/6),
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
	
	root.add(stage);
	stage.add(turret);
	turret.add(gun);

	// mount
	root.traverse(function(model){
		if(UTIL.isUndefined(model.mountChildren)) return;
		model.mountChildren();
	});

	// add object to scene
	BROUSER.log("adding model to scene");
	root.traverse(function(model){
		if(UTIL.isUndefined(model.addToScene)) return;
		model.addToScene(scene);
	});
	
	// constrain
	root.traverse(function(model){
		if(UTIL.isUndefined(model.constrainChildren)) return;
		model.constrainChildren(scene);
	});

	// insert action
	root.traverse(function(model){
		if(UTIL.isUndefined(model.insertAction)) return;
		model.insertAction(actions);
	});

	// 7. setup actions
	inputman.setActionTable(actions);

	// 8. update
	var update = function() {
		// render
		root.update();
		graphics.render(scene, camera);
		requestAnimationFrame( update );
	};
	BROUSER.log("go!");
	update();
}
