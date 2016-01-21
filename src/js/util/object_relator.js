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
			if(meshData.type == "mounter-point") continue;
			if(meshData.type == "mount-point") continue;
			
			var parent = meshDatas[meshData.parent];
			parent.mesh.add(meshData.mesh);
		}
	};
	
	proto.createDataFromMeshDatas = function(meshDatas){
		for(var meshName in meshDatas){
			var data = {};
			var meshData = meshDatas[meshName];
			if(meshData.type == "mounter-point"){
				var mounterPoint = PointTemplate.getCenterOfMesh(meshData.mesh);
				mounterData.point = mounterPoint;
				data.mounter = mounterData;
			}
			else if(meshData.type == "mount-point"){
				mountData.type = meshData.mountType;
				mountData.point = PointTemplate.getCenterOfMesh(meshData.mesh);
				data.mount[meshData.name] = mountData;
			}
			else if(meshData.parent == "root"){
				data.object3d = meshData.mesh;
			}
		}
		
		return data;
	};
	
	proto.createData = function(object){
		var errorObject = O3DTemplate.createBox(1.0, 1.0, 1.0, new THREE.MeshLambertMaterial({color:0xff0000}));
		var data = {
			object3d : errorObject,
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
		
		// 1. separate meshes from object
		var meshes = this.separateMeshes(object);

		// 2. get mesh data from meshDataLibrary using mesh name as key
		var meshDatas = this.getMeshDatas(meshes);
		
		// 3. create phyis mesh if meshSetupData.physics is true
		this.setupPhysicsMesh(meshDatas);
		
		// 4. connect parent-child from meshSetupData.parent
		this.setupRelations(meshDatas);
		
		// 5. create data
		data = this.createDataFromMeshDatas(meshDatas);
		
		return data;
	};

	return ObjectRelator;
})();