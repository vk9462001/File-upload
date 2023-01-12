const inputFile = document.getElementById("file");
const selectImage = document.querySelector(".select-image");
const imgArea = document.querySelector(".img-area");
const download = document.querySelector(".download");

const formdata = new FormData();

let imgg;

imgArea.addEventListener("click", () => {
  inputFile.click();
});

inputFile.addEventListener("change", function () {
  const image = this.files[0];
  const fileType = image["type"];
  const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
  if (!validImageTypes.includes(fileType)) {
    alert("Not a image file!");
  } else {
    if (image.size < 2000000) {
      formdata.append("ufile", image);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        const allImg = imgArea.querySelectorAll("img");
        allImg.forEach((item) => item.remove());
        const imgUrl = reader.result;
        const img = document.createElement("img");
        imgg = img;
        img.src = imgUrl;
        imgArea.appendChild(img);
        imgArea.classList.add("active");
        imgArea.dataset.img = image.name;
      };
    } else {
      alert("Image size is more than 2mb!");
    }
  }
});

selectImage.addEventListener("click", () => {
  let flag = 0;
  let flag2 = 0;
  fetch("/", {
    method: "post",
    body: formdata,
  })
    .then((response) => {
      if (response.status == 400) {
        flag = 1;
      }
      if (response.status == 500) {
        flag2 = 1;
      }
      return response.json();
    })
    .then((data) => {
      if (flag) {
        alert(data.message);
      }
      if (flag2) {
        alert("Internal Server Error!");
        console.log(data);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  imgg.style.filter = "grayscale(100%)";
  selectImage.style.display = "none";
  download.style.display = "block";
  imgArea.style.pointerEvents = "none";
});
