function test(){
	var scene, graphics, camera, element, assetman;
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
	
	var update = function(){
		// render
		graphics.render(scene, camera);
		requestAnimationFrame( update );
	};
	
	function separateMeshes(object){
		var meshes = {};
		object.traverse(function(child){
			if(child instanceof THREE.Mesh){
				meshes[child.name] = child;
			}
		});
		return meshes;
	}
	
	function calculateCenter(mesh){
		var positions = mesh.geometry.attributes.position.array;
		var totalVerts = positions.length/3;
		var sumX = 0;
		var sumY = 0;
		var sumZ = 0;
		for(var i = 0; i < positions.length; i+=3){
			sumX += positions[i];
			sumY += positions[i+1];
			sumZ += positions[i+2];
		}
		return new THREE.Vector3(sumX/totalVerts, sumY/totalVerts, sumZ/totalVerts);
	}
	
	function meshNameToMeshData(meshName){
		var meshData = {};
		
		function sliceOfSuffix(name){ return name.slice(0, name.indexOf("}")+1); }
		var jsonString = sliceOfSuffix(meshName);
		if(!UTIL.isJSONString(jsonString)) return meshData;
		
		var rawMeshData = JSON.parse(jsonString);
		meshData.name			 	= rawMeshData.n;
		meshData.parent			 	= rawMeshData.P;
		meshData.type				= rawMeshData.t;
		meshData.physics		 	= rawMeshData.p;
		meshData.physicsMeshType	= rawMeshData.pmt;
		meshData.wireframe			= rawMeshData.pw;
		meshData.friction			= rawMeshData.pf;
		meshData.restitution		= rawMeshData.pr;
		meshData.mass				= rawMeshData.pm;
		meshData.mountType			= rawMeshData.mt;
		return meshData;
	};
	
	function createData(object){
		var data = {
			object3d : O3DTemplate.createBox(1.0, 1.0, 1.0, new THREE.MeshLambertMaterial({color:0xff0000})),
			mounter : undefined,
			mount : undefined
		};
		var mounterData = {
			point : null
		};
		var mountData = {
			type : null,
			point : null,
			rotation : {
				axis : null,
				range : null,
				bounce : null
			},
			constraint : null
		};
		
		console.log("1. separate meshes from object");
		var meshes = separateMeshes(object);

		console.log("2. parse mesh names to JSON and create setup data");
		var meshDatas = {};
		for(meshRawName in meshes){
			var mesh = meshes[meshRawName];
			var meshSetupData = meshNameToMeshData(meshRawName);
			meshSetupData.mesh = mesh;
			meshDatas[meshSetupData.name] = meshSetupData;
		}
		
		console.log("3. create phyis mesh if meshSetupData.physics is true");
		for(var meshName in meshDatas){
			if(!meshDatas[meshName].physics) continue;
			
			var meshData = meshDatas[meshName];
			var meshMaterialOptions = {color:0xffffff};
			if (meshData.visible) meshMaterialOptions.wirefame = true;
			else meshMaterialOptions.visible = false;
			meshData.mesh = O3DTemplate.createPhysicsMesh(meshData.physicsMeshType, meshData.mesh.geometry, new THREE.BasicMaterial(meshMaterialOptions), meshData.friction, meshData.restitution, meshData.mass);
		}
		
		console.log("4. connect parent-child from meshSetupData.parent");
		for(var meshName in meshDatas){
			var meshData = meshDatas[meshName];
			if(meshData.parent == "root") continue;
			if(meshData.type == "mounter-point") continue;
			if(meshData.type == "mount-point") continue;
			
			meshDatas[meshDatas.parnet].mesh.add(meshData.mesh);
		}
		
		console.log("5. create data from root mesh also");
		for(var meshName in meshDatas){
			var meshData = meshDatas[meshName];
			if(meshData.type == "mounter-point"){
				var mounterPoint = calculateCenter(meshData.mesh);
				mounterData.point = mounterPoint;
				data.mounter = mounterData;
			}
			else if(meshData.type == "mount-point"){
				mountData.type = meshData.mountType;
				mountData.point = calculateCenter(meshData.mesh);
				data.mount[meshData.name] = mountData;
			}
			else if(meshData.parent == "root"){
				data.object3d = meshData.mesh;
			}
		}
		
		return data;
	}
	
	var objDir = "/BattleTanks/src/obj/";
	var objSources = [objDir+"relation_test.obj"];
	
	var whenAllObjLoaded = function(){
		console.log("all obj loaded");
		var datas = {};
		for(var src in assetman.loadedObj){
			datas[src] = createData(assetman.loadedObj[src]);
			console.log(datas);
		}
		
		//scene.add(datas[data].object3d);
		
		//scene.add(O3DTemplate.createFloor(60, 60, new THREE.MeshLambertMaterial({color:0x88dd99}), true, 0.9, 1.0, 0));
		scene.add(O3DTemplate.createAxes(0,0,0, 5));
		
		update();
	};

	assetman.loadObjs(objSources, whenAllObjLoaded);
}