if(!window.jsapp){
  var jsapp = {"version": "1.0"};
}

jsapp = {
	steps: [],
	audio: null,
	start: null,
	step: null,
	sound: null,
	stepMap: function(){
		var self = this;
		var map = {}
		var i = parseFloat(self.start);
		var s = 1;
		var duration = self.sound.durationEstimate;
		while(i < parseFloat(duration)){
			map[i] = s;
			if(s == 8) s = 1;
			else s++;
			i = i + self.step;
		}
		return map;
	},
	bindButtons: function(){
		var self = this;
		jQuery('#steps').on('click', function(){
			var currentTime = self.sound.position;
			self.steps[self.steps.length] = currentTime;
			console.log(currentTime);
		});
		jQuery('#steps-clear').on('click', function(){
			self.steps = [];
		})
		self.generateSteps();
	},
	generateSteps: function(){
		var self = this;
		jQuery('#generate').on('click', function(){
			self.start = self.steps[0];
			self.step = jQuery.map(jsapp.steps, function(o, i){
				if(i > 0){
					return o - jsapp.steps[i - 1];
				}
			}).reduce(function(a, b){
				var sum = a + b;
				return sum / 2;
			})
			console.log(self.stepMap());
			self.sound.setPosition(0);
			self.printSteps();
			self.sound.play();
		});
	},
	printSteps: function(){
		var self = this;
		var last = null;
		var stepMap = self.stepMap();
		var keys = Object.keys(stepMap);
		jQuery.each(keys, function(i, key){
			self.sound.onPosition(key, function(evt){
				var value = stepMap[key];
				if(value != 4 && value != 8){
					console.log(value);
				};
			});
		});
	},
	smDeploy: function(){
		var self = this;
		soundManager.setup({
			url: '/swf/',
			onready: function() {
				self.sound = soundManager.createSound({
					id: 'aSound',
					url: '/files/salsalesson.mp3'
		    	});
			},
			ontimeout: function() {
		  		// Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
			}
		});
	}
}


jQuery(document).ready(function(){
	//jsapp.audio = jQuery('audio').get(0);
	jsapp.bindButtons();
	jsapp.smDeploy();
})