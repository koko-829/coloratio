document.addEventListener("turbo:before-stream-render", function() {
  setTimeout(function() {
    const shareTrigger = document.getElementById("share-trigger");
    if (shareTrigger) {
      const shareLink = shareTrigger.href; // リンクのURLを取得
      const popupBlockerMeasure = document.getElementById('popup-blocker-measure');
      // ポップアップブロック対策として空要素をクリックさせておく。
      if (popupBlockerMeasure) {
        popupBlockerMeasure.click();
        console.log('クリック要素を見つけました');
      }
      // 新しいウィンドウを開く
      const newWindow = window.open(shareLink, '_blank');
      // ポップアップがブロックされたかチェック
      if (!newWindow) {
        // ポップアップがブロックされた場合、location.hrefで遷移
        location.href = shareLink;
      }
      popupBlockerMeasure.remove();
      shareTrigger.remove(); // 要素を削除
    }
  }, 300);
});