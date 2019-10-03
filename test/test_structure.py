import unittest
import numpy
from xml.dom import minidom, Node

from structure import EmoticonStructure


class StructureTest(unittest.TestCase):

    def test_simple_attribute(self):
        node = minidom.parseString('<svg><path id="my-id" d="M0,0 L1,1"/></svg>')
        emoticon = EmoticonStructure(node)
        self.assertTrue("my-id" in emoticon.pattern)

        params = emoticon.get_params(node)
        numpy.testing.assert_array_equal([0,0,1,1], params)

        emoticon.set_params([2,3,4,5])
        self.assertTrue('d="M2,3 L4,5"' in emoticon.format())

    def test_multi_node(self):
        node = minidom.parseString('<svg><path id="a" d="M1,2"/><path id="b" d="M3,4"/></svg>')
        emoticon = EmoticonStructure(node)
        params = emoticon.get_params(node)
        numpy.testing.assert_array_equal([1,2,3,4], params)

    def test_attribute_order(self):
        node = minidom.parseString('<svg><path id="b" transform="translate(10,10)" d="M0,0"/></svg>')
        emoticon = EmoticonStructure(node)

        params = emoticon.get_params(node)
        numpy.testing.assert_array_equal([0,0,10,10], params)

        emoticon.set_params([2,3,4,5])
        path_node = emoticon.node.firstChild.firstChild
        self.assertEqual("M2,3", path_node.getAttribute("d"))
        self.assertEqual("translate(4,5)", path_node.getAttribute("transform"))


    def test_skip_fixed(self):
        node = minidom.parseString('<svg><path id="my-id" morph="fixed" d="M0,0 C1,1"/></svg>')
        emoticon = EmoticonStructure(node)
        self.assertFalse("my-id" in emoticon.pattern)
        self.assertEqual(0, len(emoticon.get_params()))

    def test_skip_fixed_children(self):
        node = minidom.parseString('<svg><g id="my-g" morph="fix-children" transform="scale(1)"><path id="my-id" d="M0,0 C1,1"/></g></svg>')
        emoticon = EmoticonStructure(node)
        self.assertTrue("my-g" in emoticon.pattern)
        self.assertFalse("my-id" in emoticon.pattern)


if __name__ == '__main__':
    unittest.main()
