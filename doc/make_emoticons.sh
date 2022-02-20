set -e

# Create parametric emoji
PARAMS=$(cat *.tex | \
   grep "paramoji{" | \
   sed -e s"/.*paramoji{\([^}]*\)}.*/\1/" | \
   sort -u)

# Parametric emoji
for PARAM in $PARAMS
do
FILE=gen/paramoji-$PARAM.pdf
if [ ! -e $FILE ]; then
echo Processing paramoji with params=$PARAM
mkdir -p gen
node << EOF | inkscape --pipe --export-filename=$FILE
  const emoji = require('./emoticon.js')
  console.log(emoji.emoticon_svg(${PARAM}, 1))
EOF
fi
done

# Create bold paramoji
PARAMS=$(cat *.tex | \
   grep "paramojib{" | \
   sed -e s"/.*paramojib{\([^}]*\)}.*/\1/" | \
   sort -u)

# Parametric emoji
for PARAM in $PARAMS
do
FILE=gen/paramojib-$PARAM.pdf
if [ ! -e $FILE ]; then
echo Processing bold paramoji with params=$PARAM
mkdir -p gen
node << EOF | inkscape --pipe --export-filename=$FILE
  const emoji = require('./emoticon.js')
  console.log(emoji.emoticon_svg(${PARAM},2.5))
EOF
fi
done


# Screens
for IMG in img/*; do
OUT=${IMG/img/gen}
OUT=${OUT/.*/.pdf}
if [ ! -e $OUT ]; then
  echo $IMG $OUT
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
