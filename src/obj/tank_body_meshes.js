// tank_test.obj mesh
var tankBodyMeshLibrary = {
	bodyPhysiMesh : {
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
		name : "bodyMesh",
		parent : "bodyPhysiMesh",
		type : "body",
		physics : false
	},
	turretMountPoint : {
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
		name : "gunMesh",
		parent : "gunPhysiMesh",
		type : "gun",
		physics : false
	},
	gunMounterPoint : {
		name : "gunMounterPoint",
		type : "mounterPoint"
	},
	turretPhysiMesh : {
		name : "turretPhysiMesh",
		parent : "gunPhysiMesh",
		type : "physiMesh",
		physics : true,
		physicsMeshType : "box",
		visible : true,
		friction : 10,
		restitution : 0,
		mass : 50
	},
	turretGunMountPoint : {
		name : "turretGunMountPoint",
		parent : "turretPhysiMesh"
		type : "mountPoint",
		mountType : "turret",
		rotation : {
			axis : new THREE.Vector3(0,1,0),
			range : new Range(0, Math.PI/6),
			bounce : 0.0
		}
	},
	turretMesh : {
		name : "turretMesh",
		parent : "turretPhysiMesh",
		type : "turret",
		physics : false
	},
	turretMounterPoint : {
		name : "turretMounterPoint",
		type : "mounterPoint"
	}
};