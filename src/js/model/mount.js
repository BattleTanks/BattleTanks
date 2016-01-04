Mount = (function(){
	Mount = function(mountPoint){
		this._mountPoint = mountPoint;
		this._constraint;
	};
	
	proto = Mount.prototype;
	
	return Mount;
})();

Hinge = (function(){
	Hinge = function(mountPoint, rotationAxis, rotationLimit){
		Mount.call(this, mountPoint);
		
		this._axis;
		this._rotationLimit;
	};

	UTIL.inherits(Hinge, Mount);

	proto = Hinge.prototype;

	proto.mount = function(model){
		
	};

	return Hinge;
})();