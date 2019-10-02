from xml.dom import minidom, Node
import numpy

from structure import EmoticonStructure
from normalizer import normalize_svg

def main():
    node = minidom.parse('faces/face_000.svg')
    normalize_svg(node)
    emoticon = EmoticonStructure(node)

    base = emoticon.get_params()
    print(base)
    print(emoticon.node.toprettyxml())

    emoticon.writexml("gen/test.svg")



if __name__ == "__main__":
    main()
