<?php

function gteCaptchaImage(array $opts = array()) {
	$url = 'https://worktime.evolable.asia/ewt_users/captcha_image/';
	$contents = file_get_contents($url);
	if ($opts['base64']) {
		return base64_encode($contents);
	}
	header('content-type:image/jpeg');
	return $contents;
}