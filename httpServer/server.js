import { Output, Input } from './serializer.js';
// import * as ww from '../httpClient/client.js'
import { writeFileSync } from 'fs';
// 
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const json = require("./data.json");
// 
import express, { response } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Так надо передавать параметры или что? Ya ni panimau
app.post('/postinputdata', (request, response) => {
    let input = request.body.input;
    if (input.length < 1) { console.log("Ошибка! Пустой ввод."); return; }
    json.data = JSON.parse(input);
    writeFileSync('./httpServer/data.json', JSON.stringify(json));
})

app.get('/postinputdata', async (request, response) => {
    // Посылаем параметры через параметры get запроса
    /* let query = request.query.obj;
    if (query === undefined || query.length < 1) { console.log("Ошибка! Пустой ввод."); return; }
    json.data = JSON.parse(query); */

    let task = `{"K":15,"Sums":[1.01,2.02],"Muls":[1,4]}`
    axios.post(`http://localhost:3000/postinputdata`, {
        input: task
    });
})

app.get('/getanswer', async (request, response) => {
    response.send(json.answer);
})

app.get('/getinputdata', async (request, response) => {
    response.send(json.data);
})

app.post('/writeanswer', (request, response) => {
    let output = request.body.output;
    if (output.length < 1) { console.log("Ошибка! Пустой ввод."); return; }
    json.answer = JSON.parse(output);
    writeFileSync('./httpServer/data.json', JSON.stringify(json));
})

/* app.get('/writeanswer', (request, response) => {
    let query = request.query.obj;
    if (query === undefined || query.length < 1) { console.log("Ошибка! Пустой ввод."); return; }

    let _answer = JSON.parse(query);
    json.answer = _answer;
    writeFileSync('./httpServer/data.json', JSON.stringify(json));
}) */