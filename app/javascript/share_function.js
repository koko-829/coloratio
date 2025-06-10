document.addEventListener("turbo:before-stream-render", function() {
  setTimeout(function() {
    const shareTrigger = document.getElementById("share-trigger");
    if (shareTrigger) {
      // shareTrigger.click();
      window.open(twitterShareLink.href, '_blank');
      shareTrigger.remove();
    }
  }, 300);
});