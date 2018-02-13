<?php
$act = trim($_GET['act']);
//
require('helpers.php');
//
switch ($act) {
	case 'captcha_image': {
		die(gteCaptchaImage());
	}
	case 'store': {
		$img = trim($_POST['data']);
		$data = array_pop(explode(',', $img));
		$data = base64_decode($data);
		$filename = __DIR__ . '/data/' . trim(microtime(true)) . '.jpg';
		@file_put_contents($filename, $data);
		die($filename);
	}
}
?>
<!DOCTYPE html> 
<html lang ="en">
    <head>
        <meta charset="UTF-8" >
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>AI</title>
		<link rel="stylesheet" href="croppie.css" />
		<script src="http://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
		<script src="croppie.js"></script>
		<style>
			#captcha-wrapper {
				float: left;
			}
		</style>
    </head>
    <body>
		<div id="captcha-wrapper">
			<div id="captcha"></div>
			<button id="get-captcha">get</button>
		</div>
		<div id="img-holder"></div>
		<script>
			var transforms = [
				'translate3d(220px, 1px, 0px) scale(1)',
				'translate3d(118px, 1px, 0px) scale(1)',
				'translate3d(18px, 1px, 0px) scale(1)',
				'translate3d(-82px, 1px, 0px) scale(1)',
				'translate3d(-182px, 1px, 0px) scale(1)'
			];
			var $captcha = $('#captcha');
			var vanilla = new Croppie($captcha.get(0), {
				viewport: { width: 30, height: 30 },
				boundary: { width: 500, height: 60 },
				showZoomer: false,
				// enableOrientation: true
			});
			var $getCaptcha =  $('#get-captcha').click(function() {
				vanilla.bind({ url: '?act=captcha_image&rN=' + Date.now() }).then(function(){
					var i = 0;
					function crop() {
						var transform = transforms[i++];
						if (!transform) {
							return setTimeout(function(){
								$getCaptcha.click();
							}, 5 * 1000);
						}
						var $img = $captcha.find('img').css('transform', transform);
						vanilla.result('base64').then(function(data) {
							// $('<div />').html($('<img />').attr('src', data)).appendTo('#img-holder'); crop();
							jQuery.post('?act=store', { data: data }, function(){
								crop();	
							});
						});	
					}
					crop();
				});
			});
		</script>
    </body>
</html>
