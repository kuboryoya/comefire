$(function () {
  // milkcocoa設定
  var milkcocoa = new MilkCocoa('icej4kgsqax.mlkcca.com');
  var datastore = milkcocoa.dataStore('sample000data');

  /* canvas要素のノードオブジェクト */
  var canvas = document.getElementById('canvas');

  /* canvas要素の存在チェックとCanvas未対応ブラウザの対処 */
  if (!canvas || !canvas.getContext) {
    return false;
  }
  /* 2Dコンテキスト */
  var ctx = canvas.getContext('2d');

  /*  アニメーション設定  */
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  var cancelAnimationFrame = window.cancelAnimationFrame ||
    window.mozcancelAnimationFrame ||
    window.webkitcancelAnimationFrame ||
    window.mscancelAnimationFrame;
  window.cancelAnimationFrame = cancelAnimationFrame;

  var w = $('#canvas-wrapper').width();
  var h = $('#canvas-wrapper').height();
  $(window).on('load resize', function () {
    responsive();
  });

  function responsive() {
    w = $('#canvas-wrapper').width();
    h = $('#canvas-wrapper').height();
    $('#canvas').attr('width', w);
    $('#canvas').attr('height', h);
  }


//花火の粒の大きさ
    var auto_size = 1;
    var utiage_size = 3;

//使う色
    var hanabi_colors = [
      [50, 200, 255],
      [255, 50, 50],
      [100, 255, 100],
      [255, 200, 255],
      [100, 200, 155],
      [20, 200, 255],
      [255, 30, 255],
      [255, 200, 255],
      [255, 255, 255],
      [255, 255, 10]
    ];
  
  
//背景ブラー & オート花火
loop();
var auto = 0;
function loop() {
  requestId = window.requestAnimationFrame(loop); //戻り値を取得
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0,0,w,h);  
  
  auto ++;
  if(auto == 5){
    auto = 0;
    //オート花火
    autohanabi();
    function autohanabi(){
    //オート花火用変数
    var auto_t = 0;
    var grav = 0.1; //重力
    var auto_x = Math.random() * w;
    var auto_y = Math.random() * h;
    var auto_c = Math.floor(Math.random() * 10);
    var auto_m = 10; //粒の数
    var auto_p = 0; //中心からの位置
    var auto_v = 2; //飛ぶ速度
    var auto_o = 1
      loop();
      function loop() {
        auto_t++;
        if(auto_t == 200){
          return;   
        }
        requestId = window.requestAnimationFrame(loop); //戻り値を取得
        //オート花火
        auto_v -= 0.05;
        if(auto_v < 0){
           auto_v = 0;
         }
        grav += 0.4;
        auto_p += auto_v;
        auto_o -= 0.02;
        ctx.fillStyle = 'rgba('
          + hanabi_colors[auto_c][0] + ','
          + hanabi_colors[auto_c][1] + ','
          + hanabi_colors[auto_c][2] + ','
          + auto_o + ')';        
        for(var i=0; i<auto_m; i++){
          ctx.beginPath();
          ctx.arc(
            auto_p * Math.cos( Math.PI / 180 * i * 360 / auto_m) + auto_x,
            auto_p * Math.sin( Math.PI / 180 * i * 360 / auto_m) + auto_y + grav,
            auto_size, 0, Math.PI *2);
          ctx.fill();
          ctx.closePath();
        }
      }
    } //end autohanabi()
  }
}

//スマートフォンから送信された値を受け取る
datastore.on('send', function(sent){
  hanabi_done(
    Math.floor( Math.random() * (w-100 + 1 - 100) ) + 100,
    Math.floor( Math.random() * (h-300 + 1 - 200) ) + 200,
    Math.floor( Math.random() * 10),
    Math.floor( Math.random() * 10),
    Math.floor( Math.random() * 10),
    Math.floor( Math.random() * 10)
  );
  function hanabi_done(x,y,c1,c2,c3,c4){
    var hanabi_time = 0;
    var hanabi_opacty_after = 1;
    var hanabi_opacty = 1;
    var hanabi_grav = 0;

    //大円の拡散
    var hanabi_math = 200;
    var hanabi_p_w = []; //位置
    var hanabi_v_w = []; //目標
    var hanabi_vs_w = []; //速度
    var hanabi_r = []; //発角度

    var hanabi_place02 = 0;
    var hanabi_place02_v = 10;

    for( var i = 0; i < hanabi_math; i++){
      hanabi_p_w.push(0);
      hanabi_v_w.push(Math.random() * 150);
      hanabi_vs_w.push(hanabi_v_w[i]* 0.1);
      hanabi_r.push(Math.random() * 360);
    }

    //爆発パラメータ
    var expr_math = 60;
    var expr_time = [];
    var expr_p = [];
    var expr_rad = [];
    var expr_opacty = [];
    var expr_opacty_time = 0;
    for( var i = 0; i < hanabi_math; i++){
      expr_p.push(Math.random() * (150));
      expr_rad.push(Math.random() * (360));
      expr_time.push(Math.random() * 360);
    }

    var soundcount = 0;
    var kotoba_opacity = 20;

    loop();

    function loop() {
      requestId = window.requestAnimationFrame(loop); //戻り値を取得
      hanabi_time += 2.5;
      if( hanabi_time > 1000 ){
        return;
      }
      //描画処理
      hanabi_brew();
      function hanabi_brew(){

        //最初に打ち上がるやつ
        hanabi_opacty_after -= 1/150;
        ctx.fillStyle = 'rgba('
          + hanabi_colors[c1][0] + ','
          + hanabi_colors[c1][1] + ','
          + hanabi_colors[c1][2] + ','
          + hanabi_opacty_after + ')';

        ctx.beginPath();
        ctx.arc( x, y+400 - hanabi_time , 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();


        //一定秒数たったら爆発
        if(hanabi_time > 400){

          if(soundcount == 0){
            //音を出します
            soundcount ++;
            // 対象となるID名
            var id = 'sound-file' ;
            // 初回以外だったら音声ファイルを巻き戻す
            if( typeof( document.getElementById( id ).currentTime ) != 'undefined' )
            {
              document.getElementById( id ).currentTime = 0;
            }
            // [ID:sound-file]の音声ファイルを再生[play()]する
            document.getElementById( id ).play() ;
          }

          hanabi_opacty -= 1/100;
          ctx.fillStyle = 'rgba('
            + hanabi_colors[c2][0] + ','
            + hanabi_colors[c2][1] + ','
            + hanabi_colors[c2][2] + ','
            + hanabi_opacty + ')';
          //大円
          for(var i = 0; i < hanabi_math; i++){

            hanabi_p_w[i] += hanabi_vs_w[i]
            //拡散を止める
            if(hanabi_vs_w[i] >= 0){
              hanabi_vs_w[i] -= 0.35;
            }
            if(hanabi_vs_w[i] < 0){
              hanabi_vs_w[i] = 0;
            }
            ctx.beginPath();
            ctx.arc(
              hanabi_p_w[i] * Math.cos( Math.PI / 180 * hanabi_r[i]) + x,
              hanabi_p_w[i] * Math.sin( Math.PI / 180 * hanabi_r[i]) + y,
              utiage_size, 0, Math.PI *2);
            ctx.fill();
            ctx.closePath();
          }
        }
        ctx.fillStyle = 'rgba('
          + hanabi_colors[c3][0] + ','
          + hanabi_colors[c3][1] + ','
          + hanabi_colors[c3][2] + ','
          + hanabi_opacty + ')';
        if(hanabi_time > 410){
          //小円

          //拡散を止める
          hanabi_place02 += hanabi_place02_v;
          if(hanabi_place02_v >= 0){
            hanabi_place02_v -= 0.3;
          }
          if(hanabi_place02_v < 0){
            hanabi_place02_v = 0;
          }

          for(var i = 0; i < 50; i++){
            ctx.beginPath();
            ctx.arc(
              hanabi_place02 * Math.sin( Math.PI / 180 * i * 360 / 50) + x,
              hanabi_place02 * Math.cos( Math.PI / 180 * i * 360 / 50) + y + hanabi_grav,
              utiage_size, 0, Math.PI *2);
            ctx.fill();
            ctx.closePath();
          }
        }

        //爆発
        if(hanabi_time > 550){
          for(var i = 0; i < expr_math; i++){

            expr_opacty = Math.sin( Math.PI / 180 * (expr_opacty_time + expr_time[i]) ) + hanabi_opacty * 2;
            expr_opacty_time += 0.3;

            ctx.fillStyle = 'rgba('
              + hanabi_colors[c4][0] + ','
              + hanabi_colors[c4][1] + ','
              + hanabi_colors[c4][2] + ','
              + expr_opacty + ')';
            ctx.beginPath();
            ctx.arc(
              expr_p[i] * Math.sin( Math.PI / 180 * expr_rad[i] ) + x,
              expr_p[i] * Math.cos( Math.PI / 180 * expr_rad[i] ) + y,
              utiage_size, 0, Math.PI *2);
            ctx.fill();
            ctx.closePath();
          }
        }

        if(hanabi_time > 400){
          kotoba_opacity -= 0.1;
          /* フォントスタイルを定義 */
          ctx.font = "36px 'ＭＳ Ｐゴシック'";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = 'rgba(255,255,255,' + kotoba_opacity + ')';
          ctx.fillText(sent.value.kotoba,x,y)
        }
      }
    }
  } /* end loop */
});





});