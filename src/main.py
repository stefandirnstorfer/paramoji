from xml.dom import minidom, Node
import numpy

from structure import EmoticonStructure
from normalizer import normalize_svg
from js_exporter import js_export, js_export2

def main():
    node = minidom.parse('faces/face_000.svg')
    normalize_svg(node)
    emoticon = EmoticonStructure(node)

    ticks = [-1.0, 0.0, 1.0]
    X = numpy.stack(numpy.meshgrid(ticks, ticks, ticks), -1).reshape(-1, 3)
    Y = numpy.array([load_parameters(emoticon, c) for c in X])

    B = numpy.array([X.shape[0]*[1], X[:,0], X[:,1], X[:,2], X[:,0]*X[:,1], X[:,0]*X[:,2], X[:,1]*X[:,2], X[:,0]**2, X[:,1]**2, X[:,2]**2]).T
    x = numpy.linalg.lstsq(B, Y, rcond=None)

    Y2 = numpy.matmul(B, x[0])
    e = (numpy.mean((Y2-Y) ** 2, axis=1))
    error_by_face = numpy.concatenate((X, numpy.matrix(e).T),1)
    print(error_by_face)

    js_export(emoticon, Y.T, "gen/emoticon.js")
    js_export2(emoticon, x[0].T, "gen/emoticon2.js")

def load_parameters(base, coord):
    code = "".join([["-","0","+"][int(c + 1)] for c in coord])
    file = "faces/face_" + code + ".svg"
    node = minidom.parse(file)
    normalize_svg(node)
    return base.get_params(node)


if __name__ == "__main__":
    main()
