import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 80;

const __dirname = path.resolve();

app.use(cors());
app.use(express.static('build'));

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
