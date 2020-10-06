const route = window.location.pathname;

const info = document.querySelector("#info");
const meeting = document.querySelector("#for");
const title = document.querySelector("#title");
const startTime = document.querySelector("#starttime");
const startPrBtn = document.querySelector("#startPrBtn");
const endPrBtn = document.querySelector("#endPrBtn");
const assocDisc = document.querySelectorAll(".assoc-disc");
const myDiv = document.querySelector(".mydiv");
const discipleList = document.querySelector(".disciple-list");
const editReport = document.querySelector(".edit-report");
const showPassword = document.querySelectorAll(".password-visible");
const editReportRemove = document.querySelector(".edit-report-remove");
const prChform = document.querySelector("#prChform");
const noDisp = document.querySelector(".nodisplay");
const startPr = document.querySelector("#startPr");
const starttimeInput = document.querySelector("#starttime");
const endtimeInput = document.querySelector("#endtime");
const copyText = document.querySelectorAll(".copy-text");
const copyTextArr = Array.from(copyText);
const prayerTable = document.querySelector("#prayer-table");
const dateLockdown = document.querySelector("#date-lockdown");
const dateToQuery = document.querySelector(".date-to-query");
const formLockdown = document.querySelector("#form-lockdown");
const deleteWorkerButton = document.querySelectorAll(".del-worker");
const delWorkerBtn = Array.from(deleteWorkerButton);
const deleteReportButton = document.querySelectorAll(".del-report");
const delReportBtn = Array.from(deleteReportButton);
const lockdownNoReport = document.querySelector("#generate-no-report-list");
const lockdownNoReportCopy = document.querySelector("#copy-no-report-list");
const textAreaNoReportLockdown = document.querySelector("#list-no-lockdown-reports");

// Prayer Chain

if (startPrBtn) {
  startPrBtn.addEventListener("click", (e) => {
    e.preventDefault();
    myDiv.classList.add("nodisplay");
    startPrBtn.classList.add("nodisplay");
    let regExTime = /([0-9]?[0-9]):([0-9][0-9])/;
    let regExTimeArrStarttime = regExTime.exec(starttimeInput.value);
    let thisTime = moment()
      .hour(regExTimeArrStarttime[1])
      .minute(regExTimeArrStarttime[2])
      .second(0)
      .millisecond(0)
      .valueOf();
    let time = { starttime: thisTime };
    $.ajax({
      type: "POST",
      url: "/prayerChain",
      data: time,
      success: (data) => {
        let newPrCh = document.createElement("p");
        let newDiv = document.createElement("div");
        let newDiv2 = document.createElement("div");
        newDiv.classList.add("d-flex");
        newPrCh.setAttribute("data-id", data._id);
        newPrCh.setAttribute("class", "startPr");
        newPrCh.classList.add("text-center");
        newPrCh.classList.add("p-2");
        newPrCh.textContent =
          "I started praying at " +
          new Date(data.start).getHours().toString().padStart(2, "0") +
          ":" +
          new Date(data.start).getMinutes().toString().padStart(2, "0") +
          " am";
        //Create an input for End Praying
        let newInput = document.createElement("input");
        newInput.setAttribute("class", "form-control col-md-3");
        // newInput.setAttribute("class", );
        newInput.setAttribute("id", "endtime");
        newInput.setAttribute("data-id", data._id);
        newInput.setAttribute("type", "time");
        newInput.setAttribute("name", "endtime");
        newInput.setAttribute("min", "01:00");
        newInput.setAttribute("max", "08:00");
        newInput.value = `${new Date(Date.now())
          .getHours()
          .toString()
          .padStart(2, "0")}:${new Date(Date.now())
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        //Create a div of class "d-flex"
        let newDiv3 = document.createElement("div");
        newDiv3.setAttribute("class", "d-flex");
        newDiv3.innerText = "I ended praying at ";
        //insert newInput
        newDiv3.append(newInput, newDiv2);
        let endPrBtn = document.createElement("button");
        endPrBtn.setAttribute("id", "endPrBtn");
        endPrBtn.innerText = "End Praying";
        endPrBtn.setAttribute("class", "col-sm-10 btn btn-success btn-sm");
        newDiv2.append(endPrBtn);
        newDiv.append(newPrCh);
        prChform.append(newDiv, newDiv3);
      },
    });
  });
}

if (prChform) {
  prChform.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.getAttribute("id") == "endPrBtn") {
      let regExTime = /([0-9]?[0-9]):([0-9][0-9])/;
      let inputTarget = e.target.parentNode.parentNode.children[0];
      let regExTimeArrEndtime = regExTime.exec(inputTarget.value);
      let thisTime = moment()
        .hour(regExTimeArrEndtime[1])
        .minute(regExTimeArrEndtime[2])
        .second(0)
        .millisecond(0)
        .valueOf();
      let time = { endtime: thisTime };
      ////
      let id = inputTarget.dataset.id;
      inputTarget.classList.add("nodisplay");
      e.target.parentNode.parentNode.remove();
      $.ajax({
        type: "PUT",
        url: id + "/prayerChain/",
        data: time,
        success: (data) => {
          let newPrCh = document.createElement("p");
          let newDiv = document.createElement("div");
          newPrCh.setAttribute("data-id", data._id);
          newPrCh.textContent =
            "I ended praying at " +
            new Date(data.end).getHours().toString().padStart(2, "0") +
            ":" +
            new Date(data.end).getMinutes().toString().padStart(2, "0") +
            " am";
          newDiv.append(newPrCh);
          prChform.append(newDiv);
        },
      });
    }
  });
}

// Associate Disciples
if (assocDisc) {
  for (let i = 0; i < assocDisc.length; i++) {
    let oneAssocDisc = assocDisc[i];
    oneAssocDisc.addEventListener("click", (e) => {
      e.preventDefault();
      let url = oneAssocDisc.getAttribute("href");
      $.ajax({
        type: "PUT",
        url: url,
        success: (done) => {
          console.log(done);
        },
        error: (err) => {
          console.log(err);
        },
      });
      e.target.remove();
    });
  }
}

//Delete Report

if (deleteReportButton) {
  delReportBtn.forEach((delOne) => {
    delOne.addEventListener("click", (e) => {
      e.preventDefault();
      let id = e.target.dataset.id;
      $.ajax({
        type: "DELETE",
        url: "/discipleship/" + id,
        //   data: { id: idWorker }
      });
      e.target.parentNode.parentNode.remove();
    });
  });
}

// Delete Worker Account

if (deleteWorkerButton) {
  delWorkerBtn.forEach((delOne) => {
    delOne.addEventListener("click", (e) => {
      e.preventDefault();
      let idWorker = e.target.dataset.id;
      let response = confirm(
        `Are you sure you want to delete ${e.target.dataset.name} forever?`
      );
      if (response) {
        $.ajax({
          type: "DELETE",
          url: "/lma/" + idWorker,
          data: { id: idWorker },
        });
        e.target.parentNode.parentNode.parentNode.remove();
      }
    });
  });
}

if (prayerTable) {
  prayerTable.addEventListener("click", (e) => {
    e.preventDefault();
    if (Array.from(e.target.classList).includes("prayer-del-btn")) {
      let url = e.target.getAttribute("href");
      $.ajax({
        type: "DELETE",
        url: url,
        success: (data) => {},
      });
      e.target.parentNode.parentNode.remove();
    }
  });
}

if (prayerTable) {
  prayerTable.addEventListener("mouseover", (e) => {
    e.preventDefault();
    if (Array.from(e.target.classList).includes("prayer-del-btn")) {
      Array.from(e.target.parentNode.parentNode.children).forEach((elem) => {
        elem.classList.toggle("line-through");
      });
      //   addClass("line-through");
    }
  });
}

if (prayerTable) {
  prayerTable.addEventListener("mouseout", (e) => {
    e.preventDefault();
    if (Array.from(e.target.classList).includes("prayer-del-btn")) {
      Array.from(e.target.parentNode.parentNode.children).forEach((elem) => {
        elem.classList.toggle("line-through");
      });
    }
  });
}

// LMA Lockdown
if (dateToQuery) {
  dateLockdown.addEventListener("input", (e) => {
    let link = dateToQuery.getAttribute("action");
    console.log(e.target.value, link);
    let date = e.target.value;
    dateToQuery.setAttribute("action", `${link}/${date}`);
  });
}

if (copyText) {
  copyTextArr.forEach((each) => {
    each.addEventListener("click", (e) => {
      if (e.target.tagName == "BUTTON") {
        console.log("Clicked copy button");
        let txtArea = e.target.parentNode.children[1];
        console.log(txtArea.value);
        txtArea.select();
        txtArea.setSelectionRange(0, 99999); /*For mobile devices*/
        document.execCommand("copy");
        txtArea.setSelectionRange(0, 0);
        console.log(":) copied");
        e.target.setAttribute("data-toggle", "tooltip");
        e.target.setAttribute("data-placement", "top");
        e.target.setAttribute("title", "Copied");
        setTimeout(() => {
          e.target.removeAttribute("data-toggle");
          e.target.removeAttribute("data-placement");
          e.target.removeAttribute("title");
        }, 2000);
        // data-toggle="tooltip" data-placement="top" title="Copied"
      }
    });
  });
}

$(document).ready(() => {
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
  // $(".list").on("click", "li", function (worker) {
  //     removeWorker($(this));
  //     $("#present").text("Present");
  // })

  //For Report_edit template. It removes / adds from a list
  $(".list").on("click", ".select", function (worker) {
    removeWorker2($(this));
    $("#present").text("Present");
  });

  $(".absent").on("click", ".select", function (worker) {
    restoreWorker2($(this));
  });

  $(".worker-list").on("click", function (e) {
    if (e.target.tagName == "A") {
      if (e.target.textContent.trim() == "Add") {
        $.ajax({
          type: "PUT",
          url: "/lma",
          data: { add: e.target.parentNode.dataset.id },
          success: (data) => {
            console.log(data);
            if (e.target.classList.contains("btn-outline-primary")) {
              e.target.classList.remove("btn-outline-primary");
              e.target.classList.add("btn-warning");
              e.target.textContent = "Remove";
            }
          },
          error: () => {
            console.log("There was a problem!");
            alert("There was a problem!");
          },
        });
      } else if (e.target.textContent.trim() == "Remove") {
        $.ajax({
          type: "PUT",
          url: "/lma",
          data: { remove: e.target.parentNode.dataset.id },
          success: (data) => {
            console.log(data);
            if (e.target.classList.contains("btn-warning")) {
              e.target.classList.remove("btn-warning");
              e.target.classList.add("btn-outline-primary");
              e.target.textContent = "Add";
            }
          },
          error: () => {
            console.log("There was a problem!");
            alert("There was a problem!");
          },
        });
      }
    }
  });

  $(".disciple-list-remove").on("click", function (e) {
    e.preventDefault();
    rmDisciple($(this));
  });

  $("#export").on("click", function (e) {
    e.preventDefault();
    let buttonId = "export";
    exporter(buttonId);
  });

  $("#export-attendance").on("click", function (e) {
    e.preventDefault();
    let buttonId = "export-attendance";
    exporter(buttonId);
  });

  $("#export-expected-attendance").on("click", function (e) {
    e.preventDefault();
    let buttonId = "export-expected-attendance";
    exporter(buttonId);
  });

  $("#copier").on("click", function () {
    copyAll();
  });
});

function appendWorkers(workers) {
  workers.forEach((worker) => {
    appendOne(worker);
  });
}

function appendOne(worker) {
  let workerList = $(`<li>${worker.name}</li>`);
  $(worker).data("id", worker._id);
  $(".list").append(workerList);
}


function removeWorker(worker) {
  let absentName = worker[0].innerHTML;
  let absentNameList = $(`<li>${absentName}</li>`);
  // let absentNameList = $(worker[0].outerHTML);
  $(".absent").append(absentNameList);
  worker.remove();
}

function removeWorker2(worker) {
  let toRemoveDiv = $(worker)
    .removeClass("btn-danger")
    .addClass("btn-primary")
    .val("Add")
    .parent()
    .parent()[0].outerHTML;
  $(".absent").append(toRemoveDiv);
  $(worker).parent().parent()[0].remove();
}

function restoreWorker2(worker) {
  // let presentWorker = worker[0].innerHTML;
  let toRemoveDiv = $(worker)
    .removeClass("btn-primary")
    .addClass("btn-danger")
    .val("Remove")
    .parent()
    .parent()[0].outerHTML;
  $(".list").append(toRemoveDiv);
  $(worker).parent().parent()[0].remove();
}

function splitText(presWorkers) {}

function exporter(buttonId) {
  var idsArray = [];
  let list = document.getElementsByClassName("list")[0];

  let lister = Array.from(list.children);
  lister.forEach((item) => {
    let ids = item.children[0].getAttribute("id");
    objIds = { _id: ids };
    idsArray.push(objIds);
  });
  if (idsArray && idsArray.length == 0 && info.value == "") {
    console.log("info", info.value);
    console.log(idsArray && idsArray.length == 0 && info.value == "");
    alert("Empty Report. Please fill in this report");
    return;
  } else {
    console.log("buttonId", buttonId);
    console.log(idsArray);
    if (buttonId == "export") {
      $.post(
        "/discipleship",
        {
          ids: idsArray,
          title: title.innerText,
          for: meeting.value,
          info: info.value,
        },
        function () {
          window.location.replace(`${window.location.origin}/discipleship`);
        }
      );
    } else if (buttonId == "export-attendance") {
      $.post(
        "/attendance",
        {
          ids: idsArray,
          title: title.innerText,
          for: meeting.value,
          info: info.value,
        },
        function () {
          window.location.replace(`${window.location.origin}/attendance`);
        }
      );
    } else if (buttonId == "export-expected-attendance") {
      $.post(
        "/expected",
        {
          ids: idsArray,
          title: title.innerText,
          for: meeting.value,
          info: info.value,
        },
        function () {
          window.location.replace(`${window.location.origin}/expected`);
        }
      );
    }
  }
}

function subWorker(e) {
  e.preventDefault();
  let form = $(this);
  let btn = $(this).children("button");
  btn.text("Remove Worker");
  let id = btn.attr("_id");
  let data = { _id: id };
  $.post("/lma", data);
  btn.removeClass("btn-primary").addClass("btn-danger");
  if (form.hasClass("worker-list")) {
    form.removeClass("worker-list").addClass("worker-list-remove");
    form.off("click").on("click", rmaSubWorker);
  }
}

function rmaSubWorker(worker) {
  worker.preventDefault();
  let workerThis = worker[0];
  let id = $(this).children("button").attr("_id"); //workerThis = worker[0];
  let btn = $(this).children("button");
  let formData = { _id: id };
  let formAction = "/lma";
  $.ajax({
    url: formAction,
    data: formData,
    type: "PUT",
    success: function (data) {},
  });
  btn.removeClass("btn-danger").addClass("btn-primary");
  if ($(this).hasClass("worker-list-remove")) {
    $(this).removeClass("worker-list-remove").addClass("worker-list");
    btn.text("Add Worker");
    $(this).off("click").on("click", subWorker);
  }
}

function copyAll() {
  let copyText = document.getElementById("presentWorkers");
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  let resu = copyText.value;
}

//Remove Disciple from list
function rmDisciple(e) {
  let form = $(e);
  let btn = form.children("button");
  let id = e.children(".select").attr("_id");
  let data = { _id: id };
  btn.removeClass("btn-danger").addClass("btn-primary");
  btn.text("Add");
  if (form.hasClass("disciple-list-remove")) {
    form.removeClass("disciple-list-remove").addClass("disciple-list");
    form.off("click").on("click");
  }
}

// DELETE DISCIPLE
if (discipleList) {
  discipleList.addEventListener("click", (e) => {
    let link = e.target;
    if (link.tagName == "A") {
      if (link.textContent.trim() == "Delete") {
        let id = link.dataset.id;
        $.ajax({
          url: `/disciple/${id}`,
          type: "DELETE",
          success: () => {
            link.parentNode.parentNode.remove();
          },
          error: () => {
            alert("There was a problem");
          },
        });
      }
    }
  });
}

//EDIT REPORT; ADD DISCIPLE TO LIST
if (editReport) {
  editReport.addEventListener("click", (e) => {
    if (e.target.tagName == "INPUT") {
      // Get this Report ID
      let reportId = e.target.dataset.reportId;
      let id = e.target.getAttribute("_id");
      let report = e.target.parentNode.parentNode.parentNode.dataset.report;
      console.log(report);
      // Send a request (PUT) and add to ids
      $.ajax({
        type: "POST",
        url: `/${report}/${reportId}/edit`,
        data: {
          _id: id,
        },
        success: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  });
}

//EDIT REPORT; REMOVE DISCIPLE FROM LIST
if (editReportRemove) {
  editReportRemove.addEventListener("click", (e) => {
    if ((e.target.tagName = "INPUT")) {
      // Get this Report ID
      let reportId = e.target.dataset.reportId;
      let id = e.target.getAttribute("_id");
      let report = e.target.parentNode.parentNode.parentNode.dataset.report;
      console.log(report);
      // Send a request (PUT) and add to ids
      $.ajax({
        type: "DELETE",
        url: `/${report}/${reportId}/edit`,
        data: { _id: id },
        success: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  });
}


// SHOW PASSWORD FUNCTIONALITY
if(showPassword) {
  for(let j = 0; j < showPassword.length; j++){
    let eachPassword = showPassword[j];
    eachPassword.addEventListener("change", function (e) {
      let relatedElements = this.parentNode.parentNode.children;
      if(this.checked){
        for(let i = 0; i < relatedElements.length; i++){
          if(relatedElements[i] && relatedElements[i].type == "password"){
            relatedElements[i].setAttribute("type", "text");
          }
        }
      } else {
        for(let i = 0; i < relatedElements.length; i++){
          if(relatedElements[i] && relatedElements[i].type == "text"){
            relatedElements[i].setAttribute("type", "password");
          }
        }
      }
    });
  }
}