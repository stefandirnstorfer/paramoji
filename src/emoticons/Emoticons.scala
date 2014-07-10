package emoticons

import scala.xml.Node
import scala.xml.MetaData
import scala.xml.UnprefixedAttribute
import scala.xml.Null
import scala.xml.Elem

class MatchException(msg : String, cause : Throwable) extends Exception(msg, cause) {
	def this(msg : String) = this(msg, null)
}

class EmoticonStructure(val node : Node) {
	val children = node.child.filter { !_.label.startsWith("#") }.map { new EmoticonStructure(_) }

	val attributes  = node.attributes.flatMap { attr => attr.key match {
				case "transform" => List("transform" -> new SimpleAttributePattern(attr.value.toString))
				case "style" => List("style" -> new StyleAttributePattern(attr.value.toString))
				case "d" => List("d" -> new PathAttributePattern(SVGUtil.normalizePath(attr.value.toString)))
				case _ => List()
	}}.toList

	def format_replaceAttribs(attr : MetaData, params : Iterator[Param]) : MetaData = {
		attributes.foldLeft(attr) { case (newAttr, (key, pattern)) => 
			val newValue= pattern.format(params);
		  	newAttr.append(new UnprefixedAttribute(key, newValue, Null))
		  }
	}

	def getMap() : Map[String, EmoticonStructure] = {
		val recurse = children.map { _.getMap() }.fold(Map()) ( _ ++ _ )
		val nodeId = node.attribute("id").map{ _.text }
		if (nodeId.isDefined)
		  recurse + (nodeId.get -> this)
		else
		  recurse
	}

	def getParameterList(node : Node) : List[Param] = {
		attributes.flatMap{ case (key, pattern) => pattern.getParams(node.attribute(key).get.text) }
	}
	
	def getParameterSet(node : Node, map : Map[String, EmoticonStructure]) : Map[String, List[Param]] = {
		val recurse = node.child
				.filter { !_.label.startsWith("#") }
				.map { getParameterSet(_, map) }
				.foldLeft(Map[String, List[Param]]())(_ ++ _)
		val nodeId = node.attribute("id").map{_.text }
		if (nodeId.isDefined && map.contains(nodeId.get)) {
		  recurse + (nodeId.get -> map.get(nodeId.get).get.getParameterList(node))
		} else
		  recurse
	}
	
	def getParameterSet(otherNode : Node) : Map[String, List[Param]]= {
	    getParameterSet(otherNode, getMap());
	}

	def getParametersFromFile(file: String): Map[String, List[Param]] = {
		try {
		  getParameterSet(EmoticonStructure.loadAsXML(file))
		} catch {
			case e:MatchException =>
			throw new MatchException(file + ": "+e.getMessage, e)
		}
	}

	def format(param : Map[String,List[Param]]) : Node = node match {
	case Elem(prefix, label, attribs, scope, _*) => {
		val nodeId = node.attribute("id").map{ _.text }
		Elem(prefix, label,
		    if (nodeId.isDefined && param.contains(nodeId.get))
		    	format_replaceAttribs(attribs, param(nodeId.get).iterator)
		    else
		        attribs, 
			scope, 
				children.map { _.format(param) }:_*
		)
	}
	case _ => node
	}
	
}

object EmoticonStructure {
  	def loadAsXML(file : String) : Node = {
		val src= scala.io.Source.fromFile(file)
		val doc= scala.xml.parsing.XhtmlParser.apply(src)
		doc.head
	}

  	def load(file : String) = new EmoticonStructure(loadAsXML(file))
}

object Emoticons extends App {
	val base = EmoticonStructure.load("faces/face_000.svg")
	val shape_ooo= base.getParametersFromFile("faces/face_000.svg")
	val shape_poo= base.getParametersFromFile("faces/face_+00.svg")
	val shape_moo= base.getParametersFromFile("faces/face_-00.svg")
	val shape_opo= base.getParametersFromFile("faces/face_0+0.svg")
	val shape_omo= base.getParametersFromFile("faces/face_0-0.svg")
	val shape_oop= base.getParametersFromFile("faces/face_00+.svg")
	val shape_oom= base.getParametersFromFile("faces/face_00-.svg")
	
	def emoticon(v: Double, a: Double, p:Double) : Node = {
		val sv = Math.abs(1-2*v)
		val sa = Math.abs(1-2*a)
		val sp = Math.abs(1-2*p)
		val param= MorphableParameter.morph(1-sv-sa-sp, shape_ooo, 
				MorphableParameter.morph(sv/(sa+sv+sp),
						if (v>0.5) shape_poo else shape_moo,
						MorphableParameter.morph(sa/(sa+sp),
								if (a>0.5) shape_opo else shape_omo,
								if (p>0.5) shape_oop else shape_oom)))
	    base.format(param)
	}

	scala.xml.XML.save("gen/face_000.svg", emoticon(.5,.5,.5))

	scala.xml.XML.save("gen/face_0+0.svg", emoticon(.5,1,.5))
	scala.xml.XML.save("gen/face_0-0.svg", emoticon(.5,0,.5))
	scala.xml.XML.save("gen/face_+00.svg", emoticon(1,.5,.5))
	scala.xml.XML.save("gen/face_-00.svg", emoticon(0,.5,.5))
	scala.xml.XML.save("gen/face_00+.svg", emoticon(.5,.5,1))
	scala.xml.XML.save("gen/face_00-.svg", emoticon(.5,.5,0))

	scala.xml.XML.save("gen/face_++0.svg", emoticon(1,1,.5))
	scala.xml.XML.save("gen/face_+-0.svg", emoticon(1,0,.5))
	scala.xml.XML.save("gen/face_+0+.svg", emoticon(1,.5,1))
	scala.xml.XML.save("gen/face_+0-.svg", emoticon(1,.5,0))
	scala.xml.XML.save("gen/face_0++.svg", emoticon(.5,1,1))
	scala.xml.XML.save("gen/face_0+-.svg", emoticon(.5,1,0))
	scala.xml.XML.save("gen/face_0-+.svg", emoticon(.5,0,1))
	scala.xml.XML.save("gen/face_0--.svg", emoticon(.5,0,0))
	scala.xml.XML.save("gen/face_-0+.svg", emoticon(0,.5,1))
	scala.xml.XML.save("gen/face_-0-.svg", emoticon(0,.5,0))
	scala.xml.XML.save("gen/face_-+0.svg", emoticon(0,1,.5))
	scala.xml.XML.save("gen/face_--0.svg", emoticon(0,0,.5))

	scala.xml.XML.save("gen/face_+++.svg", emoticon(1,1,1))
	scala.xml.XML.save("gen/face_++-.svg", emoticon(1,1,0))
	scala.xml.XML.save("gen/face_+-+.svg", emoticon(1,0,1))
	scala.xml.XML.save("gen/face_+--.svg", emoticon(1,0,0))
	scala.xml.XML.save("gen/face_-++.svg", emoticon(0,1,1))
	scala.xml.XML.save("gen/face_-+-.svg", emoticon(0,1,0))
	scala.xml.XML.save("gen/face_--+.svg", emoticon(0,0,1))
	scala.xml.XML.save("gen/face_---.svg", emoticon(0,0,0))
}

