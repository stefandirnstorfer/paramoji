package emoticons
import scala.util.matching.Regex
import scala.xml._
import scala.math._
import scala.xml.NodeSeq.seqToNodeSeq
import scala.xml._


class MatchException(msg : String, cause : Throwable) extends Exception(msg, cause) {
	def this(msg : String) = this(msg, null)
}

/** This class is responsible for morphing between different SVG images */
class Mesmerizer() {

	
	case class BaseShape(val attributes: Map[String, AttributePattern]) {
		override def toString() : String =
		attributes.map { case (key, pattern) => "@"+key+" : "+pattern }.mkString("\n")
	}

	/** Contains the numeric parameters for a BaseShape */
	case class ParametricShape(val values: Map[String, List[Param]]) {
		override def toString() : String = 
			values.map { case (key, value) => "@"+key+" : "+value }.mkString("\n")
	}

	def id(node : Node) = node.attribute("id").map { _.text }.getOrElse("("+node.label+")")

	/** Extract a tree of regex patterns which match variations of this base shape */
	def extractBaseShapeAsList(node : Node) : List[(String, AttributePattern)] = {
		val children = node.child
				.filter { !_.label.startsWith("#") }
		.map { extractBaseShapeAsList(_) }
		val nodeid = id(node)
		val attributes : List[(String, AttributePattern)]= node.attributes
			.flatMap { attr => attr.key match {
				case "transform" => List(nodeid + "@transform" -> new SimpleAttributePattern(attr.value.toString))
				case "style" => List(nodeid + "@style" -> new StyleAttributePattern(attr.value.toString))
				case "d" => List(nodeid + "@d" -> new PathAttributePattern(SVGUtil.normalizePath(attr.value.toString)))
				case _ => List()
			}}.toList
		children.foldRight(attributes)(_ ++ _)
    }
	def extractBaseShape(node : Node) = BaseShape(Map(extractBaseShapeAsList(node):_*))

	/** Use the regex pattern in the base shape to extract variable parameters in the shape */
	def extractParameters(node: Node, base: BaseShape): List[(String, List[Param])] = {
		try {
			val children = node.child.map(extractParameters(_, base))
			val values= node.attributes
			.flatMap{ attr =>
				val key = id(node) + "@" + attr.key
				val pattern = base.attributes.get(key)
				val value = attr.value.text
				if (pattern.isEmpty)
				   List()
				else
				   List(key -> pattern.get.getParams(value))
			}.toList
			children.foldLeft(values)(_ ++ _)
		} catch {
		case e:MatchException => throw new MatchException( "#" + id(node) + " " +e.getMessage(), e)
		}
	}

	def format_replaceAttribs(id : String, attr : MetaData, base : BaseShape, param : ParametricShape) : MetaData = {
	  if (attr == Null) {
	    Null
	  } else {
		if (base.attributes.contains(id + "@" + attr.key)) {
			val newValue= base.attributes.get(id + "@" + attr.key).get.format(param.values.get(id + "@" + attr.key).get);
			format_replaceAttribs(id, attr.next, base, param)
				.append(new UnprefixedAttribute(attr.key, newValue.replaceAll("\\\\",""), Null))
		}
		else {
		  attr.append(format_replaceAttribs(id, attr.next, base, param))
		}
	  }    
	}
	
	def format(shape: Node, base: BaseShape, param: ParametricShape): Node = {
		shape match {
		case Elem(prefix, label, attribs, scope, children @ _*) => {
			Elem(prefix, label, 
				format_replaceAttribs(id(shape), attribs, base, param), 
				scope, 
					children.map { child => format(child, base, param) }:_*
				)
		}
		case _ => shape
		}
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
				shape1.values.map { 
				case (key,value) => key -> morph(left, right, value, shape2.values.get(key).get) 
				}
		)

	def map(f : ColorParam => ColorParam, shape: ParametricShape) : ParametricShape =
		ParametricShape(
				shape.values.map { case (key, list) =>
				key -> list.map { _ match {
				case value : ColorParam => f(value)
				case other => other
				}}})

	def morph(factor:Double, shape1: ParametricShape, shape2: ParametricShape) : ParametricShape =
		if (factor==1) shape1 else { 
			if (factor==0) shape2 else
				morph(factor, 1-factor, shape1, shape2)
		}

	def load(file : String) : Node = {
		val src= scala.io.Source.fromFile(file)
		val doc= scala.xml.parsing.XhtmlParser.apply(src)
		doc.head
	}

	def extractParameters(file: String, base: BaseShape): ParametricShape = {
		try {
			ParametricShape(Map(extractParameters(load(file), base):_*))
		} catch {
			case e:MatchException =>
			throw new MatchException(file + ": "+e.getMessage, e)
		}
	}

	/*
  	val master= load("front-master.svg")
  	val base = extractBaseShape(master)
  	val shape1= extractParameters("front-v0-a1-p1.svg", base)
    val shape2= extractParameters("front-v1-a1-p1.svg", base)
    val shape3= extractParameters("front-v0-a0-p1.svg", base)
    val shape4= extractParameters("front-v1-a0-p1.svg", base)
    val shape5= extractParameters("front-v0-a1-p0.svg", base)
    val shape6= extractParameters("front-v1-a1-p0.svg", base)
    val shape7= extractParameters("front-v0-a0-p0.svg", base)
    val shape8= extractParameters("front-v1-a0-p0.svg", base)
    def emoticon(v: Double, a: Double, p:Double) : Node = {
    val param= 
                   morph(p,
			 morph(a, 
    			       morph(v, shape2, shape1), 
    			       morph(v, shape4, shape3)),
			 morph(a, 
    			       morph(v, shape6, shape5), 
    			       morph(v, shape8, shape7)))
    format(master, base, param)
    }
	*/

	val master= load("faces/face_000.svg")
	val base = extractBaseShape(master)
	val shape_ooo= extractParameters("faces/face_000.svg", base)
	val shape_poo= extractParameters("faces/face_+00.svg", base)
	val shape_moo= extractParameters("faces/face_-00.svg", base)
	val shape_opo= extractParameters("faces/face_0+0.svg", base)
	val shape_omo= extractParameters("faces/face_0-0.svg", base)
	val shape_oop= extractParameters("faces/face_00+.svg", base)
	val shape_oom= extractParameters("faces/face_00-.svg", base)

	def emoticon(v: Double, a: Double, p:Double) : Node = {
		val sv = abs(1-2*v)
		val sa = abs(1-2*a)
		val sp = abs(1-2*p)
		val param= morph(1-sv-sa-sp, shape_ooo, 
				morph(sv/(sa+sv+sp),
						if (v>0.5) shape_poo else shape_moo,
						morph(sa/(sa+sp),
								if (a>0.5) shape_opo else shape_omo,
								if (p>0.5) shape_oop else shape_oom)))
		format(master, base, param)
	}
}

object Mesmerizer {
	def main(args : Array[String]) {
		try {
			val mes = new Mesmerizer()
			scala.xml.XML.save("gen/face_000.svg", mes.emoticon(.5,.5,.5))
			scala.xml.XML.save("gen/face_0+0.svg", mes.emoticon(.5,1,.5))
			scala.xml.XML.save("gen/face_0-0.svg", mes.emoticon(.5,0,.5))
			scala.xml.XML.save("gen/face_+00.svg", mes.emoticon(1,.5,.5))
			scala.xml.XML.save("gen/face_-00.svg", mes.emoticon(0,.5,.5))
			scala.xml.XML.save("gen/face_00+.svg", mes.emoticon(.5,.5,1))
			scala.xml.XML.save("gen/face_00-.svg", mes.emoticon(.5,.5,0))

			scala.xml.XML.save("gen/face_++0.svg", mes.emoticon(1,1,.5))
			scala.xml.XML.save("gen/face_+-0.svg", mes.emoticon(1,0,.5))
			scala.xml.XML.save("gen/face_+0+.svg", mes.emoticon(1,.5,1))
			scala.xml.XML.save("gen/face_+0-.svg", mes.emoticon(1,.5,0))
			scala.xml.XML.save("gen/face_0++.svg", mes.emoticon(.5,1,1))
			scala.xml.XML.save("gen/face_0+-.svg", mes.emoticon(.5,1,0))
			scala.xml.XML.save("gen/face_0-+.svg", mes.emoticon(.5,0,1))
			scala.xml.XML.save("gen/face_0--.svg", mes.emoticon(.5,0,0))
			scala.xml.XML.save("gen/face_-0+.svg", mes.emoticon(0,.5,1))
			scala.xml.XML.save("gen/face_-0-.svg", mes.emoticon(0,.5,0))
			scala.xml.XML.save("gen/face_-+0.svg", mes.emoticon(0,1,.5))
			scala.xml.XML.save("gen/face_--0.svg", mes.emoticon(0,0,.5))

			scala.xml.XML.save("gen/face_+++.svg", mes.emoticon(1,1,1))
			scala.xml.XML.save("gen/face_++-.svg", mes.emoticon(1,1,0))
			scala.xml.XML.save("gen/face_+-+.svg", mes.emoticon(1,0,1))
			scala.xml.XML.save("gen/face_+--.svg", mes.emoticon(1,0,0))
			scala.xml.XML.save("gen/face_-++.svg", mes.emoticon(0,1,1))
			scala.xml.XML.save("gen/face_-+-.svg", mes.emoticon(0,1,0))
			scala.xml.XML.save("gen/face_--+.svg", mes.emoticon(0,0,1))
			scala.xml.XML.save("gen/face_---.svg", mes.emoticon(0,0,0))

		} catch {
		case e:Throwable =>
		  throw e
		if (!args.isEmpty && args(0)=="debug") {
			throw e
		} else {
			println("ERROR:")
			println(e.getMessage())
		}
		}
	}
}
