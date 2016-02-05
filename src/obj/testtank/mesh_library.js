var SHOW_PHYSI_MESH = true;

// tank_test mesh
var TEST_WORLD_MESH_LIBRARY = {
	bodyPhysiMesh : {
		modelType : "tankBody",
		name : "bodyPhysiMesh",
		parent : "root",
		type : "physiMesh",
		physics : true,
		physicsMeshType : "box",
		visible : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
		visible  : SHOW_PHYSI_MESH,
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
		visible  : SHOW_PHYSI_MESH,
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
		visible  : SHOW_PHYSI_MESH,
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
		visible  : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
		visible : SHOW_PHYSI_MESH,
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
};SHOW_PHYSI_MESH