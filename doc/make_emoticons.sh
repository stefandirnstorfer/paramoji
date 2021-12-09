
set -e
PARAMS=$(cat *.tex | \
   grep "emoticon{" | \
   sed -e s"/.*emoticon{\([^}]*\)}.*/\1/" | \
   sort -u)

for PARAM in $PARAMS
do
FILE=gen/emoticon-$PARAM.pdf
if [ ! -e $FILE ]; then
echo Processing emoticon with params=$PARAM
mkdir -p gen
node << EOF | inkscape --pipe --export-filename=$FILE
const emoji = require('./emoticon.js')
console.log(emoji.emoticon_svg(${PARAM}))
EOF
fi
done


if [ ! -e gen/emojito.pdf]; then
inkscape emojito.svg --export-filename=gen/emojito.pdf
fi
