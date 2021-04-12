function evaluate(parseTree) {

    let oprs = {
        "+": (a, b) => a + b,
        "-": (a, b) => {
            if (typeof b === "undefined") return -a;
            return a - b;
        },
        "++": a => a + 1,
        "--": a => a - 1,
        "<": (a, b) => a < b,
        ">": (a, b) => a > b,
        "<=": (a, b) => a <= b,
        ">=": (a, b) => a >= b,
        "!=": (a, b) => a != b,
        "!": (a, b) => a != b,
        "==": (a, b) => a == b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
        "%": (a, b) => a % b,
        "|": (a, b) => a | b,
        "&": (a, b) => a & b,
        "&&": (a, b) => a && b,
        "||": (a, b) => a || b,
        "^": (a, b) =>  Math.pow(a, b),
    };

    function loop(num, times){
       let arr = [];
       for(let i = 0; i < times; i++){
          arr[i] = num;
          //console.log(num);
        }
        return arr;
        //return `${num} should be looped - ${times} times (check the console)`;
    }

    let funcs = {
        round: Math.round,
        ceil: Math.ceil,
        floor: Math.floor,
        sqrt: Math.sqrt,
        random: Math.random,
        loop: loop,
    };

    let vars = {
        pi: Math.PI,
    };

    var args = {};

    var parseNode = function (node) {
        if (node.type === "number") {
            return node.value;
        }
        else if (oprs[node.type]) {
            if (node.left) {
                return oprs[node.type](
                    parseNode(node.left),
                    parseNode(node.right)
                );
            }
            return oprs[node.type](parseNode(node.right));
        } else if (node.type === "identifier") {
            let value = args.hasOwnProperty(node.value) ? args[node.value] : vars[node.value];
            if (typeof value === "undefined") {
                throw node.value + " is undefined";
            }
            return value;
        } else if (node.type === "assign") {
            vars[node.name] = parseNode(node.value);
        } else if (node.type === "call") {
            for (let i = 0; i < node.args.length; i++) {
                node.args[i] = parseNode(node.args[i]);
            }
            return funcs[node.name].apply(null, node.args);
        } else if (node.type === "function") {
            funcs[node.name] = function () {
                for (let i = 0; i < node.args.length; i++) {
                    args[node.args[i].value] = arguments[i];
                }
                let ret = parseNode(node.value);
                args = {};
                return ret;
            };
        }
    };

    let output = "";
    for (let i = 0; i < parseTree.length; i++) {
        let value = parseNode(parseTree[i]);
        if (typeof value !== "undefined"){
            output += value + "\n";
        } 
    }
    return output;
}

////Generates binary code------------->
function generateBinary() {
    let result = document.getElementById("binaryContainer");  
    let input = document.getElementById("input").value;
    result.value = "";
      for (let i=0; i < input.length; i++) {
        result.value +=input[i].charCodeAt(0).toString(2) + " ";
      }  
  }