package emoticons

abstract class Param {
  	def morph(thisFactor : Double, otherFactor : Double, otherParam : Param): Param
}

case class NumberParam(val value:Double) extends Param {
  override def toString() : String =
	if (value == value.toInt)
		value.toInt.toString
	else
		SVGUtil.format(value)

  	def morph(thisFactor : Double, otherFactor : Double, otherParam : Param): Param = {
	  NumberParam(thisFactor * value + otherFactor * otherParam.asInstanceOf[NumberParam].value)
	}
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
}

object MorphableParameter {
  	def morph(left: Double, right: Double, shape1:List[Param], shape2:List[Param]):List[Param] = {
		val it= shape2.iterator
		shape1.map { _.morph(left, right, it.next) }
	}

	def morph(left: Double, right:Double, shape1: Map[String, List[Param]], shape2: Map[String, List[Param]]) : Map[String,List[Param]] = {
		Map((shape1.keys.toList ++ shape2.keys.toList).map { key =>
		  (shape1.get(key), shape2.get(key)) match {
		    case (Some(a), None) => (key -> a)
		    case (None, Some(b)) => (key -> b)
		    case (Some(a), Some(b)) => (key -> morph(left, right, a, b))
		    case (None, None) => (key -> List())
		  }
		}:_*)
	}

	def morph(left : Double, shape1: Map[String, List[Param]], shape2: Map[String, List[Param]]) : Map[String,List[Param]] = {
  		if (left == 1) return shape1
		if (left == 0) return shape2
		morph(left, 1-left, shape1, shape2)
	}
}