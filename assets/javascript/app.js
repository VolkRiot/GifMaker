
var animals = ['Cat', 'Dog', 'Skunk', 'Possum', 'Sloth'];

// TODO: Remove Debugger
var globalObj = {};
///////////////////////////////////////////////

function buildButton(value) {
  var $newButton = $('<button>');

  if(value){
    $newButton.addClass('btn btn-success api-query');
    $newButton.attr('data-query', value);
    $newButton.text(value);
  }else{
    var $inputVal = $('#input-bar').val();
    $newButton.addClass('btn btn-success api-query');
    $newButton.attr('data-query', $inputVal);
    $newButton.text($inputVal);
  }
  $('#buttons-container').append($newButton);
}

function createImg(imgObj) {
  var $newImg = $('<img>',{
    data: {
      'stopped': imgObj.fixed_width_still.url,
      'animated': imgObj.fixed_width.url,
      'state': 'stopped'
    },
    class: "img-responsive",
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
    // TODO: Perhaps clear the img container here because of async overlap

    for(var i = 0; i < numItems; i++){
      if(this.custom()){
        doThis(data[i][this.parameter]);
      }else{
        doThis(data[i]);
      }
    }
  })
}

$(document).ready(function () {

  for(var i = 0; i < animals.length; i++){
    buildButton(animals[i]);
  }

  $('#submit-input').on('click', function () {

    if($('#input-bar').val()){
      buildButton();
    }

  });

  $('#buttons-container').on('click', '.api-query', function () {
    $('#gif-container').empty();
    postAjaxObject(createImg, $(this).attr('data-query'), 'images', 5);
  })


});