if(!window.jsapp){
  var jsapp = {"version": "1.0"};
}

jsapp = {
    steps: [],
    audio: null,
    start: null,
    step: null,
    sound: null,
    elems: {},
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
    handleAudio: function(stepMap, callback){
        var self = this;
        var duration = self.getDuration();
        var queryTime = function(){
            var currentTime = self.getCurrentTime();
            var step = stepMap[currentTime];
            if(step) {
                self.showStep(step);
                callback(step);
            }
            if(duration > currentTime){
                setZeroTimeout(queryTime);
            }
        }
        setZeroTimeout(queryTime);
    },
    showStep: function(step){
        var self = this;
        if(!self.elems.span){
            self.elems.span = jQuery('<span class="badge">10</span>');  
        }
        if(step != self.elems.span.text()){
            self.elems.span.fadeIn(0);
            self.chooseClassForCounter(step);
            jQuery('#counter').append(self.elems.span);
            self.elems.span.text(step);
            self.elems.span.fadeOut('1');
        }
    },
    chooseClassForCounter: function(step){
        var self = this;
        var toRemove = 'badge-important badge-warning badge-info';
        var toAdd = '';
        if(step == 1 || step == 5) toAdd = 'badge-important';
        if(step == 2 || step == 6) toAdd = 'badge-warning';
        if(step == 3 || step == 7) toAdd = 'badge-info';
        self.elems.span.removeClass(toRemove);
        self.elems.span.addClass(toAdd);
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
    //jsapp.smDeploy();
})


//working steps
//[9.11, 9.47, 9.86, 10.56, 10.92, 11.32, 12.11, 12.48, 12.87, 13.62, 13.98, 14.36, 15.11, 15.47, 15.86, 16.55, 16.94, 17.34]
//[9.1, 9.45, 9.87, 10.6, 10.95, 11.33, 12.08, 12.47, 12.88, 13.58, 13.97, 14.34, 15.08, 15.48, 15.87, 16.57, 16.96, 17.32, 18.09, 18.47, 18.85, 19.57, 19.95, 20.34, 21.08, 21.46, 21.88, 22.57, 22.96, 23.34]