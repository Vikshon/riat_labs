/* const xml_convert = require('xml-js');
const { XMLParser, XMLBuilder } = require('fast-xml-parser'); */
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
const builder = new XMLBuilder();
const parser = new XMLParser();

class Input {
    constructor(type = "", obj = {}) {
        this.type = type;
        if (type == "json") {
            let parsed = JSON.parse(obj);
            this.K = parsed.K;
            this.Sums = parsed.Sums;
            this.Muls = parsed.Muls;
        }
        else if (type == "xml") {
            let parsed = parser.parse(obj);
            this.K = parsed.Input.K;
            this.Sums = parsed.Input.Sums.decimal;
            this.Muls = parsed.Input.Muls.int;
        }
    }
}

class Output {
    Deserialize(variable) {
        /* let sum = 0
        for (let i of variable.Sums) {
            sum += i
        }
        console.log(sum); */
        
        this.SumResult = +(variable.Sums.reduce((a, b) => a + b) * variable.K).toFixed(2);
        this.MulResult = +(variable.Muls.reduce((a, b) => a * b)).toFixed(2);
        this.SortedInputs = [...variable.Sums, ...variable.Muls].sort();
        console.log(this.SumResult, this.MulResult, this.SortedInputs);

        if (variable.type == "json") {
            return JSON.stringify({SumResult: this.SumResult, MulResult: this.MulResult, SortedInputs: this.SortedInputs});
        }
        else if (variable.type == "xml") {
            return builder.build({ Output: { SumResult: this.SumResult, MulResult: this.MulResult, SortedInputs: {decimal: this.SortedInputs } } });
        }
    }
}

const test_json = new Input("json", `{"K":10,"Sums":[1.01,2.02],"Muls":[1,4]}`);
const test_xml = new Input("xml", `<Input><K>10</K><Sums><decimal>1.01</decimal><decimal>2.02</decimal></Sums><Muls><int>1</int><int>4</int></Muls></Input>`);

let out = new Output()
console.log(out.Deserialize(test_json));