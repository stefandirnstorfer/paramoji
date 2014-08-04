package emoticons

abstract class Param {
  	def morph(thisFactor : Double, otherFactor : Double, otherParam : Param): Param
	def isSignificant : Boolean
}

case class NumberParam(val value:Double) extends Param {
  override def toString() : String = SVGUtil.format(value)

  	def morph(thisFactor : Double, otherFactor : Double, otherParam : Param): Param = {
	  NumberParam(thisFactor * value + otherFactor * otherParam.asInstanceOf[NumberParam].value)
	}
  
  	def isSignificant() = value.abs > 0.5
}

case class ColorParam(val r:Double, g:Double, b:Double) extends Param {
  override def toString() : String =
	  SVGUtil.formatColor(r.toInt,g.toInt,b.toInt)

  	def morph(thisFactor : Double, otherFactor : Double, otherParam : Param): Param = {
	  	val other = otherParam.asInstanceOf[ColorParam]
		ColorParam(thisFactor * r + otherFactor * other.r,
				   thisFactor * g + otherFactor * other.g,
				   thisFactor * b + otherFactor * other.b)
	}
  
  	def isSignificant = (r.abs > 10) || (g.abs > 10) || (b.abs > 10)
}


object MorphableParameter {
	type ParameterSet = Map[String, List[Param]]
  	def morph(left: Double, right: Double, shape1:List[Param], shape2:List[Param]):List[Param] = {
		val it= shape2.iterator
		shape1.map { _.morph(left, right, it.next) }
	}

	def morph(left: Double, right:Double, shape1: ParameterSet, shape2: ParameterSet) : Map[String,List[Param]] = {
		Map((shape1.keys.toList ++ shape2.keys.toList).removeDuplicates.map { key =>
		  (shape1.get(key), shape2.get(key)) match {
		    case (Some(a), None) => (key -> morph(left, right, a, a))
		    case (None, Some(b)) => (key -> morph(left, right, b, b))
		    case (Some(a), Some(b)) => (key -> morph(left, right, a, b))
		    case (None, None) => (key -> List())
		  }
		}:_*)
	}
}