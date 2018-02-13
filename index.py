import os
from PIL import Image as Img, ImageFilter  as ImgFilter

RGB_WHITE = 255

def img_char_only(filename, save_filename=None):
    img = Img.open(filename).convert('L')
    mincolor, maxcolor = img.getextrema()
    for w in range(img.width):
        for h in range(img.height):
            color = img.getpixel((w, h))
            if color > mincolor:
                img.putpixel((w, h), RGB_WHITE)
    #endfor
    #
    if save_filename is not None:
        img.save(save_filename)
    return img
#end

#
#
#
if not os.path.isdir('./datac'):
    os.mkdir('./datac')

#
#
#
dircnt = 0
datadirname = './data/'
datacdirname = './datac/'
lsdir = os.listdir(datadirname)
for imgfile in lsdir:
    if imgfile.endswith('.jpg'):        
        filename = datadirname + imgfile
        filenamec = datacdirname + imgfile
        if os.path.isfile(filenamec):
            continue
        print filename
        img_char_only(filename, filenamec)
        dircnt += 1
        # if dircnt > 100:
            # break
#endif
