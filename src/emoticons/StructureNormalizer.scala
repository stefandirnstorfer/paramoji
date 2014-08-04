package emoticons

import scala.xml.Node
import scala.xml.Elem
import scala.xml.UnprefixedAttribute
import scala.xml.Null
import scala.xml.PrefixedAttribute
import scala.xml.MetaData

/*
 * Pushes transformations down to the child elements
 * Normalizes stroke width to multiples of 0.5
 */
class SVGTransformFlattener {

	val FILTERED_GROUPS = List("upper-teeth","lower-teeth")
  
	var updateMap = Map[String, SVGMatrix]()
	var clipPathRef = Map[String, SVGMatrix]()
  
	val idMap = Map("defs4"->"defs",
			"path164" -> "head-outline",
			"path3622" -> "left-eye-outline",
			"clipPath2967" -> "clipPath-left-eye",
			"lens" -> "left-eyeball",
			"g4403" -> "left-lens",
			"use3959" -> "right-eye-outline",
			"g4015" -> "right-eyeball",
			"clipPath4022" -> "clipPath-right-eye",
			"use5959" -> "use-left-eye-outline-2",
			"use2969" -> "use-left-eye-outline-1")
	
	def flatten(node : Node) : Node = {
	  findTransforms(node, SVGMatrix())
	  fixIds(applyTransforms(node, SVGMatrix()))
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
		val matrix = refMatrix.multiply(
		    optId.flatMap { updateMap.get(_) }.getOrElse(SVGMatrix()))
	  	
	  	val newRefMatrix = (
	  	    optId.flatMap { clipPathRef.get(_) }.getOrElse(SVGMatrix()))

	  	val flatAttribs = if (label=="g")
  	  	  		attribs.remove("transform").remove("style")
	  		else 
	  			attribs.remove("transform")
	  	val isFiltered = optId.exists(FILTERED_GROUPS.contains(_))
	  	
	    Elem(prefix, label,
	        if (isFiltered)
		      flatAttribs.append(new UnprefixedAttribute("transform", matrix.toString(), Null))
	        else if ("path"==label) {
	          val d = attribs.get("d").get.text
	          val d2 = SVGUtil.normalizePath(d, matrix)
	          val style = attribs.get("style").get.text
	          val style2 = "stroke-width:([^;p]*)".r.replaceAllIn(style, 
	              w => "stroke-width:" + (Math.round( 2* w.group(1).toDouble * Math.sqrt(matrix.det.abs))/2.0).toString())
		      flatAttribs
		      	.append(new UnprefixedAttribute("style", style2, Null))
		      	.append(new UnprefixedAttribute("d", d2, Null))
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
	
	def fixIds(node : Node) : Node = {
	  	  node match {
	  case Elem(prefix, label, attribs, scope, children @ _*) => {
	  	def mapA(id : String) = idMap.get(id).getOrElse(id)
	  	def mapR(url : String) = "#([0-9a-zA-Z]*)".r.replaceAllIn(url, m => "#" + mapA(m.subgroups(0)))
	  	
		def newAttr(attr : MetaData) : MetaData = {
		  if (attr == Null)
		    Null
		  else if (attr.key == "id")
			  new UnprefixedAttribute("id", mapA(attr.value.text), newAttr(attr.next))
		  else if (attr.key == "clip-path")
			  new UnprefixedAttribute("clip-path", mapR(attr.value.text), newAttr(attr.next))
		  else if (attr.prefixedKey == "xlink:href")
			  new PrefixedAttribute("xlink","href", mapR(attr.value.text), newAttr(attr.next))
	      else 
	        attr.append(newAttr(attr.next))
	    }
	      
	    Elem(prefix, label,
	    	newAttr(attribs),
	        scope,
     		children.map(fixIds(_)):_*)
	  }
	  case _ => node
	  }

	}
}
