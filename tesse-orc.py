from PIL import Image
from pytesseract import image_to_string

''' img1 = Image.open('./datac/1517380259.5263.jpg')
img2 = Image.open('./datac/1517380348.701.jpg')
print 'txt1: ' + image_to_string(img1)
print 'txt2: ' + image_to_string(img2, lang='eng') '''

#
#
#
dircnt = 0
datacdirname = './datac/'
lsdir = os.listdir(datacdirname)
for imgfile in lsdir:
    if imgfile.endswith('.jpg'):        
        filenamec = datacdirname + imgfile
        if os.path.isfile(filenamec):
            img1 = Image.open('./datac/1517380259.5263.jpg')
            print 'txt ' + image_to_string(img1)
        
#endif

