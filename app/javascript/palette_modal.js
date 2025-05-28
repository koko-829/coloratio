// パレット詳細画面のスケルトンローディング用のjs
// パレット詳細モーダル開く瞬間にスケルトンローディングを表示したい。
document.addEventListener("turbo:before-fetch-request", function() {
  // document.querySelector(".modal-palette").style.display = "none";
  const skelton = document.getElementById("palette-skelton");
  if (skelton) {
    console.log('skeltonを見つけました。表示します。');
    skelton.style.display = "block";
  }
});

// すべて読み込んだらスケルトンを非表示にしたい。
document.addEventListener("turbo:before-stream-render", function() {
  const skelton = document.getElementById("palette-skelton");
  const modal = document.querySelector(".modal-palette");
  // 数秒後にスケルトンを非表示にする
  if (skelton && modal) {
    console.log('skeltonとmodalを見つけました。数秒後にmodalを表示します。');
    setTimeout(function() {
      document.querySelector(".modal-palette").style.display = "block";
      skelton.style.display = "none"; // スケルトンを非表示
    }, 500);

  }
});