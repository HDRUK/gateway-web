import express from 'express';
import cors from 'cors';
import path from 'path';
import https from 'https';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 443;

const __dirname = path.resolve();

app.use(cors());
app.use(express.static('build'));

const key = fs.readFileSync(__dirname + '/../selfsigned.key');
const cert = fs.readFileSync(__dirname + '/../selfsigned.crt');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = https.createServer({ key, cert }, app);

server.listen(port, () => console.log(`Listening on port ${port}`));
