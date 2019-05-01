const time = 10;
const Timer = document.querySelector("#timer");
const qr_image = document.querySelector(".QR_image");
const generator = document.querySelector("#Generate");
var counter = 0;
let qr = new QRCode( qr_image,{
    width: 302,
    height: 263,
    colorDark: "#000000",
    colorLight: "white",
    correctLevel: QRCode.CorrectLevel.H
});

generator.addEventListener("click", (e) => {
    QR_Update(time);
});

function QR_Update(time) {
    qr.clear();
    var dataref = firebase.database().ref("QR Codes");
    dataref.on("value",  function(snapshot) {
        data = snapshot.val();
        qr.makeCode(data[1]);
        console.log(data[2]);
        add_data();
    });
    time < 10 ? Timer.innerText = "0:0" + time : Timer.innerText = "0:" + time;
    time--;
    if(time >= 0) setTimeout(function() {QR_Update(time)}, 1000);
    else {
        counter = 0;
        QR_Update(10);
    }
}

function add_data(){
    if(counter == 0){
        counter++;
        var new_data = [data[2], scramble(data[1])];
        firebase.database().ref("QR Codes").update({
            "1": new_data[0],
            "2": new_data[1]
        });
    }else return;
}

function scramble(a){
    a=a.split("");
    for(var b=a.length-1;0<b;b--){
        var c = Math.floor(Math.random()*(b+1));
        d = a[b];
        a[b] = a[c];
        a[c] = d;
    }
    return a.join("")
}