document.addEventListener('turbo:load', () => {
  setTimeout(() => {
    const ogpImageBase = document.getElementById('ogp-image-base');

    // html2canvasを使用して画像を生成
    html2canvas(ogpImageBase).then(canvas => {
      const imageData = canvas.toDataURL('image/png');

      // ogp-dupに画像を描画
      const ogpDup = document.getElementById('ogp-dup');
      ogpDup.innerHTML = `<img src="${imageData}" alt="OGP Image" />`;

      // ogp-urlに画像のURLを表示
      const ogpUrl = document.getElementById('ogp-url');
      ogpUrl.textContent = imageData;
    });
  }, 5000); // 5秒後に実行
});
