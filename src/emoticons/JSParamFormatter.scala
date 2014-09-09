package emoticons

import java.io.PrintWriter
import scala.collection.mutable.MutableList

class JSParamFormatter {
	val coords = MutableList[JSParam]();

	class JSParam(params : List[Param]) extends Param {
	  def morph(thisFactor : Double, otherFactor : Double, otherParam : Param): Param = throw new UnsupportedOperationException
	  def isSignificant() = true
	  
	  def f(values:List[Double]) = "f([" + values.map(x => "%1.0f".format(x)).mkString(",") +"])"
	  def fround(values : List[Double]) = "'+Math.round("+f(values)+")+'";
	  override def toString() : String = {
		if (params.tail.exists( _.isSignificant )) {
			coords += this
			"?"
		} else
	      params(0).toString
	  }
	  def format() = {
		params.head match {
      		case _ : ColorParam => "'rgb("+fround(params.map{_.asInstanceOf[ColorParam].r})+","+
      				fround(params.map{_.asInstanceOf[ColorParam].g})+","+
      				fround(params.map{_.asInstanceOf[ColorParam].b})+")'"
      		case _ : NumberParam =>
      			f(params.map{k => k.asInstanceOf[NumberParam].value });
        }
	  }
	}
  
  
	val jsf = """var sv= Math.abs(v-50)/50, sa= Math.abs(a-50)/50, sp= Math.abs(p-50)/50;
	var f = function(x) {
      return (x[0] + sv*(v>50 ? x[1] : x[2])
	+ sa * (a>50 ? x[3] : x[4])
	+ sp * (p>50 ? x[5] : x[6])
	+ sv*sa * (v > 50 ?
		   (a > 50 ? x[7] : x[8]) :
		   (a > 50 ? x[11] : x[12]))
        + sv*sp * (v > 50 ?
		   (p > 50 ? x[9] : x[10]) :
		   (p > 50 ? x[13] : x[14]))
	+ sa*sp * (a > 50 ?
		   (p > 50 ? x[15] : x[17]) :
		   (p > 50 ? x[16] : x[18]))
	+ sv*sa*sp * (v > 50 ?
		      (a > 50 ?
		       (p > 50 ? x[19] : x[20]) :
		       (p > 50 ? x[21] : x[22])) :
		      (a > 50 ?
		       (p > 50 ? x[23] : x[24]) :
		       (p > 50 ? x[25] : x[26]))))
    };""";
	
	def merge(paramSets : List[Map[String, List[Param]]]) : Map[String, List[Param]] = {
	  Map(paramSets(0).keys.map {
	    case key =>
	      if (paramSets.exists(_.get(key).isEmpty)) {
	        println("Incomplete definition of #"+key)
	        ( key -> paramSets(0)(key) )
	      }
	      else {
	      	val iters = paramSets.map ( _(key).iterator )
	      	val length = paramSets(0)(key).length
	    	key -> { for(i <- 1 to length) yield new JSParam(iters.map( _.next )) }.toList
	      }
	  }.toList:_*)
	}
	
	def saveToFile(filename : String, base : EmoticonStructure, paramSets : List[Map[String, List[Param]]]) {
	  	val jsparam = merge(paramSets)
		val xml = base.format(jsparam).toString
	  	val out = new PrintWriter(filename)
	  	out.println("function emoticon_svg_raw(v,a,p) { "+jsf)
	  	out.println("var i=0, d="+coords.map(_.format).mkString("[",",","]")+";")
	  	out.print("return '")
	  	out.print(xml)
	  	out.println("'.replace(/\\?/g, function(x) { return d[i++];}); }")
	  	out.close()
	}
}