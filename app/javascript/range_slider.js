document.addEventListener('DOMContentLoaded', function() {
  const slider = document.getElementById('ratio-slider');
  // 色情報の配列を格納する変数を定義。
  window.colors = JSON.parse(document.getElementById('tag-info').dataset.json);
  // 選択中の色番号を管理するための変数を定義
  window.currentBaseNum = 0;
  // 色の数管理用の変数を定義。(JSでの要素数取得メソッドはlengthのみ)
  const colorCount = window.colors.length;

  // つまみの数を使用する色の数で動的管理するための変数を定義。(3色使用の場合は4つ摘みが必要になる。)
  const handleCount = colorCount + 1;
  // ツールチップを実装するための定義。下のnoUiSlider.createのtooltips: toolTipsで参照する。
  const toolTips = [false]; //1つ目のつまみはツールチップを表示する必要がないからfalseにしておく。
  for (let i=1; i < handleCount; i++) {
    toolTips.push({ to: function(value) { return value + '%';}});
  }

  // デフォルトのつまみ設置場所を定義しておく。{色の数: noUiのスタート位置}の形。
  const defaultRanges = {
    2: [0, 50, 100],
    3: [0, 35, 70, 100],
    4: [0, 25, 50, 75, 100],
    5: [0, 20, 40, 60, 80, 100]
  };

  // noUiのconnectイベント用の配列をハッシュ形式で格納しておく。
  const defaultConnects = {
    2: [false, true, true, false],
    3: [false, true, true, true, false],
    4: [false, true, true, true, true, false],
    5: [false, true, true, true, true, true, false]
  };


  noUiSlider.create(slider, {
    start: defaultRanges[colorCount], // ハッシュのインデックスは色の数で指定することに注意(handleCountではない。)
    behaviour: 'drag-all', //スライドをまとめてドラックできるオプション。両端をcssで動かせないようにすることで、完全に固定するための逆説的な使い方試してみた…
    connect: defaultConnects[colorCount], // 上で定義したdefaultConnectsでconnect状態を数に対応させる。
    range: {
      'min': 0,
      'max': 100
    },
    margin: 5, // ハンドル同士の最小距離。5にしたら、少なくとも5%の幅は持てる？
    step: 5,

    //tooltips: toolTips, //上で定義したツールチップ用配列を使用。

    pips: {  // 特定の間隔で値のマーカーを追加
      mode: 'positions',
      values: [0,25,50,75,100],
      density: 5 // 小さいメモリの間隔5%ごとに
    }
  })


  // つまみ間に色をつけたい。
  var connect = slider.querySelectorAll('.noUi-connect');

  for (var i = 0; i < connect.length; i++) {
      connect[i].style.background = window.colors[i]; // backgroundのスタイルを直接指定する。
  }
});
