/*
 * ブラウザ機能のインタフェース
 */
BROUSER = {};
BROUSER.debug = false;
BROUSER.events = {
	KEY_DOWN : "keydown",
	KEY_UP : "keyup",
	MOUSE_DOWN : "mousedown",
	MOUSE_UP : "mouseup",
	MOUSE_WHEEL : (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll":"mousewheel",
	MOUSE_MOVE : "mousemove"
};
BROUSER.inputs = {
	INVALID : 0x0,
	MOUSE_LEFT_BUTTON : 0x1,
	MOUSE_MIDDLE_BUTTON : 0x2,
	MOUSE_RIGHT_BUTTON : 0x3,
	MOUSE_SCROLL_UP : 0x10,
	MOUSE_SCROLL_DOWN : 0x11,
	KEY_UP : 38,
	KEY_DOWN : 40,
	KEY_RIGHT : 39,
	KEY_LEFT : 37
};
BROUSER.getElementById      = function(id){ return document.getElementById(id); };
BROUSER.getInnerHTML        = function(element){ return element.innerHTML; };
BROUSER.addEventListener    = function(element, eventName, callback){ element.addEventListener(eventName, callback); };
BROUSER.removeEventListener = function(element, eventName, callback){ element.removeEventListener(eventName, callback); };
BROUSER.getKeyCode          = function(event){ return event.keyCode||event.which; };
BROUSER.getKeyChar          = function(event){ return String.fromCharCode(BROUSER.getKeyCode(event)); };
BROUSER.getMouseButton = function(event){
	switch(event.which){
		case 1: return BROUSER.inputs.MOUSE_LEFT_BUTTON;
		case 2: return BROUSER.inputs.MOUSE_MIDDLE_BUTTON;
		case 3: return BROUSER.inputs.MOUSE_RIGHT_BUTTON;
		default:return BROUSER.inputs.INVALID;
	}
};
BROUSER.getMouseWheelDirection = function(event){
	var delta = event.wheelDelta||-event.detail;
	if(delta>0) return this.inputs.MOUSE_SCROLL_UP;
	if(delta<0) return this.inputs.MOOSE_SCROLL_DOWN;
	return this.inputs.INVALID;
};
BROUSER.getMouseWheelSpeed        = function(event){ return event.wheelDelta||-event.detail; };
BROUSER.getMousePageCoordinate    = function(event){ return {x:event.pageX, y:event.pageY}; };
BROUSER.getMouseElementCoordinate = function(event, element){ return {x:event.pageX-element.offsetLeft, y:event.pageY-element.offsetTop}; };
BROUSER.getPointerLockedMouseMovement = function(event){
	var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
	return { x:movementX, y:movementY };
};
BROUSER.preventArowKeyDefautlAction = function(event){ if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1){ event.preventDefault(); }};
BROUSER.requestAnimationFrame     = function(callback){ window.requestAnimationFrame(callback); };
BROUSER.log    = function(argv){ console.log.apply(console, Array.prototype.slice.call(arguments)); };
BROUSER.assert = function(argv){ console.assert.apply(console, Array.prototype.slice.call(arguments)); if(this.debug)debugger; };
BROUSER.alert  = function(message){ alert(message); };
BROUSER.write  = function(message){ document.write(message); };
BROUSER.error  = function(message){ console.log("<!! ERROR !!>", message); };
BROUSER.warn   = function(message){ console.log("<!! WARNING !!>", message); };
BROUSER.requestPointerLock = function(element, whenLocked, whenExit){
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	if(!havePointerLock){ console.log("<!! ERROR !!> document does not supports PointerLock"); return; }
	
	element.requestPointerLock && element.requestPointerLock();
	element.mozRequestPointerLock && element.mozRequestPointerLock();
	element.webkitRequestPointerLock && element.webkitRequestPointerLock();
	
	var changeCallback = function(){
		(document.pointerLockElement       === requestedElement ||
		 document.mozPointerLockElement    === requestedElement ||
		 document.webkitPointerLockElement === requestedElement)
		
		?(BROUSER.log("<!! NOTICE !!> pointer is now locked") && whenLocked())
		
		:(BROUSER.log("<!! ERROR !!> pointer failed to lock") && whenExit());
	};
	
	document.addEventListener('pointerlockchange', changeCallback, false);
	document.addEventListener('mozpointerlockchange', changeCallback, false);
	document.addEventListener('webkitpointerlockchange', changeCallback, false);
	
	document.addEventListener('pointerlockerror', whenExit, false);
	document.addEventListener('mozpointerlockerror', whenExit, false);
	document.addEventListener('webkitpointerlockerror', whenExit, false);
};
BROUSER.exitPointerLock = function(){
	var exitLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
	exitLock();
};

/*
 * 範囲
 */
Range = (function(){
	Range = function(min, max){
		BROUSER.assert(min <= max);
		this._min = min;
		this._max = max;
		this._size = max - min;
	};
	
	proto = Range.prototype;
	
	proto.getMin = function(val){
		return this._min;
	};
	
	proto.getMax = function(val){
		return this._max;
	};
	
	proto.getSize = function(val){
		return this._size;
	};
	
	proto.isOutside = function(val){
		return (val < this._min) || (this._max < val);
	};
	
	proto.isInside = function(val){
		return (this._min <= val) && (val <= this._max);
	};
	
	proto.nearest = function(val){
		var middle = (this._min + this._max) / 2;
		return (val < middle) ? this._min : this._max;
	};
	
	proto.clamp = function(val){
		if(val < this._min) return this._min;
		if(this._max < val) return this._max;
		return val;
	};
	
	proto.wrap = function(val){
		if(val < this._min) return this.wrap(this._max - (this._min - val));
		if(this._max < val) return this.wrap(this._min + (val - this._max));
		return val;
	};
	
	return Range;
})();

/*
 * カウンタ
 */
Counter = (function(){
	Counter = function(countFrom, interval){
		this._initial = this._count = UTIL.optional(0, countFrom);
		this._interval = UTIL.optional(1, interval);
	};
	
	proto = Counter.prototype;
	
	proto.count = function(){
		return this._count;
	};
	
	proto.increment = function(incval){
		this._count += UTIL.optional(this._interval, incval);
		return this._count;
	};
	
	proto.decrement = function(decval){
		this._count -= UTIL.optional(this._interval, decval);
		return this._count;
	};
	
	proto.setInterval = function(interval){
		BROUSER.assert(0 < interval);
		this._interval = interval;
	};
	
	proto.reset = function(){
		this._count = this._initial;
		return this._count;
	};
	
	return Counter;
})();

/*
 * タイマー
 */
Timer = (function(){
	Timer = function(limit){
		this._elapsed = 0;
		this._limit = limit;
		this._laps = [];
		this._isStoped = true;
	};
	
	proto = Timer.prototype;
	
	proto.getElapsed = function(){
		return this._elapsed;
	};
	
	proto.update = function(dt){
		if(this._isStoped) return;
		this._elapsed += dt;
		return this._elapsed;
	};
	
	proto.isTimeup = function(){
		return this._elapsed >= this._limit;
	};
	
	proto.stop = function(){
		this._isStoped = true;
		return this._elapsed;
	};
	
	proto.isStoped = function(){
		return this._isStoped;
	};
	
	proto.start = function(){
		this._isStoped = false;
	};
	
	proto.reset = function(){
		this.stop();
		this._elapsed = 0;
	};
	
	proto.restart = function(){
		this.reset();
		this.start();
	};
	
	proto.lap = function(dt){
		this._laps.push(dt);
		this.update(dt);
	};
	
	return Timer;
})();

/*
 * 時間
 */
Time = (function(){
	Time = function(){
		this._current = Date.now();
		
		this._unitBias = {
			MSECONDS : 1.0,
			SECONDS : 0.001,
			MINUTES : 0.001/60
		}
		this._timers = new Iterator();
	};
	
	proto = Time.prototype;
	
	proto.update = function(){
		var before = this._current;
		this._current = Date.now();
		var dt = this._current - before;
		
		this.updateTimers(dt);
		
		return dt;
	};
	
	proto.getMSeconds = function(){
		return this._current * this._unitBias.MSECONDS;
	};

	proto.getSeconds = function(){
		return this._current * this._unitBias.SECONDS;
	};
	
	proto.getMinutes = function(){
		return this._current * this._unitBias.MINUTES;
	};
	
	proto.secToMSec = function(sec){
		return sec / this._unitBias.SECONDS;
	};
	
	proto.minToMSec = function(min){
		return min / this._unitBias.MINUTES;
	};
	
	proto.addTimer = function(timer){
		this._timers.push(timer);
	};
	
	proto.createTimer = function(limit){
		var timer = new Timer(limit);
		this.addTimer(timer);
		return timer;
	};
	
	proto.updateTimers = function(dt){
		for(var timer = this._timers.first(); timer; timer = this._timers.next()){
			timer.update(dt);
		}
	};

	return Time;
})();

/*
 * イテレータ
 */
Iterator = (function(){
	Iterator = function(){
		this._items = [];
		this._index = 0;
		this._indexRange = new Range(-1, -1);
	};
	
	proto = Iterator.prototype;

	proto.push = function(item){
		this._items.push.apply(this._items, Array.prototype.slice.call(arguments));
		this._indexRange = new Range(0, this._items.length-1);
	};
	
	proto.pop = function(){
		return this._items.pop();
	};
	
	proto.length = function(){
		return this._items.length;
	};
	
	proto.current = function(){
		return (this._items.length) ? this._items[this._index] : false;
	};
	
	proto.isValidIndex = function(index){
		return index < 0 ? false : this._indexRange.isInside(index);
	};
	
	proto.hasNext = function(){
		return this.isValidIndex(this._index+1);
	};
	
	proto.hasPrevious = function(){
		return this.isValidIndex(this._index-1);
	};
	
	proto.index = function(index){
		if(!(this.isValidIndex(index))) return false;
		this._index = index;
		return this._items[this._index];
	};
	
	proto.next = function(){
		return this.index(this._index+1);
	};

	proto.previous = function(){
		return this.index(this._index-1);
	};

	proto.first = function(){
		return this.index(this._indexRange.getMin());
	};
	
	proto.last = function(){
		return this.index(this._indexRange.getMax());
	};
	
	return Iterator;
})();

/*
 *	UTIL関数
 */
UTIL = {};
UTIL.inherits = function(child, parent){ Object.setPrototypeOf(child.prototype, parent.prototype); };
UTIL.isUndefined = function(variable){ return typeof variable === "undefined"; };
UTIL.optional = function(defaultValue, variable){ return UTIL.isUndefined(variable) ? defaultValue : variable; };
UTIL.rightFillString = function(string, size, fill){
	if(UTIL.isUndefined(fill)) fill = " ";
	var holder;
	for(var i=0; i<size; ++i){
		holder += fill;
	}
	
	return (holder + string).substr(-size);
};
UTIL.numberToString = function(value, size, radix, fill){
	return UTIL.rightFillString(value.toString(radix), size, fill);
};
UTIL.mergeObjects = function(ref, target){ for(var key in ref){ target[key] = ref[key]; } };
UTIL.include = function(src){
	if(UTIL.isUndefined(this.loadedFiles)) this.loadedFiles = [];
	if(this.loadedFiles.indexOf(src) != -1) return;
	
	var parts = src.split(".");
	var filetype = parts[parts.length - 1];
	var element = {name : "", attributes : {} };
	switch(filetype){
		case  "js" :
			element.name = "script";
			element.attributes["src"] = src;
			element.attributes["charset"] = "utf-8";
			break;
		case "css" :
			element.name = "link";
			element.attributes["rel"] = "stylesheet";
			element.attributes["type"] = "text/css";
			element.attributes["href"] = src;
			break;
		default:
			BROUSER.log("could not include " + src);
			return;
	}
	
	this.loadedFiles.push(src);
	var fileref = document.createElement(element.name);
	for(attribute in element.attributes){
		fileref.setAttribute(attribute, element.attributes[attribute]);
	}
	document.getElementsByTagName("head")[0].appendChild(fileref);
	console.log(this.loadedFiles);
};