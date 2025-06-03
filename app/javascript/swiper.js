// このカルーセルを表示したいのはturbo_streamでモーダルを表示した時。
// turbo:before-stream-renderを捕捉してswiper作動させる方法やったらいける？
document.addEventListener("turbo:before-stream-render", function() {

  // まだこの状態ではstreamでのupdate後の要素が生まれてない段階なのでモーダル自体に設置しておいたidを取得する。
  const swiperTrigger = document.getElementById('swiper-trigger');

  // .swiper-Triggerが存在する場合のみSwiperを初期化
  if (swiperTrigger) {
    console.log('swiperのトリガー要素が見つかりました');
    let swipeOption = {
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      speed: 2000
      // swiperのページネーションつけるなら必要↓
      // pagination: {
      //   el: '.swiper-pagination',
      //   clickable: true,
      // }
    };

    // beforeイベントから0.5秒後にSwiperのインスタンスを作成(beforeイベントの段階ではまだ.swiper-container要素が描画されてないため0.5秒後に取得する感じ。)
    // ↓存在しなturbo:after-stream-renderイベントを擬似的に再現してるみたいな感じ。
    setTimeout(function() {
      const swiper = new Swiper('.swiper-container', swipeOption);
    }, 500);
  }
});