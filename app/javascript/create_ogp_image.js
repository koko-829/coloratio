import html2canvas from './html2canvas.min';

document.addEventListener('turbo:load', function() {
  const ogpImageBase = document.getElementById('ogp-image-base');
  // ogp-image-baseが存在する場合のみsetTimeoutを実行
  if (ogpImageBase) {
    // 元画像を一瞬だけ表示する
    ogpImageBase.style.display = 'block';

    // html2canvasを使用して画像を生成
    html2canvas(ogpImageBase).then(function(canvas) {
      const imageData = canvas.toDataURL('image/png');

      // ogp-dupに画像を描画
      const ogpDup = document.getElementById('ogp-dup');
      ogpDup.innerHTML = `<img src="${imageData}" alt="OGP Image" />`;

      // ogp-urlに画像のURLを表示
      // const ogpUrl = document.getElementById('ogp-url');
      // ogpUrl.textContent = imageData;

      // サイズを表示(確認用)
      const sizeDisplay = document.getElementById('image-size');
      sizeDisplay.textContent = `幅：${canvas.width}px x 高さ：${canvas.height}px`;

      // 画像ダウンロードリンクのhrefをimageDataに変更
      const downloadLink = document.getElementById('image-download-link');
      if (downloadLink) {
        downloadLink.href = imageData; // hrefをimageDataに更新
      }
    });

    // 元画像を非表示にする。
    ogpImageBase.style.display = 'none';

  }
});