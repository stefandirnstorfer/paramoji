from xml.dom import minidom, Node


from attribute_pattern import SimpleAttributePattern


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

    def get_params(self, node):
        for node_id in self.pattern.keys():
            pass

        return []
