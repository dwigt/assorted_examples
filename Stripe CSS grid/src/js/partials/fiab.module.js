fiab.module = (function($){
  "use strict";

  function init(){
    buildTimeline();
    animate();
  }

var container = $("#container");
  
function getAnimation() {
  var element = $('<div class="creature"/>');
  container.append(element);
  TweenLite.set(element, {x:-30, y:300})
  //bezier magic provided by GSAP BezierPlugin (included with TweenMax)
  //https://api.greensock.com/js/com/greensock/plugins/BezierPlugin.html
  
 //create a semi-random tween 
  var bezTween = new TweenMax(element, 6, {
    bezier:{
      type:"soft", 
      values:[{x:60, y:600}, {x:150, y:30}, {x:400 + Math.random() *100, y:320*Math.random() + 50}, {x:500, y:320*Math.random() + 50}, {x:700, y:100}, {x:850, y:500}],
      autoRotate:true
    },
    ease:Linear.easeNone});
  return bezTween;
}

  function buildTimeline() {
  var scene1 = new TimelineMax({repeat:300, delay:1});
  for (var i = 0 ; i < 20; i++){
    //start creature animation every 0.17 seconds
    scene1.add(getAnimation(), i * 0.17);
  }
}

  function animate() {
    var box = $('.animate');
  var scene1 = new TimelineMax({repeat:300, delay:1});

      scene1
      .to(box, 1, {x:500,y:0}, "scene1+=1");
  }

  return {
    init:init
  }

})(jQuery);
