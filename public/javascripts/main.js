if(!window.jsapp){
  var jsapp = {"version": "1.0"};
}

jsapp = {
	steps: [],
	audio: null,
	start: null,
	step: null,
	stepMap: function(){
		var self = this;
		var map = {}
		var i = parseFloat(self.start);
		var s = 1;
		var duration = Big(self.audio.duration).toFixed(2);
		while(i < parseFloat(duration)){
			var truei = Big(i).toFixed(2);
			map[truei] = s;
			if(s == 8) s = 1;
			else s++;
			i = Big(i).plus(self.step).toFixed(2);
		}
		return map;
	},
	bindButtons: function(){
		var self = this;
		jQuery('#steps').on('click', function(){
			var currentTime = Big(self.audio.currentTime).toFixed(2);
			self.steps[self.steps.length] = currentTime;
			var input = jQuery('input#' + self.steps.length);
			input.val(currentTime);
			input.on('click', function(){
				self.audio.currentTime = jQuery(this).val();
			})
		});
		jQuery('#steps-clear').on('click', function(){
			self.steps = [];
			jQuery('.steps input').val(null);
		})
		self.generateSteps();
	},
	generateSteps: function(){
		var self = this;
		jQuery('#generate').on('click', function(){
			self.start = self.steps[0];
			self.step = jQuery.map(jsapp.steps, function(o, i){
				if(i == 1 || i == 2 || i == 4 || i == 5){
					return (Big(o).minus(jsapp.steps[i - 1]).toFixed(2));
				}
			}).reduce(function(a, b){
				var sum = Big(a).plus(b)
				return  sum.div(2).toFixed(2);
			})
			console.log(self.stepMap());
			self.audio.currentTime = 0;
			self.printSteps();
			self.audio.play;
		});
	},
	printSteps: function(){
		var self = this;
		var stepMap = self.stepMap();
		var last = null;
		setInterval(function(){
			var currentTime = Big(self.audio.currentTime).toFixed(2);
			var step = stepMap[currentTime];
			if(step && step != 4 && step != 8 && step != last) {
				console.log(step);
			}
		}, 1)
	}
}


jQuery(document).ready(function(){
	jsapp.audio = jQuery('audio').get(0);
	jsapp.bindButtons();
	
})