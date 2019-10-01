import unittest
from attribute_pattern import SimpleAttributePattern


class PatternTest(unittest.TestCase):

    def test_simple_attribute_pattern(self):
        pattern = SimpleAttributePattern("matrix(1,0.0,-0.1,1)")
        self.assertEqual("matrix(*,*,*,*)", pattern.value)

        new_str = pattern.format([1,2,3,4])
        self.assertEqual("matrix(1,2,3,4)", new_str)

        params = pattern.get_params("matrix(7,8,-4,2.5)")
        self.assertEqual([7,8,-4,2.5], params)

if __name__ == '__main__':
    unittest.main()
