if(!window.jsapp){
  var jsapp = {"version": "1.0"};
}

jsapp.edit = {
  bindButtons: function(){
    var self = this;
    jQuery('#steps').on('click', function(){
      var currentTime = jsapp.getCurrentTime();
      if(currentTime){
        jsapp.steps[jsapp.steps.length] = currentTime;
        var span = jQuery('<span>');
        span.addClass('stepmapitem');
        span.text(currentTime);
        jQuery('#stepmapview').append(span);
        //console.log(currentTime);
      }else{
        console.log("Can't get song position!");
      }
    });
    jQuery('#steps-clear').on('click', function(){
      jsapp.steps = [];
      jQuery('.stepmapitem').remove();
    });
    jQuery('#generate').on('click', function(){
      jsapp.start = jsapp.steps[0];
      console.log(jsapp.stepMap());
      jsapp.restartPlay();
    });
    jQuery('#play').on('click', function(){
      jsapp.startPlay(function(){});
    });
    jQuery('#pause').on('click', function(){
      jsapp.sound.pause();
    });
    jQuery('#restart').on('click', function(){
      jsapp.restartPlay();
    });
    jQuery('#save').on('click', function(evt){
      evt.preventDefault();
      var songid = jQuery('#songid').val();
      var title = jQuery('#title').val();
      var filename = jQuery('#filename').val();
      jQuery.ajax({
        'url': '/editsong',
        'data': {
          'id': songid,
          'filename': filename,
          'title': title
        },
        'success': function(data){
          document.location.reload();
        }
      });
      return false;
    });
  }
};


jQuery(document).ready(function(){
  var filepath = jQuery('#filepath').val();
  jsapp.smDeploy(filepath, function(){
    jsapp.edit.bindButtons();
  });
});
