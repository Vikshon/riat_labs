const xml_convert = require('xml-js');

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
            let parsed = xml_convert.xml2js(obj, {compact: true, nativeType: true});
            this.K = parsed.Input.K._text;
            this.Sums = parsed.Input.Sums.decimal.map(el => el._text);
            this.Muls = parsed.Input.Muls.int.map(el => el._text);
        }
    }
    sayBoo() {
        console.log("Boo!");
    }
}

class Output {
    
}

const test_json = new Input("json", `{"K":10,"Sums":[1.01,2.02],"Muls":[1,4]}`);
const test_xml = new Input("xml", `<Input><K>10</K><Sums><decimal>1.01</decimal><decimal>2.02</decimal></Sums><Muls><int>1</int><int>4</int></Muls></Input>`);

const a = new Input("boo");
console.log(test_xml);