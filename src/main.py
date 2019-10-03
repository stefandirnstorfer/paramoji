from xml.dom import minidom, Node
import numpy

from structure import EmoticonStructure
from normalizer import normalize_svg
from js_exporter import js_export

def main():
    node = minidom.parse('faces/face_000.svg')
    normalize_svg(node)
    emoticon = EmoticonStructure(node)

    print(emoticon.get_params())
    print(emoticon.node.toprettyxml())

    ticks = [0.0, 0.5, 1.0]
    X = numpy.stack(numpy.meshgrid(ticks, ticks, ticks), -1).reshape(-1, 3)
    Y = numpy.array([load_parameters(emoticon, c) for c in X])

    print(X)
    print(Y.shape)

    #emoticon.set_params(numpy.mean(Y, axis=0))
    #emoticon.writexml("gen/test.svg")
    js_export(emoticon, Y.T, "gen/emoticon.js")


def load_parameters(base, coord):
    code = "".join([["-","0","+"][int(2*c)] for c in coord])
    file = "faces/face_" + code + ".svg"
    node = minidom.parse(file)
    normalize_svg(node)
    return base.get_params(node)


if __name__ == "__main__":
    main()
