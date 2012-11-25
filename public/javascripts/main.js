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
		var s = 1;
		var duration = self.sound.durationEstimate;
		var steps = self.steps.slice();
		var last_steps = steps.slice();
		while(parseInt(steps.slice(-1)) < duration){
			var offset = last_steps.slice(-6, -5) - last_steps.slice(-last_steps.length, -last_steps.length + 1);
			var new_steps = jQuery.map(last_steps, function(o, i){
				return o + offset;
			})
			steps.push.apply(steps, new_steps);
			last_steps = new_steps.slice();
		}
		for(var i = 0; i <= steps.length - 1; i++){
			if(s == 4) s = 5;
			if(s == 8) s = 1;
			map[steps[i]] = s;
			s++;
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

//[9456, 9796, 10214, 10893, 11285, 11703, 12382, 12800, 13192, 13871, 14289, 14655, 15412, 15778, 16196, 16901, 17267, 17685]