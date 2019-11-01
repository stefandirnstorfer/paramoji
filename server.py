import http.server
import json
import numpy

PORT_NUMBER = 5555

def process(data):
    ticks = [-1.0, 0.0, 1.0]
    X = numpy.stack(numpy.meshgrid(ticks, ticks, ticks), -1).reshape(-1, 3)
    X = numpy.vstack((X, numpy.array(data['position'])/50.0 -1.0))

    B = numpy.array([X.shape[0]*[1], X[:,0]/10.0, X[:,1]/10.0, X[:,2]/10.0]).T
    Y = numpy.matmul(B, numpy.array(data['current']))

    Y[len(Y)-1] = 10*data['target']
    B[len(Y)-1,:] = 10 * B[len(Y)-1,:]

    x = numpy.linalg.lstsq(B, Y, rcond=None)
    return [int(round(y)) for y in x[0]]

def save(data):
    print("save", data)
    f= open("emoticon.js","r")
    lines= f.readlines()
    f.close()
    for i in range(len(lines)):
        for key in data.keys():
            if key in lines[i]:
                lines[i] = '    "'+key+'", ['+\
                       (",".join([("%4d"%y) for y in data[key]['x']])+'], ['+ \
                        ",".join([("%4d"%y) for y in data[key]['y']])+'],\n')
    f= open("emoticon.js","w")
    f. writelines(lines)
    f.close()
    return {"status" : "SUCCESS"}

class myHandler(http.server.BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, content-type, Access-Control-Request-Method, Access-Control-Request-Headers")
        self.end_headers()

    def do_POST(self):
        content_len = int(self.headers['Content-Length'])
        post_body = self.rfile.read(content_len)
        data = json.loads(post_body)
        result = None
        if self.path == "/update":
            result= process(data)
        if self.path == "/save":
            result= save(data)
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

try:
    server = http.server.HTTPServer(('', PORT_NUMBER), myHandler)
    print ('Started httpserver on port ' , PORT_NUMBER)

    #Wait forever for incoming htto requests
    server.serve_forever()

except KeyboardInterrupt:
    print ('^C received, shutting down the web server')
    server.socket.close()