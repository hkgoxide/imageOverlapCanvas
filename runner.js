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
		//Get canvas
		var canvas = document.getElementById('myCanvas');
		var context = canvas.getContext('2d');
		//Resize canvas to image size
		context.canvas.width = image.width;
		context.canvas.height = image.height;
		//Edit the image
		 var x = 0, y = 0;

		    // Draw the image on canvas.
		    context.drawImage(this, x, y);

		    // Get the pixels.
		    var imgd = context.getImageData(x, y, this.width, this.height);
		    var pix = imgd.data;

		    // Loop over each pixel and invert the color.
		    for (var i = 0, n = pix.length; i < n; i += 4) {
		      pix[i  ] = 255 - pix[i  ]; // red
		      pix[i+1] = 255 - pix[i+1]; // green
		      pix[i+2] = 255 - pix[i+2]; // blue
		      // i+3 is alpha (the fourth element)
		    }

		    // Draw the ImageData object.
		    context.putImageData(imgd, x, y);
// 		var data = context.getImageData(x, y, 1, 1).data;
// 		var color = new Color([data[0], data[1], data[2]]);
// 		context.drawImage(image,0,0,imageWidth,imageHeight);
	  }
  
  	image.src=img;
}

/*
Input an image object
*/
function lab2rgb(img,callback){
	
	if(callback){
		callback();
	}
}
