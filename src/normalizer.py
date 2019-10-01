import re
import numpy
from xml.dom import minidom, Node

from svg_util import identiy_matrix, parse_svg_matrix, matmult, format_matrix


def flatten_transformation(node):
    remove_inkscape_stuff(node)
    update_map = { '' : identiy_matrix()}
    clip_path_ref = {}
    matrix = identiy_matrix()
    _find_transforms(node.firstChild, matrix, update_map, clip_path_ref)
    _apply_transforms(node.firstChild, matrix, update_map, clip_path_ref)

def _find_transforms(node, matrix, update_map, clip_path_ref):
    if node.nodeType == Node.ELEMENT_NODE:
        node_id = node.getAttribute("id")
        clip_path = node.getAttribute("clip-path")
        transform = node.getAttribute("transform")

        if transform:
            matrix = matmult(matrix, parse_svg_matrix(transform))

        if clip_path:
            ref_id = re.match(r"url\(#([^)]*)\)", clip_path).group(1)
            if ref_id in clip_path_ref.keys():
                raise Exception("Duplicate reference to " + ref_id)
            clip_path_ref[ref_id] = matrix

        if node_id:
            update_map[node_id] = matrix

        for child in node.childNodes:
            _find_transforms(child, matrix, update_map, clip_path_ref)

def _apply_transforms(node, ref_matrix, update_map, clip_path_ref):
    if node.nodeType == Node.ELEMENT_NODE:
        node_id = node.getAttribute("id")
        morph = node.getAttribute("morph")

        matrix = matmult(ref_matrix, update_map[node_id])
        new_ref_matrix = clip_path_ref[node_id] if node_id in clip_path_ref.keys() else identiy_matrix()

        if node.getAttribute("transform"):
            node.removeAttribute("transform")
        isFiltered = (morph in ["fixed","fix-children"]) or node_id == "lower-teeth"

        #if node_id == "mouth-outline":
            #symmetrizeMouth(node.asInstanceOf[Elem], matrix)
        #elif morph in ["transform-only", "relative"]:
            #fixScalePath(node.asInstanceOf[Elem], matrix)
        #else:
        if isFiltered:
            node.setAttribute("transform", format_matrix(matrix))
        else:
            if node.tagName == "path":
                d = node.getAttribute("d")
                node.setAttribute("d", normalize_path(d, morph != "relative", matrix))
            elif node.tagName == "use":
                ref = node.getAttribute("xlink:href").replace("#","")
                ref_matrix = update_map.get(ref)
                new_matrix = matmult(matrix, numpy.linalg.inv(ref_matrix))
                node.setAttribute("transform", format_matrix(new_matrix))

            for child in node.childNodes:
                _apply_transforms(child, new_ref_matrix, update_map, clip_path_ref)

def normalize_path(path, toAbsolute, matrix):
    NUMBER= r"[+-]?[0-9]+(\\.[0-9]+)?"
    PATHSEG= re.compile("[a-zA-Z]|("+NUMBER+"),("+NUMBER+")")

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
            "L" : 2,
            "M" : 2,
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
            return format("%.3f,%.3f") % (v[0], v[1])

    return re.sub(PATHSEG, segment, path).replace("  ", " ")

def remove_inkscape_stuff(node):
    if node.nodeType == Node.ELEMENT_NODE:
        attrs= [a for a in node.attributes.values() if re.match(r"xmlns:(df|dc|sodipodi|inkscape|rdf|cc)|^(df|dc|sodipodi|inkscape|rdf):", a.name)]
        for a in attrs:
            node.removeAttribute(a.name)
        if re.match(r"^(df|dc|sodipodi|inkscape|rdf):", node.tagName) or node.tagName == "metadata":
            node.parentNode.removeChild(node)
        for child in node.childNodes:
            remove_inkscape_stuff(child)