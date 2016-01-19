StageModel = (function(){
	StageModel = function(data){
		Model.call(this, data);
	};

	UTIL.inherits(StageModel, Model);

	proto = StageModel.prototype;

	proto._update(dt){
		
	};

	return StageModel;
})();