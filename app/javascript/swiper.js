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

// htmlリクエスト遷移用
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
    swiperStart.remove();
  }

});

// 未ログイントップ画面用swiper
document.addEventListener("turbo:load", function() {
  const preLoginSwiper = document.getElementById('pre_login_swiper');
  if (preLoginSwiper) {
    const swiper = new Swiper('.swiper-container', {
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 2000, // スライド切り替えのスパン(ms)
        disableOnInteraction: false,
      },
      speed: 1000,
      allowTouchMove: false, //タップでのスライド変更無効
      simulateTouch: false, //PCでのドラッグ無効
      on: {
          slideChange: function () {
            const currentSlideIndex = this.realIndex; // 現在のスライドindexを取得。

            // input要素を取得
            const currentSlideInput = document.getElementById('current-slide-input');
            if (currentSlideInput) {
              // inputの値を変更
              currentSlideInput.value = currentSlideIndex;
              // inputイベントを発火させる(x-model要素で認識させるため)
              currentSlideInput.dispatchEvent(new Event('input'));
            } else {
              console.warn('current-slide-inputが見つかりませんでした。');
            }
          }
        }
    });
    preLoginSwiper.style.visibility = 'visible';
  }

});