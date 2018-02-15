from __future__ import print_function
import os
import json
from PIL import Image as Img, ImageFilter  as ImgFilter

COLOR_WHITE = 255

def img_char_only(filename, save_filename=None, save_mode='bmp', debug=False):
    ''' Filter input image for character only! '''
    img = Img.open(filename).convert('L')
    mincolor, maxcolor = img.getextrema()
    for w in range(img.width):
        for h in range(img.height):
            color = img.getpixel((w, h))
            if color > mincolor:
                img.putpixel((w, h), COLOR_WHITE)
    #endfor
    # Save image?
    if save_filename is not None:
        img.save(save_filename + '.bmp', save_mode)
    # Return
    return img
#enddef

def img_to_trained_json(filename, debug=False):
    '''  '''
    pixels = {}
    img = filename if isinstance(filename, Img.Image) else Img.open(filename)
    # mincolor, maxcolor = img.getextrema()
    if debug: print(filename)
    for y in range(img.width):
        if debug: print('[', end='')
        for x in range(img.height):
            color = img.getpixel((x, y))
            if debug: print('0' if color == COLOR_WHITE else '#', end='')
            if color != COLOR_WHITE:
                pixels['%s:%s' % (x, y)] = color
            #endif
        #endfor
        if debug: print(']')
    #endfor
    return pixels
#end

def make_trained_data(datadir='./data/tranning/', trained_filename = './data/trained.json', debug=False, jsonpindent=2):
    ''' Read all tranning images and make trained data! '''
    trained_data = {}
    lsdir = os.listdir(datadir)
    for childir in lsdir:
        if childir.isalpha():
            cdatadir = datadir + childir + '/'
            # 
            clsdir = os.listdir(cdatadir)
            if debug: print(clsdir)
            for imgfile in clsdir:
                if imgfile.endswith('.png') or imgfile.endswith('.bmp'):
                    filename = cdatadir + imgfile
                    pixels = img_to_trained_json(filename, debug)
                    trained_data.setdefault(childir, [])
                    trained_data[childir].append(pixels)
                #endif
            #endfor:
        #endif
    #endfor
    # print(trained_data_json)
    # write result to file
    trained_data_json = json.dumps(trained_data, indent=jsonpindent)
    trained_file = open(trained_filename, "w")
    trained_file.write(trained_data_json)
    trained_file.close()
    # Return
    return trained_data
#enddef

def get_trained_data(trained_filename = './data/trained.json', char=None):
    ''' Get trained data  '''
    try:
        with open(trained_filename, 'r') as content_file:
            content = content_file.read()
            content = json.loads(content)
            content = content.get(char) if char else content
            return content
    except:
        return {}
#enddef

def ocr_pixels_cmp(from_pixels, to_pixels):
    total = len(from_pixels)
    total2 = len(to_pixels)
    color_cnt = 0
    for key in from_pixels:
        color = to_pixels.get(key)
        if color is not None:
            color_cnt += 1
        #endif
    #endfor
    percent_1 = float(color_cnt) / float(total)
    percent_2 = 0.1 * (float(color_cnt) / float(total2))
    rank = percent_1 + percent_2
    return (
        color_cnt
        , total
        , percent_1
        , total2
        , percent_2
        , rank
    )
#enddef
        
def ocr(filename, char=None, debug=False):
    img = img_char_only(filename, debug=debug)
    pixels = img_to_trained_json(img, debug=False)
    #
    trained_data = get_trained_data(char=None)
    # print(pixels)
    cnt_max_by_char = (0, 0, 0.0, '')
    for char in trained_data:
        if debug: print('----- %s ----- ' % (char))
        cnt_max = (0, 0, 0.0)
        for data in trained_data[char]:
            pixcels_cmp = ocr_pixels_cmp(pixels, data)
            ''' if pixcels_cmp[2] >= 0.65 or pixcels_cmp[4] >= 0.65:
                # print('char: ' + char)
                # print(pixcels_cmp)
                # print('char: ' + char, pixcels_cmp[2] + pixcels_cmp_rvt[2]) '''
            if debug: print(pixcels_cmp)
            if pixcels_cmp[0] > cnt_max[0]:
                cnt_max = pixcels_cmp
        #endfor
        if debug: print('----- end#%s ----- ' % (char))
        if cnt_max[0] > cnt_max_by_char[0]:
            cnt_max_by_char = cnt_max + (char,)
    #endfor
    img.show()
    return cnt_max_by_char
#endif
