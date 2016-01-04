Button = (function(){
	Button = function(){
		this._state = false;
	};

	proto = Button.prototype;

	proto.up = function(){
		BROUSER.alert("<!! Error !!> define method for Button.up");
	};
	
	proto.down = function(){
		BROUSER.alert("<!! Error !!> define method for Button.down");
	};
	
	proto.isOn = function(){
		return this._state;
	};

	return Button;
})();

MomentaryButton = (function(){
	MomentaryButton = function(){
		Button.call(this);
	};

	UTIL.inherits(MomentaryButton, Button);
	
	proto = MomentaryButton.prototype;
	
	proto.up = function(){
		if(!this._state) return false;
		return this._state = false;
	};
	
	proto.down = function(){
		if(this._state) return true;
		return this._state = true;
	};
	
	return MomentaryButton;
})();

AlternateButton = (function(){
	AlternateButton = function(){
		Button.call(this);
		this._hold = false;
	};
	
	UTIL.inherits(AlternateButton, Button);
	
	proto = AlternateButton.prototype;
	
	proto._alternateState = function(){
		return this._state = !this._state;
	};
	
	proto.up = function(){
		if(this._hold) this._hold = false;
		return this._state;
	};
	
	proto.down = function(){
		if(this._hold) return this._state;
		this._hold = true;
		return this._alternateState();
	};
	
	return AlternateButton;
})();

