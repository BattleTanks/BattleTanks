Inputcoder = (function(){
	Inputcoder = function(){
		this.inputs = {
			KEY_DOWN : 0x1,
			KEY_UP : 0x2,
			MOUSE_BUTTON_DOWN : 0x3,
			MOUSE_BUTTON_UP : 0x4,
			MOUSE_WHEEL_UP : 0x5,
			MOUSE_WHEEL_DOWN : 0x6,
			MOUSE_MOVE : 0x7,
			MOUSE_MOVE_VERTICAL : 0x8,
			MOUSE_MOVE_HORIZONTAL : 0x9,
		};
		
		this._inputTypeBit = 24;
		this._inputTypeBitMask = 0xff << this._inputTypeBit;
		this._inputValueBitMask = ~this._inputTypeBitMask;
	};

	proto = Inputcoder.prototype;

	proto.create = function(inputTypeValue, inputValue){
		var inputTypeBits = inputTypeValue << this._inputTypeBit;
		var inputValueBits = this._inputValueBitMask & (inputValue << 0);
		return inputTypeBits | inputValueBits;
	};
	
	proto.decode = function(inputcode){
		var input = {type:0x0, value:0x0};
		input.type = inputcode >> this._inputTypeBit;
		input.value = inputcode & this._inputValueBitMask;
		return input;
	};

	return Inputcoder;
})();

InputActionManager = (function(){
	InputActionManager = function(domelement){
		//this._domelement = UTIL.optional(document, domelement);
		this._domelement = document;
		var varBridge = this._varBridge = {actionTable:{}, isPointerLocked:false};
		var coder = this._coder = new Inputcoder();
		
		var eventToAction = function(event, inputValueGetter, inputType){
			var inputValue = inputValueGetter(event);
			var typecode = coder.create(inputType, 0);
			var inputcode = coder.create(inputType, inputValue);
			
			var actionTable = varBridge.actionTable;
			actionTable[typecode]  && actionTable[typecode](inputValue);
			actionTable[inputcode] && actionTable[inputcode]();
		};
		
		var whenKeyDown = function(event){
			BROUSER.preventArowKeyDefautlAction(event);
			eventToAction(event, BROUSER.getKeyCode, coder.inputs.KEY_DOWN);
		};
		
		var whenKeyUp = function(event){
			eventToAction(event, BROUSER.getKeyCode, coder.inputs.KEY_UP);
		};
		
		var whenMouseDown = function(event){
			eventToAction(event, BROUSER.getMouseButton, coder.inputs.MOUSE_BUTTON_DOWN);
		};
		
		var whenMouseUp = function(event){
			eventToAction(event, BROUSER.getMouseButton, coder.inputs.MOUSE_BUTTON_UP);
		};
		
		var whenMouseWheel = function(event){
			var direction = BROUSER.getMouseWheelDirection(event);
			var speed = BROUSER.getMouseWheelSpeed(event);
			var typecode = (direction == BROUSER.inputs.MOUSE_SCROLL_UP) ? coder.create(coder.inputs.MOUSE_WHEEL_UP, 0)
																			: coder.create(coder.inputs.MOUSE_WHEEL_DOWN, 0);
			var actionTable = varBridge.actionTable;
			actionTable[typecode] && actionTable[typecode]((speed < 0) ? -speed : speed);
		};
		
		var dom = this._domelement;
		var whenMouseMove = function(event){
			var coord;
			if(varBridge.isPointerLocked){
				coord = BROUSER.getPointerLockedMouseMovement(event);
			}else{
				coord = (dom === document) ? BROUSER.getMousePageCoordinate(event, dom) : BROUSER.getMouseElementCoordinate(event, dom);
			}
			var typecode = {move:0x0, horizontal:0x0, vertical:0x0};
			
			typecode.move       = coder.create(coder.inputs.MOUSE_MOVE, 0);
			typecode.horizontal = coder.create(coder.inputs.MOUSE_MOVE_HORIZONTAL, 0);
			typecode.vertical   = coder.create(coder.inputs.MOUSE_MOVE_VERTICAL, 0);
			
			var actionTable = varBridge.actionTable;
			actionTable[typecode.move]       && actionTable[typecode.move](coord);
			actionTable[typecode.horizontal] && actionTable[typecode.horizontal](coord.x);
			actionTable[typecode.vertical]   && actionTable[typecode.vertical](coord.y);
		};
		
		BROUSER.addEventListener(this._domelement, BROUSER.events.KEY_DOWN, whenKeyDown);
		BROUSER.addEventListener(this._domelement, BROUSER.events.KEY_UP, whenKeyUp);
		BROUSER.addEventListener(this._domelement, BROUSER.events.MOUSE_DOWN, whenMouseDown);
		BROUSER.addEventListener(this._domelement, BROUSER.events.MOUSE_UP, whenMouseUp);
		BROUSER.addEventListener(this._domelement, BROUSER.events.MOUSE_WHEEL, whenMouseWheel);
		BROUSER.addEventListener(this._domelement, BROUSER.events.MOUSE_MOVE, whenMouseMove);
	};

	proto = InputActionManager.prototype;

	proto.setActionTable = function(table){
		this._varBridge.actionTable = (table instanceof ActionTable) ? table.getTable() : table;
	};
	
	proto.enablePointerLock = function(){
		if(this._varBridge.isPointerLocked) return;
		
		var varBridge = this._varBridge;
		var whenLocked = function(){
			BROUSER.log("<!! NOTICE !!> pointerlock success");
			varBridge.isPointerLocked = true;
		};
		var whenExit = function(){
			BROUSER.log("<!! ERROR !!> pointerlock failed");
			varBridge.isPointerLocked = false;
		};
		BROUSER.requestPointerLock((this._domelement === document)? document.body : this._domelement, whenLocked, whenExit);
	};
	
	proto.disablePointerLock = function(){
		BROUSER.exitPointerLock();
		this._varBridge.isPointerLocked = false;
	};
	
	proto.pointerIsLocked = function(){
		return this._varBridge.isPointerLocked;
	};

	return InputActionManager;
})();


ActionTable = (function(){
	ActionTable = function(){
		this._coder = new Inputcoder();
		this._table = {};
	};
	
	proto = ActionTable.prototype;
	
	proto.getTable = function(){
		return this._table;
	};
	
	proto._setAction = function(inputType, inputValue, action){
		var inputcode = this._coder.create(inputType, inputValue);
		this._table[inputcode] = action;
	};
	
	proto.insertKeyUpAction = function(action, character){
		var value = UTIL.isUndefined(character) ? 0 : character.charCodeAt(0);
		this._setAction(this._coder.inputs.KEY_UP, value, action);
	};
	
	proto.insertKeyDownAction = function(action, character){
		var value = UTIL.isUndefined(character) ? 0 : character.charCodeAt(0);
		this._setAction(this._coder.inputs.KEY_DOWN, value, action);
	};
	
	proto.insertMouseButtonUpAction = function(action, button){
		this._setAction(this._coder.inputs.MOUSE_BUTTON_UP, UTIL.optional(0, button), action);
	};
	
	proto.insertMouseButtonDownAction = function(action, button){
		this._setAction(this._coder.inputs.MOUSE_BUTTON_DOWN, UTIL.optional(0, button), action);
	};
	
	proto.insertMouseWheelUpAction = function(action){
		this._setAction(this._coder.inputs.MOUSE_WHEEL_UP, 0, action);
	};
	
	proto.insertMouseWheelDownAction = function(action){
		this._setAction(this._coder.inputs.MOUSE_WHEEL_DOWN, 0, action);
	};
	
	proto.insertMouseMoveAction = function(action){
		this._setAction(this._coder.inputs.MOUSE_MOVE, 0, action);
	};
	
	proto.insertMouseMoveVerticalAction = function(action){
		this._setAction(this._coder.inputs.MOUSE_MOVE_VERTICAL, 0, action);
	};
	
	proto.insertMouseMoveHorizontalAction = function(action){
		this._setAction(this._coder.inputs.MOUSE_MOVE_HORIZONTAL, 0, action);
	};
	
	return ActionTable;
})();