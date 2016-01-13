GunModel = (function(){
	var Vector3 = THREE.Vector3;

	GunModel = function(id){
		Model.call(this);

		this.id = id;

		function createGunObject(){
			var size = {
				width: 0.2,
				height: 0.2,
				length: 2.0
			};
			return O3DTemplate.createBox(size.width, size.height, size.length, new THREE.MeshLambertMaterial({color:0x34f903}), true, 0.9, 0.0, 1);
		}

		this.object3d = createGunObject();

		this.mounterPoint = new Vector3(0.0, 0.0, 1.0)
	};

	UTIL.inherits(GunModel, Model);

	proto = GunModel.prototype;

	proto._update = function(dt){
		return
	};

	return GunModel;
})();
