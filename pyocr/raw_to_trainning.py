from __future__ import print_function
import os
from PIL import Image as Img, ImageFilter  as ImgFilter
from helpers import *

COLOR_WHITE = 255

def print_img_char(img):
    mincolor, maxcolor = img.getextrema()
    print(mincolor, maxcolor)
    for y in range(img.width):
        print('[', end='')
        for x in range(img.height):
            color = img.getpixel((x, y))
            # print(color)
            # continue
            print('0' if color == COLOR_WHITE else '#', end='')
            #endif
        #endfor
        print(']')
    #endfor
    return img
#end

#
#
#
dircnt = 0
data_raw_dirname = './data/raw/trainning02/'
data_trainning_dirname = './data/trainning-tmp/'

cnt = 0
lsdir = os.listdir(data_raw_dirname)
for imgfile in lsdir:
    if imgfile.endswith('.jpg'):
        filename = data_raw_dirname + imgfile
        img = img_char_only(filename)
        ocr_stats = ocr(img)
        char = ocr_stats[len(ocr_stats) - 1]
        data_trainning_dirname_child = data_trainning_dirname + char + '/'
        if not os.path.isdir(data_trainning_dirname_child):
            os.mkdir(data_trainning_dirname_child)
        #endif
        filenamenew = data_trainning_dirname_child + imgfile + '.bmp'
        if os.path.isfile(filenamenew):
            continue
        img.save(filenamenew)
        print(cnt, filenamenew)
        cnt += 1
#endif
