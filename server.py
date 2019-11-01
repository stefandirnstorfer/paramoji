import http.server
import json
import numpy

PORT_NUMBER = 5555

def process(data):
    print(data)
    ticks = [-1.0, 0.0, 1.0]
    X = numpy.stack(numpy.meshgrid(ticks, ticks, ticks), -1).reshape(-1, 3)
    X = numpy.vstack((X, numpy.array(data['position'])/50.0 -1.0))

    print("X", X)

    B = numpy.array([X.shape[0]*[1], X[:,0]/10.0, X[:,1]/10.0, X[:,2]/10.0]).T
    Y = numpy.matmul(B, numpy.array(data['current']))

#    position= numpy.array(data['position'])/50.0 -1.0
#    B = numpy.vstack((B, numpy.hstack((1, position))))
#    Y = numpy.hstack((Y, 10*data['target']))
    Y[len(Y)-1] = 10*data['target']
    B[len(Y)-1,:] = 10 * B[len(Y)-1,:]

    print("B",B)

    print(Y)
    x = numpy.linalg.lstsq(B, Y, rcond=None)
    print('x0=', x[0])
    print(numpy.matmul(B, x[0]))
    return [int(round(y)) for y in x[0]]


class myHandler(http.server.BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, content-type, Access-Control-Request-Method, Access-Control-Request-Headers")
        self.end_headers()

    def do_POST(self):
        if self.path == "/update":
            content_len = int(self.headers['Content-Length'])
            post_body = self.rfile.read(content_len)
            data = json.loads(post_body)
            result= process(data)
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