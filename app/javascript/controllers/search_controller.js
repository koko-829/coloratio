import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="search"
export default class extends Controller {
  // コントローラーに紐づく要素（=フォーム）をsubmitするアクション
  submit() {
    // セットされているTimeoutをクリアする
    clearTimeout(this.timeout)

    // inputされて300ms後にリクエストを実行するようsetTimeout
    // 連続でinputされるとTimeoutはクリアされるため、最後の処理だけしか実行されない
    this.timeout = setTimeout(() => {
      this.element.requestSubmit()
    }, 300)
  }
}
