window.slider = document.getElementById('ratio-slider');
// 色情報の配列を格納する変数を定義。
window.colors = JSON.parse(document.getElementById('tag-info').dataset.json);
// 選択中の色番号を管理するための変数を定義
window.currentBaseNum = 0;
// ベース追加時に登録されるデフォルトの色管理用
window.defaultAddColors = ['#808080', '#ff0000', '#ff00ff', '#00ff00', '#ffff00', '#0000ff', '#00ffff', '#008080', '#000080', '#808000', '#008000', '#800080', '#800000', '#000000'];
// 色の数管理用の変数を定義。(JSでの要素数取得メソッドはlengthのみ)
window.colorCount = window.colors.length;
// つまみの数を使用する色の数で動的管理するための変数を定義。(3色使用の場合は4つ摘みが必要になる。)
let handleCount = colorCount + 1;
// ツールチップを実装するための定義。下のnoUiSlider.createのtooltips: toolTipsで参照する。
const toolTips = [false]; //1つ目のつまみはツールチップを表示する必要がないからfalseにしておく。
for (let i=1; i < handleCount; i++) {
  toolTips.push({ to: function(value) { return value + '%';}});
}

// デフォルトのつまみ設置場所を定義しておく。{色の数: noUiのスタート位置}の形。
window.defaultRanges = {
  1: [0, 100],
  2: [0, 50, 100],
  3: [0, 35, 70, 100],
  4: [0, 25, 50, 75, 100],
  5: [0, 20, 40, 60, 80, 100]
};

// noUiのconnectイベント用の配列をハッシュ形式で格納しておく。
window.defaultConnects = {
  1: [false, true, false],
  2: [false, true, true, false],
  3: [false, true, true, true, false],
  4: [false, true, true, true, true, false],
  5: [false, true, true, true, true, true, false]
};

// スライド作成用の関数を作成しておく(グローバル)
window.createSlider = function(){
  window.colorCount = window.colors.length;
  noUiSlider.create(window.slider, {
    start: defaultRanges[colorCount], // ハッシュのインデックスは色の数で指定することに注意(handleCountではない。)
    behaviour: 'drag-all', //スライドをまとめてドラックできるオプション。両端をcssで動かせないようにすることで、完全に固定するための逆説的な使い方試してみた…
    connect: defaultConnects[colorCount], // 上で定義したdefaultConnectsでconnect状態を数に対応させる。
    range: {
      'min': 0,
      'max': 100
    },
    margin: 5, // ハンドル同士の最小距離。5にしたら、少なくとも5%の幅は持てる？
    step: 5,
  });
}

//スライダー作成の呼び出し(ページ更新時用)
createSlider();

// 色選択でベースが変更された時は、connectの色だけ変更する
window.changeConnectColors = function(){
	var connect = window.slider.querySelectorAll('.noUi-connect');
	for (var i = 0; i < connect.length; i++) {
    connect[i].style.background = window.colors[i]; // backgroundのスタイルを直接指定する。
	}
}

// バーの色をセット。
changeConnectColors();

// プレビューのパレットリアルタイム反映用。
window.previewUpdate = function(){
  for(let i = 0; i < window.colors.length; i++){ //colorsの要素数分繰り返す。
    document.getElementById(`preview-${i+1}`).style.background = window.colors[i];
  }
}

window.updateRatio = function(){
  // スライドの値が変更されるたびに実行される処理を定義(各色の差をリアルタイムで反映させる。)
  window.slider.noUiSlider.on('update', function(values) {
    for(let i = 1; i < values.length; i++){ //今あるvalue(つまみの)の要素分繰り返し処理
      const ratio = values[i] - values[i - 1];
      document.getElementById(`ratio-${i}`).textContent = `${ratio}%`;
      document.getElementById(`preview-${i}`).style.width = `${ratio}%`;
    }
    previewUpdate(); //プレビューの色を変更する。
  });
}

updateRatio();
