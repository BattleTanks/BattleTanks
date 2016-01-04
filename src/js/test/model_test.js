function test(){
	var time = new Time();
	timer = time.createTimer(1000);
	
	gun = new Gun();
	
	function update(){
		gun.update();
		gun.render();
		BROUSER.requestAnimationFrame(update);
	}
	update();
}