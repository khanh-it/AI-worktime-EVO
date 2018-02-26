(function(glob){
	//
	let preload = {
		__dirname: __dirname, __filename: __filename
	};
	glob.preload = preload;

	// Require libs
	const elt = require('electron');
	const fs = require('fs');
	const path = require('path');
	const { exec } = require('child_process');
	
	/**
	 | 
	 */
	function captcha_resolve(filename, callback) {
		let opts = {
			'cwd': path.join(__dirname)
		};
		let proc = exec('python pyocr/index.py "' + filename + '"', opts, function(err, stdout, stderr){
			if (err) {
				return callback(new Error(stderr));
			}
			callback(null, stdout.trim());
		});
	}
	// return captcha_resolve('C:\\Users\\Admin\\Documents\\AI-worktime-EVO\\datac\\1518794674968.png');
	
	/**
	 | Helper: save captcha images
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
			console.log('write file OK: ', filename);
			// let win = window.open(path.join(__dirname, './croppie/index.html') + '?imgsrc=' + filename, 'croppie');
			let win = new elt.remote.BrowserWindow({
				width: 800,
				height: 600,
				webPreferences: {
					preload: path.join(__dirname, './croppie/index.js'),
					nodeIntegration: false
				}
			});
			win.loadURL(path.join(__dirname, './croppie/index.html') + '?imgsrc=' + filename);
			let timer = setInterval(function(){
				if (win.isDestroyed() /* win.closed */) {
					return clearInterval(timer);
				}
				try {
					let hash = decodeURIComponent((/* (win.location + '') */win.getURL().match(/#(.*)$/) || [])[1]);
					hash = JSON.parse(hash);
					if ('done' == (hash && hash.type)) {
						// console.log(hash);
						//
						win.close();
						//
						captcha_resolve(filename, function(err, captcha){
							// Delete captcha file
							let dirdatac = path.join(preload.__dirname, '/datac');
							(fs.readdirSync(dirdatac) || []).forEach(function(fname) {
								if (fname.match(/\.(jpe?g|png|bmp)$/i)) {
									let filename = path.join(dirdatac, fname);
									fs.unlink(filename, function(){});
								}
							});
							// Case: error
							if (err) {
								// Try again.
								return glob.location.reload();
							}
							console.log('captcha: ' + captcha);
							let EwtUserEmailLogin = document.getElementById('EwtUserEmailLogin');
							let EwtUserPasswordLogin = document.getElementById('EwtUserPasswordLogin');
							let EwtUserCaptcha = document.getElementById('EwtUserCaptcha');
							let EwtUserLoginForm = document.getElementById('EwtUserLogin/Form');
							EwtUserEmailLogin.value = "khanhdtp@evolableasia.vn";
							EwtUserPasswordLogin.value = "!@KhanhJa_5288#$";
							EwtUserCaptcha.value = captcha;
							EwtUserLoginForm.submit();
						});
					}
				} catch (e) {
					if (e instanceof SyntaxError) {
						// specific error
					} else {
						throw e; // let others bubble up
					}
				}
			}, 512);
		});
	}
	
	/**
	 | Helper: get image data
	 | @see https://davidwalsh.name/convert-image-data-uri-javascript
	 | @see https://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-in-javascript
	 | @see https://stackoverflow.com/questions/22710627/tainted-canvases-may-not-be-exported
	 */
	function getImgDataBase64(img, callback) {
		// Dealing with cross domain images
		let imgSrc = img.src;
		// img = new Image();
		img.crossOrigin = 'anonymous';
		/* img.onload = */function imgOnload() {
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
		};
		imgOnload();
		// img.src = imgSrc;
	}
	// Re assign!
	glob.getImgDataBase64 = getImgDataBase64;
	
	// Load, get captcha image data
	glob.addEventListener('load', function(){
		let img = document.getElementById('captcha');
		if (!img) {
			console.log('Captcha image not found!');
			glob.close();
		}
		getImgDataBase64(img, writeImgDataBase64ToFile);
	});
})(window);