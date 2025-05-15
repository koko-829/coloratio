import Tagify from '@yaireo/tagify'
// The DOM element you wish to replace with Tagify
document.addEventListener("turbo:load", function() {
  var input = document.getElementById('post_tag');
  // initialize Tagify on the above input node reference
  if (input) {
    new Tagify(input, {
      maxTags: 5, // つけられるタグを5つまでにする。
      pattern: /^.{1,15}$/, // 16文字以上の場合は登録できないようにする。
      originalInputValueFormat: valuesArr => valuesArr.map(item => item.value) // 値の配列だけの形にする。
    });
  }
});