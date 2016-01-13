/*
Constrint flow

step1, position object

step2, add objects to scene, starting from child to parent

step3, add constraints from child to parent

*/

_ConstraintTemplate = (function(){
	_ConstraintTemplate = function(){};

	proto = _ConstraintTemplate.prototype;

	/*
	About arguments
		bounce : 0.0 = no bounce
		bias_factor : applied as a factor to constraint error
	*/
	proto.createHingeConstraint = function(scene, child, point, axis, angleRange, bounce, parent){
		var constraint = new Physijs.HingeConstraint(child, parent, point, axis);
		scene.addConstraint(constraint);
		constraint.setLimits(angleRange.getMin(), angleRange.getMax(), undefined, UTIL.optional(0.0, bounce));
		return constraint;
	};

	proto.createWheelConstraint = function(scene, child, point, axis, parent){
		var constraint = this.createHingeConstraint(scene, child, point, axis, new Range(0, 2*Math.PI), 0.0, parent);
		return constraint;
	};

	/*---
	Arguments must be the following

	var mountData = {
		object : Physijs Mesh
		mounterPoint : THREE.Vector3
	};

	var mounterData = {
		object : Physijs Mesh
		mountPoint : THREE.Vector3
		rotationAxis : THREE.Vector3
		rotationRange : Range
		rotationBounce : 0.0(nobounce) ~ 1.0(bouncy)
		basePoint : THREE.Vector3
	};

	var baseData = {
		object : Physijs Mesh
		mounterPoint : THREE.Vector3
		rotationAxis : THREE.Vector3
		rotationRange : Range
		rotationBounce : 0.0(nobounce) ~ 1.0(bouncy)
	};
	---*/
	/*
	Object hirerarky will be
		parent -> Base
					Mounter
						Mount
	*/
	proto.createTurretConstraint = function(scene, baseData, mounterData, mountData){
		// create constraints
		var mountWMP = PointTemplate.getWorldPoint(mounterData.object, mounterData.mountPoint);
		var baseWMP  = PointTemplate.getWorldPoint(mounterData.object, mounterData.basePoint);
		var mounterToMountConstraint = this.createHingeConstraint(
											scene,
											mountData.object, mountWMP,
											mounterData.rotationAxis, mounterData.rotationRange, mounterData.rotationBounce, mounterData.object);
		var baseToMounterConstraint = this.createHingeConstraint(
											scene,
											mounterData.object, baseWMP,
											baseData.rotationAxis, baseData.rotationRange, baseData.rotationBounce, baseData.object);

		return {"mounterToMount" : mounterToMountConstraint, "baseToMounter" : baseToMounterConstraint};
	};

	proto.createTrackContraint = function(scene, wheels, startingPoint, interval, alignDirection, parent){
		// crate constraints
		var constraints = [];
		for(var i = 0; i < wheels.length; ++i){
			var constraint = this.createWheelConstraint(scene, wheels[i], wheels[i].position, PointTemplate.XAXIS, parent);
			constraints.push(constraint);
		}

		return constraints;
	};

	return _ConstraintTemplate;
})();
ConstraintTemplate = new _ConstraintTemplate();
