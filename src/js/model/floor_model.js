FloorModel = (function(){
	FloorModel = function(id){
		Model.call(this);

		this.id = id;

		function createFloorObject(){
			return O3DTemplate.createFloor(60, 60, new THREE.MeshLambertMaterial({color:0x88dd99}), true, 0.9, 1.0, 0);
		}

		this.object3d = createFloorObject();
	};

	UTIL.inherits(FloorModel, Model);

	proto = FloorModel.prototype;

	proto.update = function(dt){
		return;
	};

	return FloorModel;
})();
