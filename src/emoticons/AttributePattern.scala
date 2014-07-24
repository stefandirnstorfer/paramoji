package emoticons

/** Pattern against which new SVG attribute values are matched */
abstract class AttributePattern {
	def getParams(text : String) : List[Param]
	def format(params : Iterator[Param]) : String
	def format(params : List[Param]) : String = format(params.iterator)
}

class SimpleAttributePattern(text : String) extends AttributePattern {
	val PARAM= "[+-]?[0-9]+(\\.[0-9]+)?|#[0-9a-fA-F]{6}".r
	val regex = PARAM.replaceAllIn(text
			.replaceAll("\\(","\\\\(")
			.replaceAll("\\)","\\\\)"), m => "([^,; ]+)").r
	val format = PARAM.replaceAllIn(text, "*")

	/** Rebuild the attribute value from interpolated values */
	def format(params : Iterator[Param]) : String = {
		"\\*".r.replaceAllIn(format, _ => params.next.toString())
	}
	
	/** Extract the numeric parameters for interpolation */
	def getParams(text : String) : List[Param] = {
		regex.findPrefixMatchOf(text) match {
		case Some(m) =>
		    m.subgroups.map { param =>
			if (param.startsWith("#")) {
			    val c= SVGUtil.parseColor(param)
				ColorParam(c._1, c._2, c._3)
			} else 
				NumberParam(param.toDouble) 
			}
		case _ => throw new MatchException("pattern not matched")
	   }
	}
	
	def defaultParams() = getParams(text)
	
	def doesMatch(text : String) = regex.findFirstIn(text).isDefined
	
	override def toString() = format
}

class PathAttributePattern(text : String) extends SimpleAttributePattern(SVGUtil.normalizePath(text)) {
	override def getParams(text : String) : List[Param] = {
	    super.getParams(SVGUtil.normalizePath(text))
	}
}

class StyleAttributePattern(text : String) extends AttributePattern {
	val styles = text.split(";").map { new SimpleAttributePattern(_) }
	
	def getParams(text : String) : List[Param] = {
		val stylesIn = text.split(";")
		styles.flatMap { style =>
		  val matchStyle = stylesIn.filter( style.doesMatch(_) )
		  if (matchStyle.isEmpty)
		    style.defaultParams()
		  else
		    style.getParams(matchStyle.head) 
		}.toList
	}
	
	def format(params : Iterator[Param]) : String = {
		styles.map { _.format(params) }.mkString(";")
	}
}

