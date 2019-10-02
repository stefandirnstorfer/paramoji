import unittest

from normalizer import normalize_path, symmetrize_mouth
from svg_util import parse_svg_matrix, identiy_matrix

class NormalizPathTest(unittest.TestCase):

    def test_absolute(self):
        path = "M10,10 l5.2,1.2"
        norm = normalize_path(path, True, identiy_matrix())
        self.assertEqual("M10.000,10.000 15.200,11.200", norm)

    def test_relative(self):
        path = "M10,10 C8,12 2,13 5,10 Z"
        norm = normalize_path(path, False, identiy_matrix())
        self.assertEqual("m10.000,10.000 c-2.000,2.000 -8.000,3.000 -5.000,0.000 z", norm)

    def test_transform(self):
        path = "M10,0"
        norm = normalize_path(path, True, parse_svg_matrix("rotate(90)"))
        self.assertEqual("M0.000,10.000", norm)

    def test_symmetrize_mouth(self):
        #d= "M 161.96,188.33 C 150,197.38 136.77,196.91 125,197.17 113.24,196.91 100,197.38 88.05,188.33 100.14,184.24 112.99,184.89 125,184.61 137.02,184.89 149.86,184.24 161.96,188.33 Z"
        d= "M 250.2,0.2 125,10.33 0,0.2 125,-10.44 250,0"
        s= symmetrize_mouth(d)
        self.assertEqual("M 250.100,0.200 125.000,10.330 -0.100,0.200 125.000,-10.440 250.000,0.100", s)

if __name__ == '__main__':
    unittest.main()
