document.addEventListener("turbo:load", function() {

  const paletteBase = document.getElementById("palette-base");
  const colorSelector = document.getElementById("color-picker");
  if (paletteBase) {
    window.colorPicker = new iro.ColorPicker("#picker", {
      // Set the size of the color picker
      width: 300,
      // デフォルト色リストを格納したグローバル変数から
      color: window.defaultAddColors[Math.floor( Math.random() * window.defaultAddColors.length)],
      padding: 2, //明度バーの太さ、パディングを実装できる。
      wheelLightness: false, //明度バーを下げた時に色相ホイールの色は変わらない状態になる。
      borderWidth: 2,
      borderColor: "#d4d4d4"
    });

    // 選択画面の変更をベースにも反映する用の定義。(リフォーム後も残す)
    function selectorToBase(selectedIro){
      if (document.getElementById("svg-base")) {
        document.getElementById("svg-base").style.fill = selectedIro;
        document.getElementById("square-base").style.background = selectedIro;
        document.getElementById("based-hex").textContent = selectedIro;
        document.getElementById("ratio-circle").style.background = selectedIro;
        window.colors[window.currentBaseNum - 1] = selectedIro; // 色の配列情報を変更
        window.changeConnectColors(); // つまみの色を変更
        window.previewUpdate(); //プレビューの色を変更
      }
    }

    function setIro(preSetColor) {
      // 今から登録しようとしてる色が、既にパレットにある色とは違う時のみ、実際に変更する。
      if (!window.colors.includes(preSetColor)) {
        selectorToBase(preSetColor);
        // window.pickr.setColor(`${colorPicker.color.hexString}`);
        document.getElementById("picker-hex-code").textContent = preSetColor;
        document.getElementById("picker-hex-box").style.background = preSetColor;
      }
    }

    // カラーホイールの色が変化した時に選択中ベースの色も変更する。(選択中ベースはwindow.currentBaseNumで管理)
    colorPicker.on('color:change', function() {
      if (window.currentBaseNum){
        setIro(colorPicker.color.hexString);
        // window.pickr.setColor(`${colorPicker.color.hexString}`);
        // document.getElementById("picker-hex-code").textContent = colorPicker.color.hexString;
        // document.getElementById("picker-hex-box").style.background = colorPicker.color.hexString;
      }
    });

    // カラーピッカーライブラリ作成用
    window.pickr = new Pickr({
        el: colorSelector,
        useAsButton: true,
        default: '#ffffff',
        // falseにするとsave無しで直接変更できるようにする
        comparison: false,
        // 不透明度要素の無効化
        lockOpacity: false,

        swatches: [
            '#F44336',
            '#E91E63',
            '#9C27B0',
            '#673AB7',
            '#3F51B5',
            '#2196F3',
            '#03A9F4',
            '#00BCD4',
            '#009688',
            '#4CAF50',
            '#8BC34A',
            '#CDDC39',
            '#FFEB3B',
            '#FFC107',
            '#FF5722',
        ],

        components: {

            // ドラッグして動かすパレット部分は表示
            palette: true,
            // デフォルト色と現在の色の比較プレビュー部分は表示しない。
            preview: false,
            hue: true,

            // Input / output Options
            interaction: {
              input: true,
            }

        }

    }).on('change', (color) => {
      colorPicker.color.hexString = color.toHEXA();
    });

  };


});