set -e

# Create parametric emoji
PARAMS=$(cat *.tex | \
   grep "paramoji{" | \
   sed -e s"/.*paramoji{\([^}]*\)}.*/\1/" | \
   sort -u)

# Parametric emoji
for PARAM in $PARAMS
do
FILE=gen/emoticon-$PARAM.pdf
if [ ! -e $FILE ]; then
echo Processing parametric emoji with params=$PARAM
mkdir -p gen
node << EOF | inkscape --pipe --export-filename=$FILE
  const emoji = require('./emoticon.js')
  const gold="gold"
  console.log(emoji.emoticon_svg(${PARAM})
    .replace(/svg/, 'svg xmlns:xlink="http://www.w3.org/1999/xlink"')
    .replace(/ href=/g, ' xlink:href='))
EOF
fi
done

# Create unicode emoji based on noto font
NOTO_PATH=../../noto-emoji/svg
PARAMS=$(cat *.tex | \
   egrep "notomoji(Large)?{" | \
   sed -e s"/.*{\([^}]*\)}.*/\1/" | \
   sort -u)

for PARAM in $PARAMS
do
FILE=gen/emoticon-u$PARAM.pdf
if [ ! -e $FILE ]; then
  echo Processing noto emoji with params=$PARAM
  mkdir -p gen
  inkscape $NOTO_PATH/emoji_u$PARAM.svg --export-filename=$FILE
fi
done


# Screens
if [ ! -e gen/emojito.pdf ]; then
  inkscape img/emojito.svg --export-filename=gen/emojito.pdf
fi
if [ ! -e gen/encode.pdf ]; then
  inkscape img/encode.png --export-filename=gen/encode.pdf
fi
if [ ! -e gen/decode.pdf ]; then
  inkscape img/decode.png --export-filename=gen/decode.pdf
fi


# Faces
IMG_PATH=../../emoticon-data
PARAMS=$(cat *.tex | \
   egrep "face?{" | \
   sed -e s"/.*{\([^}]*\)}.*/\1/")

for PARAM in $PARAMS
do
#if [ ! -e $FILE ]; then
  echo Processing face $PARAM
  mkdir -p gen/$(dirname $PARAM)
  convert $IMG_PATH/$PARAM.jpg gen/$PARAM.pdf
#fi
done
