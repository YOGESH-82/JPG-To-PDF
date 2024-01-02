 async function convertToPDF() {
        const fileInput = document.getElementById("fileInput");
        const output = document.getElementById("output");
        const downloadLink = document.getElementById("downloadLink");

        if (fileInput.files.length === 0) {
          output.textContent = "Please select an image file.";
          output.style.color = "red";
          return;
        }
        const file = fileInput.files[0];
        if (file.type !== "image/jpeg") {
          output.textContent = "Please select a JPG image.";
          output.style.color = "red";
          return;
        }
        const reader = new FileReader();
        reader.onload = async function (event) {
          const imgData = event.target.result;
          const img = new Image();
          img.src = imgData;
          img.onload = async function () {
            const pdfDoc = await PDFLib.PDFDocument.create();
            const page = pdfDoc.addPage([img.width, img.height]);
            const jpgImage = await pdfDoc.embedJpg(imgData);
            const { width, height } = jpgImage.scale(1);
            page.drawImage(jpgImage, {
              x: 0,
              y: 0,
              width: width,
              height: height,
            });
            const pdfBytes = await pdfDoc.save();
            const pdfOutput = URL.createObjectURL(
              new Blob([pdfBytes], { type: "application/pdf" })
            );
            downloadLink.href = pdfOutput;
            downloadLink.style.display = "block";
            output.textContent = "Image converted to PDF!";
            output.style.color = "green";
          };
        };
        reader.readAsDataURL(file);

        downloadLink.classList.add("shake");
      }
