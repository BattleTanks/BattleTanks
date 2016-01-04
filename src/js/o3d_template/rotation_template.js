_RotationTemplate = (function(){
	_RotationTemplate = function(){
	};

	proto = _RotationTemplate.prototype;
	
	proto.degreeToRad = function(degree){
		return Math.PI / (180/degree);
	}

	return _RotationTemplate;
})();
RotationTemplate = new _RotationTemplate();