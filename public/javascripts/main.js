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
		var duration = self.getDuration();
		var steps = self.steps.slice();
		var offset = self.getOffset(steps);
		var last_steps = steps.slice();
		while(parseInt(steps.slice(-1)) < duration){
			var new_steps = jQuery.map(last_steps, function(o, i){
				return self.getFloat(Big(o).plus(offset));
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
	getDuration: function(){
		var self = this;
		if (self.sound) return self.sound.durationEstimate;
		else if (self.audio) return self.audio.duration;
	},
	getFloat: function(big){
		var self = this;
		return parseFloat(big.toFixed(2));
	},
	getOffset: function(list){
		var self = this;
		var last = list.slice(-6, -5);
		var first = list.slice(-list.length, -list.length + 1);
		return self.getFloat(Big(last).minus(first));
	},
	bindButtons: function(){
		var self = this;
		jQuery('#steps').on('click', function(){
			var currentTime = self.getCurrentTime();
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
			self.printSteps();
			self.restartPlay();
		});
	},
	restartPlay: function(){
		var self = this;
		if(self.sound){
			self.sound.setPosition(0);
			self.sound.stop();
			self.sound.play();
		}
		else if(self.audio){
			self.audio.currentTime = 0;
			self.audio.play();
		}
	},
	printSteps: function(){
		var self = this;
		var last = null;
		var stepMap = self.stepMap();
		if (self.sound) self.handleSound(stepMap);
		else if (self.audio) self.handleAudio(stepMap);
	},
	getCurrentTime: function(){
		var self = this;
		if(self.sound) return self.sound.position;
		if(self.audio) return self.getFloat(Big(self.audio.currentTime));
	},
	handleSound: function(stepMap){
		var self = this;
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
	handleAudio: function(stepMap){
		var self = this;
		setInterval(function(){
			var currentTime = self.getCurrentTime();
			var step = stepMap[currentTime];
			if(step) console.log(step);
		}, 1)

	},
	smDeploy: function(){
		var self = this;
		soundManager.setup({
			url: '/swf/',
			onready: function() {
				self.sound = soundManager.createSound({
					id: 'aSound',
					url: '/files/salsa.mp3'
		    	});
			},
			ontimeout: function() {
		  		// Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
			}
		});
	}
}


jQuery(document).ready(function(){
	jsapp.audio = jQuery('audio').get(0);
	jsapp.bindButtons();
	//jsapp.smDeploy();
})

//[9456, 9796, 10214, 10893, 11285, 11703, 12382, 12800, 13192, 13871, 14289, 14655, 15412, 15778, 16196, 16901, 17267, 17685]