set -e

# Create parametric emoji
PARAMS=$(cat *.tex | \
   grep "paramoji{" | \
   sed -e s"/.*paramoji{\([^}]*\)}.*/\1/" | \
   sort -u)

for PARAM in $PARAMS
do
FILE=gen/emoticon-$PARAM.pdf
if [ ! -e $FILE ]; then
echo Processing parametric emoji with params=$PARAM
mkdir -p gen
node << EOF | inkscape --pipe --export-filename=$FILE
const emoji = require('./emoticon.js')
console.log(emoji.emoticon_svg(${PARAM}))
EOF
fi
done

# Create unicode emoji based on noto font
NOTO_PATH=../../noto-emoji/svg
PARAMS=$(cat *.tex | \
   grep "notomoji{" | \
   sed -e s"/.*notomoji{\([^}]*\)}.*/\1/" | \
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


if [ ! -e gen/emojito.pdf ]; then
inkscape emojito.svg --export-filename=gen/emojito.pdf
fi
