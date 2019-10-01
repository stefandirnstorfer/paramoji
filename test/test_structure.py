import unittest
import xml.etree.ElementTree as ET
from xml.dom import minidom, Node

from structure import EmoticonStructure


class StructureTest(unittest.TestCase):

    def test_simple_attribute(self):
        node = minidom.parseString('<svg><path id="my-id" d="M0,0 L1,1"/></svg>')
        emoticon = EmoticonStructure(node)
        self.assertTrue("my-id" in emoticon.pattern)

        params = emoticon.get_params(node)
        self.assertEqual([0,0,1,1], params)

        emoticon.set_params([2,3,4,5])
        self.assertTrue('d="M2,3 L4,5"' in emoticon.format())

    def test_multi_attribute(self):
        node = minidom.parseString('<svg><path id="b" d="M0,0"/><path id="a" d="M10,10"/></svg>')
        emoticon = EmoticonStructure(node)

        params = emoticon.get_params(node)
        self.assertEqual([10,10,0,0], params)

        emoticon.set_params([2,3,4,5])
        self.assertTrue('d="M2,3" id="a"' in emoticon.format())
        self.assertTrue('d="M4,5" id="b"' in emoticon.format())


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
