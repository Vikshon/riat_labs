// <Input><K>10</K><Sums><decimal>1.01</decimal><decimal>2.02</decimal></Sums><Muls><int>1</int><int>2</int></Muls></Input>
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

app.get('/dev', (request, response) => {
    let obj = request.query;
    console.log(obj);
    response.send(obj);
})

// Так надо передавать параметры или что? Ya ni panimau
app.post('/postinputdata', (request, response) => {
    let input = request.body.input;
    let type = request.body.type;
    if (input.length < 1) { console.log("Ошибка! Пустой ввод."); return; }
    try {
        let a = new Input(type, input);
        console.log(a);
        let b = new Output();
        let done = b.Deserialize(a);
        json.data = JSON.parse(done)
        // С xml ошибка, т.к. нельзя запарсить xml в json
        console.log(done);
        writeFileSync('./httpServer/data.json', JSON.stringify(json));
    }
    // Обработка ошибок ввода параметра
    catch (err) {
        console.log(err);
    }
})

app.get('/postinputdata', async (request, response) => {
    // Посылаем параметры через параметры get запроса
    /* let query = request.query.obj;
    if (query === undefined || query.length < 1) { console.log("Ошибка! Пустой ввод."); return; }
    json.data = JSON.parse(query); */

    let task = request.query.obj || `{"K":15,"Sums":[1.01,2.02],"Muls":[1,4]}`;
    let type = "json";
    if (task.startsWith("<"))
        type = "xml";

    axios.post(`http://localhost:3000/postinputdata`, {
        input: task,
        type: type
    });
})

app.get('/getanswer', async (request, response) => {
    // Просто вернуть ответ из JSON
    response.send(json.answer);

    // Получить таск и вывести ответ
    /* let task = JSON.stringify(json.data);
    let type = "json";
    if (task.startsWith("<"))
        type = "xml";
    let a = new Input(type, task);
    let b = new Output();
    console.log(b.Deserialize(a)); */
})

app.get('/getinputdata', async (request, response) => {
    response.send(json.data);
})

app.post('/writeanswer', (request, response) => {
    let output = request.body.output;
    let type = request.body.type;
    if (output.length < 1) { console.log("Ошибка! Пустой ввод."); return; }

    try {
        let a = new Input(type, output);
        console.log(a);
        let b = new Output();
        let done = b.Deserialize(a);
        console.log(done);
        json.data = JSON.parse(done);
        writeFileSync('./httpServer/data.json', JSON.stringify(json));
    }
    // Обработка ошибок ввода параметра
    catch (err) {
        console.log(err);
    }
})

app.get('/writeanswer', async (request, response) => {
    let answer = request.query.obj || `{"SumResult":20.3,"MulResult":4,"SortedInputs":[1,1.01,2.02,4]}`;
    let type = "json";
    if (answer.startsWith("<"))
        type = "xml";
    console.log(type);

    axios.post(`http://localhost:3000/writeanswer`, {
        output: answer,
        type: type
    });
})

/* app.get('/writeanswer', (request, response) => {
    let query = request.query.obj;
    if (query === undefined || query.length < 1) { console.log("Ошибка! Пустой ввод."); return; }

    let _answer = JSON.parse(query);
    json.answer = _answer;
    writeFileSync('./httpServer/data.json', JSON.stringify(json));
}) */