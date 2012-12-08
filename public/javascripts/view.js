if(!window.jsapp){
  var jsapp = {"version": "1.0"};
}

jsapp.view = {
    stepmatrix: function(dance){
        var guapea = {
            1: {'bottom': 'lfoot rfoot'},
            2: {'bottom': 'lfoot', 'right': 'rfoot'},
            3: {'right': 'lfoot rfoot'},
            5: {'right': 'lfoot', 'top': 'rfoot'},
            6: {'top': 'rfoot', 'left': 'lfoot'},
            7: {'left': 'lfoot', 'bottom': 'rfoot'}
        }
        var leftright = {
            1: {'left': 'lfoot', 'center': 'rfoot fade'},
            2: {'left': 'lfoot', 'center': 'rfoot'},
            3: {'center': 'lfoot rfoot'},
            5: {'right': 'rfoot', 'center': 'lfoot fade'},
            6: {'right': 'rfoot', 'center': 'lfoot'},
            7: {'center': 'lfoot rfoot'}
        }
        var frontback = {
            1: {'top': 'lfoot', 'center': 'rfoot fade'},
            2: {'top': 'lfoot', 'center': 'rfoot'},
            3: {'center': 'lfoot rfoot'},
            5: {'bottom': 'rfoot', 'center': 'lfoot fade'},
            6: {'bottom': 'rfoot', 'center': 'lfoot'},
            7: {'center': 'lfoot rfoot'}
        }
        var known = {
            'guapea': guapea,
            'leftright': leftright,
            'frontback': frontback
        }
        return known[dance]
    },
    startPlay: function(){
        var self = this;
        jsapp.steps = [
            9.1, 9.45, 9.87, 10.6, 10.95, 11.33,
            12.08, 12.47, 12.88, 13.58, 13.97, 14.34,
            15.08, 15.48, 15.87, 16.57, 16.96, 17.32,
            18.09, 18.47, 18.85, 19.57, 19.95, 20.34,
            21.08, 21.46, 21.88, 22.57, 22.96, 23.34
        ]
        jQuery(jsapp.audio).on('play', function(){
            jsapp.handleAudio(jsapp.stepMap(), function(step) {
                jQuery('#stepdisplay .step').removeClass('lfoot rfoot fade');
                self.showDance(step, 'guapea');
                self.showDance(step, 'leftright');
                self.showDance(step, 'frontback');
            });
        })
    },
    showDance: function(step, dance){
        var stepmatrix = jsapp.view.stepmatrix(dance);
        for(var pos in stepmatrix[step]){
            var feet = stepmatrix[step][pos];
            var square = jQuery('.' + pos, '#stepdisplay ' + '.' + dance);
            square.addClass(feet);
        }
    }
}


jQuery(document).ready(function(){
    jsapp.view.startPlay();
})
