// パレット詳細画面のスケルトンローディング用のjs

// パレット詳細モーダル開く瞬間にスケルトンローディングを表示したい。
// document.addEventListener("turbo:before-fetch-request", function() {
//   const skelton = document.getElementById("palette-skelton");
//   if (skelton) {
//     // console.log('a');
//     skelton.style.display = "block";
//   }
// });

// すべて読み込んだらスケルトンを非表示にしたい。
document.addEventListener("turbo:before-stream-render", function() {
  const skelton = document.getElementById("palette-skelton");
  // 数秒後にスケルトンを非表示にする
  if (skelton) {
    setTimeout(function() {
      skelton.style.display = "none"; // スケルトンを非表示
    }, 500);
  }
});