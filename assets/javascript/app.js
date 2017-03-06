
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

function createImg(src) {
  var $newImg = $('<img>');
  $newImg.attr('src', src);
  $('#gif-container').append($newImg);
}

function postAjaxObject(doThis, search, parameter) {
  $.ajax({
    url: 'http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=dc6zaTOxFJmzC',
    method: "GET",
    custom: parameter
  }).done(function (response) {
    //globalObj = response;
    doThis(response.data[0].images.fixed_width[this.custom]);
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
    //console.log("Value is: " + $(this).attr('data-query'));
    postAjaxObject(createImg, $(this).attr('data-query'), 'url');
  })

  
});