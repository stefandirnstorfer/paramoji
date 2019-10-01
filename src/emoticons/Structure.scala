package emoticons

import scala.xml.Node
import scala.xml.MetaData
import scala.xml.UnprefixedAttribute
import scala.xml.Null
import scala.xml.Elem

class MatchException(msg : String, cause : Throwable) extends Exception(msg) {
	def this(msg : String) = this(msg, null)
}

class EmoticonStructure(val node : Node) {
	type ParameterSet = Map[String, List[Param]]
	val children = node.child.filter { !_.label.startsWith("#") }.map { new EmoticonStructure(_) }

	val attributes  = node.attributes.flatMap { attr => attr.key match {
				case "transform" => List("transform" -> new SimpleAttributePattern(attr.value.toString))
				case "style" => List("style" -> new StyleAttributePattern(attr.value.toString))
				case "d" => List("d" -> new PathAttributePattern(attr.value.toString))
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
		val excluded = node.attribute("morph").exists { _.text == "fixed" }
		val excludeChildren = node.attribute("morph").exists( _.text == "fix-children")
		if (excluded)
		  Map()
		else if (excludeChildren)
		  Map(nodeId.get -> this)
		else if (nodeId.isDefined)
		  recurse + (nodeId.get -> this)
		else
		  recurse
	}

	def getParameterList(node : Node) : List[Param] = {
	  try {
		attributes.flatMap{ case (key, pattern) => 
		  pattern.getParams(node.attribute(key).map( _.text).getOrElse {
		    throw new MatchException("Missing attribute : "+key);
		  })
		}
	  } catch {
	    case e:MatchException => 
	      val id = node.attribute("id").map(_.text).getOrElse("?")
	      throw new MatchException(e.getMessage() + " in node #"+id, e)
	  }
	}
	
	def getParameterSet(node : Node, map : Map[String, EmoticonStructure]) : ParameterSet = {
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
	
	def getParameterSet(otherNode : Node) : ParameterSet= {
	    getParameterSet(otherNode, getMap());
	}

	def getParametersFromFile(file: String): ParameterSet = {
		try {
		  getParameterSet(EmoticonStructure.loadAsXML(file))
		} catch {
			case e:MatchException =>
			throw new MatchException(file + ": "+e.getMessage, e)
		}
	}
	
	def getParametersFromFile(file : String, ref : ParameterSet) : ParameterSet = {
	  MorphableParameter.morph(1, -1, getParametersFromFile(file), ref)
	}

	def getParametersFromFile(file : String, ref : String) : ParameterSet = {
	  MorphableParameter.morph(1, -1, getParametersFromFile(file), getParametersFromFile(ref))
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
		val normalizer = new SVGTransformFlattener()
		normalizer.flatten(doc.head)
		//doc.head
	}

  	def load(file : String, minimize : Boolean) = {
  	  new EmoticonStructure(if (minimize)
  		  new SVGTransformFlattener().removeInkscapeStuff(loadAsXML(file))
  	    else 
  	      loadAsXML(file))
  	}
}

