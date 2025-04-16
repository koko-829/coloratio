document.addEventListener("turbo:load", function() {
  const colorPicker = new iro.ColorPicker("#picker", {
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
    document.getElementById('selected-base').style.background = selectedIro;
    document.getElementById('selected-mini-base').style.background = selectedIro;
    document.getElementById('selected-color').textContent = selectedIro;
  }

  // 選択画面の変更をベースにも反映する用の定義。
  function selectorToBase(){
    document.getElementById("svg-base").style.fill = colorPicker.color.hexString;
    document.getElementById("square-base").style.background = colorPicker.color.hexString;
    document.getElementById("based-hex").textContent = colorPicker.color.hexString;
  }
  // ページ更新時にIro.jsの初期色をプレビューに反映したい。
  selectedIroChange(colorPicker.color.hexString);


  // Iro.jsのカラーホイールで色が変化した時にプレビューに反映されるようにしたい。
  colorPicker.on('color:change', function(color) {
    selectedIroChange(colorPicker.color.hexString);
  });

  // iro-set-buttonのボタン要素を取得。
  const iroSetButton = document.getElementById('iro-set-button');
  // ボタンを押した時にクリックイベントを補足して処理を実行。
  iroSetButton.addEventListener('click',() => {
    iroSetBase(colorPicker.color.hexString); //ベースに現在のIroカラーをセットするための関数呼び出し。
    selectorToBase();
    window.colors[window.currentBaseNum - 1] = colorPicker.color.hexString;
    window.changeConnectColors();
    window.previewUpdate(); //プレビューの色を変更
  });

});