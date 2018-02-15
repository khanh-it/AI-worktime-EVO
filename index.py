import os
from PIL import Image as Img, ImageFilter  as ImgFilter

RGB_WHITE = 255

captcha_filename = './datac/1518620339510.png'

captcha = Img.open(captcha_filename)

pos = [# (left, upper, right, lower)
		(left, upper, right, lower),
		# (left, upper, left + 34, upper + 34),
		# (left, upper, right, lower),
		# (left, upper, right, lower),
		# (left, upper, right, lower)
	]

# img1 = captcha.crop((left, upper, right, lower))