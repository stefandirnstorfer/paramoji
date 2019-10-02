import unittest
import numpy

from svg_util import parse_svg_matrix


class MatrixTest(unittest.TestCase):

    def assertMatrixEquals(self, mat1, mat2, msg="Matrices don't match"):
        numpy.testing.assert_array_almost_equal(mat1, mat2[0:2], 10, msg)

    def test_translation(self):
        m = parse_svg_matrix("translate(5,6)")
        self.assertMatrixEquals([[1.0, 0.0, 5.0],[0.0, 1.0, 6.0]], m)

    def test_scale(self):
        m = parse_svg_matrix("scale(0.5, 0.6)")
        self.assertMatrixEquals([[0.5, 0.0, 0.0],[0.0, 0.6, 0.0]], m)

    def test_rotation(self):
        m = parse_svg_matrix("rotate(90)")
        self.assertMatrixEquals([[0.0, -1.0, 0.0],[1.0, 0.0, 0.0]], m)

    def test_matrix(self):
        m = parse_svg_matrix("matrix(0.1, 0.2, 0.3, 0.4, 0.5, 0.6)")
        self.assertMatrixEquals([[0.1, 0.3, 0.5],[0.2, 0.4, 0.6]], m)

    def test_multiply(self):
        A = parse_svg_matrix("translate(2,1)")
        B = parse_svg_matrix("scale(2,3)")
        self.assertMatrixEquals([[2,0,4], [0,3,3]], numpy.matmul(B, A))
        self.assertMatrixEquals([[2,0,2], [0,3,1]], numpy.matmul(A, B))

if __name__ == '__main__':
    unittest.main()
