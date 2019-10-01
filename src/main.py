from xml.dom import minidom, Node
import re

def main():
    base = minidom.parse('faces/face_000.svg')
    remove_inkscape_stuff(base.firstChild)
    with open("myfile.xml", "w") as xml_file:
        base.writexml(xml_file)


def remove_inkscape_stuff(node):
    if node.nodeType == Node.ELEMENT_NODE:
        print(node.tagName)
        attrs= [a for a in node.attributes.values() if re.match(r"xmlns:(df|dc|sodipodi|inkscape|rdf|cc)|^(df|dc|sodipodi|inkscape|rdf):", a.name)]
        for a in attrs:
            node.removeAttribute(a.name)
        print(attrs)
        if re.match(r"^(df|dc|sodipodi|inkscape|rdf):", node.tagName) or node.tagName == "metadata":
            node.parentNode.removeChild(node)
        for child in node.childNodes:
            remove_inkscape_stuff(child)


if __name__ == "__main__":
    main()
