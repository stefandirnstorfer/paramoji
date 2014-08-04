package emoticons

import java.io.BufferedWriter
import java.io.FileWriter
import java.io.PrintWriter
import scala.xml.PrettyPrinter
import java.io.File

object Emoticons extends App {
    val base = EmoticonStructure.load("faces/face_000.svg")

    def loadParameters(code : String) = {
    	val level = 2 - code.filter(_ == '0').length
    	val file = "faces/face_"+code+".svg"
    	val baseFile = if (level>0) "face_base-"+level+"_"+code+".svg" else "face_base-0.svg"
    	if (new File("faces/"+baseFile).exists())
    		base.getParametersFromFile(file, "faces/"+baseFile)
    	else
    		base.getParametersFromFile(file, "gen/"+baseFile)
    }
  
    def saveEmoticon(filename : String, param : MorphableParameter.ParameterSet) {
		println("Creating: "+filename)
		val out = new PrintWriter(filename)
 		out.write(new PrettyPrinter(100,2).formatNodes(base.format(param)))

		out.close();
    }
	
    val shape_ooo= base.getParametersFromFile("faces/face_000.svg")
    saveEmoticon("gen/face_000.svg", shape_ooo)
	saveEmoticon("gen/face_base-0.svg", shape_ooo)

	val shape_poo= loadParameters("+00")
	val shape_moo= loadParameters("-00")
	val shape_opo= loadParameters("0+0")
	val shape_omo= loadParameters("0-0")
	val shape_oop= loadParameters("00+")
	val shape_oom= loadParameters("00-")
	
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

	val shape_ppo = loadParameters("++0")
	val shape_pmo = loadParameters("+-0")
	val shape_pop = loadParameters("+0+")
	val shape_pom = loadParameters("+0-")
	val shape_opp = loadParameters("0++")
	val shape_opm = loadParameters("0+-")
	val shape_omp = loadParameters("0-+")
	val shape_omm = loadParameters("0--")
	val shape_mpo = loadParameters("-+0")
	val shape_mmo = loadParameters("--0")
	val shape_mop = loadParameters("-0+")
	val shape_mom = loadParameters("-0-")
	
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

	val shape_ppp = loadParameters("+++")
	val shape_ppm = loadParameters("++-")
	val shape_pmp = loadParameters("+-+")
	val shape_pmm = loadParameters("+--")
	val shape_mpp = loadParameters("-++")
	val shape_mmp = loadParameters("--+")
	val shape_mpm = loadParameters("-+-")
	val shape_mmm = loadParameters("---")

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
	val paramSets = List(shape_ooo, shape_poo, shape_moo, shape_opo, shape_omo, shape_oop, shape_oom,
	        shape_ppo, shape_pmo, shape_pop, shape_pom, shape_mpo, shape_mmo, shape_mop, shape_mom, shape_opp, shape_omp, shape_opm, shape_omm,
	        shape_ppp, shape_ppm, shape_pmp, shape_pmm, shape_mpp, shape_mpm, shape_mmp, shape_mmm)
    JSParamFormatter.saveToFile("gen/emoticon.js", base, paramSets)	
}

