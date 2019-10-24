import numpy


def js_export(base, params, filename):
    labels = base.get_labels()
    masked_params = []

    file = open(filename, "w")
    file.write("function emoticon_svg_raw(v,a,p) {\n")
    file.write("  function h(n, x) { return Math.max(0, 1 - Math.abs(n - x/50)) }\n")
    file.write("  let i,j,k,X=[];\n")
    file.write("  for (i=0; i<=2; ++i) for(j=0; j<=2; ++j) for (k=0; k<=2; ++k) X.push(h(i,a)*h(j,v)*h(k,p))\n")
    file.write("  function dot(c) { var r=0.0; for (var i in X) r+=X[i]*c[i]; return r }\n")
    file.write("  let l=0, d=[")

    last_label = ""
    for i in range(params.shape[0]):
        if numpy.std(params[i,]) > 1:
            masked_params.append("?")
            nos = ["%.0f" % (params[i, j]) for j in range(params.shape[1])]
            if last_label != labels[i]:
                last_label = labels[i]
                file.write("\n      // " + labels[i])
            file.write("\n      [" + ",".join(nos) + "],")
        else:
            masked_params.append("%.3g" % params[i,0])
    file.write("\n  ].map(dot);\n")

    base.set_params(masked_params)

    svg= base.node.firstChild.toprettyxml().split('\n')
    file.write('  return (' + '\n      + '.join(["'" + row + "'" for row in svg if row != ""]))
    file.write('  ).replace(/\\?/g, () => d[l++]);')
    file.write("\n}\n")
    file.close()


def js_export2(base, params, filename):
    labels = base.get_labels()
    masked_params = []

    file = open(filename, "w")
    file.write("function emoticon_svg_raw2(v,a,p) {\n")
    file.write("  v=v/50-1; a=a/50-1; p=p/50-1;\n")
    file.write("  X=[1, v/10, a/10, p/10];\n")
    file.write("  let l=0, d=[")

    last_label = ""
    params[:,1:]= 10 * params[:,1:]
    for i in range(params.shape[0]):
        if numpy.max(numpy.abs(params[i,2:])) > (1 if params[i,1]>10 else 0.1):
            masked_params.append("?")
            nos = ["%4.0f" % (params[i, j]) for j in range(params.shape[1])]
            if last_label != labels[i]:
                last_label = labels[i]
                file.write("\n      // " + labels[i])
            file.write("\n      [" + ",".join(nos) + "],")
        else:
            masked_params.append("%.3g" % params[i,0])
    file.write("\n  ].map(c => X.reduceRight((a,b) => a + b*c.pop(), 0));\n")

    base.set_params(masked_params)

    svg= base.node.firstChild.toprettyxml().split('\n')
    file.write('  return [\n')
    file.write('      ' + ',\n      '.join(["'" + row + "'" for row in svg if row != ""]))
    file.write('\n    ].join("\\n").replace(/\\?/g, () => d[l++]);')
    file.write("\n}\n")
    file.close()
