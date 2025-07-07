document.addEventListener("turbo:load", function() {
  const imagePicker = document.getElementById("image-picker");
  if (imagePicker) {

    let file; // The file to be processed
    let dropArea = document.getElementById("drop-area");
    let browseBtn = document.getElementById("browse-btn");
    let removeBtn = document.getElementById("remove-btn");
    let img = document.getElementById("image");
    let dropdownBtn = document.getElementById("dropdown-btn");
    let dropdownMenu = document.getElementById("dropdown-menu");
    let hamburgerBtnArrow = document.getElementById("hamburger-btn-arrow");
    let colors = document.getElementById("colors");
    let canvas = document.getElementById("canvas");
    let magnifierGlassContainer = document.getElementById("magnifier-glass-container");
    let magnifierGlass = document.getElementById("magnifier-glass");
    let hex;
    let rgb;
    let copyIcon = document.querySelectorAll(".copy-icon");
    let removeIcon = document.querySelectorAll(".remove-icon");
    let colorFormatOptions = document.querySelectorAll(".option");
    let colorFormat = "HEX";

    // Stores the colors
    // let colorsArr = [
    //   { id: "Q6I991QFj2", colorCode: "#4f214d" },
    // ];
    // Initial setup function
    const initialCode = function() {
      // Prevent default behavior for drag and drop events
      ["dragenter", "dragover", "dragleave", "drop"].forEach((evtName) => {
        dropArea.addEventListener(evtName, (e) => e.preventDefault());
      });

      // Highlight drop area when a file is dragged over
      dropArea.addEventListener("dragover", () => {
        dropArea.style.borderStyle = "solid";
        dropArea.style.opacity = "60%";
      });

      // Remove highlight when the file is dragged out
      dropArea.addEventListener("dragleave", () => {
        dropArea.style.borderStyle = "dashed";
        dropArea.style.opacity = "100%";
      });

      // Handle dropped file
      dropArea.addEventListener("drop", handleDroppedFile);

      // Handle file selection using the browse button
      browseBtn.addEventListener("change", handleSelectedFile);

      // Handle color format dropdown
      dropdownBtn.addEventListener("click", handleDropdown);

      // Set up color picker events
      img.addEventListener("mousemove", openEyedropper);
      img.addEventListener("touchmove", openEyedropper);
      img.addEventListener("mouseenter", openMagnifier);
      img.addEventListener("touchstart", openMagnifier);
      img.addEventListener("touchend", closeEyeDropper);
      img.addEventListener("mouseout", closeEyeDropper);
      // 画像をクリックした際に呼び出される関数。
      img.addEventListener("click", pickColor);
      // スマホとかタブレット用？指離した時にセットされる関数
      img.addEventListener("touchend", pickColor);

      // // Display initial color palette
      // displayColor();

      // Handle color removal
      removeBtn.addEventListener("click", removeColors);

      // Attach events to remove and copy icons for each color
      removeIcon.forEach((element) => {
        element.addEventListener("click", removeColor);
      });
      copyIcon.forEach((element) => {
        element.addEventListener("click", copyColor);
      });

      // Handle color format options
      colorFormatOptions.forEach((element) => {
        element.addEventListener("click", handleColorFormat);
      });
    };

    // ファイル選択用
    const handleDroppedFile = function(e) {
      dropArea.style.borderStyle = "dashed";
      dropArea.style.opacity = "100%";
      file = e.dataTransfer.files[0];
      displayImg();
    };

    // インポートした画増ファイル格納用
    const handleSelectedFile = function() {
      file = browseBtn.files[0];
      displayImg();
    };

    // インポートしたファイルの描画用関数
    const displayImg = function() {
      let reader = new FileReader();
      reader.addEventListener("load", function () {
        img.src = reader.result;
      });
      reader.readAsDataURL(file);
      removeColors();
    };

    // 虫眼鏡表示用関数
    const handleDropdown = function() {
      if (dropdownMenu.style.opacity == "1") {
        closeDropdown();
      } else {
        openDropdown();
      }
    };

    // 画像にカーソルを合わせた時の色確認虫眼鏡表示用(虫眼鏡の位置自体は関係なし。)
    const openEyedropper = function(e) {
      e.preventDefault();
      let pos = getCursorPos(e);
      let x = pos.x;
      let y = pos.y;
      useCanvas(canvas, img, function () {
        // ピクセルの色データ取得用
        let p = canvas.getContext("2d").getImageData(x, y, 1, 1).data;
        magnifierGlassContainer.style.borderColor = colorCode(p[0], p[1], p[2]);
      });
    };

    // 虫眼鏡表示用(位置関係あり)
    const openMagnifier = function() {
      let glass = magnifierGlassContainer;
      let zoom = 4;
      // 虫眼鏡をflexに変更(画面に表示されるようになる)
      magnifierGlassContainer.style.display = "flex";
      // 虫眼鏡内の背景を後ろの画増に変更(虫眼鏡として表示される)
      glass.style.backgroundImage = "url('" + img.src + "')";
      glass.style.backgroundRepeat = "no-repeat";
      // 表示される画像を拡大比率反映後のものにする
      glass.style.backgroundSize = img.width * zoom + "px " + img.height * zoom + "px";
      // 虫眼鏡内のサイズ指定
      let bw = 6;
      let w = glass.offsetWidth / 2;
      let h = glass.offsetHeight / 2;

      // カーソル動かすたびにmoveMagnifierを呼び出して虫眼鏡を動かす(PC用)。
      glass.addEventListener("mousemove", moveMagnifier);
      img.addEventListener("mousemove", moveMagnifier);

      // タッチ処理が起こるたびににmoveMagnifierを呼び出して虫眼鏡を動かす(タッチ端末用)。
      glass.addEventListener("touchmove", moveMagnifier);
      img.addEventListener("touchmove", moveMagnifier);

      function moveMagnifier(e) {
        e.preventDefault();
        let pos, x, y;
        const pixelsScrolled = window.scrollY;
        const cursorX = e.type == "touchmove" ? e.touches[0].clientX : e.clientX;
        const cursorY = e.type == "touchmove" ? e.touches[0].clientY : e.clientY;

        pos = getCursorPos(e);
        x = pos.x;
        y = pos.y;

        // 画像に対する虫眼鏡の位置指定(ここをどうにか変えて虫眼鏡の位置を変更したい。)
        glass.style.left = cursorX - glass.offsetWidth / 1.2 + "px";
        glass.style.top = cursorY + pixelsScrolled + "px";

        // 虫眼鏡の中にある拡大画像部分の位置指定。
        glass.style.backgroundPosition = `-${x * zoom - w + bw}px -${
          y * zoom - h + bw
        }px`;
      }
    };

    // カーソルの座標を識別するための処理。(虫眼鏡の位置は一切関係ない。あくまでカーソルの位置を管理するための処理)
    const getCursorPos = function(e) {
      let x, y;
      e = e || window.event;
      if (e.type === "touchmove") {
        // タッチ処理のときの位置判定
        const touch = e.touches[0];
        const a = img.getBoundingClientRect();
        x = touch.pageX - a.left - window.pageXOffset;
        y = touch.pageY - a.top - window.pageYOffset;
      } else {
        // ドラッグ処理の時の位置判定
        const a = img.getBoundingClientRect();
        x = e.pageX - a.left - window.pageXOffset;
        y = e.pageY - a.top - window.pageYOffset;
      }
      return { x: x, y: y };
    };

    //画像選択時の描画用？これ無効化したら画像の描画はできるけど色の抽出ができてないっぽい。
    const useCanvas = (el, img, callback) => {
      el.width = img.width;
      el.height = img.height;
      el.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
      return callback();
    };

    // 画像からカーソルが外れた時に虫眼鏡を外す用の処理？
    const closeEyeDropper = function() {
      magnifierGlassContainer.style.display = "none";
    };

    // HEXコードの取得用関数。
    const colorCode = (r, g, b) => {
      function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }

      hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      rgb = `rgb(${r},${g},${b})`;

      return hex;
    };

    function generateID() {
      const characters =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let id = "";

      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters.charAt(randomIndex);
      }

      return id;
    }

    // 画像内でクリックした時に実際に実行される処理。色の取得などが行われる。
    const pickColor = function() {
      colors.innerHTML = "";

      let colorObj = {
        id: generateID(),
        colorCode: hex
      };

      // カラーホイールごと色を変更する。(カラーホイールが変更されたら、ベースも変わるようにする。)
      colorPicker.color.hexString = `${colorObj.colorCode}`;
      window.pickr.setColor(`${colorObj.colorCode}`);
    };

    const removeColor = function(e) {
      let id = e.target.id;
      let newColorsArr = colorsArr.filter(function (obj) {
        return obj.id !== id;
      });
      colorsArr = newColorsArr;
      displayColor();
    };

    const copyColor = function(e) {
      let paragraph = e.target.parentElement.children[0];
      let colorCode = paragraph.innerHTML;
      navigator.clipboard.writeText(paragraph.innerHTML).then(() => {
        paragraph.innerHTML = "Copied!";
      });

      setTimeout(() => {
        paragraph.innerHTML = colorCode;
      }, 5000);
    };

    const handleColorFormat = function(e) {
      colorFormat = e.target.innerHTML;
      if (colorFormat == "HEX") {
        colorsArr = colorsArr.map((obj) => ({
          ...obj,
          colorCode: changeColorFormat(obj.colorCode)
        }));
        dropdownBtn.children[0].innerHTML = "HEX";
        colors.style.gridTemplateColumns = "repeat(auto-fit, 134px)";
      } else if (colorFormat == "RGB") {
        colorsArr = colorsArr.map((obj) => ({
          ...obj,
          colorCode: changeColorFormat(obj.colorCode)
        }));
        dropdownBtn.children[0].innerHTML = "RGB";
        colors.style.gridTemplateColumns = "repeat(auto-fit, 200px)";
      } else {
        return;
      }
      displayColor();
    };

    const changeColorFormat = (color) => {
      if (color.startsWith("#")) {
        // Convert Hex to RGB
        color = color.replace(/^#/, "");
        const bigint = parseInt(color, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgb(${r},${g},${b})`;
      } else if (color.startsWith("rgb")) {
        // Convert RGB to Hex
        const values = color.match(/\d+/g).map(Number);
        const hex = ((1 << 24) + (values[0] << 16) + (values[1] << 8) + values[2])
          .toString(16)
          .slice(1);
        return `#${hex}`;
      } else {
        // Invalid format
        return "invalid";
      }
    };

    const removeColors = function() {
      colorsArr = [];
      displayColor();
    };

    initialCode();

  }
});