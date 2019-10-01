import unittest

from normalizer import normalize_path
from svg_util import parse_svg_matrix, identiy_matrix

class MyTestCase(unittest.TestCase):

    def test_absolute(self):
        path = "M10,10 l5,1"
        norm = normalize_path(path, True, identiy_matrix())
        self.assertEqual("M10.000,10.000 15.000,11.000", norm)

    def test_relative(self):
        path = "M10,10 C8,12 2,13 5,10 Z"
        norm = normalize_path(path, False, identiy_matrix())
        self.assertEqual("m10.000,10.000 c-2.000,2.000 -8.000,3.000 -5.000,0.000 z", norm)

    def test_transform(self):
        path = "M10,0"
        norm = normalize_path(path, True, parse_svg_matrix("rotate(90)"))
        self.assertEqual("M0.000,10.000", norm)

if __name__ == '__main__':
    unittest.main()
