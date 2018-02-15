from __future__ import print_function
import os
from PIL import Image as Img, ImageFilter  as ImgFilter
#
from helpers import *

'''
imgsrc = '../datatest/1518674785731'
for i in range(1):
    imgfile = imgsrc + '-' + str(i) + '.png'
    print(imgfile)
    img_char_only(imgfile).show()
#endfor
'''

# make_trained_data(debug=False)
# print(type(get_trained_data()))

# 1518690249480-4.png
# 1518690265897-1.png
# 1518690275504-0.png
# 18690281847-1.png

imgsrcd = '../datac/1518690302428'
imgsrcs = [
    imgsrcd + '-0.png',
    imgsrcd + '-1.png',
    imgsrcd + '-2.png',
    imgsrcd + '-3.png',
    imgsrcd + '-4.png'
]
for imgsrc in imgsrcs:
    print(ocr(imgsrc, debug=False))
#endfor
