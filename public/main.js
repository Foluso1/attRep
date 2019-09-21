$(document).ready(function () {
    // $.getJSON("https://crossorigin.me/http://localhost:27017/workers_scc")
    $.getJSON("localhost:27017/workers_scc")
        .then(appendWorkers);

    $("#addNewWorker").keypress(function (event) {
        if (event.which == 13) {
            createWorker();
        }
    });
        /*Had to use this, prior to using 
        $(".list").on("click", "li", function (todon) {
        because using the above does not make it global, hence, onclick=".list" is not accessible.
        there are two ways to it. Either make it global by putting it outside of the document ready function. 
        or do it the way I did it below. This was important because the .remove() did not work with the method above inside the document ready function.*/
    $(".list").on("click", "li", function (worker) {
        removeWorker($(this));
        $("#present").text("Present");
        // let ch = document.gets
    })

    $(".absent").on("click", "li", function (worker) {
        // console.log($(this));
        restoreWorker($(this));
        // let ch = document.gets
    })

    $("#export").on("click", function(){
        exporter();
    })

    $("#copier").on("click", function () {
        copyAll();
    })
});


function appendWorkers(workers){
    console.log(workers);
    workers.forEach((worker) => {
        appendOne(worker);
    })
}

function appendOne(worker){
    let workerList = $(`<li>${worker.name}</li>`);
    $(worker).data("id", worker._id);
    $(".list").append(workerList);
}

function createWorker(worker) {
    let usrInput = $("#addNewWorker").val();
    $.post("/api/workers", { name: usrInput })
        .then(function (newWorker) {
            appendOne(newWorker);
            $("#addNewWorker").val("");
        })
        .catch(function (err) {
            console.log(err);
        })
}

function absent(worker){
    console.log(worker);
    // $(".absent").append(worker);
}


function removeWorker(worker){
    let absentName = worker[0].innerHTML;
    let absentNameList = $(`<li>${absentName}</li>`);
    $(".absent").append(absentNameList);
    worker.remove();
}

function restoreWorker(worker){
    let presentWorker = worker[0].innerHTML;
    let presentList = $(`<li>${presentWorker}</li>`);
    $(".list").append(presentList);
    worker.remove();
}

function splitText(presWorkers){
    console.log(presWorkers);
}

function exporter(){
    let list = document.getElementsByClassName("list");
    let lister = list[0].innerText
    $("#presentWorkers").val(lister);
}

function copyAll() {
    let copyText = document.getElementById("presentWorkers");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    let resu = copyText.value;
    console.log(resu);
}