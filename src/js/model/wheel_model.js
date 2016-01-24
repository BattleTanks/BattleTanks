WheelModel = (function(){
	WheelModel = function(data){
		MountModel.call(this, data);
	};
	
	UTIL.inherits(WheelModel, MountModel);

	proto = WheelModel.prototype;

	proto._update = function(dt){
		return;
	};

	return WheelModel;
})();