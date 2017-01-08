
var $overlay = $('<div id="overlay"></div>');
var $lightbox = $('<div id="lightbox"></div>');
var $content = $('<img id="selectedImg"><iframe id="selectedVid"></iframe>');
var $caption = $('<p></p>');
var $next = $('<button id="next"><img src="img/next.png"></button>');
var $prev = $('<button id="prev"><img src="img/prev.png"></button>');

//add img or vid to lightbox div + add caption to overlay
$lightbox.append($prev).append($content).append($next).append($caption);;
//add lightbox div to overlay
$overlay.append($lightbox);
//add overlay
$("body").append($overlay);

//array of image objects for imgs and vids inside .gallery
var $contentGallery = [];

//array of href attributes of the links inside .gallery (note to me: .map = Pass each element in the current matched set through a function, producing a new jQuery object containing the return values.)
var $contentSrcArray = $(".content").map(function(){
  return $(this).attr("href");
});

//array of title attributes of images
var $contentCaptionArray = $(".content img").map(function(){
  return $(this).attr("alt");
});

var $type = $(".content").map(function(){
  return $(this).attr("class");
});

//populate $contentGallery
for (var i = 0; i < $contentSrcArray.length; i++) {
  $contentGallery.push({
    src: $contentSrcArray[i],
    title: $contentCaptionArray[i],
    location: i,
    type: $type[i],
  });
}

// function that returns the current image Object based on the src we're looking
function findCurrentContent(arrayOfObjects, src) {
  for (var i = 0; i < arrayOfObjects.length; i++) {
    var result = arrayOfObjects[i].src.indexOf(src);
    if (result > -1) {
      return arrayOfObjects[i];
    }
  }
}


// function that animates the image on the transition
function animateImage() {
  $content.hide();
  $content.fadeIn("fast");
}

//Capture click event on link to the image
$(".content").click(function(event){
  event.preventDefault();
  var contentLocation = $(this).attr("href");
  //add img to overlay
  $("#selectedImg").attr("src", contentLocation);
  //get child's alt attr and add caption 600px wide in desktop
  var captionText = $(this).children("img").attr("alt");
  $caption.text(captionText);
  if ($(this).hasClass("vid")) {
    //add video to overlay
    $("#selectedVid").attr("src", contentLocation);
    $("#selectedImg").hide();
  } else {
    $("#selectedVid").hide();
  }
  //show overlay to main site - medium opacity
  $overlay.show();
});

function next() {
  //get current src attr from img
  var contentCurrentSrc = $prev.next().attr("src");
  //get all attrs for current img
  var currentContent = findCurrentContent($contentGallery, contentCurrentSrc);
  //to cycle from last img to 1st
  if (currentContent.location === $contentGallery.length - 1) {
    $prev.next().attr("src", $contentGallery[0].src);
    $caption.text($contentGallery[0].title);
    //access the type of the 1st in the array
    var firstContent = $contentGallery[0].type;
    if (firstContent === "content img") {
      $("#selectedVid").hide();
      $("#selectedImg").show();
    } else {
      $prev.siblings("iframe").attr("src", $contentGallery[0].src);
      $("#selectedVid").show();
      $("#selectedImg").hide();
    }
  } else {
    //to cycle to next img
    $prev.next().attr("src", $contentGallery[currentContent.location + 1].src);
    $caption.text($contentGallery[currentContent.location + 1].title);
    //access the next type in the array
    var nextContent = $contentGallery[currentContent.location + 1].type;
    //check the type of the next img/vid and show/hide iframe/img as necessary
    if (nextContent === "content vid") {
      $("#selectedImg").hide();
      $("#selectedVid").show();
      //if not moving from end to 1st
      $prev.siblings("iframe").attr("src", $contentGallery[currentContent.location + 1].src);
    } else {
      $("#selectedImg").show();
      $("#selectedVid").hide();
    }
  }
}

function prev() {
  //get current src attr from img
  var contentCurrentSrc = $prev.next().attr("src");
  //get all attrs for current img
  var currentContent = findCurrentContent($contentGallery, contentCurrentSrc);

  //to cycle from 1st img to last
  if (currentContent.location === 0) {
    $prev.next().attr("src", $contentGallery[$contentGallery.length - 1].src);
    $caption.text($contentGallery[$contentGallery.length - 1].title);
    //access the type of the last in the array
    var lastContent = $contentGallery[$contentGallery.length - 1].type;
    if (lastContent === "content img") {
      $("#selectedVid").hide();
      $("#selectedImg").show();
    } else {
      $prev.siblings("iframe").attr("src", $contentGallery[$contentGallery.length - 1].src);
      $("#selectedVid").show();
      $("#selectedImg").hide();
    }
  } else {
    //to cycle to prev img
    $prev.next().attr("src", $contentGallery[currentContent.location - 1].src);
    $caption.text($contentGallery[currentContent.location - 1].title);
    var prevContent = $contentGallery[currentContent.location - 1].type;
    //check the type of the prev img/vid and show/hide iframe/img as necessary
    if (prevContent === "content vid") {
      $("#selectedImg").hide();
      $("#selectedVid").show();
      //if not moving from 1st to end
      $prev.siblings("iframe").attr("src", $contentGallery[currentContent.location - 1].src);
    } else {
      $("#selectedImg").show();
      $("#selectedVid").hide();
    }
  }
}

//when next button clicked
//capture click event
$next.click(function() {
  next();
  // transition to new image
  animateImage();
});

//when prev button clicked
//capture click event
$prev.click(function(){
  prev();
  //transition to new image
  animateImage();
});

//when right arrow keyed
$(document).ready().keydown(function( event ) {
  if ( event.which == 39 ) {
   next();
  }
});
//when left arrow keyed
$(document).ready().keydown(function( event ) {
  if ( event.which == 37 ) {
   prev();
  }
});

//hide overlay when:
//lightbox clicked
$lightbox.click(function(e){
   if(e.target != this) return; // only continue if the target itself has been clicked
   $overlay.hide();
   location.reload();
});
//lightbox clicked
$overlay.click(function(e){
   if(e.target != this) return; // only continue if the target itself has been clicked
   $overlay.hide();
   location.reload();
});

//esc button pressed
$(document).ready().keydown(function( event ) {
  if ( event.which == 27 ) {
    $overlay.hide();
    location.reload();
  }
});


//Problem: filter the images based on search as you type
//Solution:
//capture key presses
$("#search").keyup(function(){
  var currentQuery = $("#search").val().toLowerCase();

  //if search term is entered
  if (currentQuery != "") {
    //hide all images
    $(".content").hide();

    //match search term to alt attr
    $(".content img").each(function(){
      var currentKeyword = $(this).attr("alt").toLowerCase();
      if (currentKeyword.indexOf(currentQuery) >= 0) {
        //show images that do match
        $(this).parent().show();
      }
    });
  } else {
    //when search term is deleted show all images again
    $(".content").show();
  }

});

//get width of iframe
var bodyWidthPx = $("body").width();
var iframeWidth = bodyWidthPx * 0.8;

//set height to 56.25% of height
$("#selectedVid").height(iframeWidth * 0.5625);
