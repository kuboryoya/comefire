
$(function () {

  var milkcocoa = new MilkCocoa('guitarj1qgeomw.mlkcca.com');
  var datastore = milkcocoa.dataStore('sample000data');

  var lastTouchEnd = 0;
  document.documentElement.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // (4) 加速度センサの値をPCサイト側に送信
  $('#Abtn').on('click', function(e) {
    datastore.send({
      a: 'on',
      b: 'off'
    });
  });

  $('#Bbtn').on('click', function(e) {
    datastore.send({
      a: 'off',
      b: 'on'
    });
  });

});