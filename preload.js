(function(glob){
	// Require libs
	const fs = require('fs');
	const path = require('path');
	
	/*
	 | Helper: save captcha image
	 */
	function writeImgDataBase64ToFile(dataURL) {
		let data = dataURL.split(',');
		let ext = (data[0].match(/jpe?g|png/) || [])[0];
		let filename = path.join(__dirname, ('./datac/' + Date.now().toString() + '.' + ext));
		let buf = Buffer.from(data[1], 'base64');
		// write file
		fs.writeFile(filename, buf, function(err){
			if (err) {
				return console.log('write file failed: ', err);
			}
			//
			console.log('write file OK');
			let win = window.open('./croppie/index.html?imgsrc=' + filename, 'captcha splitter');
			let timer = setInterval(function(){
				if (win.closed) {
					return clearInterval(timer);
				}
				try {
					let hash = decodeURIComponent(((win.location + '').match(/#(.*)$/) || [])[1]);
					hash = JSON.parse(hash);
					if ('done' == (hash && hash.type)) {
						//
						console.log(hash);
						//
						win.close();
					}
				} catch (e) {
					//...
					console.log(e);
				}
			}, 2000);
		});
	}
	
	/*
	 | Helper: get image data
	 | @see https://davidwalsh.name/convert-image-data-uri-javascript
	 | @see https://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-in-javascript
	 */
	function getImgDataBase64(img, callback) {
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
	glob.getImgDataBase64 = getImgDataBase64;
	
	// Load, get captcha image data
	window.addEventListener('load', function(){
		let img = document.querySelector('img');
		if (!img) {
			return console.log('Captcha image not found!');
		}
		getImgDataBase64(img, writeImgDataBase64ToFile);
	});
})(window);