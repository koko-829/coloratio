document.addEventListener("turbo:load", function() {
  const paletteBase = document.getElementById("palette-base");
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

    function setColor(preSetColor) {
      // 今から登録しようとしてる色が、既にパレットにある色とは違う時のみ、実際に変更する。
      if (window.colors.includes(preSetColor)) {
        console.log('既に同じ色がセットされています');
      } else {
        selectorToBase(preSetColor);
      }
    }

    // カラーホイールの色が変化した時に選択中ベースの色も変更する。(選択中ベースはwindow.currentBaseNumで管理)
    colorPicker.on('color:change', function() {
      if (window.currentBaseNum){
        setColor(colorPicker.color.hexString);
      }
    });

    // // input type="color"から値を変更した場合の処理
    // function formChange(selectedColor) {
    //   document.getElementById('selected-iro-mini-box').style.background = selectedColor;
    //   document.getElementById('selected-iro').textContent = selectedColor;
    //   colorPicker.color.hexString = selectedColor
    // }

    // // 実際にinput type="color"の値が変更された時の処理。
    // const colorInputForm = document.getElementById('selected-iro-box');
    // colorInputForm.addEventListener('input', function() {
    //   const selectedColor = colorInputForm.value;
    //   formChange(selectedColor);
    // });

    // const HexInputImageSection = document.getElementById('hex_input_image_section');
    // HexInputImageSection.addEventListener('input', function() {
    //   const withoutHashColor = HexInputImageSection.value;
    //   document.getElementById('selected-iro-box').value = `${withoutHashColor}`;
    // });

  };
});