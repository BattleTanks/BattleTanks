ObjectRelator = (function(){
	ObjectRelator = function(meshLibrary){
		this.meshLibrary = meshLibrary;
	};

	proto = ObjectRelator.prototype;

	proto.separateMeshes = function(object){
		var meshes = {};
		object.traverse(function(child){
			if(child instanceof THREE.Mesh){
				meshes[child.name] = child;
			}
		});
		return meshes;
	};
	
	proto.getMeshData = function(meshRawName){
		var meshData = {};
		function sliceOfSuffix(name){ return meshRawName.slice(0, meshRawName.indexOf("_")); }
		var name = sliceOfSuffix(meshRawName);
		
		return this.meshLibrary[name];
	};
	
	proto.getMeshDatas = function(meshes){
		var meshDatas = {};
		for(meshRawName in meshes){
			var mesh = meshes[meshRawName];
			var meshSetupData = this.getMeshData(meshRawName);
			meshSetupData.mesh = mesh;
			meshDatas[meshSetupData.name] = meshSetupData;
		}
		return meshDatas;
	};
	
	proto.setupPhysicsMesh = function(meshDatas){
		for(var meshName in meshDatas){
			if(!meshDatas[meshName].physics) continue;
			
			var meshData = meshDatas[meshName];
			var meshMaterialOptions = {color:0xffffff};
			meshData.mesh = O3DTemplate.createPhysicsMesh(
								meshData.physicsMeshType,
								new THREE.Geometry().fromBufferGeometry(meshData.mesh.geometry),
								new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true, visible:meshData.visible}),
								meshData.friction, meshData.restitution, meshData.mass);
		}
	};
	
	proto.setupRelations = function(meshDatas){
		for(var meshName in meshDatas){
			var meshData = meshDatas[meshName];
			if(meshData.parent == "root") continue;
			if(meshData.type == "mounterPoint") continue;
			if(meshData.type == "mountPoint") continue;
			
			var parent = meshDatas[meshData.parent];
			parent.mesh.add(meshData.mesh);
		}
	};
	
	proto.createDataFromMeshDatas = function(meshDatas){
		var errorObject = O3DTemplate.createBox(1.0, 1.0, 1.0, new THREE.MeshLambertMaterial({color:0xff0000}));
		var data = {
			modelType : undefined,
			object3d : errorObject,
			mounter : {
				point : new THREE.Vector3(0, 0, 0)
			},
			mount : undefined
		};
		var mountData = {};
		
		for(var meshName in meshDatas){
			var meshData = meshDatas[meshName];
			if(meshData.type == "mounterPoint"){
				data.mounter.point = PointTemplate.getCenterOfMesh(meshData.mesh);
			}
			else if(meshData.type == "mountPoint"){
				if(UTIL.isUndefined(data.mount)) data.mount = {};
				mountData.type = meshData.mountType;
				mountData.point = PointTemplate.getCenterOfMesh(meshData.mesh);
				mountData.rotation = meshData.rotation;
				data.mount[meshData.name] = {};
				data.mount[meshData.name].type = mountData.type;
				data.mount[meshData.name].point = mountData.point;
				data.mount[meshData.name].rotation = mountData.rotation;
			}
			else if(meshData.parent == "root"){
				data.modelType = meshData.modelType;
				data.object3d = meshData.mesh;
			}
		}
		console.log("fresh data ", data);
		return data;
	};
	
	proto.createData = function(object){
		// 1. separate meshes from object
		var meshes = this.separateMeshes(object);

		// 2. get mesh data from meshDataLibrary using mesh name as key
		var meshDatas = this.getMeshDatas(meshes);
		
		// 3. create phyis mesh if meshSetupData.physics is true
		this.setupPhysicsMesh(meshDatas);
		
		// 4. connect parent-child from meshSetupData.parent
		this.setupRelations(meshDatas);
		
		// 5. create data
		var data = this.createDataFromMeshDatas(meshDatas);
		
		return data;
	};

	return ObjectRelator;
})();