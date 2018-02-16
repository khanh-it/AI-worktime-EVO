from __future__ import print_function
import os
import sys
from PIL import Image as Img, ImageFilter  as ImgFilter
#
from helpers import *

def pyocr(imgfile):
    ''' Python OCR  '''
    # print(sys.argv, imgfile, os.path.isfile(imgfile))
    #
    if not os.path.isfile(imgfile):
        raise 'Image filename not found!'
    #
    imgfile_ext = imgfile.split('.').pop().lower()
    imgfile = imgfile.replace('.' + imgfile_ext, '')
    if not (imgfile_ext == 'png' or imgfile_ext == 'bmp'):
        raise 'Image filename extension must be .png or .bmp!'
    #
    chars = ''
    for i in range(5):
        imgsrc = '%s-%s.%s' % (imgfile, i, imgfile_ext)
        char = ocr(imgsrc, debug=None, show_img=False)
        chars += char[len(char) - 1]
    #endfor
    return chars
#endef

#
print(pyocr(sys.argv[1] if len(sys.argv[1]) >= 1 else ''))

'''
# make_trained_data(debug=False)
# exit(0)
# print(type(get_trained_data()))

# 1518690256410-4.png
# 1518690265897-2.png
# 1518690265897-3.png
# 1518690298130-1.png
# 1518690302428-0.png

imgsrcd = '../datac/'
imgsrcs = [
    # imgsrcd + '-0.png',
    # imgsrcd + '-1.png',
    # imgsrcd + '-2.png',
    # imgsrcd + '-3.png',
    # imgsrcd + '-4.png'
]
#
for imgfile in os.listdir(imgsrcd):
    if imgfile.endswith('.png') or imgfile.endswith('.bmp'):
        imgsrcs.append(imgsrcd + imgfile)
#endfor

#   
for imgsrc in imgsrcs:
    char = ocr(imgsrc, debug=None, show_img=True)
    print('char found: ', char)
#endfor
'''
