import http.server
import json
import numpy
import math


def align_y(data, group):
    Y= numpy.array([data[pos]['y'][0:4] for pos in group], dtype='f')
    Y0 = (numpy.mean(Y[:,0] - Y[:,2]/10))
    gap = Y0 - (Y[:,0] - Y[:,2]/10)
    Y[:,0]= Y[:,0]  + gap/2
    Y[:,2]= numpy.round(Y[:,2]- 10*gap/2)
    for i in range(len(group)):
        data[group[i]]['y'][0:4] = Y[i, :].tolist()


def normalize_eye_right_corner(data):
    group= ['#left-eye-outline:' + pos for pos in ['6','1','2']]
    X= numpy.array([data[pos]['x'] for pos in group], dtype='f')
    X[:,0]= 16 + numpy.round(X[:,2]/10)
    Xmean = numpy.mean(X, axis=0)
    X[:,1]= Xmean[1]
    X[:,3]= Xmean[3]
    for i in range(len(group)):
        data[group[i]]['x'] = X[i, :].tolist()

def normalize_mouth(data, lips):
    group= ['#lips:' + pos for pos in lips]
    X= numpy.array([data[pos]['x'] for pos in group], dtype='f')
    X[1,:] = [250,0,0,0] - X[1,:]
    Xna= X[:,0]-X[:,2]/10
    X0= numpy.mean(Xna)
    X[:,0]= X[:,0] + numpy.round(X0 - Xna)
    Xmean = numpy.mean(X, axis=0)
    X[:,1]= Xmean[1]
    X[:,2]= Xmean[2]
    X[:,3]= Xmean[3]
    X[1,:] = [250,0,0,0] - X[1,:]
    for i in range(len(group)):
        data[group[i]]['x'] = X[i, :].tolist()


def normalize(data):
    normalize_eye_right_corner(data)
    align_y(data, ['#lips:%d' % pos for pos in [1,2,3,6,7]])
    align_y(data, ['#left-eye-outline:' + pos for pos in ['6','1','2','4','3a','3b','5a','5b']])
    normalize_mouth(data, ['2', '6'])
    normalize_mouth(data, ['3', '7'])
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
