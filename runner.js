function previewFile() {
  var preview = document.querySelector('img');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
    drawFile(reader.result);
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function drawFile(img){
	var image = new Image();
  image.onload = function(){
  	var canvas = document.getElementById('myCanvas');
  	var context = canvas.getContext('2d');
  	var imageWidth = image.width;
  	var imageHeight = image.height;
    console.log(image.width,image.height);
  	context.drawImage(image,0,0,imageWidth,imageHeight);
  }
  
  	image.src=img;
}
