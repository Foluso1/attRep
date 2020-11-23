const route = window.location.pathname;
const specialMeeting = document.querySelector("#special-meeting");
const specialMeetingAtt = document.querySelector("#special-meeting-attendance");
const info = document.querySelector("#info");
const thisWeekPrCh = document.querySelector("#this-week-pr-ch");
const hoverAppear = document.querySelectorAll(".hover-appear"); 
const weekChooser = document.querySelector("#week-chooser");
const weekChooserLMA = document.querySelector("#week-chooser-lma");
const weekChooserAllLMA = document.querySelector("#week-chooser-all-lma");
const prayerChainTable = document.querySelector("#prayer-chain-table");
const prayerRatio = document.querySelector("#prayer-ratio");
const prWeekNumber = document.querySelector("#prayer-week-number");
const weekSpan = document.querySelector("#week-span");
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
const meetingToQuery = document.querySelector(".meeting-to-query");
const formLockdown = document.querySelector("#form-lockdown");
const formAttendance = document.querySelector("#form-attendance");
const deleteWorkerButton = document.querySelectorAll(".del-worker");
const delWorkerBtn = Array.from(deleteWorkerButton);
const deleteReportButton = document.querySelectorAll(".del-report");
const delReportBtn = Array.from(deleteReportButton);
const lockdownNoReport = document.querySelector("#generate-no-report-list");
const lockdownNoReportCopy = document.querySelector("#copy-no-report-list");
const textAreaNoReportLockdown = document.querySelector("#list-no-lockdown-reports");
const dateChooser = document.querySelector(".date-chooser");
const reportFor = document.querySelector(".report-for");

// Prayer Chain

if (startPrBtn) {
  startPrBtn.addEventListener("click", (e) => {
    $(".mydiv").html("");
    $(".mydiv").append("<p>Please wait...</p>");
    $.ajax({
      type: "POST",
      url: "/prayerchain",
      success: (data) => {
        let time = moment().format("LT");
        if(data !== null && typeof data === 'object'){
          $(".mydiv").remove();
          $("#prChform").append(`<div class="newDiv">
            <p class="newPrCh startPr p-2">Good day sir/ma, </br> I have started praying. </br>${time}</p>
            <div class="newDiv2 d-flex">
              <button id="endPrBtn" class="btn btn-success btn-sm">End Praying</button>
            </div>
          </div>`);
        } else {
          $(".mydiv").html("");
          $(".mydiv").append("<p>There was a problem. Please re-login.</p>");
        }
      },
    });
  });
}

if (prChform) {
  prChform.addEventListener("click", function(e) {
    e.preventDefault();
    if (e.target.getAttribute("id") == "endPrBtn") {
      let thisNode = $(e.target.parentNode);
      
      const endPrFunction = () => {
        thisNode.html("");
        thisNode.append("<p>Please wait...</p>");
        $.ajax({
          type: "POST",
          url: "/prayerChain/",
          success: (data) => {
            let time = moment().format("LT");
            if(data != null && typeof data === "object" ){
              thisNode.html("");
              let newPrCh = document.createElement("p");
              let newDiv = document.createElement("div");
              newPrCh.setAttribute("class", "p-2")
              newPrCh.innerHTML =
                `Good day sir/ma, </br>
                I am done praying </br>
                ${time}`;
              newDiv.append(newPrCh);
              prChform.append(newDiv);
            } else {
              thisNode.html("");
              thisNode.append("<p>There was a problem, please re-login to end praying.</p>");
            }
          },
        });
      }

      thisNode.html("");     
      thisNode.append(`<div>
          <p>Are you sure?</p>
          <div>
            <button class="btn btn-sm btn-success px-4" id="true">Yes</button> <button class="btn btn-sm btn-danger px-4" id="false">No</button>
          </div>
        </div>`);
      let yes = document.querySelector("#true");
      let no = document.querySelector("#false");
      yes.addEventListener("click", function (e) {
        e.preventDefault();
        endPrFunction();
      })
      no.addEventListener("click", function (e){
        e.preventDefault();
        thisNode.html("");
        thisNode.append(`<div class="newDiv">
            <div class="newDiv2 d-flex">
              <button id="endPrBtn" class="btn btn-success btn-sm">End Praying</button>
            </div>
          </div>`)
      })
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

  $("#edit-expected").on("click", function(e) {
    e.preventDefault();
    let buttonId = "edit-expected";
    editExporter(buttonId);
  })

  $("#edit-discipleship").on("click", function(e) {
    e.preventDefault();
    let buttonId = "edit-discipleship";
    editExporter(buttonId);
  })

  $("#edit-attendance").on("click", function(e) {
    e.preventDefault();
    let buttonId = "edit-attendance";
    editExporter(buttonId);
  })

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
          console.log({
            ids: idsArray,
            title: title.innerText,
            for: meeting.value,
            info: info.value,
          })
          window.location.replace(`${window.location.origin}/expected`);
        }
      );
    }
  }
}

function editExporter(buttonId) {
  let title = $("#title").text();
  let reportFor = $("#for").text();
  let info = $("#info").val();
  let reportId = $(".submitter").attr("data-report-id");
  let preUrl = "";
  if (buttonId == "edit-expected") {
    preUrl = "expected";
  } else if (buttonId == "edit-attendance"){
    preUrl = "attendance";
  } else if (buttonId == "edit-discipleship"){
    preUrl = "discipleship";
  }
  console.log(title, reportFor, info, reportId);
  $.ajax({
    type: 'PUT',
    url: `/${preUrl}/${reportId}`,
    data: {
      info: info,
      for: reportFor,
      title: title
    },
    success: () => {
      console.log("success!");
      window.location.replace(`${window.location.origin}/${preUrl}`);
    },
    error: () => {
      console.log("error");
      window.location.replace(`${window.location.origin}/${preUrl}`);
    }
  })
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
      let title = $('#title').text();
      let reportFor = $('#for').text();
      console.log(title, reportFor)
      let report = e.target.parentNode.parentNode.parentNode.dataset.report;
      console.log(report);
      // Send a request (PUT) and add to ids
      $.ajax({
        type: "POST",
        url: `/${report}/${reportId}/edit`,
        data: {
          _id: id,
          for: reportFor,
          title: title,
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


//FORM FOR CHANGING URL TO SUBMIT DATE
if (formAttendance) {
  console.log(window.location.pathname)
} 

// PRAYER CHAIN TIME FIXER
if (weekChooser) {
  weekChooser.addEventListener("change", (e) => {
    $("tbody").html("");
    $("tbody").append(`<td colspan="10">Please wait...</td>`);
    $.ajax({
      type: "GET",
      url: `/prayerchain/${e.target.value}`,
      data: e.target.value,
      success: (data) => {
        createTable(data, e.target.value);
      },
      error: (err) => {
        console.log(err);
        $("tbody").html("");
        $("tbody").append(`<td colspan="10">There was a problem. Please re-login.</td>`)
      }
    })
  })
}


// PRAYER CHAIN TIME FIXER (LMA)
if (weekChooserLMA) {
  let id = weekChooserLMA.getAttribute('user-id');
  weekChooserLMA.addEventListener("change", (e) => {
    console.log("///id", id);
    $("tbody").html("");
    $("tbody").append(`<td colspan="10">Please wait...</td>`);
    $.ajax({
      type: "GET",
      url: `/api/prayerchain/${id}/${e.target.value}`,
      data: e.target.value,
      success: (data) => {
        createTable(data, e.target.value);
      },
      error: (err) => {
        console.log(err);
        $("tbody").html("");
        $("tbody").append(`<td colspan="10">There was a problem. Please re-login.</td>`);
      }
    })
  })
}

// CREATE TABLE FUNCTION
const createTable = (data, weekVal) => {
  prWeekNumber.textContent = weekVal;
  weekSpan.textContent = `${moment().week(weekVal).startOf('week').format('ddd MMM Do')} - ${moment().week(weekVal).endOf('week').format('ddd MMM Do')}`;
  if(!(data != null && typeof(data) === "object")){
      prayerRatio.textContent = 0;
      $("tbody").html("");
      $("tbody").append(`<td colspan="10">Nothing to show here.</td>`);
  } else {
    $("tbody").html("");
    prayerRatio.textContent = data.frequency;
    for(let i=0; i<7; i++){
      let apc = $("tbody").append(`<tr></tr>`);
      for(let j=0; j<3; j++){
        if(j==0){
          apc.append(`<td>${moment().day(i).format("ddd")}</td>`);
        } else if(j==1) {
          if(data[i].start){
            apc.append(`<td>${moment(data[i].start).format("LT")}</td>`);
          } else {
            apc.append(`<td>--</td>`);
          }
        } else if (j==2) {
          if(data[i].end){
            apc.append(`<td>${moment(data[i].end).format("LT")}</td>`);
          } else {
            apc.append(`<td>--</td>`);
          }
        }
      }
    }
  }
}

// PRAYER CHAIN TIME FIXER (LMA ALL)
const prChFunction = function (thisValue) {
  $("tbody").html("");
  $("tbody").append(`<td colspan="10">Please wait...</td>`);
  $.ajax({
    type: "GET",
    url: `/api/prayerchain/${thisValue}`, //Value}`,
    data: thisValue, //Value || this,
    success: (data) => {
      document.querySelector("#pr-ch-participants").textContent = data.length;
      data = data || {};
      if(data && Array.isArray(data) && data.length > 0){
        let tableBody = prayerChainTable.querySelectorAll("tbody");
        $("tbody").html("");
        weekSpan.textContent = `${weekChooserAllLMA.value}: ${moment().week(weekChooserAllLMA.value).startOf('week').format('ddd MMM Do')} - ${moment().week(weekChooserAllLMA.value).endOf('week').format('ddd MMM Do')}`;
        let starttime = ""; 
        let endtime = "";
        data.forEach((item, j) => {
          let row = $("tbody").append(`<tr></tr>`);
          row.append(`<td>${item.prayor.firstname} ${item.prayor.surname}</td>`);
          for(let i=0; i<7; i++){
            if(item[i].start){
              starttime = moment(item[i].start).locale("en-gb").format('LT');
            } else {
              starttime = "--";
            }
            if(item[i].end){
              endtime = moment(item[i].end).locale("en-gb").format('LT');
            } else {
              endtime = "--";
            }
            if(starttime == "--" && endtime == "--"){
              row.append(`<td> -- </td>`)
            } else {
              row.append(`<td>${starttime} - ${endtime}</td>`);
            }
          }
          row.append(`<td>${item.frequency}</td>`)
        });
      } else if (!Array.isArray(data)) {
        $("tbody").html("");
        $("tbody").append(`<td colspan="10">There was a problem. Please re-login.</td>`);
      } else {
        $("tbody").html("");
        $("tbody").append($(`<td colspan="10">Nothing to show here, please select a week to query for data</td>`));
      }
    },
    error: (err) => {
      $("tbody").html("");
      $("tbody").append(`<td colspan="10">There was a problem. Please re-login.</td>`)
      console.log(err);
    }
  })
};

if (weekChooserAllLMA) {
  weekChooserAllLMA.addEventListener("change", (e) => {
    prChFunction(e.target.value);
  })
}


//THIS WEEK CHOOSER
if(thisWeekPrCh){
  thisWeekPrCh.addEventListener("click", function (e) {
    weekChooserAllLMA.value = moment().locale("en-us").week();
    prChFunction(moment().locale("en-us").week()); 
  });
}


// HOVER APPEAR
if(hoverAppear){
  for(let i=0; i<hoverAppear.length; i++){
    hoverAppear[i].addEventListener("mouseover", function (e){
      let thisNode = this.children[0].children[0].children;
      for(let j=0; j<thisNode.length; j++){
        if(thisNode[j].className == "nodisplay"){
          thisNode[j].className = "";
          hoverAppear[i].addEventListener("mouseout", function (e){
            thisNode[j].className = "nodisplay";
          });
        }
      }
    });
  }
}

const specMeetingFunc = (meetingName, url) => {
  console.log(meetingName);
  $('tbody').html('');
  $('tbody').append('<tr><td colspan="10">Please wait...</td></tr>');
  $.ajax({
    url: `${url}/${meetingName}`,
    type: 'GET',
    success: (data) => {
      console.log(data)
      if(data && Array.isArray(data) && data.length > 0) {
        let list = "";
        $('tbody').html('');
        data.forEach((item) => {
          list = list + `\n${item.summoner.firstname} ${item.summoner.surname}`
          let thisRow = $('tbody');
          console.log(item);
          item.disciples.forEach((elem) => {
            list = list + `\n\t${elem.name}`
            thisRow.append(`<tr><td>${item.summoner.firstname} ${item.summoner.surname}</td><td>${elem.name}</td><td>${elem.gender}</td><td>${elem.mobileNumber}</td><td>${elem.address}</td><td>${elem.email}</td><td>${elem.believersConventionAccommodation}</td><td>${item.summoner.fellowship}</td><td>${item.summoner.church}</td><td></td></tr>`);
          });
          list = list + `\n\tINFO:${item.info}`;
          thisRow.append(`<tr><td>${item.summoner.firstname} ${item.summoner.surname}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>${item.info}</td></tr>`);
        })
        console.log(list);
      } else {
        $('tbody').html('');
        $('tbody').append('<tr><td colspan="10">Nothing to show here</td></tr>');
      }
    },
    error: (e) => {
      console.log(e);
    }
  })
}

// SPECIAL MEETINGS CHOOSER
if (specialMeeting) {
  specialMeeting.addEventListener("change", (e) => {
    specMeetingFunc(e.target.value, `/api/expected`)
  })
}

if (specialMeetingAtt) {
  specialMeetingAtt.addEventListener("change", (e) => {
    specMeetingFunc(e.target.value, `/api/attendance`)
  })
}

const attendanceAllFunc = (attendanceType, date) => {
    console.log(date);
    $('tbody').html('');
    $('tbody').append('<tr><td colspan="10">Please wait...</td></tr>');
    $.ajax({
      url: `/api/${attendanceType}/date/${date}/for/${reportFor.value}`,
      type: 'GET',
      success: (data) => {
        console.log(data);
        $('tbody').html('');
        if(data && Array.isArray(data) && data.length > 0){
          let count = 1;
          let totalDisciples = 0;
          data.forEach((elem) => {
            let thisRow = $('tbody');
            if(elem.disciples.length != 0){
              //Disciples that came
              elem.disciples.forEach((item, i)=>{
                //First on the disciples list
                if(i == 0){
                  thisRow.append(`<tr>
                  <td>${count}</td>
                  <td>${elem.summoner.firstname} ${elem.summoner.surname} (${elem.disciples.length})</td>
                  <td>${item.name} (${item.type})</td>
                  <td></td>
                </tr>`)
                totalDisciples = totalDisciples + elem.disciples.length;
                } else {
                  thisRow.append(`<tr>
                    <td></td>
                    <td>${elem.summoner.firstname} ${elem.summoner.surname}</td>
                    <td>${item.name} (${item.type})</td>
                    <td></td>
                  </tr>`)
                }
              })
            } else {
              //No one came
              if(elem.info){
              thisRow.append(`<tr>
                <td>${count}</td>
                <td>${elem.summoner.firstname} ${elem.summoner.surname}</td>
                <td></td>
                <td>${elem.info}</td>
              </tr>`)
              }
            }
            count++;
          })
          console.log(totalDisciples);
          document.querySelector(".total-disciples").textContent = totalDisciples;
          document.querySelector(".total-workers").textContent = data.length;
        } else {
          $('tbody').append('<tr><td colspan="10">Nothing to show here</td></tr>');
        }
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

if(dateChooser){
  dateChooser.addEventListener("input", function (e) {
    let id = e.target.getAttribute("id");
    attendanceAllFunc(id, this.value);
  })
}