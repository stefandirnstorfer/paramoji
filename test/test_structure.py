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
        print(params)

    def test_skip_fixed(self):
        node = minidom.parseString('<svg><path id="my-id" morph="fixed" d="M0,0 C1,1"/></svg>')
        emoticon = EmoticonStructure(node)
        self.assertFalse("my-id" in emoticon.pattern)

    def test_skip_fixed_children(self):
        node = minidom.parseString('<svg><g id="my-g" morph="fix-children" transform="scale(1)"><path id="my-id" d="M0,0 C1,1"/></g></svg>')
        emoticon = EmoticonStructure(node)
        self.assertTrue("my-g" in emoticon.pattern)
        self.assertFalse("my-id" in emoticon.pattern)


if __name__ == '__main__':
    unittest.main()
