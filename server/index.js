const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const axios = require('axios');
var express = require('express');
var cors = require('cors')
var app = express();

app.use(express.json());
app.use(cors());

var DB = null
const url = process.env.MONGODB;
const dbName = 'emoticons';
const mvConnection = axios.create({
    baseURL: 'https://api.microworkers.com',
    headers: { MicroworkersApiKey: process.env.MW_SECRET }
})

MongoClient.connect(url, function(err, client) {
    console.log("Connected to server", err);
    DB = client.db('emoticons');
});

app.get('/api/ping', function(req, res) {
    res.end('pong')
});

app.post('/api/', async function (req, res) {
    try {
        console.log(JSON.stringify(req.body))
        const campaignId = req.body.campaignId;
        const workerId = req.body.workerId;
        const taskId = req.body.taskId || "";
        if (!campaignId || !workerId) {
            res.end("rejected");
            return
        }
        const vcode = getVCode(campaignId, workerId, taskId);
        const ip = req.headers['x-forwarded-for'];
        await res.json({
            code: vcode,
            autosubmit : false// await putProof(campaignId,workerId, taskId, vcode, ip)
        });
        await DB.collection('microworker').insertOne(req.body);
    } catch(e) {
        console.error(e);
    }
});

app.get('/api/work/:campaignId', async function(req, res) {
    const data= await DB.collection('microworker').find({campaignId: req.params.campaignId }).toArray();
    res.json(data)
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});

function getVCode(campaign, worker, task) {
    var secret_key = "d1bc28bec2c909e1c8160bf50d46ead1aaccece1a67298885a47a4d3d130de46";
    var shasum = crypto.createHash('sha256');
    shasum.update(campaign + worker + task + secret_key);
    return 'mw-' + shasum.digest('hex');
}

async function putProof(campaign, worker, task, vcode, ip) {
    var status= "";
    try {
        const params = new URLSearchParams();
        params.append('proof[]', 'autosubmit ' + vcode);
        params.append('user_id', worker);
        params.append('ip', ip);
        params.append('random_key', task);
        var result = await mvConnection.put('/campaign_hg/submit_proof/' + campaign, params);
        if (result.data.status != "SUCCESS")
            console.log(ip, result.data.error)
        return result.data.status == "SUCCESS"
    } catch (e) {
        console.error(e);
        return false;
    }
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
    DB.close()
}