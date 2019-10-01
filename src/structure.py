from xml.dom import minidom, Node

from attribute_pattern import SimpleAttributePattern
from svg_util import create_id_map

class EmoticonStructure:

    node = None
    pattern = {}

    def __init__(self, node):
        self.node = node
        self.pattern = {}
        self.extract_pattern(node.firstChild)

    def extract_pattern(self, node):
        excluded = node.getAttribute("morph") == "fixed"
        if not excluded:

            exclude_children = node.getAttribute("morph") == "fix-children"
            if not exclude_children:
                for child in node.childNodes:
                    if child.nodeType == Node.ELEMENT_NODE:
                        self.extract_pattern(child)

            node_id = node.getAttribute("id")

            if node_id:
                self.pattern[node_id] = {
                    "d" : SimpleAttributePattern(node.getAttribute("d"))
                }

    def get_params(self, node = None):
        if not node:
            node = self.node
        id_map = create_id_map(node.firstChild, {})
        params = []

        for node_id in sorted(self.pattern.keys()):
            pattern_set = self.pattern[node_id]
            node = id_map[node_id]
            for attr in sorted(pattern_set.keys()):
                params = params + pattern_set[attr].get_params(node.getAttribute(attr))

        return params

    def set_params(self, params):
        id_map = create_id_map(self.node.firstChild, {})
        index = 0

        for node_id in sorted(self.pattern.keys()):
            pattern_set = self.pattern[node_id]
            node = id_map[node_id]
            for attr in sorted(pattern_set.keys()):
                n = pattern_set[attr].length()
                if n > 0:
                    node.setAttribute(attr, pattern_set[attr].format(params[index : index+n]))
                    index = index + n
        return params

    def format(self):
        return self.node.toprettyxml()
