import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.cookie('test', 'value', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.send('ok');
});

const server = app.listen(8001, async () => {
    try {
        const res = await fetch('http://localhost:8001/');
        console.log("Cookie header:", res.headers.get('set-cookie'));
    } catch (e) {
        console.error(e);
    } finally {
        server.close();
    }
});
