_BattleTanksO3DTemplate = (function(){
	_BattleTanksO3DTemplate = function(){
		Object3DTemplate.call(this);
	};

	UTIL.inherits(_BattleTanksO3DTemplate, Object3DTemplate);

	proto = _BattleTanksO3DTemplate.prototype;

	proto.createLoadingSign = function(){
		var msgTexture = this.createTextTexture();
		
		var sign = TextureTemplate.createSign()
		return sign
	};

	proto.createBullet = function(radiusBottom, length, segments, material, restitution, mass){
		var geometry = new THREE.CylinderGeometry(0.01, radiusBottom, length, segments);
		
		if(UTIL.isUndefined(material)) material = new THREE.MeshLambertMaterial({color:this.COLOR.YELLOW});
		
		var mesh = this.createPhysicsMesh("cylinder", geometry, material, 1.0, restitution, mass);

		mesh.castShadow = false;
		mesh.receiveShadow = false;
		return mesh;
	};

	return _BattleTanksO3DTemplate;
})();
var BattleTanksO3DTemplate = new _BattleTanksO3DTemplate();