(function(glob){
	// Require libs
	const fs = require('fs');
	const path = require('path');
	
	//
	var imgsrc = (location.search.match('imgsrc=([^&]+)') || [])[1];
	var imgFilenameLetters = [];
	
	/*
	 | Helper: save captcha image
	 */
	function writeImgDataBase64ToFile(dataURL, callback) {
		let data = dataURL.split(',');
		let ext = (data[0].match(/jpe?g|png/) || [])[0];
		// let filename = path.join(__dirname, ('../datac/' + Date.now().toString() + '.' + ext));
		let fileparts = imgsrc.match(/(.*?)\.(jpe?g|png)$/);
		let filename = (fileparts[1] + '-' + imgFilenameLetters.length + '.' + fileparts[2]);
		let buf = Buffer.from(data[1], 'base64');
		// Format callback
		callback = typeof callback == 'function' ? callback : (function(){});
		// write file
		fs.writeFile(filename, buf, function(err){
			return callback(err, filename);
		});
	}
	//
	var transforms = [
		'translate3d(220px, 1px, 0px) scale(1)',
		'translate3d(118px, 1px, 0px) scale(1)',
		'translate3d(18px, 1px, 0px) scale(1)',
		'translate3d(-82px, 1px, 0px) scale(1)',
		'translate3d(-182px, 1px, 0px) scale(1)'
	];
	
	glob.jQuery(function($){
		var $captcha = $('#captcha');
		var vanilla = new Croppie($captcha.get(0), {
			viewport: { width: 30, height: 30 },
			boundary: { width: 500, height: 60 },
			showZoomer: false,
			// enableOrientation: true
		});
		var $getCaptcha =  $('#get-captcha').click(function() {
			vanilla.bind({ url: imgsrc }).then(function(){
				var i = 0;
				function crop() {
					var transform = transforms[i++];
					if (!transform) {
						if (imgFilenameLetters.length) {
							console.log('imgFilenameLetters: ', imgFilenameLetters);
						}
						location.hash = encodeURIComponent(JSON.stringify({
							type: 'done',
							data: imgFilenameLetters
						}));
						return;
					}
					var $img = $captcha.find('img').css('transform', transform);
					vanilla.result('base64').then(function(dataURL) {
						//
						$('<div />').html($('<img />').attr('src', dataURL)).appendTo('#img-holder');
						//
						writeImgDataBase64ToFile(dataURL, function(err, filename){
							//
							if (err) {
								return console.log('write file failed: ', err);
							} else {
								imgFilenameLetters.push(filename);	
							}
							//
							crop();
						});
					});	
				}
				crop();
			});
		});
		// Auto run...
		setTimeout(function(){ $getCaptcha.click(); }, 1 * 0);
	});
})(window);