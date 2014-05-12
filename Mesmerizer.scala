package emoticons

import java.io.File
import scala.util.matching.Regex
import scala.xml._

/** This class is responsible for morphing between different SVG images */
class Mesmerizer() {

  abstract class Param
  case class NumberParam(val value:Double) extends Param
  case class ColorParam(val r:Double, g:Double, b:Double) extends Param

  /** defines the structure of an SVG image */
  case class BaseShape (
    val children: Map[String, BaseShape], 
    val attributes: Map[String, (Regex, String)]) {
	  
	def isEmpty() = children.isEmpty && attributes.isEmpty

	def format(): Iterable[String] =
		attributes.map { case (key, (pattern,format)) => "@"+key+" : "+format } ++
		children.flatMap { case (key, child) => key :: (child.format.map { "  "+_ }.toList) }
	override def toString() : String = format.mkString("\n")
  }

  /** Contains the numeric parametrs for a BaseShape */
  case class ParametricShape (
    val children: Map[String, ParametricShape],
    val values: Map[String, List[Param]]) {
    
    def format(): Iterable[String] =
		values.map { case (key, value) => "@"+key+" : "+value } ++
		children.flatMap { case (key, child) => key :: (child.format.map { "  "+_ }.toList) }
	override def toString() : String = format.mkString("\n")
  }
  
  class MatchException(msg : String, cause : Throwable) extends Exception(msg, cause) {
    def this(msg : String) = this(msg, null)
  }

  val PARAM= "[+-]?[0-9]+(\\.[0-9]+)?|#[0-9a-fA-F]{6}".r
  def id(node : Node) = node.attribute("id").map { _.text }.getOrElse("("+node.label+")")
  
  /** Extract a tree of regex patterns which match variations of this base shape */
  def extractBaseShape(node : Node) : BaseShape = {
    val children= node.child
    .filter { !_.label.startsWith("#") }
    .map { child => (id(child) -> extractBaseShape(child)) }
    .filter { case (key,value) => ! value.isEmpty}
    val attributes= node
    	.attributes.map {
    	attr => attr.key match {
    		case "transform" => ("transform" -> getPattern(attr.value.toString))
    		case "style" => ("style" -> getPattern(attr.value.toString))
    		case "d" => ("d" -> getPattern(SVGUtil.normalizePath(attr.value.toString)))
    		case _ => ("" -> ("".r,""))
     }}.filter { _._1 != "" }.toList
     BaseShape(Map(children:_*), Map(attributes:_*))
   }

   /** Use the regex pattern in the base shape to extract variable parameters in the shape */
   def extractParameters(node: Node, base: BaseShape): ParametricShape = {
	 try {
	     val children= base.children.map {
	    	 case (key, child) =>
	    	 	val matchedChild= node.child.filter { id(_)==key }
	    	 	if (matchedChild.isEmpty)
	    	 		throw new MatchException(id(node)+" does not have a child "+key)
	    	 	(key -> extractParameters(matchedChild.head, child))
		 }
	     val values= base.attributes.map {
	    	 case (key, (pattern, format)) =>
	    	 	val value= node.attribute(key).getOrElse(
	    	 			{throw new MatchException(" Missing attribute "+key)}).text
	    	 	(key -> getParameters( if (key=="d") SVGUtil.normalizePath(value) else value, pattern))
	     }
	     ParametricShape(children, values)
	 } catch {
	 case e:MatchException => throw new MatchException( id(node)+"/"+e.getMessage() )
	 }
   }

   /** Extract the pattern against which new SVG images are matched */
   def getPattern(text: String) : (Regex, String) = {
	 (PARAM.replaceAllIn(text
			 .replaceAll("\\(","\\\\(")
			 .replaceAll("\\)","\\\\)"), m => "([^,; ]+)").r,
	  PARAM.replaceAllIn(text, "*"))
   }

   /** Extract the numeric parameters for interpolation */
   def getParameters(text: String, pattern: Regex): List[Param] = {
	   pattern.findPrefixMatchOf(text) match {
	  	   case Some(m) =>
	  	     m.subgroups.map { param =>
		       if (param.startsWith("#")) {
			 val c= SVGUtil.parseColor(param)
			 ColorParam(c._1, c._2, c._3)
		       } else 
			 NumberParam(param.toDouble) }
	  	   case _ =>
	  	     throw new MatchException(" pattern not matched: "+text+" does not match "+pattern)
	   }
   }

   def formatParam(value : Param):String = value match {
     case NumberParam(value) => 
     if (value == value.toInt)
       value.toInt.toString
     else
       SVGUtil.format(value)
     case ColorParam(r,g,b) => SVGUtil.formatColor(r.toInt,g.toInt,b.toInt)
   }
   
   def format(shape: Node, base: BaseShape, param: ParametricShape): Node = shape match {
     case Elem(prefix, label, attribs, scope, children @ _*) => {
       val newAttribs= base.attributes.foldLeft (attribs) { 
	 case (a, (key, (pattern, format))) =>
	   val value= param.values.get(key).get.iterator
	 val newValue= "\\*".r.replaceAllIn(format, _ => formatParam(value.next))
	 a.remove(key).append(new UnprefixedAttribute(key,newValue.replaceAll("\\\\",""), Null))
       }
       val newChildren= children.map {
	 child => base.children .get(id(child)) match {
	   case Some(childBase) => format(child, childBase, param.children.get(id(child)).get)
	   case _ => child
	 }
       }
       Elem(prefix, label, newAttribs, scope, newChildren :_*)
     }
     case _ => shape
   }

   def morph(left: Double, right: Double, shape1:List[Param], shape2:List[Param]):List[Param] = {
     val it= shape2.iterator
     shape1.map { v => (v,it.next) match {
       case (NumberParam(a), NumberParam(b)) => 
	 NumberParam(left * a + right * b)
       case (ColorParam(ar,ag,ab), ColorParam(br,bg,bb)) => 
	 ColorParam(left * ar + right * br,
		    left * ag + right * bg,
		    left * ab + right * bb)
       case _ => throw new Exception("Parameter types don't match")
     }}
   }
     
   def morph(left: Double, right:Double, shape1: ParametricShape, shape2: ParametricShape) : ParametricShape =
     ParametricShape(
       shape1.children.map { 
       case (key,value) => key -> morph(left, right, value, shape2.children.get(key).get) 
       },
       shape1.values.map { 
       case (key,value) => key -> morph(left, right, value, shape2.values.get(key).get) 
       }
     )

   def map(f : ColorParam => ColorParam, shape: ParametricShape) : ParametricShape =
     ParametricShape(
       shape.children.map { case (key, value) => key -> map(f, value) },
       shape.values.map { case (key, list) =>
	 key -> list.map { _ match {
	   case value : ColorParam => f(value)
	   case other => other
       }}})

   def morph(factor:Double, shape1: ParametricShape, shape2: ParametricShape) : ParametricShape =
       morph(factor, 1-factor, shape1, shape2)

  def load(file : String) : Node = {
    val src= scala.io.Source.fromFile(file)
    val doc= scala.xml.parsing.XhtmlParser.apply(src)
    doc.head
  }

  def extractParameters(file: String, base: BaseShape): ParametricShape = {
    try {
      extractParameters(load(file), base)
    } catch {
      case e:MatchException =>
        println("ERROR in file : "+file)
	println(e.getMessage())
	throw new MatchException(file+": "+e.getMessage)
    }
  }

  def desaturate(c : ColorParam, w : Double) = {
    val l= .4*c.r + .4*c.g + .2*c.b
    ColorParam(w*c.r + (1-w)*l, w*c.g + (1-w)*l, w*c.b + (1-w)*l)
  } 
  
  val master= load("face_000.svg")
  val base = extractBaseShape(master)
  val shape0= extractParameters("face_000.svg", base)
  val shape1= extractParameters("face_---.svg", base)

  val res= format(master, base, morph(2, shape0, shape1))
  scala.xml.XML.save("face_gen_+++.svg",res)
  
  /*
  def emoticon(v: Double, a: Double, p:Double, w:Double) : Node = {
    val param= map(desaturate(_, w),
1                   morph(p,
			 morph(a, 
    			       morph(v, shape2, shape1), 
    			       morph(v, shape4, shape3)),
			 morph(a, 
    			       morph(v, shape6, shape5), 
    			       morph(v, shape8, shape7))))
    format(master, base, param)
  }*/
}

object Mesmerizer {
  def main(args : Array[String]) {
    val mes = new Mesmerizer()
  }
}
