document.addEventListener("turbo:load", function() {
  const paletteBase = document.getElementById("palette-base");
  if (paletteBase) {
    window.slider = document.getElementById('ratio-slider');
    // 色情報の配列を格納する変数を定義。
    const colorTagInfo = document.getElementById('color-tag-info');
    window.colors = colorTagInfo ? JSON.parse(colorTagInfo.dataset.json) : null

    // edit用に既存の比率を格納するためのpreEditRatio変数も定義(editページでない場合はnullで取得する。)
    const ratioTagInfo = document.getElementById('ratio-tag-info');
    window.preEditRatio = ratioTagInfo ? JSON.parse(ratioTagInfo.dataset.json) : null;
    // 選択中の色番号を管理するための変数を定義
    window.currentBaseNum = 0;
    // ベース追加時に登録されるデフォルトの色管理用
    window.defaultAddColors = ['#808080', '#ff0000', '#ff00ff', '#00ff00', '#ffff00', '#0000ff', '#00ffff', '#008080', '#000080', '#808000', '#008000', '#800080', '#800000', '#000000'];
    // 色の数管理用の変数を定義。(JSでの要素数取得メソッドはlengthのみ)
    window.colorCount = window.colors.length;
    // つまみの数を使用する色の数で動的管理するための変数を定義。(3色使用の場合は4つ摘みが必要になる。)
    window.handleCount = colorCount + 1;
    // ツールチップを実装するための定義。下のnoUiSlider.createのtooltips: toolTipsで参照する。
    window.toolTipsSetting = [false];

    window.toolTipsUpdate = function(){
      window.toolTipsSetting = [false];
      for (let i=1; i < window.colors.length + 1; i++) {
      toolTipsSetting.push({ to: function(value) { return value + '%';}});
      }
      return toolTipsSetting;
    }

    // デフォルトのつまみ設置場所を定義しておく。{色の数: noUiのスタート位置}の形。
    window.defaultRanges = {
      1: [0, 100],
      2: [0, 50, 100],
      3: [0, 70, 75, 100],
      4: [0, 70, 75, 85, 100],
      5: [0, 60, 70, 80, 90, 100]
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
    window.createSlider = function(ratio = null){
      window.colorCount = window.colors.length;
      noUiSlider.create(window.slider, {
        start: ratio || defaultRanges[colorCount], // 引数が指定されてた場合は、その引数を元につまみの位置を設置する。ハッシュのインデックスは色の数で指定することに注意(handleCountではない。)
        behaviour: 'drag-all', //スライドをまとめてドラックできるオプション。両端をcssで動かせないようにすることで、完全に固定するための逆説的な使い方試してみた…
        connect: defaultConnects[colorCount], // 上で定義したdefaultConnectsでconnect状態を数に対応させる。
        range: {
          'min': 0,
          'max': 100
        },
        margin: 5, // ハンドル同士の最小距離。5にしたら、少なくとも5%の幅は持てる？
        step: 5,
        //tooltips: toolTipsUpdate(),
        pips: {
          mode: 'positions',
          values: [0, 25, 50, 75, 100],
          //values: [0,10,20,30,40,50,60,70,80,90,100],
          density: 5,
        }
      });
    }

    //スライダー作成の呼び出し(ページ更新時用。editの場合は既存の面積比率を取得する。)
    createSlider(preEditRatio);

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
      document.getElementById('post_color_list').value = window.colors;
      for(let i = 0; i < window.colors.length; i++){ //colorsの要素数分繰り返す。
        document.getElementById(`preview-${i+1}`).style.background = window.colors[i];
      }
    }

    window.updateRatio = function(){
      // スライドの値が変更されるたびに実行される処理を定義(各色の差をリアルタイムで反映させる。)
      window.slider.noUiSlider.on('update', function(values) {
        let inputRatio = ''; // フォームへの入力値格納用の変数。
        for(let i = 1; i < values.length; i++){ //今あるvalue(つまみの)の要素分繰り返し処理
          const ratio = values[i] - values[i - 1];
          if (i === 1) {
            inputRatio = ratio; // 求めたratioが1色目の時は単純にinputRatioに代入。
          } else {
            inputRatio = inputRatio + `,${ratio}`; // 2色目以降は,区切りで入力したいから+ `,${ratio}`の形。
          }
          document.getElementById(`ratio-${i}`).textContent = `${ratio}%`;
          document.getElementById(`preview-${i}`).style.width = `${ratio}%`;
        }
        document.getElementById('post_ratio').value = inputRatio; // 繰り返し処理変更後にフォームにinputRatioの値を入力。
        previewUpdate(); //プレビューの色を変更する。
      });
    }

    updateRatio();

  }
});