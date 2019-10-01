from xml.dom import minidom, Node
import re

from normalizer import remove_inkscape_stuff

def main():
    base = minidom.parse('faces/face_000.svg')
    remove_inkscape_stuff(base.firstChild)
    with open("myfile.xml", "w") as xml_file:
        base.writexml(xml_file)



if __name__ == "__main__":
    main()
