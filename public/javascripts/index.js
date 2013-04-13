if(!window.jsapp){
  var jsapp = {"version": "1.0"};
}

jsapp.index = {
  load: function(){
    var self = this;
    jQuery('tbody tr').hide();
    self.addbtn = jQuery('#addsong');
    self.newrow = jQuery('tr#addnew');
    self.loadSongs();
    self.newrow.hide();
    self.bindButtons();
  },
  loadSongs: function(){
    jQuery.ajax({
      'url': 'getsongs',
      'success': function(data){
        jQuery.each(data, function(i, o){
          var last = jQuery('tbody tr[id!="addnew"]:last');
          var newlast = last.clone(true);
          last.after(newlast);
          var songid = o.split(':')[1];
          jQuery('.songid', newlast).text(songid);
          jQuery.ajax({
            'url': 'getsong/' + songid,
            'success': function(data){
              jQuery('.songname', newlast).text(data);
              newlast.show();
            }
          });
        });
      }
    });
  },
  addSong: function(value){
    var last = jQuery('tbody tr[id!="addnew"]:last');
    var newlast = last.clone(true);
    jQuery.ajax({
      'url': 'addsong',
      'data': {
        'songname': value
      },
      'success': function(data){
        last.after(newlast);
        jQuery('.songid', newlast).text(data.id);
        jQuery('.songname', newlast).text(data.name);
      }
    });
  },
  bindButtons: function(){
    var self = this;
    self.addbtn.on('click', function(){
      self.addbtn.hide();
      self.newrow.show();
    });
    self.addbtn.parent().height(self.addbtn.height());
    jQuery('#save').on('click', function(){
      self.addSong(jQuery('#newsongname').val());
      self.addbtn.toggle();
      self.newrow.toggle();
      jQuery('#newsongname').val('');
    });
    jQuery('#cancel').on('click', function(){
      self.addbtn.toggle();
      self.newrow.toggle();
      jQuery('#newsongname').val('');
    });
    jQuery('button.view').on('click', function(){
      var tr = jQuery(this).parent().parent();
      var songid = jQuery('.songid', tr).text();
      var newhref = '/view/' + songid;
      document.location.href = newhref;
    });
    jQuery('button.edit').on('click', function(){
      var tr = jQuery(this).parent().parent();
      var songid = jQuery('.songid', tr).text();
      var newhref = '/edit/' + songid;
      document.location.href = newhref;
    });
    jQuery('button.delete').on('click', function(){
      var tr = jQuery(this).parent().parent();
      var songid = jQuery('.songid', tr).text();
      jQuery.ajax({
        'url': 'delsong',
        'data': {
          'id': songid
        },
        'success': function(data){
          tr.fadeOut(1000);
        }
      });
    });
  }
};


jQuery(document).ready(function(){
  jsapp.index.load();
});
