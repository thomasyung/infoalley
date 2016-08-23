/* This file is to initialize all event handlers and the starting state for the /calendar page
 * 
 * Dependencies: 
 * - jquery    : Cross-browser JavaScript support
 */
var events = [];

$(function(){
  
  var i = 0;
  
  // Get the event ids before grabbing the event details
  $.getJSON('/events').then(function(res){
    [].forEach.call(res, function(item){
      // Keep just the first 20 events
      if (i < 20){
        events.push({evid:item.evid,date:item.displaydate,time:"",startdate:item.startdate,label:item.label,venue:item.pointlabel});
        i++;
      }
    });
  }).then(function(res){ // Wait till the events[] array is filled up with data
    if (events.length > 0) {
      // Ansynchronously get all the event details (faster), and lookup the start times
      $(events).each(function(){
        var eventRef = this; // Keep a pointer to the event, so we can update it inside the getJSON callback
        $.get('/evid' + eventRef.evid, function(data){
          if (data){
            if (data.eventdates.date[0]){
              for(var n=0; n<data.eventdates.date.length; n++){
                if (eventRef.startdate === data.eventdates.date[n].startdate){
                  eventRef.time = (typeof(data.eventdates.date[n].displaytime) === "string") ? data.eventdates.date[n].displaytime : "";
                }
              }
            } else {
              eventRef.time = data.eventdates.date.displaytime;
            }
          }
        });
      });
    }
  });
  
  // rotate display of events every 10 seconds
  var counter = 0;
  var eventsinterval = 10000;
  var eventsrotation = setInterval ( function() {
    if (events.length > 0){
      $('#events-wrapper').empty();
      for(var i=(0+(counter*4)); i<(4+(counter*4)); i++){
        $('#events-wrapper').append(EVENT_ITEM_TEMPLATE(events[i]));
      }
      if(counter === 4){
        counter = 0;
      } else {
        counter++;
      }
    }
  }, eventsinterval);
  
});

// Template for displaying each event in a row, with CSS animations from http://daneden.github.io/animate.css/
var EVENT_ITEM_TEMPLATE = function(item){
  return  '<div class="event-item fadeIn animated">' + 
            '<div class="event-atom">' + item.date + ' ' + item.time + '</div>' + 
            '<div class="event-atom">' + item.label + '</div>' +
            '<div class="event-atom">' + item.venue + '</div>' + 
          '</div>';
};
