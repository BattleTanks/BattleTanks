function test(){
	var scene, graphics, camera, element, assetman, inputman, actions;;
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
		
		scene.add(new THREE.HemisphereLight(0xafafff, 0x000000, 0.5));

		inputman = new InputActionManager(element);
		actions = new ActionTable();
		
		assetman = new AssetManager();
	};
	init();
	
	// tank_test mesh
	var tankBodyMeshLibrary = {
		bodyPhysiMesh : {
			modelType : "tankBody",
			name : "bodyPhysiMesh",
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "box",
			visible : true,
			friction : 10,
			restitution : 0,
			mass : 100
		},
		bodyMesh : {
			modelType : "tankBody",
			name : "bodyMesh",
			parent : "bodyPhysiMesh",
			type : "body",
			physics : false
		},
		turretMountPoint : {
			modelType : "tankBody",
			name : "turretMountPoint",
			parent : "bodyPhysiMesh",
			type : "mountPoint",
			mountType : "turret",
			rotation : {
				axis : new THREE.Vector3(0,1,0),
				range : new Range(0, 2*Math.PI),
				bounce : 0.0
			}
		},
		gunPhysiMesh : {
			modelType : "gun",
			name : "gunPhysiMesh",
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "box",
			visible : true,
			friction : 10,
			restitution : 0,
			mass : 10
		},
		gunMesh : {
			modelType : "gun",
			name : "gunMesh",
			parent : "gunPhysiMesh",
			type : "gun",
			physics : false
		},
		gunMounterPoint : {
			modelType : "gun",
			name : "gunMounterPoint",
			parent : "gunPhysiMesh",
			type : "mounterPoint"
		},
		turretPhysiMesh : {
			modelType : "turret",
			name : "turretPhysiMesh",
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "box",
			visible : true,
			friction : 10,
			restitution : 0,
			mass : 50
		},
		turretGunMountPoint : {
			modelType : "turret",
			name : "turretGunMountPoint",
			parent : "turretPhysiMesh",
			type : "mountPoint",
			mountType : "turret",
			rotation : {
				axis : new THREE.Vector3(0,1,0),
				range : new Range(0, Math.PI/6),
				bounce : 0.0
			}
		},
		turretMesh : {
			modelType : "turret",
			name : "turretMesh",
			parent : "turretPhysiMesh",
			type : "turret",
			physics : false
		},
		turretMounterPoint : {
			modelType : "turret",
			name : "turretMounterPoint",
			parent : "turretPhysiMesh",
			type : "mounterPoint"
		}
	};
	
	// model data
	var stageObj = O3DTemplate.createFloor(60, 60, new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true}), true, 0.9, 1.0, 0);
	stageObj.add(O3DTemplate.createFloor(60, 60, new THREE.MeshLambertMaterial({color:0x88dd99})));
	var stageData = {
		id : "test stage",
		type : "stage",
		object3d : stageObj,
		mounter : {
			point : new Vector3(0, 0, 0)
		},
		mount : {
			tank : {
				type : "tank_body",
				point : new Vector3(0, 1, 0)
			}
		}
	};
	
	var gunData = {
		id : "test gun",
		type : "gun",
		object3d : null,
		mounter : {
			point : null
		}
	};

	var turretData = {
		id : "test turret",
		type : "turret",
		object3d : null,
		mounter : {
			point : null,
		},
	 	mount : {
			gun : {
				type : "gun",
				point : null,
				rotation : {
					axis : null,
					range : null,
					bounce : null
				},
				constraint : null
			}
		}
	};
	
	var bodyData = {
		id : "test body",
		type : "tankBody",
		object3d : null,
		mount : {
			turret : {
				type : "turret",
				point : null,
				rotation : {
					axis : null,
					range : null,
					bounce : null
				},
				constraint : null
			}
		}
	};
	
	var objDir = "/BattleTanks/src/obj/";
	var objSources = [objDir+"tank_test_body.obj", objDir+"tank_test_turret.obj", objDir+"tank_test_gun.obj"];
	var objRelator = new ObjectRelator(tankBodyMeshLibrary);
	
	function setupModel(model, data){
		model.data.object3d == data.object3d;
		if(!UTIL.isUndefined(model.data.mounter)){
			model.data.mounter = data.mounter;
		}
		if(!UTIL.isUndefined(model.data.mount)){
			model.data.mount = data.mount;
		}
	}
	
	var whenAllObjLoaded = function(){
		var datas = {};
		for(var src in assetman.loadedObj){
			datas[src] = objRelator.createData(assetman.loadedObj[src]);
		}

		// generate model
		var root = new RootModel();
		var stage = new StageModel(stageData);
		var body = new TankBodyModel(bodyData);
		var turret = new TurretModel(turretData);
		var gun = new GunModel(gunData);
		
		root.add(stage);
		stage.add(body);
		body.add(turret);
		turret.add(gun);
		
		// set data
		root.traverse(function(model){
			for(var dataId in datas){
				var meshDatas = datas[dataId]
				for(var meshId in meshDatas){
					console.log(meshId, meshDatas);
					var data = meshDatas[meshId];
					if(model.data.type == data.modelType){
						setupModel(model, data);
					}
				}
			}
		});
		
		// mount
		root.traverse(function(model){
			console.log("hello " + model.data.id);
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

		// setup actions
		inputman.setActionTable(actions);
		
		var update = function(){
			root.update();
			graphics.render(scene, camera);
			requestAnimationFrame( update );
		};
		update();
	};

	assetman.loadObjs(objSources, whenAllObjLoaded);
}