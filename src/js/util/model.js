Model = (function(){
	Model = function(){
		this._children = new Iterator();

		this.id = undefined;
		this.object3d = undefined;
		this.data = undefined;
		this.action = undefined;
	};

	proto = Model.prototype;

	proto.add = function(node){
		this._children.push(node);
	};

	proto.traverse = function(callback){
		callback(this);
		for(var child = this._children.first(); child; child = this._children.next()){
			child.traverse(callback);
		}
	};

	proto._update = function(dt){
		BROUSER.warn("Model._update is not defined!!");
	};

	proto.update = function(dt){
		this._update(dt);
		for(var child = this._children.first(); child; child = this._children.next()){
			child.update(dt);
		}
	};

	return Model;
})();
