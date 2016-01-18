GunData = {
	id : "",
	type : "gun",
	object3d : null,
	mounter : {
		point : new Three.Vector3(),
	}
};

GunModel = (function(){
	var Vector3 = THREE.Vector3;

	GunModel = function(data){
		Model.call(this);
		this.data = data;
	};

	UTIL.inherits(GunModel, Model);

	proto = GunModel.prototype;

	proto._update = function(dt){
		return
	};

	return GunModel;
})();
