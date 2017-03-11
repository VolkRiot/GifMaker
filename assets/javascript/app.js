
var topics = ['Dachshund', 'Akita Inu', 'Boston Terrier', 'French Bulldog', 'Basset Hound', 'Corgi'];

// TODO: Remove Debugger and REFACTOR REFACTOR REFACTOR!!
var globalObj = {};
///////////////////////////////////////////////
var YTplayer;
var myYTkey = config.YTkey;


// TODO: ADD processing to properly format words and to prevent duplicate buttons

function buildButton(value) {
  var $newButton = $('<button>');
  var inputValue = value;

  $newButton.attr('data-query', inputValue);
  $newButton.attr('data-delete', false);
  $newButton.text(inputValue);

  $newButton.addClass('btn btn-success api-query');
  $('#buttons-container').append($newButton);

}

function createImg(imgObj) {
  var $newImg = $('<img>',{
    data: {
      "stop": imgObj.images.fixed_width_still.url,
      "animate": imgObj.images.fixed_width.url,
      "rating": imgObj.rating,
      "state": "stop"
    },
    class: "img-responsive image-gifs",
    src: imgObj.images.fixed_width_still.url
  });

  var $rating = $('<p class="h4 text-center">').text("Rating: " + $newImg.data("rating"));

  $('#gif-container').append($('<li>', {
    class: 'img-container'
  }).append($newImg, $rating));
}

function postAjaxObject(doThis, search, numItems) {
  $.ajax({
    url: 'http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=dc6zaTOxFJmzC&offset='
    + Math.floor(Math.random() * 3) * 25 + '&rating=PG-13',
    method: "GET"
  }).done(function (response) {
    var data = response.data;
    var dataSize = data.length;
    var randIndex;
    var prevRandIndexes = [];

    // TODO: Debugging - Remove
    //globalObj = response;

    if (dataSize != 0) {

      for (var i = 0; i < numItems; i++) {
        randIndex = Math.floor(Math.random() * dataSize);

        while (prevRandIndexes.indexOf(randIndex) !== -1) {
          randIndex = Math.floor(Math.random() * dataSize);
        }

        prevRandIndexes.push(randIndex);
        doThis(data[randIndex]);
      }
      prevRandIndexes = [];
    } else {
      // TODO: Design an alert of some type here.
      console.log("No go");
    }
  });
}

$(document).ready(function () {

  // Async donwload and creation of the script for the youtube iFrame API
  var $youtube = $('<script>');
  $youtube.attr('src', "https://www.youtube.com/iframe_api");

  $('body').append($youtube);

  if(localStorage.getItem('topicsArray')){
    topics = localStorage.getItem('topicsArray').split(',');
  }

  for(var i = 0; i < topics.length; i++){
    buildButton(topics[i]);
  }

  $('#submit-input').on('click', function (event) {

    event.preventDefault();
    var searchTerm = $('#input-bar').val();

    if($('#input-bar').val()){
      buildButton(searchTerm);
      topics.push(searchTerm);
      $('#input-bar').val('');
    }

  });

  $('#buttons-container').on('click', '.api-query', function () {

    var searchString = $(this).attr('data-query');

    $('#gif-container').empty();

    searchAndPostYoutube(searchString);

    if($(this).attr('data-delete') !== 'true'){
      $('#gif-container').empty();
      postAjaxObject(createImg, searchString, 10);
    }

  });

  $('#gif-container').on('click', '.image-gifs', function () {

    var state = $(this).data("state");

    if(state == "stop"){
      $(this).attr('src', $(this).data("animate"));
      $(this).data("state", 'animate')
    }else{
      $(this).attr('src', $(this).data("stop"));
      $(this).data("state", 'stop')
    }

  });

  $('#save-button').on('click', function () {

    localStorage.setItem('topicsArray', topics);

  });

  $('#delete-button').on('click', function () {

    var buttonsList = $('#buttons-container').children('.api-query');

    if($('#delete-button').attr('data-active') == 'true'){

      $('#delete-button').attr('data-active', 'false');
      $(buttonsList).attr('data-delete', 'false');
      $('#delete-button').removeClass('btn-danger').addClass('btn-default');
      $(buttonsList).attr('class', 'btn btn-success api-query');

    }else if($('#delete-button').attr('data-active') == 'false'){

      $('#delete-button').attr('data-active', 'true');
      $(buttonsList).attr('data-delete', 'true');
      $('#delete-button').removeClass('btn-default').addClass('btn-danger');
      $(buttonsList).attr('class', 'btn btn-danger api-query');
    }

    $('#buttons-container').on('click', '.api-query', function () {

      if($('#delete-button').attr('data-active') == 'true'){
        var buttonData = $(this).attr('data-query');
        topics.splice(topics.indexOf(buttonData), 1);
        localStorage.setItem('topicsArray', topics);
        $(this).remove();
      }

    });

  });

});

function createYoutubeVideo(tag ,id) {

  function onYouTubeIframeAPIReady() {

    YTplayer = new YT.Player(tag, {
      height: '390',
      width: '640',
      videoId: id,
      events: {
        'onReady': function (event) {
          event.target.playVideo();
        }
      }
    });
  }
  if(!YTplayer){
    onYouTubeIframeAPIReady();
  }else{
    YTplayer.clearVideo();
    YTplayer.loadVideoById(id);
  }
}

function searchAndPostYoutube(searchTerm) {

  $.ajax({
    url: 'https://www.googleapis.com/youtube/v3/search?part=id%2C+snippet&maxResults=5&q='+ searchTerm +'&key=' + myYTkey,
    method: "GET"
  }).done(function (response) {

    globalObj = response;

    createYoutubeVideo('player', response.items[0].id.videoId)
  })
}