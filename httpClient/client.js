// {"data":{"K":10,"Sums":[1.01,2.02],"Muls":[1,4]},"answer":{"SumResult":30.3,"MulResult":4,"SortedInputs":[1,1.01,2.02,4]}}
import fetch from 'node-fetch';
import * as server from '../httpServer/server.js';
import { Input } from '../httpServer/serializer.js';
// GetInputData();
WriteAnswer();

async function GetInputData()
{
    /* let data = await fetch('http://localhost:3000/getinputdata');
    console.log(await data.json()); */
    // Если нужно сериализовать через метод, то...
    let data = await fetch('http://localhost:3000/getinputdata').then(data => data.json());
    let a = new Input("json", JSON.stringify(data));
    console.log(a);
}

async function WriteAnswer()
{
    let type = "json";
    let answer = `{"SumResult":30.3,"MulResult":4,"SortedInputs":[1,1.01,2.02,4]}`;
    let data = await fetch(`http://localhost:3000/writeanswer?obj=${answer}`);
}