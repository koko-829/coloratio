document.addEventListener("turbo:before-stream-render", function() {
  setTimeout(function() {
    const shareTrigger = document.getElementById("share-trigger");
    if (shareTrigger) {
      shareTrigger.click();
      shareTrigger.remove();
    }
  }, 300);
});