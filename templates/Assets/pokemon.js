let textInpt = document.querySelector("#txt-inpt");
let fileInpt = document.querySelector("#file-inpt");
let prediction = document.querySelector(".prediction");
let classifyBtn = document.querySelector(".classify-btn");
let fileName = document.querySelector(".file-name");

fileInpt.addEventListener("change", () => {
  let files = fileInpt.files;
  if (files.length) {
    fileName.innerHTML = `${files[0].name}`;
  }
});

let url = "https://techysharnav.herokuapp.com/predictPoke";

let xhr = new XMLHttpRequest();

xhr.open("POST", url, true);
xhr.onerror = function () {
  alert(xhr.responseText);
};
xhr.onload = function (e) {
  if (this.readyState === 4) {
    var response = JSON.parse(this.responseText);
    prediction.innerHTML = `A wild <span style="color: red;">${response.result}</span> appeared.`;
  }
};

classifyBtn.addEventListener("click", async () => {
  if (fileInpt.files.length && textInpt.value) {
    alert("Can't submit both inputs");
  } else if (textInpt.value) {
    if (textInpt.value.includes("data:")) {
      alert("Data URLs are not supported.");
    } else {
      let url2 = url + `?link=${textInpt.value}`;
      let res = await fetch(url2);
      if (res.status == 200) {
        res = await res.json();
        prediction.innerHTML = `A wild <span style="color: red;">${res.result}</span> appeared.`;
      } else alert("Something went wrong.");
    }
  } else if (fileInpt.files.length) {
    let ext = fileInpt.files[0].name.split(".");
    if (ext[1] && ["png", "jpg", "jpeg", "webp"].includes(ext[1])) {
      let formData = new FormData();
      formData.append("file", fileInpt.files[0]);
      xhr.send(formData);
    } else alert("Unsupported File Selected");
  } else alert("No input to classify.");
});

document.querySelector(".clear").addEventListener("click", () => {
  fileInpt.value = "";
  fileName.innerHTML = "";
});
