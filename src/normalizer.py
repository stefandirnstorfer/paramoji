import re
import numpy
from xml.dom import minidom, Node

from svg_util import identiy_matrix, parse_svg_matrix, format_matrix


NUMBER= r"[+-]?[0-9]+(\.[0-9]+)?"
COORD= re.compile("(" + NUMBER + "),(" + NUMBER + ")")
PATHSEG= re.compile("[a-zA-Z]|(" + NUMBER + "),(" + NUMBER + ")")


def normalize_svg(node):
    transform_map = { '' : identiy_matrix()}
    clip_path_ref = {}
    matrix = identiy_matrix()
    remove_inkscape_stuff(node.firstChild, "")
    _find_transforms(node.firstChild, matrix, transform_map, clip_path_ref)
    _apply_transforms(node.firstChild, matrix, transform_map, clip_path_ref)


def _find_transforms(node, matrix, transform_map, clip_path_ref):
    if node.nodeType == Node.ELEMENT_NODE:
        node_id = node.getAttribute("id")
        clip_path = node.getAttribute("clip-path")
        transform = node.getAttribute("transform")

        if transform:
            matrix = numpy.matmul(matrix, parse_svg_matrix(transform))

        if clip_path:
            ref_id = re.match(r"url\(#([^)]*)\)", clip_path).group(1)
            if ref_id in clip_path_ref.keys():
                raise Exception("Duplicate reference to " + ref_id)
            clip_path_ref[ref_id] = matrix

        if node_id:
            transform_map[node_id] = matrix

        children = [c for c in node.childNodes]
        for child in children:
            _find_transforms(child, matrix, transform_map, clip_path_ref)


def _apply_transforms(node, ref_matrix, transform_map, clip_path_ref):
    if node.nodeType == Node.ELEMENT_NODE:
        node_id = node.getAttribute("id")
        morph = node.getAttribute("morph")

        matrix = numpy.matmul(ref_matrix, transform_map[node_id])
        new_ref_matrix = clip_path_ref[node_id] if node_id in clip_path_ref.keys() else identiy_matrix()

        if node.getAttribute("transform"):
            node.removeAttribute("transform")

        if morph in ["transform-only", "relative", "to-circle"]:
            fix_circle(node, matrix)
        elif morph in ["fixed","fix-children"]:
            node.setAttribute("transform", format_matrix(matrix))
        else:
            if node.tagName == "path":
                d = node.getAttribute("d")
                d = normalize_path(d, True, matrix)
                if node_id == "mouth-outline":
                    d = symmetrize_mouth(d)
                node.setAttribute("d", d)
            elif node.tagName == "use":
                ref = node.getAttribute("xlink:href").replace("#","")
                ref_matrix = transform_map.get(ref)
                new_matrix = numpy.matmul(matrix, numpy.linalg.inv(ref_matrix))
                node.setAttribute("transform", format_matrix(new_matrix))

            for child in node.childNodes:
                _apply_transforms(child, new_ref_matrix, transform_map, clip_path_ref)
            for child in node.childNodes:
                if child.nodeType == Node.TEXT_NODE:
                    node.removeChild(child)

def normalize_path(path, toAbsolute, matrix):

    mode = "  "
    index = 0
    argnum = 1
    cur = numpy.array([0.0, 0.0])
    ref = cur

    def to_case(text, toUpper):
        return text.upper() if toUpper else text.lower()

    def segment(match):
        text = match.group(0)
        nonlocal mode, cur, argnum, index, ref
        argnums = {
            "L" : 1,
            "M" : 1,
            "C" : 3,
            "Q" : 2,
            "Z" : 0
        }
        if len(text) == 1:
            argnum = argnums[text.upper()]
            ref = cur
            index = 0
            if to_case(text, toAbsolute) == to_case(mode,toAbsolute):
                mode = text
                return ""
            elif mode.upper() == "M" and text.upper() == "L":
                mode = text
                return ""
            else:
                mode = text
                return to_case(text, toAbsolute)
        else:
            if index == argnum:
                ref = cur
                index = 0
            index = index + 1

            cur = numpy.array([float(match.group(1)), float(match.group(3))])
            if mode != mode.upper():
                cur = ref + cur

            v = numpy.matmul(matrix, [cur[0], cur[1], 1.0])
            if not toAbsolute:
                base = numpy.matmul(matrix, [ref[0], ref[1], 1.0])
                v = v - base
            return format("%1.3f,%1.3f") % (v[0], v[1])

    return re.sub(PATHSEG, segment, path).replace("  ", " ")

def symmetrize_mouth(path):
    points = [[float(m.group(1)), float(m.group(3))] for m in re.finditer(COORD, path)]
    points2 = []
    for i in range(len(points)):
        j = ((len(points)-1)*3//2 - i) % (len(points) - 1)
        points2.append([(points[i][0] + 250 - points[j][0])/2, (points[i][1] + points[j][1])/2])
    it = ["%1.3f,%1.3f" % (p[0], p[1]) for p in points2].__iter__()
    return re.sub(COORD, lambda x: it.__next__(), path)


def fix_circle(node, matrix):
    path_matrix = numpy.matmul(matrix, parse_svg_matrix(node.getAttribute("transform")))
    path = normalize_path(node.getAttribute("d"), True, path_matrix)
    points = [[float(m.group(1)), float(m.group(3))] for m in re.finditer(COORD, path)]
    x0 = min([p[0] for p in points])
    y0 = min([p[1] for p in points])
    x1 = max([p[0] for p in points])
    y1 = max([p[1] for p in points])

    unitD = "M 1,0 C 1,0.56 0.56,1 0,1 -0.56,1 -1,0.56 -1,0 -1,-0.56 -0.56,-1 0,-1 0.56,-1 1,-0.56 1,0 z"
    node.setAttribute("d", unitD)

    transform = format_matrix(numpy.array([[(x1-x0)/2, 0, (x0+x1)/2],[0, (y1-y0)/2, (y0+y1)/2]]))
    node.setAttribute("transform", transform)

    style = node.getAttribute("style")
    if style:
        style = re.sub(r"(stroke-width:)([0-9.]+)", lambda m: m.group(1) + "%.2g" % (float(m.group(2)) / (x1+y1-x0-y0)*2), style)
        node.setAttribute("style", style)


def remove_inkscape_stuff(node, indent):
    if node.nodeType == Node.ELEMENT_NODE:
        attrs= [a for a in node.attributes.values() if re.match(r"xmlns:(df|dc|sodipodi|inkscape|rdf|cc)|^(df|dc|sodipodi|inkscape|rdf):", a.name)]
        for a in attrs:
            node.removeAttribute(a.name)
        if re.match(r"^(df|dc|sodipodi|inkscape|rdf):", node.tagName) or node.tagName == "metadata":
            node.parentNode.removeChild(node)
        children = [c for c in node.childNodes]
        for i in range(len(children)):
            child= children[i]
            remove_inkscape_stuff(child, indent+"  ")
    if node.nodeType == Node.TEXT_NODE:
        node.nodeValue = ""
        node.parentNode.removeChild(node)
