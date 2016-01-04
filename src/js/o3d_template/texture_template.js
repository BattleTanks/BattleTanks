_TextureTemplate = (function(){
	TextureTemplate = function(){};
	
	function _mergeDefaultArgs(defaultArgs, args){
		if(UTIL.isUndefined(args)) return defaultArgs;
		UTIL.mergeObjects(args, defaultArgs);
		return defaultArgs;
	}
	
	proto = TextureTemplate.prototype;

	proto.createTextTexture = function(text, args){
		var defaultArgs = {
			width : 1024,
			height : 1024,
			aspectRatio : 1,
			fontOption : "Bold",
			fontSize : "120px",
			fontFamily : "Arial",
			textStartX : 0,
			textStartY : 0,
			fillStyle : "white",
			strokeStyle : "black",
			lineWidth : 5
		};
		args = _mergeDefaultArgs(defaultArgs, args);
		
		// create canvas bitmap
		var bitmap = document.createElement('canvas');
		var context = bitmap.getContext('2d');
		
		bitmap.width  = args.width;
		bitmap.height = args.height;
		context.scale(args.aspectRatio, 1);
		
		context.font      = args.fontOption + " " + args.fontSize + " " + args.fontFamily;
		context.fillStyle = args.fillStyle;
		context.fillText(text, args.textStartX, args.textStartY);
		
		context.lineWidth   = args.lineWidth;
		context.strokeStyle = args.strokeStyle;
		context.strokeText(text, args.textStartX, args.textStartY);
		
		var texture = new THREE.Texture(bitmap);
		texture.needsUpdate = true;
		
		return texture;
	};
	
	return TextureTemplate;
})();
var TextureTemplate = new TextureTemplate();