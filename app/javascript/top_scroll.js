document.addEventListener('turbo:load', function() {
  // bodyタグを取得
  const documentBody = document.querySelector('body');

  // ウィンドウサイズを取得
  const windowBottom = window.innerHeight;
  const topBtn = document.getElementById('backToTop');

  // // 初期設定
  // topBtn.style.opacity = 0;
  // topBtn.style.pointerEvents = "none";

  // スクロールで表示
  window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop >= windowBottom) {
          topBtn.style.opacity = 0.6;
          topBtn.style.pointerEvents = "auto";
      } else {
          topBtn.style.opacity = 0;
          topBtn.style.pointerEvents = "none";
      }
  });

  // ボタンクリックでスクロール
  topBtn.addEventListener('click', function() {
      window.scrollTo({
          top: 0,
          behavior: 'smooth' // スクロールをスムーズにする
      });
  });
});