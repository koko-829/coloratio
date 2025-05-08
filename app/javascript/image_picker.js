document.addEventListener("turbo:load", function() {
  const imagePicker = document.getElementById("image-picker");
  if (imagePicker) {
    console.log('image-pickerのidが読み込まれました。');
    // Declare variables for various elements on the webpage
    let file; // The file to be processed
    let dropArea = document.getElementById("drop-area"); // The area where files can be dropped
    let browseBtn = document.getElementById("browse-btn"); // The button to browse and select a file
    let removeBtn = document.getElementById("remove-btn"); // The button to remove colors
    let img = document.getElementById("image"); // The image element to display the selected image
    let dropdownBtn = document.getElementById("dropdown-btn"); // The button to open color format dropdown
    let dropdownMenu = document.getElementById("dropdown-menu"); // The dropdown menu for color format
    let hamburgerBtnArrow = document.getElementById("hamburger-btn-arrow"); // The arrow in the hamburger button
    let colors = document.getElementById("colors"); // The container for displaying colors
    let canvas = document.getElementById("canvas"); // The canvas for working with colors
    let magnifierGlassContainer = document.getElementById(
      "magnifier-glass-container"
    ); // The container for the magnifier
    let magnifierGlass = document.getElementById("magnifier-glass"); // The magnifier element
    let hex; // Hexadecimal color code
    let rgb; // RGB color code
    let copyIcon = document.querySelectorAll(".copy-icon"); // Icons to copy color code
    let removeIcon = document.querySelectorAll(".remove-icon"); // Icons to remove a color
    let colorFormatOptions = document.querySelectorAll(".option"); // Options for color format
    let colorFormat = "HEX"; // Default color format is HEX

    // Stores the colors
    let colorsArr = [
      { id: "Q6I991QFj2", colorCode: "#4f214d" },
    ];
    // Initial setup function
    const initialCode = () => {
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

      // Display initial color palette
      displayColor();

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

    // Handle file dropped onto the drop area
    const handleDroppedFile = (e) => {
      dropArea.style.borderStyle = "dashed";
      dropArea.style.opacity = "100%";
      file = e.dataTransfer.files[0];
      displayImg();
    };

    // Handle file selected using the browse button
    const handleSelectedFile = () => {
      file = browseBtn.files[0];
      displayImg();
    };

    // Display the selected image
    const displayImg = () => {
      let reader = new FileReader();
      reader.addEventListener("load", function () {
        img.src = reader.result;
      });
      reader.readAsDataURL(file);
      removeColors();
    };

    // Handle color format dropdown
    const handleDropdown = () => {
      if (dropdownMenu.style.opacity == "1") {
        closeDropdown();
      } else {
        openDropdown();
      }
    };



    // 画像にカーソルを合わせた時の色確認虫眼鏡表示用
    const openEyedropper = (e) => {
      e.preventDefault();
      let pos = getCursorPos(e);
      let x = pos.x;
      let y = pos.y;
      useCanvas(canvas, img, function () {
        let p = canvas.getContext("2d").getImageData(x, y, 1, 1).data;
        magnifierGlassContainer.style.borderColor = colorCode(p[0], p[1], p[2]);
      });
    };

    // 拡大プレビュー表示用
    const openMagnifier = () => {
      let glass = magnifierGlassContainer;
      let zoom = 4;

      magnifierGlassContainer.style.display = "flex";
      glass.style.backgroundImage = "url('" + img.src + "')";
      glass.style.backgroundRepeat = "no-repeat";
      glass.style.backgroundSize =
        img.width * zoom + "px " + img.height * zoom + "px";
      let bw = 6;
      let w = glass.offsetWidth / 2;
      let h = glass.offsetHeight / 2;

      /* Execute a function when someone moves the magnifier glass over the img: */
      glass.addEventListener("mousemove", moveMagnifier);
      img.addEventListener("mousemove", moveMagnifier);

      /*and also for touch screens:*/
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

        glass.style.left = cursorX + "px";
        glass.style.top = cursorY + pixelsScrolled + "px";

        glass.style.backgroundPosition = `-${x * zoom - w + bw}px -${
          y * zoom - h + bw
        }px`;
      }
    };

    // 虫眼鏡のカーソルからの絶対位置決定用
    const getCursorPos = (e) => {
      let x, y;
      e = e || window.event;
      if (e.type === "touchmove") {
        // Handle touch events
        const touch = e.touches[0];
        const a = img.getBoundingClientRect();
        x = touch.pageX - a.left - window.pageXOffset;
        y = touch.pageY - a.top - window.pageYOffset;
      } else {
        // Handle mouse events
        const a = img.getBoundingClientRect();
        x = e.pageX - a.left - window.pageXOffset;
        y = e.pageY - a.top - window.pageYOffset;
      }
      return { x: x, y: y };
    };

    // Use canvas to draw the image
    //画像選択時の描画用？これ無効化したら画像の描画はできるけど色の抽出ができてないっぽい。
    const useCanvas = (el, img, callback) => {
      el.width = img.width;
      el.height = img.height;
      el.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
      return callback();
    };

    // 画像からカーソルが外れた時に虫眼鏡を外す用の処理？
    const closeEyeDropper = () => {
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

    // Generate a random ID for a color
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

    /////////////////////////////////////////////////////////////////////
    // 画像内でクリックした時に実際に実行される処理。色の取得などが行われる。
    const pickColor = () => {
      colors.innerHTML = "";

      let colorObj = {
        id: generateID(),
        // rgbも選べるバージョン
        //colorCode: colorFormat == "HEX" ? hex : rgb
        colorCode: hex
      };
      // colorsArr.push(colorObj);

      // displayColor();

      console.log(colorObj.colorCode);
      // selected-iro-boxに色を反映させる用の処理を記載したい。
      document.getElementById('selected-iro-box').style.background = colorObj.colorCode;
      document.getElementById('selected-iro-mini-box').style.background = colorObj.colorCode;
      document.getElementById('selected-iro').textContent = colorObj.colorCode;
    };

    ///////////////////////////////////////////////////////////////////////


    // Display the color palette
    // const displayColor = () => {
    //   colors.innerHTML = "";

    //   colorsArr.map((obj) => {
    //     const colorContainer = document.createElement("div");
    //     colorContainer.className = "color";

    //     // Create the top section with class "color-top"
    //     const topSection = document.createElement("div");
    //     topSection.className = "color-top";

    //     // Create an image element for the "remove" icon
    //     const removeIcon = document.createElement("img");
    //     removeIcon.src = "./assets/remove.svg";
    //     removeIcon.alt = "remove";
    //     removeIcon.className = "remove-icon";
    //     removeIcon.id = obj.id;

    //     topSection.appendChild(removeIcon);

    //     // Create the bottom section with class "color-bottom"
    //     const bottomSection = document.createElement("div");
    //     bottomSection.className = "color-bottom";

    //     // Create a div with class "preview"
    //     const previewDiv = document.createElement("div");
    //     previewDiv.className = "preview";
    //     previewDiv.style.backgroundColor = obj.colorCode;

    //     bottomSection.appendChild(previewDiv);

    //     // Create a div with class "code"
    //     const codeDiv = document.createElement("div");
    //     codeDiv.className = "code";

    //     // Create a paragraph with the color code
    //     const colorCode = document.createElement("p");
    //     colorCode.textContent = obj.colorCode;
    //     codeDiv.appendChild(colorCode);

    //     // Create an image element for the "copy" icon
    //     const copyIcon = document.createElement("img");
    //     copyIcon.src = "https://image-color-picker.css3.com/assets/copy.svg";
    //     copyIcon.alt = "copy";
    //     copyIcon.className = "copy-icon";
    //     codeDiv.appendChild(copyIcon);

    //     bottomSection.appendChild(codeDiv);

    //     // Add the sections to the outer container
    //     colorContainer.appendChild(topSection);
    //     colorContainer.appendChild(bottomSection);

    //     // Append the entire structure to the document
    //     colors.appendChild(colorContainer);
    //   });

    //   // Attach events to newly created remove and copy icons
    //   removeIcon = document.querySelectorAll(".remove-icon");
    //   copyIcon = document.querySelectorAll(".copy-icon");
    //   removeIcon.forEach((element) => {
    //     element.addEventListener("click", removeColor);
    //   });
    //   copyIcon.forEach((element) => {
    //     element.addEventListener("click", copyColor);
    //   });
    // };

    // Remove a color from the palette
    const removeColor = (e) => {
      let id = e.target.id;
      let newColorsArr = colorsArr.filter(function (obj) {
        return obj.id !== id;
      });
      colorsArr = newColorsArr;
      displayColor();
    };

    // Copy a color code to the clipboard
    const copyColor = (e) => {
      let paragraph = e.target.parentElement.children[0];
      let colorCode = paragraph.innerHTML;
      navigator.clipboard.writeText(paragraph.innerHTML).then(() => {
        paragraph.innerHTML = "Copied!";
      });

      setTimeout(() => {
        paragraph.innerHTML = colorCode;
      }, 5000);
    };

    // Handle color format change
    const handleColorFormat = (e) => {
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

    // HEXコードとRGB値のフォーマット変更用
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

    // Remove all colors from the palette
    const removeColors = () => {
      colorsArr = [];
      displayColor();
    };

    // Initialize the code
    initialCode();



  }
});