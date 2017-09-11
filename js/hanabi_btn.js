$(function () {

  var milkcocoa = new MilkCocoa('icej4kgsqax.mlkcca.com');
  var datastore = milkcocoa.dataStore('sample000data');

  var lastTouchEnd = 0;
  document.documentElement.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // (4) ボタンをPCサイト側に送信
  $('#Abtn').on('click', function(e) {
    var form = document.forms.mainForm;  
    console.log(form._text.value);
    datastore.send({
      a: 'on',
      b: 'off',
      kotoba: form._text.value,
    });
  });

});