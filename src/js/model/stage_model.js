StageModel = (function(){
	StageModel = function(data){
		MountModel.call(this, data);
	};

	UTIL.inherits(StageModel, MountModel);

	proto = StageModel.prototype;

	proto._update = function(dt){
		return;
	};

	return StageModel;
})();