Gun = (function(){
	Gun = function(){
		Model.call(this);
		
		var width = 0.2;
		var height = 0.2;
		var length = 2.0;
		var turretMount = new Mount(THREE.Vector3(0.0, 0.0, 1.0));
		
		var friction = 0.9;
		var bounce = 0.0;
		var mass = 1.0;
		
		var physicsMaterial = new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true});
		var graphicsMaterial = new THREE.MeshLambertMaterial({color:0x333333});
		
		this.physics = O3DTemplate.createBox(width, height, length, physicsMaterial, true, friction, bounce, mass);
		this.graphics = O3DTemplate.createBox(width, height, length, graphicsMaterial);
		this.physics.add(this.graphics);
	};

	UTIL.inherits(Gun, Model);

	proto = Gun.prototype;

	proto.updateSelf = function(){
		
	};
	
	proto.renderSelf = function(renderer){
		
	};
	
	return Gun;
})();