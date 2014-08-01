package emoticons
import scala.xml._
import scala.math._
import java.io._
import scala.xml.NodeSeq.seqToNodeSeq
import scala.xml._

case class SVGMatrix(val a : Double = 1.0,
		b : Double = 0.0,
		c : Double = 0.0,
		d : Double = 1.0,
		e : Double = 0.0,
		f : Double = 0.0) {
  
  def multiply(other : SVGMatrix) : SVGMatrix = 
    SVGMatrix(a * other.a + c * other.b,
    		  b * other.a + d * other.b,
    		  a * other.c + c * other.d,
    		  b * other.c + d * other.d,
    		  a * other.e + c * other.f + e,
    		  b * other.e + d * other.f + f)

  def det() : Double = a * d - b * c 
    		  
  def inverse() : SVGMatrix = {
    SVGMatrix(d / det,
    		  -b /det,
    		  -c /det,
    		  a / det,
    		  (f * c - e * d) /det,
    		  (e * b - f * a) /det)
  }

  def apply(x : Double, y : Double) : (Double, Double) = (a * x + c * y + e, b * x + d *y + f)
  
  override def toString() = List(a,b,c,d,e,f).map(SVGUtil.format(_)).mkString("matrix(",",",")");
}

object SVGMatrix {
  val TRANSLATE_PATTERN = "translate\\(([^,]*),([^)]*)\\)".r
  val SCALE_PATTERN = "scale\\(([^,]*),([^)]*)\\)".r
  val MATRIX_PATTERN = "matrix\\(([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^)]*)\\)".r
  
  def parseSVGTransformAttribute(text : String) : SVGMatrix = {
    val matchTranslate = TRANSLATE_PATTERN.findPrefixMatchOf(text)
    val matchMatrix =  MATRIX_PATTERN.findPrefixMatchOf(text)
    val matchScale = SCALE_PATTERN.findPrefixMatchOf(text)
    if (matchTranslate.isDefined) {
      val list = matchTranslate.get.subgroups.map( _.toDouble )
      SVGMatrix(1,0,0,1, list(0), list(1))
    } else {
      if (matchMatrix.isDefined) {
        val list = matchMatrix.get.subgroups.map( _.toDouble )
        SVGMatrix(list(0), list(1), list(2), list(3), list(4), list(5))
      } else {
        if (matchScale.isDefined) {
          val list = matchMatrix.get.subgroups.map( _.toDouble )
          SVGMatrix(list(0),0,0,list(1),0,0)
        } else {
    	  throw new Exception("Unknown transform pattern : " + text)
        }
      }
    }
  }
}

object SVGUtil {

  def format(value : Double) = "%1.3f".format(value).replaceAll("\\.?0*$","")

  def hexParser(value : CharSequence):Int = {
    def hexDigitParser(value : Char):Int = {
      if (value>='0' && value<='9') value-'0'
      else
	if (value>='A' && value<='F') value-'A'+10
	else
	  if (value>='a' && value<='f') value-'a'+10
	  else 
	    0
    }
    (1 to value.length).foldLeft(0) { (a,b) => a*16 + hexDigitParser(value.charAt(b-1)) }
  }
  def parseColor(color:String) = 
    (hexParser(color.substring(1,3)), hexParser(color.substring(3,5)), hexParser(color.substring(5,7)))
  
  val DIGITS= ('0' to '9')++('a' to 'f')
  def hexFormat(value: Int, len:Int):String =
    (0 to len-1).reverse.map { digit => DIGITS((value >> (4*digit))&15) }.mkString

  def formatColor(r: Int, g:Int, b:Int) : String = 
    "#"+(List(r,g,b).map { channel => hexFormat(min(255,max(0,channel)),2) }.mkString)

  def normalizePath(path: String, matrix : SVGMatrix = SVGMatrix()) : String = {
	  val NUMBER= "[+-]?[0-9]+(\\.[0-9]+)?".r
	  val PATHSEG= ("[a-zA-Z]|("+NUMBER+"),("+NUMBER+")").r
	  var mode= "  "
	  var index= 0
	  var argnum= 1
	  var x=  0.0
	  var x0= 0.0
	  var y=  0.0
	  var y0= 0.0
	  PATHSEG.replaceAllIn(path, seg => {
		  val text= seg.matched
		  if (text.length==1) {
			  x0= x
			  y0= y
			  argnum= text.toUpperCase match {
				  case "C" => 3
				  case "Q" => 2
				  case _ => 1
			  }
			  x0=x
			  y0=y
			  index=0
			  if (text.toUpperCase==mode.toUpperCase) {
				  mode= text
				  ""
			  } else {
				  mode= text
				  text.toUpperCase
			  }

	 	  } else {
	 	 	  if (index == argnum) { x0=x; y0=y; index=0 }
	 	 	  index += 1
	 	 	  if (mode == mode.toUpperCase) {
	 	 	 	  x= seg.group(1).toDouble
	 	 	 	  y= seg.group(3).toDouble
	 	 	  } else {
	 	 	 	  val dx= seg.group(1).toDouble
	 	 	 	  val dy= seg.group(3).toDouble
	 	 	 	  x= x0+dx
	 	 	 	  y= y0+dy
	 	 	  }
	 	 	  val v = matrix.apply(x, y)
	 	 	  format(v._1)+","+format(v._2)
	 	  }
	  }).replaceAll("  "," ")
  }
}
