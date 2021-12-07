const { Output, Input } = require('./serializer.js');
const fs = require('fs');
let json = require('./data.json');
const express = require('express');
const app = express();
const port = 3000;

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

app.get('/ping', (request, response) => {
    response.sendStatus(200);
})

app.get('/stop', (request, response) => {
    response.send("Sever closed.");
    server.close();
})

app.get('/postinputdata', async (request, response) => {
    let query = request.query.obj;
    if (query === undefined || query.length < 1) { console.log("Ошибка! Пустой ввод."); return;}
    json.data = JSON.parse(query);
})

app.get('/getanswer', async (request, response) => {
    response.send(json.answer);
})

app.get('/getinputdata', async (request, response) => {
    response.send(json.data);
})

app.get('/writeanswer', async (request, response) => {
    let query = request.query.obj;
    if (query === undefined || query.length < 1) { console.log("Ошибка! Пустой ввод."); return;}
    let a = new Input("json", query);
    let b = new Output(a);
    let result = b.Deserialize(a);

    json.answer = JSON.parse(result);
    fs.writeFileSync('./httpClient/data.json', JSON.stringify(json));
})