import html2canvas from './html2canvas.min';

// htmlリクエストのshow画面用
document.addEventListener('turbo:load', function() {
  const ogpImageBase = document.getElementById('ogp-image-base');
  const imageDataField = document.getElementById('image_data');

  // ogp-image-baseが存在する場合のみ実行
  if (ogpImageBase) {
    // 元画像ベースを一瞬だけ表示する
    ogpImageBase.style.display = 'block';

    // html2canvasを使用して画像を生成
    html2canvas(ogpImageBase).then(function(canvas) {
      // CanvasをDataURLに変換
      const base64data = canvas.toDataURL('image/png');

      // 隠しフィールドにBase64データを設定
      imageDataField.value = base64data;

      // ogp-dupに画像を描画
      const ogpDup = document.getElementById('ogp-dup');
      ogpDup.innerHTML = `<img src="${base64data}" alt="OGP Image" />`;

      // サイズを表示(確認用)
      const sizeDisplay = document.getElementById('image-size');
      sizeDisplay.textContent = `幅：${canvas.width}px x 高さ：${canvas.height}px`;

      // 画像ダウンロードリンクのhrefをBase64データに変更
      const downloadLink = document.getElementById('image-download-link');
      if (downloadLink) {
        downloadLink.href = base64data; // hrefをBase64データに更新
      }

      // // 元画像ベースを非表示にする
      // ogpImageBase.style.display = 'none';
    });
  }
});

// turboによるモーダルshow表示用(before-stream-renderイベントのため、全てのDOMがレンダリングされてるであろう0.3秒後に走らせる。)
document.addEventListener("turbo:before-stream-render", function() {
  setTimeout(function() {
    const ogpImageBaseModal = document.getElementById('ogp-image-base-modal');
    const imageDataFieldModal = document.getElementById('image_data-modal');
    const ogpTrigger = document.getElementById('ogp-trigger');

    // ogpTriggerが存在する場合のみ実行(いいねボタンのturbo_streamでは走らないようにしたい。)
    if (ogpTrigger) {
      console.log('実行します');
      // 元画像を一瞬だけ表示する
      ogpImageBaseModal.style.display = 'block';

      // html2canvasを使用して画像を生成
      html2canvas(ogpImageBaseModal).then(function(canvas) {
        // CanvasをDataURLに変換
        const base64data = canvas.toDataURL('image/png');

        // 隠しフィールドにBase64データを設定
        imageDataFieldModal.value = base64data;

        // // サイズを表示(確認用)
        // const sizeDisplayModal = document.getElementById('image-size-modal');
        // sizeDisplayModal.textContent = `幅：${canvas.width}px x 高さ：${canvas.height}px`;

        // 画像ダウンロードリンクのhrefをBase64データに変更
        const downloadLinkModal = document.getElementById('image-download-link-modal');
        if (downloadLinkModal) {
          downloadLinkModal.href = base64data; // hrefをBase64データに更新
        }

        // 元画像を非表示にする
        ogpImageBaseModal.style.display = 'none';
        ogpTrigger.remove(); // ogpTrigger要素を削除(モーダル開いた1回目だけ画像処理がお子なれるようにするため)
      });
    }
  }, 300);
});

