function previewFile() {
  var preview = document.querySelector('img');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    //preview.src = reader.result;
    drawFile(reader.result);
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

/*
Input an image data object
*/
function rgb2lab(img,callback){
	var r1 = [[0.3811,0.5783,0.0402],[0.1967,0.7244,0.0782],[0.0241,0.1288,0.8444]];
	var r2 = [[0.5774,0.5774,0.5774],[0.4082,0.4082,-0.8165],[0.7071,-0.7071,0]];
	var img_lms = [[],[],[]];
	var img_lab = [[],[],[]];
	var img_rgb = [[],[],[]];
	for (var i=0,n=img.length; i < n; i += 4){
		//R
		img_rgb[0].push(img[i]/255);
		//G
		img_rgb[1].push(img[i+1]/255);
		//B
		img_rgb[2].push(img[i+2]/255);
	}
	for(var i = 0, n = img.length; i < n; i += 4){
		//channel log-L
		img_lms[0].push(Math.max(Math.log(r1[0][0]*img_rgb[0][i] + r1[0][1]*img_rgb[1][i] + r1[0][2]*img_rgb[2][i]),1e-25));
		//channel log-M
		img_lms[1].push(Math.max(Math.log(r1[1][0]*img_rgb[0][i] + r1[1][1]*img_rgb[1][i] + r1[1][2]*img_rgb[2][i]),1e-25));
		//Channel log-S
		img_lms[2].push(Math.max(Math.log(r1[2][0]*img_rgb[0][i] + r1[2][1]*img_rgb[1][i] + r1[2][2]*img_rgb[2][i]),1e-25));
		if(i%4000 == 0)
		console.log("tolms",i);
	}
	console.log(img_lms);
	delete img_rgb;
	//To CIE-Lab
	for(var i = 0, n = img_lms[0].length; i < n; i++){
		    img_lab[0].push(r2[0][0]*img_lms[0][i] + r2[0][1]*img_lms[1][i] + r2[0][2]*img_lms[2][i]);
		    img_lab[1].push(r2[1][0]*img_lms[0][i] + r2[1][1]*img_lms[1][i] + r2[1][2]*img_lms[2][i]);
		    img_lab[2].push(r2[2][0]*img_lms[0][i] + r2[2][1]*img_lms[1][i] + r2[2][2]*img_lms[2][i]);
		if(i%4000 == 0)
		console.log("tolab",i);
	}
	console.log(img_lms);
	console.log(img_lab);
	if(callback){
		callback();
	}
	delete img_lms;
	return img_lab;
}
/*1 is source, 2 is target*/
function mergeImg(img_lab1,img_lab2,callback,p){
	var mean_imglab1 = [math.mean(img_lab1[0]),math.mean(img_lab1[1]),math.mean(img_lab1[2])];
	var mean_imglab2 = [math.mean(img_lab2[0]),math.mean(img_lab2[1]),math.mean(img_lab2[2])];
	var std_imglab1 = [math.std(img_lab1[0]),math.std(img_lab1[1]),math.std(img_lab1[2])];
	var std_imglab2 = [math.std(img_lab2[0]),math.std(img_lab2[1]),math.std(img_lab2[2])];
	var img_result=[[],[],[]];
	for (var i = 0, n = mean_imglab1[0].length; i < n; i++){
		img_result[0].push((img_lab1[0][i]-mean_imglab1[0])*(std_imglab2[0]/std_imglab1[0])+mean_imglab2[0]);
		img_result[1].push((img_lab1[1][i]-mean_imglab1[1])*(std_imglab2[1]/std_imglab1[1])+mean_imglab2[1]);
		img_result[2].push((img_lab1[2][i]-mean_imglab1[2])*(std_imglab2[2]/std_imglab1[2])+mean_imglab2[2]);
		if(i%4000 == 0)
		console.log("merge",i);
	}
	if(callback){
		callback(p);
	}
	return img_result;
}

function lab2rgb(img_lab,callback,p){
	var inv_r2 =[[0.5774,0.4082,0.7071],[0.5774,0.4082,-0.7071],[0.5774,-0.8165,0.0000]];
	var inv_r1 =[[4.4687,-3.5887,0.1196],[-1.2197,2.3831,-0.1626],[0.0585,-0.2611,1.2057]];
	var img_lms = [[],[],[]];
	var img_rgb = [[],[],[]];
	var pixd = [];
	for(var i = 0, n = img_lab[0].length; i < n; i++){
		    img_lms[0].push(Math.exp(inv_r2[0][0]*img_lab[0][i] + inv_r2[0][1]*img_lab[1][i] + inv_r2[0][2]*img_lab[2][i]));
		    img_lms[1].push(Math.exp(inv_r2[1][0]*img_lab[0][i] + inv_r2[1][1]*img_lab[1][i] + inv_r2[1][2]*img_lab[2][i]));
		    img_lms[2].push(Math.exp(inv_r2[2][0]*img_lab[0][i] + inv_r2[2][1]*img_lab[1][i] + inv_r2[2][2]*img_lab[2][i]));
		if(i%4000 == 0)
		console.log(i,"tolms");
	}
	for(var i = 0, n = img_lms[0].length; i < n; i++){
		    img_rgb[0].push(inv_r1[0][0]*img_lms[0][i] + inv_r1[0][1]*img_lms[1][i] + inv_r1[0][2]*img_lms[2][i]);
		    img_rgb[1].push(inv_r1[1][0]*img_lms[0][i] + inv_r1[1][1]*img_lms[1][i] + inv_r1[1][2]*img_lms[2][i]);
		    img_rgb[2].push(inv_r1[2][0]*img_lms[0][i] + inv_r1[2][1]*img_lms[1][i] + inv_r1[2][2]*img_lms[2][i]);
		if(i%4000 == 0)
		console.log(i,"torgb")
	}
	for(var i = 0,n=img_lms[0].length; i < n; i++){
		pixd.push(Math.round(img_rgb[0][i]*255));
		pixd.push(Math.round(img_rgb[1][i]*255));
		pixd.push(Math.round(img_rgb[2][i]*255));
		pixd.push(255);
		if(i%4000 == 0)
		console.log(i,"topix");
	}
	if(callback){
		callback(p);
	}
	return pixd;
}

function drawFile(img){
	var image = new Image();
	var srcImage = new Image();
	image.onload = function(){
		//Get canvas
		var canvas = document.getElementById('myCanvas');
		var context = canvas.getContext('2d');
		var srcCanvas = document.getElementById('srcCanvas');
		var srcContext = srcCanvas.getContext('2d');
		//Resize canvas to image size
		context.canvas.width = image.width;
		context.canvas.height = image.height;
		//Edit the image
		var x = 0, y = 0;
		// Draw the image on canvas.
		srcContext.drawImage(srcImage,x,y);
		context.drawImage(this, x, y);
		// Get the pixels.
		var srcimgd = srcContext.getImageData(x,y,srcImage.width,srcImage.height);
		var imgd = context.getImageData(x, y, this.width, this.height);
		var pixsrc = srcimgd.data;
		var pix = imgd.data;
		var result = undefined;
		var img1conv=undefined,img2conv=undefined;
		var reslab = undefined;
		var intervalID1 = setInterval(function(){
			console.log(result,"result");
		    if(result){
			imgd.data = result;
			context.putImageData(imgd, x, y);
			clearInterval(intervalID1);
			return;
		    }			
		},500);
		var intervalID2 = setInterval(function(){
			if(img1conv && img2conv){
				reslab = mergeImg(img1conv,img2conv);
				clearInterval(intervalID2);
			}
		},500);
		var intervalID3 = setInterval(function(){
			if(reslab){
				result = lab2rgb(reslab);
				clearInterval(intervalID3);
			}
		},500);

	img1conv = rgb2lab(pixsrc);
	img2conv = rgb2lab(pix);
	// Draw the ImageData object.
	};
	srcImage.onload= function(){
  		image.src=img;
	};
  	srcImage.src = "source.jpg";
}
