import Tagify from '@yaireo/tagify'

document.addEventListener("turbo:load", function() {
  var input = document.getElementById('post_tag');
  if (input) {
    const tags = JSON.parse(document.getElementById('tags_info').dataset.json); // whitelist用に既存tagの情報をインスタンス変数から取得する。
    // console.log(`${tags}`);
    new Tagify(input, {
      maxTags: 3, // つけられるタグを5つまでにする。
      pattern: /^.{1,10}$/, // 16文字以上の場合は登録できないようにする。
      whitelist : tags,
      delimiters: ",| ",
      originalInputValueFormat: valuesArr => valuesArr.map(item => item.value) // 値の配列だけの形にする。
    });
  }
});