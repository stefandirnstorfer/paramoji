import unittest
from xml.dom import minidom, Node

from structure import EmoticonStructure
from normalizer import flatten_transformation

class FlattenTest(unittest.TestCase):

    def test_transform_g(self):
        node = minidom.parseString('<svg><g transform="translate(1,2)"><path d="M3,3" id="me"/></g></svg>')
        flatten_transformation(node)
        self.assertEqual('<?xml version="1.0" ?><svg><g><path d="M4.000,5.000" id="me"/></g></svg>', node.toxml())

    def test_transform_use(self):
        node = minidom.parseString('<svg xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="scale(2)"><path id="me"/></g><use xlink:href="#me"/></svg>')
        flatten_transformation(node)
        self.assertTrue('<use transform="matrix(0.500,0.000,0.000,0.500,0.000,0.000)" xlink:href="#me"/>' in node.toxml())

    def test_clip_path(self):
        node = minidom.parseString('<svg><clipPath id="clip"><path d="M0,0" id="me"/></clipPath><g id="you" transform="translate(1,2)" clip-path="url(#clip)"><path id="he"/></g></svg>')
        flatten_transformation(node)
        print(node.toprettyxml())
        self.assertTrue('<path d="M1.000,2.000" id="me"/>' in node.toxml())


if __name__ == '__main__':
    unittest.main()
