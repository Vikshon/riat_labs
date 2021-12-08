import { XMLParser, XMLBuilder } from 'fast-xml-parser';
const builder = new XMLBuilder();
const parser = new XMLParser();

export class Input {
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

export class Output {
    Deserialize(variable) {
        this.SumResult = +(variable.Sums.reduce((a, b) => a + b) * variable.K).toFixed(2);
        this.MulResult = +(variable.Muls.reduce((a, b) => a * b)).toFixed(2);
        this.SortedInputs = [...variable.Sums, ...variable.Muls].sort();

        if (variable.type == "json") {
            return JSON.stringify({SumResult: this.SumResult, MulResult: this.MulResult, SortedInputs: this.SortedInputs});
        }
        else if (variable.type == "xml") {
            return builder.build({ Output: { SumResult: this.SumResult, MulResult: this.MulResult, SortedInputs: {decimal: this.SortedInputs } } });
        }
    }
    
}

/* module.exports = {
    Output, Input
} */