var game = null, doinit = true, use_point= false;
function setInfos(str) {
    document.getElementById("infos").innerHTML = str;
}
function transformInput(__use_point) {
    game = new Game();
    use_point = __use_point;
    for (let i = 0; i < 4; i++) {
        let row = new Row();
        for (let j = 0; j < 4; j++) {
            let li = i + 1, co = j + 1;
            let val = eval(document.getElementById("r"+li+"n"+co).value);
            if(typeof(val) != "Number" || isNaN(val)) {
                if(val != 1 && val != 2) {
                    alert("Erreur d'introduction de la mère");
                    fail = true;
                    return;
                }
            }
            row.append(val);
        }
        game.matrix.push(row);
    }
    let infotext = "<br/>";
    if(! game.mustContinue()) {
        infotext += "<b class='text text-danger'>TALE et FAHAVALO ne sont pas de la même famille en position</b>";
    } else {
        infotext += "<b class='text text-success'>TALE et FAHAVALO sont de la même famille</b>";
    }
    setInfos(infotext);
    showAllConfiguration(__use_point);
    if(! doinit ) {
        doinit = doinit && false;
        
    }
}
function showAllConfiguration(__use_point) {
    var first = true;
    game.play(); // IMPORTANT : calcul le scoring => keep this !!!
    let score = game.score;
    if(first) {
        document.getElementById("title").innerHTML = "";
        document.getElementById("orientation_status").innerHTML = "Position..";
    }

    for(let point in score) {
        document.getElementById("orientation_status").innerHTML += "&nbsp&nbsp&nbsp[<b class='text text-danger'>"+point+"</b> : "+score[point]+"]";
    }
    if(game.tokana != null) {
        document.getElementById("orientation_status").innerHTML += "<h2 class='text text-success'>=>existence d'INTO :: #"+game.tokana+"</h2>";
    } else {
        document.getElementById("orientation_status").innerHTML += "<h2 class='text text-danger'>=>non-existence d'INTO";
        document.getElementById("orientation_status").innerHTML += "<button class='btn btn-warning btn-lg btn-block' onclick='continueGame()'>ITERER!</buttom>";
    }
    for (let q = 1; q <= 16; q++) {
        let col = game.getPilier(q);
        document.getElementById("title").innerHTML += "<th class='text text-center'>#"+q+"</th>";
        for(let z = 0; z  < 4; z++) {
            if(first) {
                document.getElementById("n"+(z+1)).innerHTML = "";
            }
            let strtmp = "";
            if(__use_point) {
                strtmp = col.row[z] == 2 ? "<b>| |</b>" : "<b>|</b>"
            } else {
                strtmp = col.row[z];
            }
            document.getElementById("n"+(z+1)).innerHTML += "<td class='text text-center' title='#"+q+" : Ligne "+(z+1)+"'>"+strtmp+"</td>";
        }
        if(first) {
            document.getElementById("data_sup").innerHTML = "";
        }
        let datatext = "<b class='text text-primary'>"+game.getCardinauxByPilier(q)+"</b>";
        document.getElementById("data_sup").innerHTML += "<td class='text text-center' title='#"+q+"'>"+datatext+"</td>";
        first = false;
    }
}
function continueGame() {
    game = game.getOtherGame();
    let infotext = "<br/>";
    if(! game.mustContinue()) {
        infotext += "<b class='text text-danger'>TALE et FAHAVALO ne sont pas de la même famille en position</b>";
    } else {
        infotext += "<b class='text text-success'>TALE et FAHAVALO sont de la même famille</b>";
    }
    setInfos(infotext);
    showAllConfiguration(use_point);
}
function generateInput() {
    if(confirm("Voulez vous tester?")) {
        game = null;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let li = i + 1, co = j + 1;
                document.getElementById("r"+li+"n"+co).value = Math.random() > 0.5 ? 1 : 2;
            }
        }
    }
    if(! doinit ) {
        doinit = doinit && false;
        
    }
}
