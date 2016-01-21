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

MountModel = (function(){
	MountModel = function(data){
		if(UTIL.isUndefined(data.mounter)){
			data.mounter = {
				point : new THREE.Vector3(0, 0, 0)
			};
		}
		
		Model.call(this, data);
	};
	
	UTIL.inherits(MountModel, Model);
	
	proto = MountModel.prototype;
	
	proto.mount = function(mount){
		var target = this.findChild(function(child){ return child.data.type == mount.type; });
		if(target === null){
			BROUSER.log(mount.type + " not found in " + this.data.id);
			return;
		}
		PointTemplate.mount(target.data.object3d, this.data.object3d, target.data.mounter.point, mount.point);
	};
	
	proto.mountChildren = function(){
		for(var mountId in this.data.mount){
			this.mount(this.data.mount[mountId]);
		}
	};
	
	proto.addToScene = function(scene){
		scene.add(this.data.object3d);
	}
	
	return MountModel;
})();

ConstraintModel = (function(){
	ConstraintModel = function(data){
		if(UTIL.isUndefined(data.mount)){
			data.mount = {};
		}
		
		MountModel.call(this, data);
	};
	
	UTIL.inherits(ConstraintModel, MountModel);
	
	proto = ConstraintModel.prototype;

	proto.constrain = function(scene, mount){
		var target = this.findChild(function(child){ return child.data.type == mount.type; });
		if(target === null) return;
		
		var children = this.data.object3d.children;	// save children before constraining
		
		mount.constraint = ConstraintTemplate.createHingeConstraint(
								scene,
								target.data.object3d,
								(new THREE.Vector3()).addVectors(mount.point, this.data.object3d.position),
								mount.rotation.axis,
								mount.rotation.range,
								mount.rotation.bounce,
								this.data.object3d);
		
		// restore children
		for(var i = 0; i < children.length; ++i){
			this.data.object3d.add(children[i]);
		}
	};
	
	proto.constrainChildren = function(scene){
		for(var mountId in this.data.mount){
			this.constrain(scene, this.data.mount[mountId]);
		}
	};

	proto.addToScene = function(scene){
		scene.add(this.data.object3d);
	};
	
	return ConstraintModel;
})();

RootModel = (function(){
	RootModel = function(){
		data = {};
		data.id = "root";
		Model.call(this, data);
	};
	
	UTIL.inherits(RootModel, Model);

	proto = RootModel.prototype;
	
	proto._update = function(dt){
		return;
	};

	return RootModel;
})();