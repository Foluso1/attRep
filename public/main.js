$(document).ready(function () {
    $.getJSON("/api/workers")
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
        // console.log($(this));
        removeWorker($(this));
    })

    $("#export").on("click", function(){
        exporter();
    })

    $("#copier").on("click", function () {
        copyAll();
    })
});


function appendWorkers(workers){
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


function removeWorker(worker){
    worker.remove();
}

function splitText(presWorkers){
    console.log(presWorkers);
}

function exporter(){
    let workersHTML = $("ol").html();
    let res = workersHTML.split("</li><li>").join("\n").split("<li>").join("\n").split("</li>").join("\n");
    $("#presentWorkers").val(res);
}

function copyAll() {
    let copyText = document.getElementById("presentWorkers");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    console.log(copyText.value);
}