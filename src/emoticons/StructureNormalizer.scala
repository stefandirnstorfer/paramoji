package emoticons

import scala.xml.Node
import scala.xml.Elem
import scala.xml.UnprefixedAttribute
import scala.xml.Null
import scala.xml.PrefixedAttribute
import scala.xml.MetaData
import scala.xml.Text
import scala.xml.TopScope
import scala.xml.NamespaceBinding
import scala.xml.NamespaceBinding

/*
 * Pushes transformations down to the child elements
 * Normalizes stroke width to multiples of 0.5
 */
class SVGTransformFlattener {

	var updateMap = Map[String, SVGMatrix]()
	var clipPathRef = Map[String, SVGMatrix]()
  
	def flatten(node : Node) : Node = {
	  findTransforms(node, SVGMatrix())
	  applyTransforms(node, SVGMatrix())
	}
  
	def findTransforms(node : Node, matrix : SVGMatrix) {
	 node match {
	  case Elem(prefix, label, attribs, scope, children @ _*) => {
	    val clipPath = node.attribute("clip-path").map{ _.text }
		val transform = node.attribute("transform").map{ _.text }
		val mymatrix = if (transform.isDefined) {
		  matrix.multiply(SVGMatrix.parseSVGTransformAttribute(transform.get))
		} else {
		  matrix
		}
	    clipPath.foreach( key => {
	      val m = "url\\(#([^)]*)\\)".r.findPrefixMatchOf(key).get.subgroups(0)
	      if (clipPathRef.contains(m))
	        throw new Exception("Duplicate reference")
	        clipPathRef += (m -> mymatrix)
	    })
		attribs.get("id").foreach {
			key => updateMap += (key.text -> mymatrix)
	  	}
	    children.foreach( findTransforms(_, mymatrix))
	  }
	  case _ => 
	  }
	}
	
	def applyTransforms(node : Node, refMatrix : SVGMatrix) : Node = {
	  node match {
	  case Elem(prefix, label, attribs, scope, children @ _*) => {
	    val optId = attribs.get("id").map(_.text)
	    val optMorph = attribs.get("morph").map(_.text)
		val matrix = refMatrix.multiply(
		    optId.flatMap { updateMap.get(_) }.getOrElse(SVGMatrix()))
	  	
	  	val newRefMatrix = (
	  	    optId.flatMap { clipPathRef.get(_) }.getOrElse(SVGMatrix()))

	  	val flatAttribs = if (label=="g" || label=="use")
  	  	  		attribs.remove("transform").remove("style")
	  		else 
	  			attribs.remove("transform")
	  	val isFiltered = attribs.get("morph").exists(_.text.matches("fix|fix-children")) || 
	  		optId.exists(_ == "lower-teeth")
	  	
	    if (optMorph.exists(_.matches("transform-only|relative")))
	      fixScalePath(node.asInstanceOf[Elem], matrix)
	    else
		    Elem(prefix, label,
		        if (isFiltered)
			      flatAttribs.append(new UnprefixedAttribute("transform", matrix.toString(), Null))
		        else if ("path"==label) {
		          val d = attribs.get("d").get.text
		          val d2 = SVGUtil.normalizePath(d, 
		              !optMorph.exists( _.matches("relative")), 
		              matrix)
		          val style2 = "stroke-width:([0-9.]*)".r.replaceAllIn(attribs("style").text, 
		              w => "stroke-width:" +(w.group(1).toDouble * Math.sqrt(matrix.det.abs)))

			      flatAttribs
			      	.append(new UnprefixedAttribute("d", d2, Null))
			      	.append(new UnprefixedAttribute("style", style2, Null))
		        } else if (label == "use") {
			 	    val ref = attribs.filter( _.prefixedKey == "xlink:href").value.text.replace("#","")
			 	    val mapMatrix = updateMap.get(ref).getOrElse(SVGMatrix())
			 	    val newMatrix = matrix.multiply(mapMatrix.inverse())
	  		        flatAttribs.append(new UnprefixedAttribute("transform", newMatrix.toString(), Null))
			    } else
			        flatAttribs,
			     scope,
			     	(if (isFiltered)
			     		children
			     	else
			     		children.map(applyTransforms(_, newRefMatrix))):_*)
	  }
	  case _ => node
	  }
	}
	
	def fixScalePath(path : Elem, transform : SVGMatrix) : Node = {
	  val d = path.attributes("d").text
	  val d2 = SVGUtil.normalizePath(d, true)
	  val NUMBER= "[+-]?[0-9]+(\\.[0-9]+)?".r
	  val PATHSEG= (" ("+NUMBER+"),("+NUMBER+")").r
	  val points = PATHSEG.findAllMatchIn(d2).map(m => (m.subgroups(0).toDouble, m.subgroups(2).toDouble)).toList
	  val x0 = points.map(_._1).min
	  val y0 = points.map(_._2).min
	  val w = points.map(_._1).max - x0
	  val h = points.map(_._2).max - y0
	  val matrix = SVGMatrix((w+h)/2,0,0,(w+h)/2,x0,y0)
	  //val unitD = SVGUtil.normalizePath(d, true, matrix.inverse)
	  val unitD = "M 1,0.5 C 1,0.78 0.78,1 0.5,1 0.22,1 0,0.78 0,0.5 0,0.22 0.22,0 0.5,0 0.78,0 1,0.22 1,0.5 z"
	  Elem(path.prefix, path.label,
	      path.attributes
	      	.append(new UnprefixedAttribute("d", unitD, Null))
	      	.append(new UnprefixedAttribute("transform", transform.multiply(matrix).toString, Null))
	      	.append(new UnprefixedAttribute("style", 
	      	    "stroke-width:([0-9.]*)".r.replaceAllIn(
	      	        path.attributes("style").text,
	      	        m => "stroke-width:" + m.subgroups(0).toDouble/Math.sqrt(w*h)), Null)),
	      path.scope)
	}
	
	def removeInkscapeStuff(node : Node) : Node = node match {
	  case Elem(prefix, label, attribs, scope, children @ _*) => {
		def newAttr(attr : MetaData) : MetaData = {
		  if (attr == Null)
		    Null
		  else if (attr.key.matches("morph") ||
		           attr.prefixedKey.matches("^(inkscape|sodipodi|xmlns):.*"))
			  newAttr(attr.next)
		  else 
	        attr.copy(newAttr(attr.next))
	    }
		
		if ((prefix!=null && prefix.matches("rdf|dc|sodipodi|inkscape")) || 
		    label.matches("metadata|namedview")) {
			Text("")
		} else
		Elem(prefix, label,
	    	newAttr(attribs),
	    	if (label=="svg")
		        new NamespaceBinding(null,"http://www.w3.org/2000/svg",
		        new NamespaceBinding("xlink","http://www.w3.org/1999/xlink",TopScope))
	    	else TopScope,
     		children.map(removeInkscapeStuff(_)):_*)
	  }
	  case _ => node
	}
}
