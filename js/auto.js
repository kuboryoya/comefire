
//背景ブラー
var auto = function auto(){

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

}