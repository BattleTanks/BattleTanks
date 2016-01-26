BattleTanksGameState = (function(){
	BattleTanksGameState = function(owner){
		State.call(this, owner);
	};

	proto = BattleTanksGameState.prototype;

	UTIL.inherits(BattleTanksGameState, State);
	
	proto = BattleTanksGameState.prototype;

	proto.firstThingToDo = function(){
		var actions, assetman, scene, camera, time, inputman = this.owner.actionManager, root = this.rootModel;
		var init = function(){
			var graphics = this.owner.graphics;
			scene = graphics.createScene({physics:true, reportSize : 30});

			camera = graphics.createCamera({fov : 60});
			camera.position.set( -10, 10, -10 );
			camera.lookAt( scene.position );
			scene.add(camera);

			var light = O3DTemplate.setLazyShadowSettings(new THREE.DirectionalLight(0xffffff,1));
			light.position.set(10, 10, 10);
			scene.add(light);
			
			scene.add(new THREE.HemisphereLight(0xafafff, 0x000000, 0.5));
			
			actions = new ActionTable();
			assetman = new AssetManager();
			time = new Time();
			
			this.camera = camera;
			this.assetman = assetman;
			this.time = time;
		};
		init.call(this);
		
		var createLoadingScene = function(){
			var loadingScene = this.owner.graphics.createScene({physics:false});
			var loadingLight = new THREE.AmbientLight(0xffffff,1);
			var loadingSign = O3DTemplate.createTexturedPlane(10, 10, TextureTemplate.createTextTexture("ロード中...", {textStartX : 210, textStartY : 300}));
			
			this.camera.lookAt(loadingSign.position);
			
			loadingScene.add(loadingLight);
			loadingScene.add(camera);
			loadingScene.add(loadingSign);
			
			this.scene = scene;
		};
		createLoadingScene.call(this);
		
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
			reloadSpeed : time.secToMSec(4)
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
			engineSound : "/BattleTanks/src/sound/engine.mp3",
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
		var objSources = [ objDir+"body.obj",
							objDir+"turret.obj",
							objDir+"gun.obj",
							objDir + "front_right_wheel.obj",
							objDir + "front_left_wheel.obj",
							objDir + "back_right_wheel.obj",
							objDir + "back_left_wheel.obj",
							objDir + "stage.obj"
						];
		var objRelator = new ObjectRelator(TEST_WORLD_MESH_LIBRARY);
		
		var setupModel = function(model, data){
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
		
		var setupCamera = function(model){
			camera.position.copy(model.data.mount.camera.point);
			camera.lookAt(new THREE.Vector3(0, 1, -1));
			model.data.object3d.add(camera);
		}
		
		var changeScene = function(){
			console.log("changing scene");
			this.scene = scene;
		};
		
		var whenAllObjLoaded = function(){
			var datas = {};
			console.log(assetman.loadedObj);
			for(var src in assetman.loadedObj){
				datas[src] = objRelator.createData(assetman.loadedObj[src]);
			}
			console.log("datas", datas);

			// generate model
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
				if(UTIL.isUndefined(model.mountChildren)) return;
				console.log("mounting " + model.data.id);
				model.mountChildren();
			});

			// add object to scene
			console.log("adding model to scene");
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
			
			console.log("go!");
			changeScene();
		};

		assetman.loadObjs(objSources, whenAllObjLoaded);
	};

	proto._update = function(){
		
	};

	return BattleTanksGameState;
})();