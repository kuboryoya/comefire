// forked from haii's "forked: fireworks" http://jsdo.it/haii/6DHz
// forked from kyo_ago's "fireworks" http://jsdo.it/kyo_ago/fireworks
// forked from zarkswerk's "fireworx" http://jsdo.it/zarkswerk/fireworx
// forked from zarkswerk's "fireworks" http://jsdo.it/zarkswerk/3598

;(function (window, undefined) {
'use strict';

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 800;
var PI2 = Math.PI * 2;

var quality = 0;
var ratios = [window.devicePixelRatio || 1, 1, 0.5, 0.25];

// 簡易的な乱数
var random = function (i) {
    i += 123456;
    return function () {
        i ^= i << 5 ^ i >> 3;
        i ^= i << 2 ^ i >> 1;
        return (i & 255) / 256;
    };
};

// 花火の粒子を描画する関数
var drawParticle = function (ctx, hue) {
    var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    grad.addColorStop(0, 'hsla(' + hue + ',60%,60%,1)');
    grad.addColorStop(0.1, 'hsla(' + hue + ',60%,60%,' + 0.02 + ')');
    grad.addColorStop(1, 'hsla(' + hue + ',60%,60%,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(-1, -1, 2, 2);
};

// 閃光を描画する関数
var drawSpark = function (ctx, hue) {
    var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    grad.addColorStop(0, 'hsla(' + hue + ',60%,80%,1)');
    grad.addColorStop(0.05, 'hsla(' + hue + ',60%,80%,' + 0.1 + ')');
    grad.addColorStop(1, 'hsla(' + hue + ',60%,80%,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(-1, -1, 2, 2);
};

// 打ち上げを描画する関数
var uchiage = function (ctx, t, x0, y0) {
    var x = x0;
    x += Math.sin(t * 50 % PI2) * 0.3; // ゆらぎ
    var y = y0 * (1 - t * 0.5);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(16, 16);
    drawParticle(ctx, 20);
    drawParticle(ctx, 20);
    ctx.restore();
};

// 花火を描画する関数
var hanabi = function (ctx, seed, t, x0, y0, color, vcolor, radius, spark) {
    var num = radius * 1; // パーティクル数
    var tail = radius - 100; // 燃え尽きるまでの時間
    var r = random(seed); // 乱数
    var t2 = 1 - Math.pow(1 - t, 8); // だんだんゆっくり
    var ay = 400; // 落下速度
    var atBegin = 0.85; // 色消失開始時間
    var atEnd = 0.95; // 色消失終了時間
    var atColor = 20; // 色消失後は橙色にする

    // 色変化
    color = (color + t2 * vcolor) % 360;
    // 色消失
    if (t2 > atBegin && t2 < atEnd) {
        color = (color + 540 - atColor) % 360 - 180;
        color *= (atEnd - t2) / (atEnd - atBegin);
        color = (color + 360 + atColor) % 360;
    } else if (t2 >= atEnd) {
        color = atColor;
    }
    for (var i = 0; i < num; i++) {
        // 燃え尽き
        if (i + tail < t * 500) {  continue; }
        // 速度
        var vx = (r() * 2 - 1) * radius;
        var vy = (r() * 2 - 1) * radius;
        if (vx * vx + vy * vy > radius * radius) { // 円形にする
            continue;
        }
        // 座標に速度と落下速度を加算
        var x = x0 + t2 * vx;
        var y = y0 + t2 * vy + t * t * ay;
        // ゆらぎ
        x += Math.sin((t + i) * 200 % PI2) * 0.2;
        // 描画
        ctx.save();
        ctx.translate(x, y);
        if (spark && t2 > 0.8 && t2 < 0.9 && Math.random() < 0.003) {
            ctx.scale(512, 512);
            drawSpark(ctx, 50);
        } else {
            ctx.scale(16, 16);
            drawParticle(ctx, color);
        }
        ctx.restore();
    }
};

// 打ち上げ+花火を描画する関数
var uchiageHanabi = function (ctx, t, seed) {
    var r = random(seed);
    var x = SCREEN_WIDTH * 0.5;
    var y = SCREEN_HEIGHT * 0.3;
    var radius = 300; // 大きさ 100～300くらい

    if (t < 0.15) {
        t = t * 6;
        uchiage(ctx, t, SCREEN_WIDTH * 0.5, SCREEN_HEIGHT);
    } else if (t > 0.25) {
        t = (t * 4 - 1) / 3;

        // 最初の閃光
        if (t < 0.005) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(radius * 3, radius * 3);
            drawSpark(ctx, 50);
            ctx.restore();
        }

        // 外側
        var color = (r() * 36 | 0) * 10; // 色 0～359
        var vcolor = ((r() * 3 | 0) - 1) * 200; // 色変化速度
        var spark = r() < 0.3; // 閃光の有無
        hanabi(ctx, r() * 10000 | 0, t, x, y, color, vcolor, radius, spark);

        // 内側
        if (r() < 0.5) { // 色を変える
            color = (r() * 36 | 0) * 10;
            vcolor = ((r() * 3 | 0) - 1) * 200;
            spark = r() < 0.5;
        }
        hanabi(ctx, r() * 10000 | 0, t, x, y, color, vcolor, radius * 0.7, spark);
    }
};

// 初期化
var canvas = document.body.appendChild(document.createElement('canvas'));
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
var ctx = canvas.getContext('2d');

// 画面のリサイズ処理
(window.onresize = function () {
    var ratio = ratios[quality];
    var x = 0;
    var y = 0;
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (SCREEN_WIDTH / SCREEN_HEIGHT < w / h) {
        w = h * SCREEN_WIDTH / SCREEN_HEIGHT;
        x = (window.innerWidth - w) * 0.5;
    } else {
        h = w * SCREEN_HEIGHT / SCREEN_WIDTH;
        y = (window.innerHeight - h) * 0.5;
    }
    canvas.width = (w * ratio) | 0;
    canvas.height = (h * ratio) | 0;
    canvas.style.position = 'absolute';
    canvas.style.left = (x | 0) + 'px';
    canvas.style.top = (y | 0) + 'px';
    canvas.style.width = (w | 0) + 'px';
    canvas.style.height = (h | 0) + 'px';
    ctx.scale(canvas.width / SCREEN_WIDTH, canvas.height / SCREEN_HEIGHT);
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
})();

// メインループ
(function loop() {
    var t = Number(new Date()) - 1000000000000; // 経過時間
    t = t / (12 * 1000);
    ctx.save();

    // 少し暗くする
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'hsla(240,50%,0%,0.1)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // 描画
    ctx.globalCompositeOperation = 'lighter';
    uchiageHanabi(ctx, t % 1, t | 0);

    ctx.restore();
    requestAnimationFrame(loop);
}());

window.onclick = function () {
    quality = (quality + 1) % ratios.length;
    window.onresize();
};

}(this));