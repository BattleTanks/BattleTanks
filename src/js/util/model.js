Model = (function(){
	Model = function(data){
		this.data = data;
		this.parent = null;
		this.children = new Iterator();
	};

	proto = Model.prototype;

	proto.add = function(model){
		model.parent = this;
		this.children.push(model);
	};

	proto.getRoot = function(){
		if(this.parent instanceof RootModel) return this.parent;
		return this.parent.getRoot();
	};

	proto.findChild = function(searchBy){
		for(var child = this.children.first(); child; this.children.next()){
			if(searchBy(child)) return child;
		}
		return null;
	};

	proto.traverse = function(callback){
		callback(this);
		for(var child = this.children.first(); child; child = this.children.next()){
			child.traverse(callback);
		}
	};

	proto._update = function(dt){
		BROUSER.warn("Model._update is not defined!!");
	};

	proto.update = function(dt){
		this._update(dt);
		for(var child = this.children.first(); child; child = this.children.next()){
			child.update(dt);
		}
	};

	return Model;
})();

RootModel = (function(){
	RootModel = function(){
		data = {};
		data.id = "root";
		Model.call(this, data);
	};
	
	UTIL.inherits(RootModel, Model);

	return RootModel;
})();