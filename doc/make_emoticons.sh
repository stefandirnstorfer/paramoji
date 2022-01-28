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

# Screens
for IMG in img/*; do
OUT=${IMG/img/gen}
OUT=${OUT/.*/.pdf}
echo $IMG $OUT
if [ ! -e $OUT ]; then
  inkscape $IMG --export-type=pdf --export-filename=$OUT
fi
done


# Faces
IMG_PATH=../../emoticon-data
PARAMS=$(cat *.tex | \
   egrep "face?{" | \
   sed -e s"/.*{\([^}]*\)}.*/\1/")

for PARAM in $PARAMS
do
if [ ! -e gen/$PARAM.pdf ]; then
  echo Processing face $PARAM
  mkdir -p gen/$(dirname $PARAM)
  convert $IMG_PATH/$PARAM.jpg gen/$PARAM.pdf
fi
done
