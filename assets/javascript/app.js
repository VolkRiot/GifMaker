
var animals = ['Cat', 'Dog', 'Skunk', 'Possum', 'Sloth'];

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

$(document).ready(function () {

  for(var i = 0; i < animals.length; i++){
    buildButton(animals[i]);
  }

  $('#submit-input').on('click', function () {

    if($('#input-bar').val()){
      buildButton();
    }

  })



});