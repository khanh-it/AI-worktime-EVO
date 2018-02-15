(function(glob){
	// Require libs
	const fs = require('fs');
	
	/*
	 | Helper: save captcha image
	 */
	function imgBase64ToFile(dataURL, filename) {
		let data = dataURL.split(',');
		let ext = (data[0].match(/jpe?g|png/) || [])[0];
		let b64string = data[1];
		filename = filename || ('./datac/' + Date.now().toString() + '.' + ext);
		let buf = Buffer.from(b64string, 'base64');
		console.log('filename: ', filename);
		console.log('buf: ', buf);
		fs.writeFile(filename, buf, function(err){
			if (err) {
				return console.log('write file failed: ', err);
			}
			console.log('write file OK');
			//
			let win = window.open('./captcha.html?filename=' + filename, 'captcha splitter');
			
		});
	}
	
	/*
	 | Helper: get image data
	 | @see https://davidwalsh.name/convert-image-data-uri-javascript
	 | @see https://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-in-javascript
	 */
	function getBase64Image(img, callback) {
		// Dealing with cross domain images
		img.crossOrigin = 'anonymous';
		
		function imgOnload() {
			// Create an empty canvas element
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;

			// Copy the image contents to the canvas
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			// Get the data-URL formatted image
			// Firefox supports PNG and JPEG. You could check img.src to
			// guess the original format, but be aware the using "image/jpg"
			// will re-encode the image.
			var dataURL = canvas.toDataURL("image/png");
			// dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
			callback(dataURL);
			// Return?
			return dataURL;
		}
		// Case: image is loaded
		if (img.naturalWidth) {
			imgOnload();
		// Case: image is not loaded
		} else {
			img.onload = imgOnload;
		}
	}
	// Re assign!
	glob.getBase64Image = getBase64Image;
	
	//
	window.addEventListener('load', function(){
		let img = document.querySelector('img');
		getBase64Image(img, function(dataURL){
			imgBase64ToFile(dataURL);
		});
	});
})(window);