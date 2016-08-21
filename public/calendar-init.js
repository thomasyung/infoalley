$(function(){
  
  var events = [];
  
  
  $.get('/events', function(res) {
      // events = data;
      console.log('In Client, here is res: ', res);
  });
  
  
  
  
});