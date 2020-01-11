const route = window.location.pathname;
$(document).ready(function () {
    // $.getJSON("/api/workers")
        // .then(appendWorkers);


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

    //For Report_edit template. It removes / adds from a list
    $(".list").on("click", ".select", function (worker) {
        // console.log($(this).parent("div")[0]);
        // console.log($(worker).parent("div").outerHTML)
        removeWorker2($(this));
        $("#present").text("Present");
        // let ch = document.gets
    })

    $(".absent").on("click", ".select", function (worker) {
        // console.log($(this));
        restoreWorker2($(this));
        // let ch = document.gets
    })

    $(".worker-list").on("click", function (e) {
        e.preventDefault();
        console.log("To Add Worker");
        console.log(e);
        let form = $(this);
        console.log(form);
        let btn = $(this).children("button");
        btn.removeClass("btn-primary").addClass("btn-danger");
        btn.text("Remove Worker");
        console.log(btn);// e.attr("_id", id);
        let id = btn.attr("_id"); 
        let data = { "_id": id };
        console.log(data);
        $.post("/lma", data);
        if (form.hasClass("worker-list")) {
            form.removeClass("worker-list").addClass("worker-list-remove");
            form.off('click').on('click', rmaSubWorker);
        }
    })


    $(".worker-list-remove").on("click", function (e) {
        e.preventDefault();
        rmSubWorker($(this));
    })

    $(".disciple-list").on("click", function (e) {
        e.preventDefault();
        console.log("To Add Disciple");
        console.log(e);
        let form = $(e);
        console.log(form);
        let btn = $(this).children(".select");
        // let btn = $(this).(".select");
        btn.removeClass("btn-primary").addClass("btn-danger");
        btn.text("Remove");
        console.log(btn);// e.attr("_id", id);
        let id = btn.attr("_id");
        let data = { "_id": id };
        console.log(data);
        $.post(route, data);
        if (form.hasClass("disciple-list")) {
            form.removeClass("disciple-list").addClass("disciple-list-remove");
            form.off('click').on('click', rmaDisciple);
        }
    })

    $(".disciple-list-remove").on("click", function (e) {
        e.preventDefault();
        console.log($(this));
        rmDisciple($(this));
    })

    $(".absent").on("click", "li", function (worker) {
        // console.log($(this));
        restoreWorker($(this));
        // let ch = document.gets
    })

    $("#export").on("click", function(e){
        e.preventDefault();
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

function absent(worker){
    console.log(worker);
    // $(".absent").append(worker);
}


function removeWorker(worker) {
    console.log(worker[0])
    let absentName = worker[0].innerHTML;
    let absentNameList = $(`<li>${absentName}</li>`);
    // let absentNameList = $(worker[0].outerHTML);
    console.log(absentNameList);
    $(".absent").append(absentNameList);
    worker.remove();
}

function removeWorker2(worker){
    console.log(worker[0])
    // let abc = $(worker).parent().removeClass("btn-danger").addClass("btn-primary");
    let toRemoveDiv = $(worker).removeClass("btn-danger").addClass("btn-primary").val("Add").parent().parent()[0].outerHTML;
    // let toRemoveDiv = $(worker).parent().parent()[0].outerHTML;
    console.log(toRemoveDiv)
    // let absentName = worker[0].innerHTML;
    $(".absent").append(toRemoveDiv);
    $(worker).parent().parent()[0].remove();
}

function restoreWorker(worker){
    let presentWorker = worker[0].innerHTML;
    let id = $(worker[0]).attr("id");
    let presentList = $(`<li id="${id}">${presentWorker}</li>`);
    $(".list").append(presentList);
    worker.remove();
}

function restoreWorker2(worker) {
    // let presentWorker = worker[0].innerHTML;
    let toRemoveDiv = $(worker).removeClass("btn-primary").addClass("btn-danger").val("Remove").parent().parent()[0].outerHTML;
    console.log(toRemoveDiv)
    $(".list").append(toRemoveDiv);
    $(worker).parent().parent()[0].remove();
    // let id = $(worker[0]).attr("id");
    // // let presentList = $(`<li id="${id}">${presentWorker}</li>`);
    // let presentList = $(worker[0].outerHTML);
    // $(".list").append(presentList);
    // worker.remove();
}

function splitText(presWorkers){
    console.log(presWorkers);
}

function exporter(){
    var idsArray = [];
    // var _id = {};

    let list = document.getElementsByClassName("list")[0];    
    let lister = Array.from(list.children);
    lister.forEach((item) => {
        let ids = item.getAttribute("id");
        console.log(ids);
        objIds = { "_id": ids };
        idsArray.push(objIds);
    });
    // $.post("/report", {ids: idsArray});
    $.post("/report",
        {
            ids: idsArray
        },
        function (data) {
            console.log(data);
            window.location.replace(`${window.location.origin}/report`)
        });
}

function rmSubWorker(e) {
    console.log("To remove worker");
    let form = $(e);
    console.log(e);
    let btn = form.children("button");
    console.log("Form Parent")
    console.log(form.get(0));
    let id = $(".worker-list-remove").children("button").attr("_id");
    console.log(id);
    let data = { "_id": id };
    console.log(data);
    btn.removeClass("btn-danger").addClass("btn-primary")
    btn.text("Add Worker");
    $.ajax({
        url: "/lma",
        data: data,
        type: "PUT",
        success: function (data) {
            console.log(data)
        }
    })
    if (form.hasClass("worker-list-remove")) {
        form.removeClass("worker-list-remove").addClass("worker-list");
        form.off('click').on('click', subWorker);
    }
}

function subWorker(e) {
    e.preventDefault();
    console.log("TO ADD WORKER");
    console.log($(this));
    let form = $(this);
    let btn = $(this).children("button");
    console.log(btn);
    btn.text("Remove Worker");
    let id = btn.attr("_id");
    let data = { "_id": id };
    console.log(data);
    $.post("/lma", data);
    btn.removeClass("btn-primary").addClass("btn-danger");
    if (form.hasClass("worker-list")) {
        form.removeClass("worker-list").addClass("worker-list-remove");
        form.off('click').on('click', rmaSubWorker);
    }
}

function rmaSubWorker(worker) {
    worker.preventDefault();
    console.log("TO REMOVE WORKER!!");
    let workerThis = worker[0];
    let id = $(this).children("button").attr("_id");//workerThis = worker[0];
    let btn = $(this).children("button");
    console.log($(this).children("button"));
    let formData = { "_id": id };
    let formAction = "/lma";
    console.log(formData);
    console.log(formAction);
    $.ajax({
        url: formAction,
        data: formData,
        type: "PUT",
        success: function (data) {
            console.log("Successfully Removed!")
        }
    })
    btn.removeClass("btn-danger").addClass("btn-primary");
    if ($(this).hasClass("worker-list-remove")) {
        $(this).removeClass("worker-list-remove").addClass("worker-list");
        btn.text("Add Worker");
        $(this).off('click').on('click', subWorker);
    }
}


function copyAll() {
    let copyText = document.getElementById("presentWorkers");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    let resu = copyText.value;
    console.log(resu);
}


function disciple (e) {
    e.preventDefault();
    console.log("TO ADD DISCIPLE");
    console.log($(this));
    let form = $(this);
    let btn = $(this).children("button");
    console.log(btn);
    btn.text("Remove");
    let id = btn.attr("_id");
    let data = { "_id": id };
    console.log(data);
    $.post(route, data);
    btn.removeClass("btn-primary").addClass("btn-danger");
    if (form.hasClass("disciple-list")) {
        form.removeClass("disciple-list").addClass("disciple-list-remove");
        form.off('click').on('click', rmaDisciple);
    }
}



function rmaDisciple(e) {
    // e.children("button").preventDefault();
    console.log(e);
    console.log("TO REMOVE DISCIPLE!!");
    // let discipleThis = disciple[0];
    let id = e.children("button").attr("_id");//discipleThis = disciple[0];
    let btn = e.children("button");
    console.log(e.children("button"));
    let formData = { "_id": id };
    let formAction = "/report";
    console.log(formData);
    console.log(formAction);
    $.ajax({
        url: formAction,
        data: formData,
        type: "DELETE",
        success: function (data) {
            console.log("Successfully Removed!");
        }
    })
    btn.removeClass("btn-danger").addClass("btn-primary");
    if (e.hasClass("disciple-list-remove")) {
        e.removeClass("disciple-list-remove").addClass("disciple-list");
        btn.text("Add");
        e.off('click').on('click', disciple);
    }
}

function rmDisciple(e) {
    console.log("To remove disciple");
    let form = $(e);
    console.log(e);
    let btn = form.children("button");
    console.log("Form Parent");
    console.log(form.get(0));
    // console.log($(form).get(0).children("button").attr("_id"));
    // console.log(form.get(1));
    let id = e.children(".select").attr("_id");
    console.log(id);
    let data = { "_id": id };
    console.log(data);
    btn.removeClass("btn-danger").addClass("btn-primary");
    btn.text("Add");
    $.ajax({
        url: route,
        data: data,
        type: "DELETE",
        success: function (data) {
            console.log(data);
        }
    });
    if (form.hasClass("disciple-list-remove")) {
        form.removeClass("disciple-list-remove").addClass("disciple-list");
        form.off('click').on('click', disciple);
    }
}
