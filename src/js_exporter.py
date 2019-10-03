import numpy


def js_export(base, params, filename):
    masked_params = []

    file = open(filename, "w")
    file.write("function emoticon_svg_raw(v,a,p) {\n")
    file.write("  function h(n, x) { return Math.max(0, 1 - Math.abs(n - x/50)) }\n")
    file.write("  X=[];\n")
    file.write("  for (var i=0; i<=2; ++i) for(var j=0; j<=2; ++j) for (var k=0; k<=2; ++k) X.push(h(i,a)*h(j,v)*h(k,p))\n")
    file.write("  function dot(c) { var r=0.0; for (var i in X) r+=X[i]*c[i]; return r }\n")
    file.write("  var i=0, d=[")

    for i in range(params.shape[0]):
        if numpy.std(params[i,]) > 1:
            masked_params.append("?")
            nos = ["%.0f" % (params[i, j]) for j in range(params.shape[1])]
            file.write("\n      [" + ",".join(nos) + "],")
        else:
            masked_params.append("%.2g" % params[i,0])
    file.write("\n  ].map(dot);\n")

    base.set_params(masked_params)

    svg= base.node.firstChild.toprettyxml().split('\n')
    file.write('  return (' + '\n      + '.join(["'" + row + "'" for row in svg if row != ""]))
    file.write('  ).replace(/\\?/g, () => d[i++]);')
    file.write("\n}\n")
    file.close()
