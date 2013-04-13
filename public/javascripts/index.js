if(!window.jsapp){
  var jsapp = {"version": "1.0"};
}

jsapp.index = {
  load: function(){
    console.log('Loaded!');
  }
};


jQuery(document).ready(function(){
  jsapp.index.load();
});
