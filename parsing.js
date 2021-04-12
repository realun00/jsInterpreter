function parse(tokens) {
    let symbols = {};
    
    function symbol (id, nud, lbp, led) {
            let sym = symbols[id] || {};
            symbols[id] = {
                lbp: sym.lbp || lbp,
                nud: sym.nud || nud,
                led: sym.lef || led,
            };
    }

    function interprTkn (tkn) {
        let sym = Object.create(symbols[tkn.type]);
        sym.type = tkn.type;
        sym.value = tkn.value;
        return sym;
    }

    let i = 0;

    let token = () => interprTkn(tokens[i]);
    let forward = () => {
        i++;
        return token();
    }

    function expr (rbp) {
        let left,
            t = token();
        forward();
        if (!t.nud) {
            throw "Unexpected token: " + t.type;
        }
        left = t.nud(t);
        while (rbp < token().lbp) {
            t = token();
            forward();
            if (!t.led) {
                throw "Unexpected token: " + t.type;
            }
            left = t.led(left);
        }
        return left;
    }

    function afterFix (id, lbp, rbp, led) {
            rbp = rbp || lbp;
            symbol(id,null,lbp,led ||
                function (left) {
                    return {
                        type: id,
                        left: left,
                        right: expr(rbp),
                    };
                }
            );
    }
    function beforeFix (id, rbp) {
            symbol(id, function () {
                return {
                    type: id,
                    right: expr(rbp),
                };
            });
    } 

    symbol(",");
    symbol(")");
    symbol("(end)");

    symbol("number", (number) => number);
    symbol("identifier", function (name) {
        if (token().type === "(") {
            let args = [];
            if (tokens[i + 1].type === ")") forward();
            else {
                do {
                    forward();
                    args.push(expr(2));
                } while (token().type === ",");
                if (token().type !== ")") 
                {
                    throw "Expected closing parenthesis ')'";
                }
            }
            forward();
            return {
                type: "call",
                args: args,
                name: name.value,
            };
        }
        return name;
    });

    symbol("(", function () {
        let value = expr(2);
        if (token().type !== ")"){
            throw "Expected closing parenthesis ')'";
        }
        forward();
        return value;
    });

    
    beforeFix("-", 8);
    beforeFix("--", 8);
    beforeFix("++", 8);
    afterFix("--", 7);
    afterFix("++", 7);
    afterFix("^", 6, 5);
    afterFix("|", 4);
    afterFix("&", 4);
    afterFix("||", 4);
    afterFix("&&", 4);
    afterFix("*", 4);
    afterFix("/", 4);
    afterFix("%", 4);
    afterFix("+", 3);
    afterFix("-", 3);
    afterFix("<=", 2);
    afterFix("<", 2);
    afterFix(">", 2);
    afterFix(">=", 2);
    afterFix("!=", 2);
    afterFix("!", 2);
    afterFix("==", 2);

    afterFix("=", 1, 2, function (left) {
        if (left.type === "call") {
            for (let i = 0; i < left.args.length; i++) {
                if (left.args[i].type !== "identifier") {
                    throw "Invalid argument name";
                }
            }
            return {
                type: "function",
                name: left.name,
                args: left.args,
                value: expr(2),
            };
        } else if (left.type === "identifier") {
            return {
                type: "assign",
                name: left.value,
                value: expr(2),
            };
        } else {
            throw "Invalid value";
        }
    });

    let parseTree = [];
    while (token().type !== "(end)") {
        parseTree.push(expr(0));
    }
    return parseTree;
}