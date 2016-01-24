function test(){
	var it = new Iterator();
	
	it.push(19,22,24);
	
	for(var i = it.first(); i; i = it.next()){
		console.log(i);
	}
	
	for(var i = it.first(); i; i = it.next()){
		console.log(i);
	}
}