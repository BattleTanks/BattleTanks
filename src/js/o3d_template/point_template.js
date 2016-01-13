_PointTemplate = (function(){
	Vector3 = THREE.Vector3;

	_PointTemplate = function(){
		this.XAXIS = new Vector3(1, 0, 0);
		this.YAXIS = new Vector3(0, 1, 0);
		this.ZAXIS = new Vector3(0, 0, 1);
		this.FRONT = new Vector3(0, 0, -1);
		this.BACK  = new Vector3(0, 0, 1);
		this.UP    = new Vector3(0, 1, 0);
		this.DOWN  = new Vector3(0, -1, 0);
		this.LEFT  = new Vector3(-1, 0, 0);
		this.RIGHT = new Vector3(1, 0, 0);
	};

	proto = _PointTemplate.prototype;

	proto.getWorldPoint = function(object, objectLocalPoint){
		return (new Vector3()).addVectors(object.position, objectLocalPoint);
	};

	proto.getDirectionVector = function(source, target){
		return (new Vector3()).subVectors(target, source);
	};

	proto.mountLocalToWorld = function(object, localPoint, worldPoint){
		var localPtoWorldP = this.getDirectionVector(localPoint, worldPoint);
		object.position.copy(localPtoWorldP);	// translate obbject acording to direction vector
	};

	proto.mount = function(child, parent, childMountingPoint, parentMountingPoint){
			var parentCMP = this.getWorldPoint(parent, parentMountingPoint);
			this.mountLocalToWorld(child, childMountingPoint, parentCMP);
	};

	proto.gather = function(objects, point){
		for(var i = 0; i < objects.length; ++i){
			objects[i].position.copy(point);
		}
	};

	proto.align = function(objects, interval, direction){
		var translateV = new Vector3(0, 0, 0);
		var intervalV = (new Vector3()).copy(direction).normalize().multiplyScalar(interval);
		for(var i = 0; i < objects.length; ++i){
			objects[i].position.add(translateV.add(intervalV)); // like x += interval*i
		}
	};

	/*
	 Arguments
		base : base object
		mounter : mounter object
		mount : mount object
		baseMounterPoint : base's mounter point
		mounterBasePoint : mounter's base point
		mounterMountPoint : mounter's mount point
		mountMounterPoint : mount's mounter point
	*/
	proto.mountTurret = function(base, mounter, mount, baseMounterPoint, mounterBasePoint, mounterMountPoint, mountMounterPoint){
		PointTemplate.mount(mounter, base, mounterBasePoint, baseMounterPoint);		// mount mounter to base
		PointTemplate.mount(mount, mounter, mountMounterPoint, mounterMountPoint);		// mount mount to mounter
	}

	return _PointTemplate;
})();
PointTemplate = new _PointTemplate();
