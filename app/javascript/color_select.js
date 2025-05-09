document.addEventListener("turbo:load", function() {
  const paletteBase = document.getElementById("palette-base");
  if (paletteBase) {
    window.colorPicker = new iro.ColorPicker("#picker", {
      // Set the size of the color picker
      width: 250,
      // デフォルト色リストを格納したグローバル変数から
      color: window.defaultAddColors[Math.floor( Math.random() * window.defaultAddColors.length)],
      padding: 2, //明度バーの太さ、パディングを実装できる。
      wheelLightness: false, //明度バーを下げた時に色相ホイールの色は変わらない状態になる。
      borderWidth: 2,
      borderColor: "#d4d4d4"
    });


    // 選択色反映用の関数を定義しておく
    function selectedIroChange(selectedIro) {
      document.getElementById('selected-iro-box').style.background = selectedIro;
      document.getElementById('selected-iro-mini-box').style.background = selectedIro;
      document.getElementById('selected-iro').textContent = selectedIro;
    }

    // Iro.jsで選んだ色を実際にパレットにセットする用の定義
    function iroSetBase(selectedIro){
      document.getElementById('selected-base').style.fill = selectedIro;
      document.getElementById('selected-mini-base').style.background = selectedIro;
      document.getElementById('selected-color').textContent = selectedIro;
    }

    // 選択画面の変更をベースにも反映する用の定義。
    function selectorToBase(selectedIro){
      document.getElementById("svg-base").style.fill = selectedIro;
      document.getElementById("square-base").style.background = selectedIro;
      document.getElementById("based-hex").textContent = selectedIro;
    }
    // ページ更新時にIro.jsの初期色をプレビューに反映したい。
    selectedIroChange(colorPicker.color.hexString);


    // Iro.jsのカラーホイールで色が変化した時にプレビューに反映されるようにしたい。
    colorPicker.on('color:change', function() {
      selectedIroChange(colorPicker.color.hexString);
    });

    // ベースの色を変更するボタンを押した時の処理。
    // iro-set-buttonのボタン要素を取得。
    const iroSetButton = document.getElementById('iro-set-button');
    // ボタンを押した時にクリックイベントを補足して処理を実行。
    iroSetButton.addEventListener('click',() => {
      const preSetColor = colorPicker.color.hexString
      // 今から登録しようとしてる色が、既にパレットにある色とは違う時のみ、実際に変更する。
      if (window.colors.includes(preSetColor)) {
        console.log('既に同じ色がセットされています');
      } else {
        iroSetBase(preSetColor);
        selectorToBase(preSetColor);
        window.colors[window.currentBaseNum - 1] = preSetColor;
        window.changeConnectColors();
        window.previewUpdate(); //プレビューの色を変更
      }
    });
  };
});