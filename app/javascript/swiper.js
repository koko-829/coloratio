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
            let previousSlideIndex = currentSlideIndex - 1; // 一つ前に表示されてたパレット要素を取得
            // 表示中のスライドが0だった場合(1つ前の要素が最終スライドの11だった場合)、11にする。
            if (previousSlideIndex < 0) {
              previousSlideIndex = 11;
            }
            const activeElements = document.getElementsByClassName(`slide-palette-${currentSlideIndex}`); // 拡大したい表示中のパレット要素を取得。
            const previousElements = document.getElementsByClassName(`slide-palette-${previousSlideIndex}`); // 一つ前に拡大されていたパレット要素を取得。

            // // 一つ前のパレット要素をもとの状態に戻す。
            if (previousElements) {
              for (let i = 0; i < previousElements.length; i++) {
                previousElements[i].style.transform = "scale(0.9)"; // 大きさを戻す
                previousElements[i].style.opacity = 0.6; // 透明度を戻す
              }
            }

            // // 現在表示中のパレット要素を拡大する。
            if (activeElements) {
              for (let i = 0; i < activeElements.length; i++) {
                activeElements[i].style.transform = "scale(1.2)"; // 大きさ拡大
                activeElements[i].style.opacity = 1.0; // 透明度を1.0に
              }
            }
          }
        }
    });
    preLoginSwiper.style.visibility = 'visible';
  }

});