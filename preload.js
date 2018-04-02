(function(glob){
	// Require libs
	const elt = require('electron');
	// const fs = require('fs');
	// const path = require('path');
	// const { exec } = require('child_process');
	
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}

	//
	let preload = {
		__dirname: __dirname, __filename: __filename,
		elt: elt
	};
	glob.preload = preload;

	// Load, get captcha image data
	glob.addEventListener('load', function(){
		setTimeout(function(){
			let worktimeATag = document.querySelector('li.box_metro.worktime > a');
			if (worktimeATag) {
				worktimeATag.click();
			}
			// Auto close window!
			setTimeout(glob.close, 12 * 1000);
		}, getRandomInt(1, 180)  * 1000);
	});
})(window);