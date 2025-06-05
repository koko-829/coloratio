// このカルーセルを表示したいのはturbo_streamでモーダルを表示した時。
// turbo:before-stream-renderを捕捉してswiper作動させる方法やったらいける？
document.addEventListener("turbo:before-stream-render", function() {

  // まだこの状態ではstreamでのupdate後の要素が生まれてない段階なのでモーダル自体に設置しておいたidを取得する。
  const swiperTrigger = document.getElementById('swiper-trigger');

  // .swiper-Triggerが存在する場合のみSwiperを初期化
  if (swiperTrigger) {
    let swipeOption = {
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 1500, // スライド切り替えのスパン(ms)
        disableOnInteraction: false,
      },
      speed: 2000,
      allowTouchMove: false, //タップでのスライド変更無効
      simulateTouch: false //PCでのドラッグ無効
      // swiperのページネーションつけるなら必要↓
      // pagination: {
      //   el: '.swiper-pagination',
      //   clickable: true,
      // }
    };

    // beforeイベントから0.3秒後にSwiperのインスタンスを作成(beforeイベントの段階ではまだ.swiper-container要素が描画されてないため0.3秒後に取得する感じ。)
    // ↓存在しなturbo:after-stream-renderイベントを擬似的に再現してるみたいな感じ。
    setTimeout(function() {
      // モーダル開いて1回目だけswiperを初期化したいから、id='swiper-start'があった時のみnew Swiperを実行(モーダル内のいいねボタンを押すと,streamが走ってカルーセルが2重になってしまう)
      const swiperStart = document.getElementById('swiper-start');
      if (swiperStart) {
        const swiper = new Swiper('.swiper-container', swipeOption);
        // 同一モーダル内で再度new Swiperが実行されないように<div id="swiper-start">要素を削除する。
        swiperStart.remove();
      }
    }, 300);
  }
});

// html遷移用
document.addEventListener("turbo:load", function() {
  const swiperStart = document.getElementById('swiper-start');
    if (swiperStart) {
      const swiper = new Swiper('.swiper-container', {
        loop: true,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        autoplay: {
          delay: 1500, // スライド切り替えのスパン(ms)
          disableOnInteraction: false,
        },
        speed: 2000,
        allowTouchMove: false, //タップでのスライド変更無効
        simulateTouch: false //PCでのドラッグ無効
      });
    }
});