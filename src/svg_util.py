import re
import numpy
from xml.dom import Node
from math import sin, cos, pi

def identiy_matrix():
    return [[1.0, 0.0, 0.0],[0.0, 1.0, 0.0],[0.0, 0.0, 1.0]]

def parse_svg_matrix(text):
    TRANSLATE_PATTERN = r"translate\(([^,]*),([^)]*)\)"
    SCALE2_PATTERN = r"scale\(([^,]*)(,[^)]*)?\)"
    ROTATE_PATTERN = r"rotate\(([^,]*)\)"
    MATRIX_PATTERN = r"matrix\(([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^)]*)\)"

    if not text:
        return identiy_matrix()

    m = re.match(TRANSLATE_PATTERN, text)
    if m:
        v = [float(x) for x in list(m.groups())]
        return numpy.array([[1.0, 0.0, v[0]], [0.0, 1.0, v[1]],[0.0, 0.0, 1.0]])

    m = re.match(SCALE2_PATTERN, text)
    if m:
        v0 = float(m.group(1))
        v1 = float(m.groups()[m.lastindex - 1].replace(",", ""))
        return numpy.array([[v0, 0.0, 0.0],[0.0, v1, 0.0],[0.0, 0.0, 1.0]])

    m = re.match(ROTATE_PATTERN, text)
    if m:
        v = [float(x) for x in list(m.groups())]
        rad = v[0] * pi / 180
        return numpy.array([[cos(rad), -sin(rad), 0.0], [sin(rad), cos(rad), 0.0],[0.0, 0.0, 1.0]])

    m = re.match(MATRIX_PATTERN, text)
    if m:
        v = [float(x) for x in list(m.groups())]
        return numpy.array([[v[0], v[2], v[4]],[v[1], v[3], v[5]],[0.0, 0.0, 1.0]])

    raise Exception("Unknown transform pattern: " + text)


def format_matrix(mat):
    return "matrix(%1.3f,%1.3f,%1.3f,%1.3f,%1.3f,%1.3f)" % (mat[0,0], mat[1,0], mat[0,1], mat[1,1], mat[0,2], mat[1,2])


def node_list(node, nodes):
    if node.nodeType == Node.ELEMENT_NODE:
        node_id = node.getAttribute('id')
        if node_id:
            nodes.append(node)
        for child in node.childNodes:
            node_list(child, nodes)
    return nodes
