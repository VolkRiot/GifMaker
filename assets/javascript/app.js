
var topics = ['Dachshund', 'Akita Inu', 'Boston Terrier', 'French Bulldog', 'Basset Hound', 'Corgi'];

// TODO: Remove Debugger and REFACTOR REFACTOR REFACTOR!!
var globalObj = {};
///////////////////////////////////////////////

function buildButton(value) {
  var $newButton = $('<button>');

  if(value){
    $newButton.attr('data-query', value);
    $newButton.text(value);
  }else{
    var $inputVal = $('#input-bar').val();
    $newButton.attr('data-query', $inputVal);
    $newButton.text($inputVal);
  }
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
    + Math.floor(Math.random() * 3) * 25,
    method: "GET"
  }).done(function (response) {
    var data = response.data;
    var dataSize = data.length;
    var randIndex;
    var prevRandIndexes = [];

    // TODO: Perhaps clear the img container here because of async overlap
    globalObj = response;

    for(var i = 0; i < numItems; i++){
      randIndex = Math.floor(Math.random() * dataSize);
      while(prevRandIndexes.indexOf(randIndex) !== -1){
        randIndex = Math.floor(Math.random() * dataSize);
      }
      prevRandIndexes.push(randIndex);
      doThis(data[randIndex]);
    }
    prevRandIndexes = [];
  }).fail(function(err) {
    throw err;
  })
}

$(document).ready(function () {

  for(var i = 0; i < topics.length; i++){
    buildButton(topics[i]);
  }

  $('#submit-input').on('click', function (event) {

    event.preventDefault();

    if($('#input-bar').val()){
      buildButton();
      $('#input-bar').val('');
    }

  });

  $('#buttons-container').on('click', '.api-query', function () {

    $('#gif-container').empty();

    postAjaxObject(createImg, $(this).attr('data-query'), 10);

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

  })

});