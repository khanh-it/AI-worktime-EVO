from __future__ import print_function
import os
from PIL import Image as Img, ImageFilter  as ImgFilter

RGB_WHITE = 255

def print_img_char(img):
    mincolor, maxcolor = img.getextrema()
    print(mincolor, maxcolor)
    for y in range(img.width):
        print('[', end='')
        for x in range(img.height):
            color = img.getpixel((x, y))
            # print(color)
            # continue
            print('0' if color == RGB_WHITE else '#', end='')
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
datadirname = './datac/B/'
datanewdirname = datadirname + 'new/'
# if not os.path.isdir(datanewdirname):
#    os.mkdir(datanewdirname)
lsdir = os.listdir(datadirname)
final_img = None
for imgfile in lsdir:
    if imgfile.endswith('.bmp'):
        filename = datadirname + imgfile
        # filenamenew = datanewdirname + imgfile + '.bmp'
        # print(filename)
        img = Img.open(filename)
        # img = print_img_char(img)
        # img.save(filenamenew, 'bmp')
        # img.show()
        if final_img is None:
            final_img = img
            continue
        final_img = Img.blend(final_img, img, 0.5)
        #if dircnt > 1:
        #    break
        dircnt += 1
#endif
print(final_img.getextrema())
print_img_char(final_img)
final_img.show()
