_MaterialTemplate = (function(){
	_MaterialTemplate = function(){
		this.COLOR = {
			WHITE  : 0xeeeeee,
			RED    : 0xff0000,
			BLUE   : 0x0000ff,
			GREEN  : 0x11f2a9,
			YELLOW : 0xfffe24,
			PURPLE : 0xfe3ff4
		};
	};

	proto = _MaterialTemplate.prototype;

	return _MaterialTemplate;
})();
MaterialTemaplte = new _MaterialTemplate();