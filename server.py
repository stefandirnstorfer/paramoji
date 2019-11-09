import http.server
import json
import numpy
import math


def normalize(data):
    print("Normalizing")
    group= ['#left-eye-outline:' + pos for pos in ['6','1','2']]
    X= numpy.array([data[pos]['x'] for pos in group], dtype='f')
    Y= numpy.array([data[pos]['y'] for pos in group], dtype='f')
    print(X)
    Xmean = numpy.mean(X, axis=0)
    Ymean = numpy.mean(Y, axis=0)
    Xna= X[:,0]-X[:,2]/10
    Yna= Y[:,0]-Y[:,2]/10
    X0= numpy.mean(Xna)
    Y0= numpy.mean(Yna)
    X[:,0]= X[:,0] + math.round(X0 - Xna)
    Y[:,0]= Y[:,0] + math.round(Y0 - Yna)
    Xmean = numpy.mean(X, axis=0)
    Ymean = numpy.mean(Y, axis=0)
    Xna= X[:,0]-X[:,2]/10
    Yna= Y[:,0]-Y[:,2]/10
    X0= numpy.mean(Xna)
    Y0= numpy.mean(Yna)
    X[:,2]= X[:,2] + 10*math.round(X0 - Xna)
    Y[:,2]= Y[:,2] + 10*math.round(Y0 - Yna)
    X[:,1]= Xmean[1]
    X[:,3]= Xmean[3]
    Y[:,1]= Ymean[1]
    Y[:,3]= Ymean[1]
    for i in range(len(group)):
        data[group[i]]['x'] = X[i, :].tolist()
        data[group[i]]['y'] = Y[i, :].tolist()
    return data


def minimpact(data):
    n= len(data['current'])-1
    ticks = [[-1.0, 0.0, 1.0]]*3 + [[0.0, 1.0]]*(n-3)
    X = numpy.stack(numpy.meshgrid(*ticks), -1).reshape(-1, n)
    X = numpy.vstack((X, numpy.array(data['position'])[0:n]))

    B = numpy.hstack((numpy.array([X.shape[0]*[1]]).T, X/10.0))
    Y = numpy.matmul(B, numpy.array(data['current']))

    Y[len(Y)-1] = 10 * data['target']
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
            if ('"'+key+'"') in lines[i]:
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
            result= minimpact(data)
        if self.path == "/save":
            result= save(data)
        if self.path == "/normalize":
            result= normalize(data)
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

try:
    PORT_NUMBER = 5555
    server = http.server.HTTPServer(('', PORT_NUMBER), myHandler)
    print ('Started httpserver on port ' , PORT_NUMBER)

    #Wait forever for incoming htto requests
    server.serve_forever()

except KeyboardInterrupt:
    print ('^C received, shutting down the web server')
    server.socket.close()
