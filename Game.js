// ROW CLASS
function Row(row) {
    this.row = row || [];
    this.append = function(element) {
        if(this.row.length == 4)
            throw "Elements already == 4";
        this.row.push(element);
    }
    this.initRandomly = function() {
        // randomly init. the configuration
        for (let k = 0; k < 4; k++) {
            this.append(Math.random() > 0.5 ? 2 : 1);            
        }
    }
    this.equals = function(arr) {
        let eq = true, n = 0;
        arr.forEach(a => {
            if(a != this.row[n]){
                eq = false;
                return;
            }
            n++;
        });
        return eq;
    }
    this.get = function(index) {
        return this.row[index];
    }
    this.add = function(row_add) {
        if(row_add.row.length != 4){
            throw "CANNOT ADD !!! Length must be == 4";
        }
        var result = [];
        for (let k = 0; k < 4; k++) {
            let a = row_add.get(k),
                b = this.get(k);
            result.push(
                (a+b) % 2 == 0 ? 2 : 1
            );
        }
        return new Row(result);
    }
    this.toString = function() {
        return this.row.join(", ");
    }
}
// GAME CLASS
function Game(matrix) {
    //nbr play tant qu on ne retrouve pas "Tokana"
    this.replay_counter = 0;
    this.tokana = null;
    this.definition = {
        NORD : [ // NORD
            [1, 2, 2, 2],
            [2, 2, 1, 2],
            [1, 1, 1, 2],
            [1, 2, 1, 2]
        ],
        SUD : [ // SUD
            [1, 1, 2, 2],
            [1, 1, 1, 1],
            [2, 2, 2, 2],
            [1, 1, 2, 1]
        ],
        OUEST : [ // OUEST
            [1, 2, 1, 1],
            [1, 2, 2, 1],
            [2, 1, 2, 1],
            [2, 1, 1, 1],
            [2, 2, 2, 1]
        ],
        EST : [ // EST
            [2, 1, 2, 2],
            [2, 1, 1, 2],
            [2, 2, 1, 1]
        ]
    };
    this.score = {
        NORD : 0, SUD : 0, OUEST : 0, EST : 0
    };
    this.score_pilier_index = {
        NORD : [], SUD : [], OUEST : [], EST : []
    };
    this.matrix = matrix || [];
    this.initRandomly = function() {
        // randomly init. the configuration
        for (let k = 0; k < 4; k++) {
            let row = new Row();
            row.initRandomly();
            this.matrix.push(row);         
        }
    }

    this.getPilier = function(index) {
        return this.getRow(index - 1);
    }
    this.getCardinauxByPilier = function(index) {
        var cardinaux = "";
        var row = this.getPilier(index);
        for (let region in this.definition) {
            this.definition[region].forEach(conf =>{
                if(row.equals(conf)) {
                    cardinaux += region;
                }
            });
        }
        return cardinaux;
    }
    this.getRow = function(index) {
        if(index < 0 || index >= 16) {
            throw "Index must be <= 15";
        }
        if(index  < 4) {
            return this.matrix[index];
        } else if(index >= 4 && index < 8) {
            // transposition
            let row_result = new Row();
            this.matrix.forEach(row => {
                row_result.append(row.get(index - 4));
            });
            return row_result;
        } else {
            // tableau de HASH correspondant
            let hash = {
                '9' : '7+8',
                '10' : '9+11',
                '11' : '5+6',
                '12' : '10+14',
                '13' : '3+4',
                '14' : '13+15',
                '15' : '2+1',
                '16' : '12+1'
            };
            let key = index + 1;
            let addition = hash[key];
            let separated = addition.split("+");
            let a = eval(separated[0]),
                b = eval(separated[1]);

            // relation recurssive par definition
            let sol = this.getRow(a-1).add(this.getRow(b-1));
            return sol;
        }
    }
    this.mustContinue = function() {
        // on verifie si 1 et 8 sont dans le meme camp
        let un = this.getPilier(1);
        let huit = this.getPilier(8);
        let same_region = false;
        for(let region in this.definition) {
            let count = 0;
            this.definition[region].forEach(etat => {
                if(un.equals(etat)) {
                    count++;
                }
                if(huit.equals(etat)) {
                    count++;
                }
            });
            same_region = count >= 2;
            if(same_region) {
                break;
            }
        }
        console.log("Same region "+same_region);
        return same_region;
    }
    this.play = function() {
        /*
        if( ! this.mustContinue() ) {
            console.log("1 and 8 aren t on the same category!");
            return;
        }
        */
        let stop = false;
        for(let u in this.definition) {
            let region = this.definition[u];
            for (let i = 0; i < 16; i++) {
                let config = this.getRow(i);
                region.forEach(state => {
                    if(config.equals(state)) {
                        this.score[u]++;
                        this.score_pilier_index[u].push(i+1);
                    }
                });
            }
        }
        // existe t il un tokana ?
        for(let u in this.score) {
            if(this.score[u] == 1) {
                // found it!
                this.tokana = this.score_pilier_index[u][0];
            }
        }
    }
    this.getOtherGame = function() {
        // 11, 12, 13, 14
        let game = new Game();
        for (let index = 5; index <= 8; index++) {
            game.matrix.push(this.getPilier(index));            
        }
        return game;
    }
    this.toString = function() {
        let str = "", index = 0;
        this.matrix.forEach(row => {
            str += "\nROW ["+index+"] = "+row.toString();
            index++;
        });
        return str;
    }
}
/*
var game = new Game();

game.initRandomly();
game.play();
if(game.mustContinue()) {
    for (let u = 1; u <= 16; u++) {
        console.log("Numero "+u+" = "+game.getPilier(u));
    }
}
console.log(game.score);
*/
/*
var game = new Game();
game.initRandomly();
console.log(game.toString());
// test 10 = 9 + 11 = (7+8)+(5+6)
console.log(game.getPilier(7)+" + "+game.getPilier(8) + " = " +game.getPilier(9).toString());
console.log(game.getPilier(5)+" + "+game.getPilier(6) + " = " +game.getPilier(11).toString());
console.log("10 "+game.getPilier(10).toString() +" ?? = "+game.getPilier(9).add(game.getPilier(11)).toString());
*/
/*
var test = new Row();
test.initRandomly();
var test2 = new Row();
test2.initRandomly();
console.log(test.toString() + " + " + test2.toString() +" = "+test.add(test2)+" = "+test2.add(test));
*/