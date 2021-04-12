//Lexing------------->
function lexer(input) {
    const operator = (check) => /^(\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|,|\^|\(|\))$/.test(check);
    const digit = (check) => /[0-9]/.test(check);
    const whiteSpace = (check) => /\s/.test(check);
    const identifier = (check) =>
        typeof check === "string" &&
        !operator(check) &&
        !digit(check) &&
        !whiteSpace(check);

    let tokens = [];
    let c, i = 0;

    let mov = () => (c = input[++i]);

    function addToken (type, value) {
        tokens.push({
            type: type,
            value: value,
        })
    }
    
    while (i < input.length) {
        c = input[i];
        if (whiteSpace(c)) {
            mov();
        } else if (operator(c)) {
            if(c === ">" && input[i+1] === "="){
                addToken(">=");
                mov();
                mov();
            }
            else if(c === "<" && input[i+1] === "="){
                addToken("<=");
                mov();
                mov();
            }
            else if(c === "+" && input[i+1] === "+"){
                addToken("++");
                mov();
                mov();
                if(whiteSpace(c) || c == undefined){
                    addToken("number", 0);
                }
            }
            else if(c === "-" && input[i+1] === "-"){
                addToken("--");
                mov();
                mov();
                if(whiteSpace(c) || c == undefined){
                    addToken("number", 0);
                }
            }
            else if(c === "=" && input[i+1] === "="){
                addToken("==");
                mov();
                mov();
            }
            else if(c === "!" && input[i+1] === "="){
                addToken("!=");
                mov();
                mov();
            }
            else if(c === "+" && input[i+1] === "="){
                addToken("+");
                mov();
                mov();
            }
            else if(c === "-" && input[i+1] === "="){
                addToken("-");
                mov();
                mov();
            }
            else if(c === "*" && input[i+1] === "="){
                addToken("*");
                mov();
                mov();
            }
            else if(c === "/" && input[i+1] === "="){
                addToken("/");
                mov();
                mov();
            }
            else if(c === "%" && input[i+1] === "="){
                addToken("%");
                mov();
                mov();
            }
            else if(c === "&" && input[i+1] === "&"){
                addToken("&&");
                mov();
                mov();
            }
            else if(c === "|" && input[i+1] === "|"){
                addToken("||");
                mov();
                mov();
            } else {
              addToken(c);
              mov();
            }
        } else if (digit(c)) {
            let num = c;
            while (digit(mov())) {
                num += c;
            }
            if (c === ".") {
                do {
                    num += c;
                } while (digit(mov()));
            }
            num = parseFloat(num);
            if (!isFinite(num)) {
                throw "Number is too large or too small for a 64-bit double.";
            }
            addToken("number", num);
        } else if (identifier(c)) {
            var idn = c;
            while (identifier(mov())) idn += c;
            addToken("identifier", idn);
        } else { 
            throw "Can't recognize the token.";
        }
    }
    addToken("(end)");
    return tokens;
}