
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
      "stop": imgObj.fixed_width_still.url,
      "animate": imgObj.fixed_width.url,
      "state": "stop"
    },
    class: "img-responsive image-gifs",
    src: imgObj.fixed_width_still.url
  });

  $('#gif-container').append($('<li>', {
    class: 'img-container'
  }).append($newImg));
}

function postAjaxObject(doThis, search, parameter, numItems) {
  $.ajax({
    url: 'http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=dc6zaTOxFJmzC',
    method: "GET",
    custom: function () {
      if(parameter){
        this.parameter = parameter;
        return true;
      }else{
        return false;
      }
    }
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

      if(this.custom()){
        doThis(data[randIndex][this.parameter]);
      }else{
        doThis(data[randIndex]);
      }
    }
    prevRandIndexes = [];
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
    postAjaxObject(createImg, $(this).attr('data-query'), 'images', 10);

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