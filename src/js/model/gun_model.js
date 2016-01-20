GunModel = (function(){
	GunModel = function(data){
		MountModel.call(this, data);
	};

	UTIL.inherits(GunModel, MountModel);

	proto = GunModel.prototype;

	proto._update = function(dt){
		return;
	};

	return GunModel;
})();
