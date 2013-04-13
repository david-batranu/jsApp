if(!window.jsapp){
  var jsapp = {"version": "1.0"};
}

jsapp = {
  sc: null,
  steps: [],
  audio: null,
  start: null,
  step: null,
  sound: null,
  elems: {},
  stepMap: function(){
    var self = this;
    var map = {};
    var s = 1;
    var duration = self.getDuration();
    var steps = self.steps.slice();
    var offset = self.getOffset(steps);
    var last_steps = steps.slice(6, steps.length);
    function getFloatList(list){
      return jQuery.map(last_steps, function(o, i){
        return self.getFloat(Big(o).plus(offset));
      });
    }
    while(parseInt(steps.slice(-1), 10) < duration){
      var new_steps = getFloatList(last_steps);
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
  buildStepList: function(steptimes){
    var self = this;
    var array;
    if(self.sound) {
      array = jQuery.map(steptimes, function(i, o) {
        return parseInt(i, 10);
      });
      return array;
    }
    if(self.audio) {
      array = jQuery.map(steptimes, function(i, o) {
        return self.getFloat(i);
      });
      return array;
    }
  },
  startPlay: function(callback){
    var self = this;
    if(self.sound) {
      soundManager.play('aSound', {
        onplay: function(){
          callback();
        }
      });
    }
    if(self.audio) {
      self.audio.play();
      callback();
    }
  },
  stepDifference: function(currentTime, nextTime){
    var self = this;
    var difference = self.getFloat(Big(nextTime).minus(currentTime));
    return difference;
  },
  maxDifference: function(){
    if(navigator.userAgent.indexOf('Chrome') != -1 ) return 100;
    if(navigator.userAgent.indexOf('Firefox') != -1 ) return 300;
    return 200;
  },
  handlePlayback: function(stepMap, callback){
    var self = this;
    var duration = self.getDuration();
    var steptimes = Object.keys(stepMap);
    var steplist = null;
    var nextTime = null;
    var lastTime = 0;
    var lastStep = 0;
    var maxDifference = self.maxDifference();
    var queryTime = function(){
      if (steplist === null && nextTime === null){
        steplist = self.buildStepList(steptimes);
        nextTime = steplist[0];
      }
      var currentTime = self.getCurrentTime();
      if(self.stepDifference(currentTime, nextTime) <= maxDifference) {
        var step = stepMap[nextTime];
        if(step && step != lastStep) {
          self.showStep(step);
          callback(step);
          lastStep = step;
        }
        lastTime = currentTime;
        steplist = steplist.slice(1);
        nextTime = steplist[0];
      }
      if(duration > currentTime && currentTime != duration){
        //pass
      }
    };
    self.startPlay(function(){
      setInterval(queryTime, 10);
    });
  },
  showStep: function(step){
    var self = this;
    if(!self.elems.span){
      self.elems.span = jQuery('<span class="badge">10</span>');
    }
    if(step != self.elems.span.text()){
      //self.elems.span.fadeIn(100);
      self.chooseClassForCounter(step);
      jQuery('#counter').append(self.elems.span);
      self.elems.span.text(step);
      //self.elems.span.fadeOut('100');
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
  smDeploy: function(callback){
    var self = this;
    soundManager.setup({
      url: '/swf/',
      debugMode: false,
      onready: function() {
        self.sound = soundManager.createSound({
          id: 'aSound',
        url: '/files/salsalesson.mp3'
        });
        soundManager.load('aSound', {
          onload: function(){
            callback();
          }
        });

      },
      ontimeout: function() {
        // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
      }
    });
  }
};


jQuery(document).ready(function(){
  //jsapp.audio = jQuery('audio').get(0);
  //jsapp.smDeploy();
});


//working steps
//[9.11, 9.47, 9.86, 10.56, 10.92, 11.32, 12.11, 12.48, 12.87, 13.62, 13.98, 14.36, 15.11, 15.47, 15.86, 16.55, 16.94, 17.34]
//[9.1, 9.45, 9.87, 10.6, 10.95, 11.33, 12.08, 12.47, 12.88, 13.58, 13.97, 14.34, 15.08, 15.48, 15.87, 16.57, 16.96, 17.32, 18.09, 18.47, 18.85, 19.57, 19.95, 20.34, 21.08, 21.46, 21.88, 22.57, 22.96, 23.34]
