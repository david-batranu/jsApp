if(!window.jsapp){
	var jsapp = {"version": "1.0"};
}

jsapp.edit = {
	bindButtons: function(){
		var self = this;
		jQuery('#steps').on('click', function(){
			var currentTime = jsapp.getCurrentTime();
			jsapp.steps[jsapp.steps.length] = currentTime;
			console.log(currentTime);
		});
		jQuery('#steps-clear').on('click', function(){
			jsapp.steps = [];
		})
		jQuery('#generate').on('click', function(){
			jsapp.start = jsapp.steps[0];
			console.log(jsapp.stepMap());
			jsapp.printSteps();
			jsapp.restartPlay();
		});
	}
}


jQuery(document).ready(function(){
	jsapp.edit.bindButtons();
})
