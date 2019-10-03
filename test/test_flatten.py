import unittest
import re
from xml.dom import minidom, Node

from normalizer import normalize_svg, fix_circle
from svg_util import identiy_matrix

class FlattenTest(unittest.TestCase):

    def test_transform_g(self):
        node = minidom.parseString('<svg><g transform="translate(1,2)"><path d="M3,3" id="me"/></g></svg>')
        normalize_svg(node)
        self.assertEqual('<svg><g><path d="M4.000,5.000" id="me"/></g></svg>', node.firstChild.toxml())

    def test_transform_multiply(self):
        node = minidom.parseString('<svg><g transform="scale(2)"><g transform="translate(1,2)"><path d="M3,3" id="me"/></g></g></svg>')
        normalize_svg(node)
        self.assertEqual('<svg><g><g><path d="M8.000,10.000" id="me"/></g></g></svg>', node.firstChild.toxml())

    def test_transform_use(self):
        node = minidom.parseString('<svg xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="scale(2)"><path id="me"/></g><use xlink:href="#me"/></svg>')
        normalize_svg(node)
        self.assertTrue('<use transform="matrix(0.500,0.000,0.000,0.500,0.000,0.000)" xlink:href="#me"/>' in node.toxml())

    def test_clip_path(self):
        node = minidom.parseString('<svg><clipPath id="clip"><path d="M0,0" id="me"/></clipPath><g id="you" transform="translate(1,2)" clip-path="url(#clip)"><path id="he"/></g></svg>')
        normalize_svg(node)
        self.assertTrue('<path d="M1.000,2.000" id="me"/>' in node.toxml())

    def test_remove_whitespace(self):
        node = minidom.parseString("<svg>  \n  <g>  \n  </g> \n  </svg>")
        normalize_svg(node)
        self.assertEqual('<svg><g/></svg>', node.firstChild.toxml())


class ToCircleTest(unittest.TestCase):

    def test_to_circle(self):
        node = minidom.parseString('<path d="M 12,30 22,40 12,30 2,20" morph="to-circle"/>')

        fix_circle(node.firstChild, identiy_matrix())
        self.assertTrue('transform="matrix(20.000,0.000,0.000,20.000,2.000,20.000)' in node.toxml())

        fix_circle(node.firstChild, identiy_matrix())
        self.assertTrue('transform="matrix(20.000,0.000,0.000,20.000,2.000,20.000)' in node.toxml())


    def test_to_transformed_circle(self):
        node = minidom.parseString('<path d="M 12,30 22,40 12,30 2,20" morph="to-circle" transform="scale(2)"/>')

        fix_circle(node.firstChild, identiy_matrix())
        self.assertTrue('transform="matrix(40.000,0.000,0.000,40.000,4.000,40.000)' in node.toxml())

    def test_circle_stroke(self):
        node = minidom.parseString('<path d="M 0,0 10,10" morph="to-circle" style="stroke-width:1px"/>')

        fix_circle(node.firstChild, identiy_matrix())
        style= re.findall(r'style="[^"]*"', node.toxml())
        self.assertEqual(1, len(style))
        self.assertEqual('style="stroke-width:0.1px"', style[0])


if __name__ == '__main__':
    unittest.main()
