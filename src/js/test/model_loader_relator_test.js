function test(){
	var scene, graphics, camera, element, assetman, inputman, actions, time;
	var init = function(){
		element = BROUSER.getElementById("viewport");
		graphics = new Graphics({shadow:true, domelement:element, renderWidth:element.clientWidth, renderHeight:element.clientHeight });
		graphics.enableShadow();
		scene = graphics.createScene({physics:true, reportSize : 30});

		camera = graphics.createCamera({fov : 60});
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
		
		time = new Time();
	};
	init();
	
	var showPhysiMesh = false;
	
	// tank_test mesh
	var tankBodyMeshLibrary = {
		bodyPhysiMesh : {
			modelType : "tankBody",
			name : "bodyPhysiMesh",
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "box",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0,
			mass : 500
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
			name : "mainTurret",
			parent : "bodyPhysiMesh",
			type : "mountPoint",
			mountType : "turret",
			rotation : {
				axis : new THREE.Vector3(0,1,0),
				range : new Range(0, 2*Math.PI),
				bounce : 0.0
			}
		},
		frontRightWheelMountPoint : {
			modelType : "tankBody",
			name : "frontRightWheel",
			parent : "bodyPhysiMesh",
			type : "mountPoint",
			mountType : "frontRightWheel",
			rotation : {
				axis : new THREE.Vector3(1, 0, 0),
				range : new Range(0, 2*Math.PI),
				bounce : 0.0
			}
		},
		frontLeftWheelMountPoint : {
			modelType : "tankBody",
			name : "frontLeftWheel",
			parent : "bodyPhysiMesh",
			type : "mountPoint",
			mountType : "frontLeftWheel",
			rotation : {
				axis : new THREE.Vector3(1, 0, 0),
				range : new Range(0, 2*Math.PI),
				bounce : 0.0
			}
		},
		backRightWheelMountPoint : {
			modelType : "tankBody",
			name : "backRightWheel",
			parent : "bodyPhysiMesh",
			type : "mountPoint",
			mountType : "backRightWheel",
			rotation : {
				axis : new THREE.Vector3(1, 0, 0),
				range : new Range(0, 2*Math.PI),
				bounce : 0.0
			}
		},
		backLeftWheelMountPoint : {
			modelType : "tankBody",
			name : "backLeftWheel",
			parent : "bodyPhysiMesh",
			type : "mountPoint",
			mountType : "backLeftWheel",
			rotation : {
				axis : new THREE.Vector3(1, 0, 0),
				range : new Range(0, 2*Math.PI),
				bounce : 0.0
			}
		},
		// gun
		gunPhysiMesh : {
			modelType : "gun",
			name : "gunPhysiMesh",
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "box",
			visible : showPhysiMesh,
			friction : 1.0,
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
		// turret
		turretPhysiMesh : {
			modelType : "turret",
			name : "turretPhysiMesh",
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "box",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0,
			mass : 50
		},
		turretGunMountPoint : {
			modelType : "turret",
			name : "mainGun",
			parent : "turretPhysiMesh",
			type : "mountPoint",
			mountType : "gun",
			rotation : {
				axis : new THREE.Vector3(1,0,0),
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
		},
		cameraMountPoint : {
			modelType : "turret",
			name : "camera",
			parent : "turretPhysiMesh",
			type : "mountPoint",
			mountType : "camera"
		},
		// front left wheels
		frontLeftWheelPhysiMesh : {
			modelType : "frontLeftWheel",
			name : "frontLeftWheelPhysiMesh",
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "sphere",
			visible  : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 10
		},
		frontLeftWheelMesh : {
			modelType : "frontLeftWheel",
			name : "frontLeftWheelMesh",
			parent  :"frontLeftWheelPhysiMesh",
			type : "wheel",
			physics : false
		},
		frontLeftWheelMounterPoint : {
			modelType : "frontLeftWheel",
			name : "frontLeftWheelMounterPoint",
			parent : "frontLeftWheelPhysiMesh",
			type : "mounterPoint"
		},
		// front right wheels
		frontRightWheelPhysiMesh : {
			modelType : "frontRightWheel",
			name : "frontRightWheelPhysiMesh",
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "sphere",
			visible  : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 10
		},
		frontRightWheelMesh : {
			modelType : "frontRightWheel",
			name : "frontRightWheelMesh",
			parent  :"frontRightWheelPhysiMesh",
			type : "wheel",
			physics : false
		},
		frontRightWheelMounterPoint : {
			modelType : "frontRightWheel",
			name : "frontRightWheelMounterPoint",
			parent : "frontRightWheelPhysiMesh",
			type : "mounterPoint"
		},
		// back left wheel
		backLeftWheelPhysiMesh : {
			modelType : "backLeftWheel",
			name : "backLeftWheelPhysiMesh",
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "sphere",
			visible  : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 10
		},
		backLeftWheelMesh : {
			modelType : "backLeftWheel",
			name : "backLeftWheelMesh",
			parent  :"backLeftWheelPhysiMesh",
			type : "wheel",
			physics : false
		},
		backLeftWheelMounterPoint : {
			modelType : "backLeftWheel",
			name : "backLeftWheelMounterPoint",
			parent : "backLeftWheelPhysiMesh",
			type : "mounterPoint"
		},
		// back right wheel
		backRightWheelPhysiMesh : {
			modelType : "backRightWheel",
			name : "backRightWheelPhysiMesh",
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "sphere",
			visible  : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 10
		},
		backRightWheelMesh : {
			modelType : "backRightWheel",
			name : "backRightWheelMesh",
			parent  :"backRightWheelPhysiMesh",
			type : "wheel",
			physics : false
		},
		backRightWheelMounterPoint : {
			modelType : "backRightWheel",
			name : "backRightWheelMounterPoint",
			parent : "backRightWheelPhysiMesh",
			type : "mounterPoint"
		},
		// stage
		basePhysiMesh : {
			modelType : "stage",
			name : "basePhysiMesh", 
			parent : "root",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "box",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 0
		},
		baseMesh : {
			modelType : "stage",
			name : "baseMesh",
			parent : "basePhysiMesh",
			type : "mesh",
			physics : false
		},
		tankSpawnPoint : {
			modelType : "stage",
			name : "tank",
			parent : "basePhysiMesh",
			type : "mountPoint",
			mountType : "tankBody"
		},
		building1PhysiMesh : {
			modelType : "stage",
			name : "building1PhysiMesh",
			parent : "basePhysiMesh",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "convex",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 0
		},
		building1Mesh : {
			modelType : "stage",
			name : "building1Mesh",
			parent : "building1PhysiMesh",
			type : "mesh",
			physics : false
		},
		building2PhysiMesh : {
			modelType : "stage",
			name : "building2PhysiMesh",
			parent : "basePhysiMesh",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "convex",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 0
		},
		building2Mesh : {
			modelType : "stage",
			name : "building2Mesh",
			parent : "building2PhysiMesh",
			type : "mesh",
			physics : false
		},
		building3PhysiMesh : {
			modelType : "stage",
			name : "building3PhysiMesh",
			parent : "basePhysiMesh",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "convex",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 0
		},
		building3Mesh : {
			modelType : "stage",
			name : "building3Mesh",
			parent : "building3PhysiMesh",
			type : "mesh",
			physics : false
		},
		building4PhysiMesh : {
			modelType : "stage",
			name : "building4PhysiMesh",
			parent : "basePhysiMesh",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "convex",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 0
		},
		building4Mesh : {
			modelType : "stage",
			name : "building4Mesh",
			parent : "building4PhysiMesh",
			type : "mesh",
			physics : false
		},
		// wall
		wall1PhysiMesh : {
			modelType : "stage",
			name : "wall1PhysiMesh",
			parent : "basePhysiMesh",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "convex",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 0
		},
		wall1Mesh : {
			modelType : "stage",
			name : "wall1Mesh",
			parent : "wall1PhysiMesh",
			type : "mesh",
			physics : false
		},
		wall2PhysiMesh : {
			modelType : "stage",
			name : "wall2PhysiMesh",
			parent : "basePhysiMesh",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "convex",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 0
		},
		wall2Mesh : {
			modelType : "stage",
			name : "wall2Mesh",
			parent : "wall2PhysiMesh",
			type : "mesh",
			physics : false
		},
		wall3PhysiMesh : {
			modelType : "stage",
			name : "wall3PhysiMesh",
			parent : "basePhysiMesh",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "convex",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 0
		},
		wall3Mesh : {
			modelType : "stage",
			name : "wall3Mesh",
			parent : "wall3PhysiMesh",
			type : "mesh",
			physics : false
		},
		wall4PhysiMesh : {
			modelType : "stage",
			name : "wall4PhysiMesh",
			parent : "basePhysiMesh",
			type : "physiMesh",
			physics : true,
			physicsMeshType : "convex",
			visible : showPhysiMesh,
			friction : 1.0,
			restitution : 0.1,
			mass : 0
		},
		wall4Mesh : {
			modelType : "stage",
			name : "wall4Mesh",
			parent : "wall4PhysiMesh",
			type : "mesh",
			physics : false
		}
	};
	
	// model data
	var stageData = {
		id : "test stage",
		type : "stage",
		mount : {
			tank : {
				type : "tankBody"
			}
		}
	};
	
	var gunData = {
		id : "test gun",
		type : "gun",
		fireSound : "/BattleTanks/src/sound/shot.mp3",
		reloadSound : "/BattleTanks/src/sound/click.mp3",
		reloadSpeed : time.secToMSec(6)
	};

	var turretData = {
		id : "test turret",
		type : "turret",
	 	mount : {
			mainGun : {
				type : "gun",
				motorSpeed : 2
			},
			camera : {
				type : "camera"
			},
		}
	};
	
	var bodyData = {
		id : "test body",
		type : "tankBody",
		mount : {
			mainTurret : {
				type : "turret",
				motorSpeed : 2
			},
			frontRightWheel : {
				type : "frontRightWheel",
				motorSpeed : 20
			},
			frontLeftWheel : {
				type : "frontLeftWheel",
				motorSpeed : 20
			},
			backRightWheel : {
				type : "backRightWheel",
				motorSpeed : 20
			},
			backLeftWheel : {
				type : "backLeftWheel",
				motorSpeed : 20
			}
		}
	};

	var frontRightWheelData = {
		id : "test front right wheel",
		type : "frontRightWheel",
		object3d : null,
		mounter : {
			point : null
		}
	};
	
	var frontLeftWheelData = {
		id : "test front left wheel",
		type : "frontLeftWheel",
		object3d : null,
		mounter : {
			point : null
		}
	};
	
	var backRightWheelData = {
		id : "test back right wheel",
		type : "backRightWheel",
		object3d : null,
		mounter : {
			point : null
		}
	};
	
	var backLeftWheelData = {
		id : "test back left wheel",
		type : "backLeftWheel",
		object3d : null,
		mounter : {
			point : null
		}
	};
	
	var objDir = "/BattleTanks/src/obj/testtank/";
	var objSources = [objDir+"body.obj", objDir+"turret.obj", objDir+"gun.obj",
						objDir + "front_right_wheel.obj", objDir + "front_left_wheel.obj",
						objDir + "back_right_wheel.obj", objDir + "back_left_wheel.obj",
						objDir + "stage.obj"
						];
	var objRelator = new ObjectRelator(tankBodyMeshLibrary);
	
	function setupModel(model, data){
		model.data.object3d = data.object3d;
		console.log("setup " + model.data.id);
		if(!UTIL.isUndefined(model.data.mounter)){
			model.data.mounter = data.mounter;
		}
		if(!UTIL.isUndefined(model.data.mount)){
			for(var mountId in model.data.mount){
				UTIL.mergeObjects(data.mount[mountId], model.data.mount[mountId]);
			}
		}
	}
	
	function setupCamera(model){
		camera.position.copy(model.data.mount.camera.point);
		camera.lookAt(new THREE.Vector3(0, 1, -1));
		model.data.object3d.add(camera);
	}
	
	var whenAllObjLoaded = function(){
		var datas = {};
		console.log(assetman.loadedObj);
		for(var src in assetman.loadedObj){
			datas[src] = objRelator.createData(assetman.loadedObj[src]);
		}
		console.log("datas", datas);

		// generate model
		var root = new RootModel();
		var stage = new StageModel(stageData);
		var body = new TankBodyModel(bodyData);
		var turret = new TurretModel(turretData);
		var gun = new GunModel(gunData);
		var frontRightWheel = new WheelModel(frontRightWheelData);
		var frontLeftWheel = new WheelModel(frontLeftWheelData);
		var backRightWheel = new WheelModel(backRightWheelData);
		var backLeftWheel = new WheelModel(backLeftWheelData);
		
		root.add(stage);
		stage.add(body);
		body.add(turret);
		body.add(frontRightWheel);
		body.add(frontLeftWheel);
		body.add(backRightWheel);
		body.add(backLeftWheel);
		turret.add(gun);
		
		// set data
		root.traverse(function(model){
			for(var dataId in datas){
				var meshData = datas[dataId]
				if(model.data.type == meshData.modelType){
					setupModel(model, meshData);
					console.log("set data", model, meshData);
				}
			}
		});
		
		// mount
		root.traverse(function(model){
			console.log("hello " + model.data.id);
			if(UTIL.isUndefined(model.mountChildren)) return;
			console.log("mounting");
			model.mountChildren();
		});

		// add object to scene
		BROUSER.log("adding model to scene");
		root.traverse(function(model){
			if(UTIL.isUndefined(model.addToScene)) return;
			model.addToScene(scene);
		});
		//scene.add(O3DTemplate.createAxes(0, 1, 0, 5));
		
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
		
		// set camera
		setupCamera(turret);
		
		var update = function(){
			root.update(time.update());
			graphics.render(scene, camera);
			requestAnimationFrame( update );
		};
		console.log("go!");
		update();
	};

	assetman.loadObjs(objSources, whenAllObjLoaded);
}