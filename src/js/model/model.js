Model = (function(){
	Model = function(){
		this._id;
		this._children = new Iterator();
	};

	proto = Model.prototype;

	proto.add = function(node){
		this._children.push(node);
	};
	
	proto.updateSelf = function(){
		BROUSER.warn("Model._updateSelf is not defined!!");
	};
	
	proto.update = function(){
		this.updateSelf();
		for(var child = this._children.first(); child; child = this._children.next()){
			child.update();
		}
	};
	
	proto.renderSelf = function(renderer){
		BROUSER.warn("Model._renderSelf is not defined!!");
	};
	
	proto.render = function(renderer){
		this.renderSelf(renderer);
		for(var child = this._children.first(); child; child = this._children.next()){
			child.render(renderer);
		}
	};

	return Model;
})();