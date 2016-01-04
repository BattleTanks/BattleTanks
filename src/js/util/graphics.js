Matrix3 = THREE.Matrix3;
Matrix4 = THREE.Matrix4;
Vector2 = THREE.Vector2;
Vector3 = THREE.Vector3;

Graphics = (function(){
	function _mergeDefaultArgs(defaultArgs, args){
		if(UTIL.isUndefined(args)) return defaultArgs;
		UTIL.mergeObjects(args, defaultArgs);
		return defaultArgs;
	}
	
	Graphics = function(args){
		var defaultArgs = {
			domelement : document.body,
			physijsWorker : '/js/api/physijs_worker.js',
			physijsAmmo : '/js/api/ammo.js',
			antialias : true,
			renderWidth : window.innerWidth,
			renderHeight : window.innerHeight
		};
		args = _mergeDefaultArgs(defaultArgs, args);
		
		function __setupPhysijsScripts(){
			Physijs.scripts.worker = args.physijsWorker;
			Physijs.scripts.ammo = args.physijsAmmo;
		};
		
		function __createRenderer(){
			var domelement = args.domelement;
			BROUSER.log("render width:" + args.renderWidth + " height:" + args.renderHeight);
			var rendererArgs = {
				antialias : args.antialias
			};
			var renderer = new THREE.WebGLRenderer(rendererArgs);
			renderer.setSize(args.renderWidth, args.renderHeight);
			domelement.appendChild(renderer.domElement);
			return renderer;
		};
		
		__setupPhysijsScripts();
		this._domelement = args.domelement;
		this._renderer   = __createRenderer();
		this._renderWidth = args.renderWidth;
		this._renderHeight = args.renderHeight;
	};

	proto = Graphics.prototype;
	
	proto.enableShadow = function(args){
		var defaultArgs = {
			mapType : THREE.PCFShadowMap,
			soft : true
		};
		args = _mergeDefaultArgs(defaultArgs, args);
		
		this._renderer.shadowMap.enabled = true;
		this._renderer.shadowMap.type = args.mapType;
		this._renderer.shadowMapSoft = args.soft;
	};
	
	proto.disableShadow = function(){
		this._renderer.shadowMap.enabled = false;
	};
	
	proto.createScene = function(args){
		var defaultArgs = {
			physics : false,
			reportSize : 10,
			gravity : new Vector3(0, -9.8, 0)
		};
		args = _mergeDefaultArgs(defaultArgs, args);
		
		function __createPhysicsScene(){
			var physijsSceneArgs = {
				reportsize : args.reportSize
			};
			var scene = new Physijs.Scene(physijsSceneArgs);
			scene.setGravity(args.gravity);
			scene.userData = {physics : true};
			return scene;
		};
		
		function __createStaticScene(){
			var scene = new THREE.Scene();
			scene.userData = {physics : false};
			return scene;
		};
		
		return args.physics ? __createPhysicsScene() : __createStaticScene();
	};
	
	proto.createCamera = function(args){
		var defaultArgs = {
			clipNear : 0.1,
			clipFar : 1000,
			type : "perspective",
			// for perspective camera
			fov : 60,
			aspectRatio : this._renderWidth / this._renderHeight,
			// for orthographic camera
			frustumLeft : this._renderWidth / (-2),
			frustumRight : this._renderWidth / 2,
			frustumTop : this._renderHeight / 2,
			frustumBottom : this._renderHeight / (-2)
		};
		args = _mergeDefaultArgs(defaultArgs, args);
		
		var __createCamera = {};
		
		__createCamera["perspective"] = function(){
			return new THREE.PerspectiveCamera(args.fov, args.aspectRatio, args.clipNear, args.clipFar);
		};
		
		__createCamera["orthographic"] = function(){
			return new THREE.OrthographicCamera(args.frustumLeft, args.frustumRight, args.frustumTop, args.frustumBottom, args.clipNear, args.clipFar);
		};
		
		return __createCamera[args.type]();
	};
	
	proto.render = function(scene, camera, dt, steps){
		var timeStep = UTIL.optional(undefined, dt);
		var maxsteps = UTIL.optional(1, steps);
		if(scene.userData.physics) scene.simulate(timeStep, maxsteps);
		this._renderer.render(scene, camera);
	};
	
	proto.templates = {};
	
	return Graphics;
})();