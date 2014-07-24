package emoticons

import scala.xml.Node
import scala.xml.MetaData
import scala.xml.UnprefixedAttribute
import scala.xml.Null
import scala.xml.Elem
import java.io.BufferedWriter
import java.io.FileWriter
import java.io.PrintWriter
import scala.xml.PrettyPrinter

class MatchException(msg : String, cause : Throwable) extends Exception(msg) {
	def this(msg : String) = this(msg, null)
}


class EmoticonStructure(val node : Node) {
	type ParameterSet = Map[String, List[Param]]
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
		val excluded = node.attribute("morph").exists { _.text == "fixed" } ||
			node.prefix == "sodipodi" || node.prefix == "inkscape"
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
		        attribs.remove("morph"), 
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
	def saveEmoticon(filename : String, param : MorphableParameter.ParameterSet) {
		println("Creating: "+filename)
		val out = new PrintWriter(filename)
 		out.write(new PrettyPrinter(100,2).formatNodes(base.format(param)))

		out.close();
	}
	
	val base = EmoticonStructure.load("faces/face_000.svg")
	val shape_ooo= base.getParametersFromFile("faces/face_000.svg")
	
	saveEmoticon("gen/face_000.svg", shape_ooo)

	val shape_poo= base.getParametersFromFile("faces/face_+00.svg", shape_ooo)
	val shape_moo= base.getParametersFromFile("faces/face_-00.svg", shape_ooo)
	val shape_opo= base.getParametersFromFile("faces/face_0+0.svg", shape_ooo)
	val shape_omo= base.getParametersFromFile("faces/face_0-0.svg", shape_ooo)
	val shape_oop= base.getParametersFromFile("faces/face_00+.svg", shape_ooo)
	val shape_oom= base.getParametersFromFile("faces/face_00-.svg", shape_ooo)
	
	def emoticon(v: Double, a: Double, p:Double)  = {
		val sv = Math.abs(1-2*v)
		val sa = Math.abs(1-2*a)
		val sp = Math.abs(1-2*p)
		var param = shape_ooo
		param = MorphableParameter.morph(1, sv, param,
						if (v>0.5) shape_poo else shape_moo)
		param = MorphableParameter.morph(1, sa, param,
						if (a>0.5) shape_opo else shape_omo)
		param = MorphableParameter.morph(1, sp, param,
						if (p>0.5) shape_oop else shape_oom)
		param
	}
	saveEmoticon("gen/face_0+0.svg", emoticon(.5,1,.5))
	saveEmoticon("gen/face_0-0.svg", emoticon(.5,0,.5))
	saveEmoticon("gen/face_+00.svg", emoticon(1,.5,.5))
	saveEmoticon("gen/face_-00.svg", emoticon(0,.5,.5))
	saveEmoticon("gen/face_00+.svg", emoticon(.5,.5,1))
	saveEmoticon("gen/face_00-.svg", emoticon(.5,.5,0))

	saveEmoticon("gen/face_base-1_++0.svg", emoticon(1,1,.5))
	saveEmoticon("gen/face_base-1_+-0.svg", emoticon(1,0,.5))
	saveEmoticon("gen/face_base-1_+0+.svg", emoticon(1,.5,1))
	saveEmoticon("gen/face_base-1_+0-.svg", emoticon(1,.5,0))
	saveEmoticon("gen/face_base-1_0++.svg", emoticon(.5,1,1))
	saveEmoticon("gen/face_base-1_0+-.svg", emoticon(.5,1,0))
	saveEmoticon("gen/face_base-1_0-+.svg", emoticon(.5,0,1))
	saveEmoticon("gen/face_base-1_0--.svg", emoticon(.5,0,0))
	saveEmoticon("gen/face_base-1_-0+.svg", emoticon(0,.5,1))
	saveEmoticon("gen/face_base-1_-0-.svg", emoticon(0,.5,0))
	saveEmoticon("gen/face_base-1_-+0.svg", emoticon(0,1,.5))
	saveEmoticon("gen/face_base-1_--0.svg", emoticon(0,0,.5))

	val shape_ppo = base.getParametersFromFile("faces/face_++0.svg", "faces/face_base-1_++0.svg")
	val shape_pmo = base.getParametersFromFile("faces/face_+-0.svg", "faces/face_base-1_+-0.svg")
	val shape_pop = base.getParametersFromFile("faces/face_+0+.svg", "faces/face_base-1_+0+.svg")
	val shape_pom = base.getParametersFromFile("faces/face_+0-.svg", "faces/face_base-1_+0-.svg")
	val shape_opp = base.getParametersFromFile("faces/face_0++.svg", "faces/face_base-1_0++.svg")
	val shape_opm = base.getParametersFromFile("faces/face_0+-.svg", "faces/face_base-1_0+-.svg")
	val shape_omp = base.getParametersFromFile("faces/face_0-+.svg", "faces/face_base-1_0-+.svg")
	val shape_omm = base.getParametersFromFile("faces/face_0--.svg", "faces/face_base-1_0--.svg")
	val shape_mpo = base.getParametersFromFile("faces/face_-+0.svg", "faces/face_base-1_-+0.svg")
	val shape_mmo = base.getParametersFromFile("faces/face_--0.svg", "faces/face_base-1_--0.svg")
	val shape_mop = base.getParametersFromFile("faces/face_-0+.svg", "faces/face_base-1_-0+.svg")
	val shape_mom = base.getParametersFromFile("faces/face_-0-.svg", "faces/face_base-1_-0-.svg")
	
	val fixattr1 = List[String]()
	def emoticon2(v: Double, a: Double, p: Double) = {
  		val sv = Math.abs(1-2*v)
		val sa = Math.abs(1-2*a)
		val sp = Math.abs(1-2*p)
		var param = emoticon(v, a, p)
		val values = fixattr1.map(key => (key -> param(key)))
		if (v > .5 && a > .5)
			param = MorphableParameter.morph(1, sv*sa, param, shape_ppo)
		if (v > .5 && a < .5)
			param = MorphableParameter.morph(1, sv*sa, param, shape_pmo)
		if (v > .5 && p > .5)
			param = MorphableParameter.morph(1, sv*sp, param, shape_pop)
		if (v > .5 && p < .5)
			param = MorphableParameter.morph(1, sv*sp, param, shape_pom)
		if (v < .5 && a > .5)
			param = MorphableParameter.morph(1, sv*sa, param, shape_mpo)
		if (v < .5 && a < .5)
			param = MorphableParameter.morph(1, sv*sa, param, shape_mmo)
		if (v < .5 && p > .5)
			param = MorphableParameter.morph(1, sv*sp, param, shape_mop)
		if (v < .5 && p < .5)
			param = MorphableParameter.morph(1, sv*sp, param, shape_mom)
		if (a > .5 && p < .5)
			param = MorphableParameter.morph(1, sa*sp, param, shape_opm)
		if (a > .5 && p > .5)
			param = MorphableParameter.morph(1, sa*sp, param, shape_opp)
		if (a < .5 && p > .5)
			param = MorphableParameter.morph(1, sa*sp, param, shape_omp)
		if (a < .5 && p < .5)
			param = MorphableParameter.morph(1, sa*sp, param, shape_omm)
		param ++= values
		param
	}
	
	saveEmoticon("gen/face_++0.svg", emoticon2(1,1,.5))
	saveEmoticon("gen/face_+-0.svg", emoticon2(1,0,.5))
	saveEmoticon("gen/face_+0+.svg", emoticon2(1,.5,1))
	saveEmoticon("gen/face_+0-.svg", emoticon2(1,.5,0))
	saveEmoticon("gen/face_0++.svg", emoticon2(.5,1,1))
	saveEmoticon("gen/face_0+-.svg", emoticon2(.5,1,0))
	saveEmoticon("gen/face_0-+.svg", emoticon2(.5,0,1))
	saveEmoticon("gen/face_0--.svg", emoticon2(.5,0,0))
	saveEmoticon("gen/face_-0+.svg", emoticon2(0,.5,1))
	saveEmoticon("gen/face_-0-.svg", emoticon2(0,.5,0))
	saveEmoticon("gen/face_-+0.svg", emoticon2(0,1,.5))
	saveEmoticon("gen/face_--0.svg", emoticon2(0,0,.5))

	saveEmoticon("gen/face_base-2_+++.svg", emoticon2(1,1,1))
	saveEmoticon("gen/face_base-2_++-.svg", emoticon2(1,1,0))
	saveEmoticon("gen/face_base-2_+-+.svg", emoticon2(1,0,1))
	saveEmoticon("gen/face_base-2_+--.svg", emoticon2(1,0,0))
	saveEmoticon("gen/face_base-2_-++.svg", emoticon2(0,1,1))
	saveEmoticon("gen/face_base-2_-+-.svg", emoticon2(0,1,0))
	saveEmoticon("gen/face_base-2_--+.svg", emoticon2(0,0,1))
	saveEmoticon("gen/face_base-2_---.svg", emoticon2(0,0,0))

	val shape_ppp = base.getParametersFromFile("faces/face_+++.svg", "faces/face_base-2_+++.svg")
	val shape_ppm = base.getParametersFromFile("faces/face_++-.svg", "faces/face_base-2_++-.svg")
	val shape_pmp = base.getParametersFromFile("faces/face_+-+.svg", "faces/face_base-2_+-+.svg")
	val shape_pmm = base.getParametersFromFile("faces/face_+--.svg", "faces/face_base-2_+--.svg")
	val shape_mpp = base.getParametersFromFile("faces/face_-++.svg", "faces/face_base-2_-++.svg")
	val shape_mmp = base.getParametersFromFile("faces/face_--+.svg", "faces/face_base-2_--+.svg")
	val shape_mpm = base.getParametersFromFile("faces/face_-+-.svg", "faces/face_base-2_-+-.svg")
	val shape_mmm = base.getParametersFromFile("faces/face_---.svg", "faces/face_base-2_---.svg")

	val fixattr2 = List[String]()
	def emoticon3(v: Double, a: Double, p: Double) = {
		val s = Math.abs(1-2*v) * Math.abs(1-2*a) * Math.abs(1-2*p)
		var param = emoticon2(v, a, p)
		val values = fixattr2.map(key => (key -> param(key)))
		if (v > .5 && a > .5 && p >.5)
			param = MorphableParameter.morph(1, s, param, shape_ppp)
		if (v > .5 && a > .5 && p <.5)
			param = MorphableParameter.morph(1, s, param, shape_ppm)
		if (v > .5 && a < .5 && p >.5)
			param = MorphableParameter.morph(1, s, param, shape_pmp)
		if (v > .5 && a < .5 && p <.5)
			param = MorphableParameter.morph(1, s, param, shape_pmm)
		if (v < .5 && a > .5 && p >.5)
			param = MorphableParameter.morph(1, s, param, shape_mpp)
		if (v < .5 && a > .5 && p <.5)
			param = MorphableParameter.morph(1, s, param, shape_mpm)
		if (v < .5 && a < .5 && p >.5)
			param = MorphableParameter.morph(1, s, param, shape_mmp)
		if (v < .5 && a < .5 && p <.5)
			param = MorphableParameter.morph(1, s, param, shape_mmm)
		param ++= values
		param
	}

	saveEmoticon("gen/face_+++.svg", emoticon3(1,1,1))
	saveEmoticon("gen/face_++-.svg", emoticon3(1,1,0))
	saveEmoticon("gen/face_+-+.svg", emoticon3(1,0,1))
	saveEmoticon("gen/face_+--.svg", emoticon3(1,0,0))
	saveEmoticon("gen/face_-++.svg", emoticon3(0,1,1))
	saveEmoticon("gen/face_-+-.svg", emoticon3(0,1,0))
	saveEmoticon("gen/face_--+.svg", emoticon3(0,0,1))
	saveEmoticon("gen/face_---.svg", emoticon3(0,0,0))

	println("Writing Javascript code")
	val out = new PrintWriter("gen/emoticon.js")
	out.print("function emoticon_svg_raw(f) { return '")
	val paramSets = List(shape_ooo, shape_poo, shape_moo, shape_opo, shape_omo, shape_oop, shape_oom,
	        shape_ppo, shape_pmo, shape_pop, shape_pom, shape_mpo, shape_mmo, shape_mop, shape_mom, shape_opp, shape_omp, shape_opm, shape_omm,
	        shape_ppp, shape_ppm, shape_pmp, shape_pmm, shape_mpp, shape_mpm, shape_mmp, shape_mmm)
	val jsparam = JSParamFormatter.merge(paramSets)
	out.print(base.format(jsparam).toString)
	out.println("'; }")
	out.close()
	
}

