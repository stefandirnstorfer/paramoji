package emoticons

class JSParam(params : List[Param]) extends Param {
  def morph(thisFactor : Double, otherFactor : Double, otherParam : Param): Param = throw new UnsupportedOperationException
  override def toString : String = {
    params.head match {
      case _ : ColorParam => params(0).toString
      case _ : NumberParam => 
        if (params.tail.exists( _.asInstanceOf[NumberParam].value.abs > 0.01))
        	"'+f(["+params.map{_.toString}.mkString(",")+"])+'";
        else
          params(0).toString
    }
  }
}

object JSParamFormatter {
	def merge(paramSets : List[Map[String, List[Param]]]) : Map[String, List[Param]] = {
	  Map(paramSets(0).keys.map {
	    case key =>
	      	val iters = paramSets.map ( _(key).iterator )
	      	val length = paramSets(0)(key).length
	    	key -> { for(i <- 1 to length) yield new JSParam(iters.map( _.next )) }.toList
	  }.toList:_*)
	}	
}