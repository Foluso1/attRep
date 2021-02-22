const route = window.location.pathname;
const specialMeeting = document.querySelector("#special-meeting");
const specialMeetingAtt = document.querySelector("#special-meeting-attendance");
const info = document.querySelector("#info");
const prWeekNumber = document.querySelector("#prayer-week-number");
const weekSpan = document.querySelector("#week-span");
const meeting = document.querySelector("#for");
const title = document.querySelector("#title");
const startTime = document.querySelector("#starttime");
const assocDisc = document.querySelectorAll(".assoc-disc");
const myDiv = document.querySelector(".mydiv");
const discipleList = document.querySelector(".disciple-list");
const editReport = document.querySelector(".edit-report");
const showPassword = document.querySelectorAll(".password-visible");
const editReportRemove = document.querySelector(".edit-report-remove");
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
const fellowshipChooser = document.querySelector(".fellowship-chooser");
const noReport = document.querySelector(".no-report");
const copyList = document.querySelector(".copy-list");
const copyList2 = document.querySelector(".copy-list-2");
const offering = document.querySelector("#offering");
const dateChooserEvglsm = document.querySelectorAll(".date-chooser-evglsm");
const newElement = document.querySelectorAll(".new-element");
const newElementEdit = document.querySelectorAll(".new-element-edit");
const delElement = document.querySelectorAll(".del-element");
const firstNameElem = document.querySelector("#firstname");
const elementPlayground = document.querySelectorAll(".element-playground");
const editPlayground = document.querySelector("#edit-playground");
const prayerGroupCoord = document.querySelector("#prayer-group-coord");
const numReached = document.querySelector("#reached");
const prayerGroupReport = document.querySelector("#prayer-group-report");
const delPrayerGroup = document.querySelector("#del-prayer-group");
let list = "";
let list2 = "";



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
  // Check for empty report
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
      console.log({
        ids: idsArray,
        title: title.innerText,
        for: meeting.value,
        info: info.value,
      })
      $.ajax({
        url: "/expected", 
        type: "POST", 
        data: {
          ids: idsArray,
          title: title.innerText,
          for: meeting.value,
          info: info.value,
        }, 
        success: (data) => {
          window.location.replace(`${window.location.origin}/expected`);
        },
      })
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
      if(data && Array.isArray(data) && data.length > 0) {
        let list = "";
        $('tbody').html('');
        data.forEach((item) => {
          list = list + `\n${item.summoner.firstname} ${item.summoner.surname}`
          let thisRow = $('tbody');
          item.disciples.forEach((elem) => {
            list = list + `\n\t${elem.name}`
            thisRow.append(`<tr><td>${item.summoner.firstname} ${item.summoner.surname}</td><td>${elem.name}</td><td>${elem.gender}</td><td>${elem.mobileNumber}</td><td>${elem.address}</td><td>${elem.email}</td><td>${meetingName == "Charis Campmeeting" ? elem.charisCampmeetingAccommodation : elem.believersConventionAccommodation}</td><td>${elem.accommType}</td><td>${item.summoner.fellowship}</td><td>${item.summoner.church}</td><td></td></tr>`);
          });
          list = list + `\n\tINFO:${item.info}`;
          thisRow.append(`<tr><td>${item.summoner.firstname} ${item.summoner.surname}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>${item.info}</td></tr>`);
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
    $(noReport).html('');
    $(noReport).append('<li><em>Please wait...</em></li>')
    $.ajax({
      url: `/api/${attendanceType}/date/${date}/for/${reportFor.value}/fellowship/${fellowshipChooser.value}`,
      type: 'GET',
      success: (result) => {
        let data = result.present
        $('tbody').html('');
        $(noReport).html('');
        if(data && Array.isArray(data) && data.length > 0){
          list = "";
          let count = 1;
          let totalDisciples = 0;
          // let elemCount = 0;
          data.forEach((elem) => {
            // if(elem.summoner.fellowship == fellowshipChooser.value){ //Displays result for a particular fellowship
              list = list + `\n${elem.summoner.firstname} ${elem.summoner.surname}`
              let thisRow = $('tbody');
              if(elem.disciples.length != 0){
                //Disciples that came
                elem.disciples.forEach((item, i)=>{
                  //First on the disciples list
                  list = list + `\n\t${item.name} (${item.type})`
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
                      <td></td>
                      <td>${item.name} (${item.type})</td>
                      <td></td>
                    </tr>`)
                  }
                })
              } else {
                //No one came
                if(elem.info){
                list = list + `\n\tINFO:${elem.info}`;
                thisRow.append(`<tr>
                  <td>${count}</td>
                  <td>${elem.summoner.firstname} ${elem.summoner.surname}</td>
                  <td></td>
                  <td>${elem.info}</td>
                </tr>`)
                }
              }
              // elemCount++;
              count++;
            // }
          })
          console.log(list);
          document.querySelector(".total-disciples").textContent = totalDisciples;
          document.querySelector(".total-workers").textContent = data.length;
          list2 = "";
          result.absent.forEach((item) => {
            list2 = list2 + `\n${item.firstname} ${item.surname}`
            $(noReport).append(`<li>${item.firstname} ${item.surname}</li>`)
          });
          console.log(list2)
        } else {
          $('tbody').append('<tr><td colspan="10">Nothing to show here</td></tr>');
          $(noReport).append(`<li><em>Nothing to show here</em></li>`)
        }
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

if(copyList) {
  copyList.addEventListener("click", (e) => {
    function updateClipboard(list) {
      navigator.clipboard.writeText(list).then(function() {
        console.log("Clipboard write successful");
      }, function() {
        console.log("Clipboard write failed");
      });
    }
    updateClipboard(list);
  })
}

if(copyList2) {
  copyList2.addEventListener("click", async (e) => {

    const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
    const permissionStatus = await navigator.permissions.query(queryOpts);
    // Will be 'granted', 'denied' or 'prompt':
    console.log(permissionStatus.state);

    function updateClipboard(list) {
      navigator.clipboard.writeText(list).then(function() {
        console.log("Clipboard write successful");
      }, function() {
        console.log("Clipboard write failed");
      });
    }
    updateClipboard(list2);
  })
}

if(dateChooser){
    dateChooser.addEventListener("input", function (e) {
      let id = e.target.getAttribute("id");
      attendanceAllFunc(id, this.value);
    })
    reportFor.addEventListener("change", (e) => {
        if (dateChooser.value) {
          let id = dateChooser.getAttribute("id")
          attendanceAllFunc(id, dateChooser.value);
        }
    })
    fellowshipChooser.addEventListener("change", (e) => {
      if (dateChooser.value) {
        let id = dateChooser.getAttribute("id")
        attendanceAllFunc(id, dateChooser.value);
      }
  })
}

// function numberWithCommas(x) {
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }
// if (offering){
//   offering.addEventListener("change", (e) => {
//     if (e.target.parentNode.parentNode.children[2]){
//       e.target.parentNode.parentNode.children[2].textContent = "";
//       e.target.parentNode.parentNode.children[2].style.backgroundColor = "";
//           e.target.parentNode.parentNode.children[2].style.border = "";
//     }
//     let val = e.target.value
//     e.target.type = "text";
//     let thisValue = val;
//     let strAmt = thisValue.toString();
//     if(isNaN(val)){
//         thisValue = strAmt.split(",").join("");
//         if(isNaN(thisValue)){
//           e.target.parentNode.parentNode.children[2].textContent = "Value is supposed to be a number";
//           e.target.parentNode.parentNode.children[2].style.backgroundColor = "#FFC7CE";
//           e.target.parentNode.parentNode.children[2].style.border = "1px solid red";
//         }
//     }
//     e.target.value = numberWithCommas(thisValue);
//   });
// }


//////////////////////////// EVANGELISM //////////////////////////////

// const evangelismAllFunc = (fellowship, start, end) => {
//   $('tbody').html('');
//   $('tbody').append('<tr><td colspan="10">Please wait...</td></tr>');
//   $(noReport).html('');
//   $(noReport).append('<li><em>Please wait...</em></li>')
//   $.ajax({
//     url: `/api/evangelism/${fellowship}/${start}/${end}`,
//     type: 'GET',
//     success: (data) => {
//       console.log(data)
//       // let data = result.present
//       $('tbody').html('');
//       $(noReport).html('');
//       if(data && Array.isArray(data) && data.length > 0){
//         list = "";
//         let count = 1;
//         let reached = 0;
//         let saved = 0;
//         let filled = 0;
//         let prophesied = 0;
//         let healed = 0;
//         // let elemCount = 0;
//         data.forEach((elem) => {
//             let thisRow = $('tbody');
//             if(elem.data){
//               let thisData = JSON.parse(elem.data);
//               console.log(thisData)
//                 reached = reached + Number(thisData.stats[0]);
//                 saved = saved + Number(thisData.stats[1]);
//                 filled = filled + Number(thisData.stats[2]);
//                 prophesied = prophesied + Number(thisData.stats[3]);
//                 healed = healed + Number(thisData.stats[4]);
//                 thisRow.append(`<tr>
//                   <td>${count}</td>
//                   <td>${elem.author.firstname} ${elem.author.surname}</td>
//                   <td>${thisData.stats[0]}</td>
//                   <td>${thisData.stats[1]}</td>
//                   <td>${thisData.stats[2]}</td>
//                   <td>${thisData.stats[3]}</td>
//                   <td>${thisData.stats[4]}</td>
//                   <td>${thisData.details}</td>
//                   <td>${thisData.healing}</td>
//                 </tr>`)
//                 list = list + `\n${thisData.details}`
//             } else {
//             }
//             count++;
//             document.querySelector("#reached").textContent = reached
//             document.querySelector("#saved").textContent = saved
//             document.querySelector("#filled").textContent = filled
//             document.querySelector("#prophesied").textContent = prophesied
//             document.querySelector("#healed").textContent = healed
//         })
//         $('tbody').append(`<tr>
//                   <td>Total</td>
//                   <td></td>
//                   <td>${reached}</td>
//                   <td>${saved}</td>
//                   <td>${filled}</td>
//                   <td>${prophesied}</td>
//                   <td>${healed}</td>
//                   <td></td>
//                 </tr>`)
//         list2 = "";
//         console.log(list2)
//       } else {
//         $('tbody').append('<tr><td colspan="10">Nothing to show here</td></tr>');
//         $(noReport).append(`<li><em>Nothing to show here</em></li>`)
//       }
//     },
//     error: (e) => {
//       console.log(e);
//     }
//   })
// }

////////NEW
const evangelismAllFunc = (fellowship, start, end) => {
  $('tbody').html('');
  $('tbody').append('<tr><td colspan="10">Please wait...</td></tr>');
  $(noReport).html('');
  $(noReport).append('<li><em>Please wait...</em></li>')
  $.ajax({
    url: `/api/evangelism/${fellowship}/${start}/${end}`,
    type: 'GET',
    success: (data) => {
      console.log(data)
      // let data = result.present
      $('tbody').html('');
      $(noReport).html('');
      if(data && typeof(data) == "object"){
        list = "";
        let count = 1;
        let reached = 0;
        let saved = 0;
        let filled = 0;
        let prophesied = 0;
        let healed = 0;
        // let elemCount = 0;
        let keysArr = Object.keys(data)
        keysArr.forEach((item)=>{
          let splitted = item.split(" ");
          let thisUser = `${splitted[0]} ${splitted[1]}`;
          let thisReached = 0;
          let thisSaved = 0;
          let thisFilled = 0;
          let thisProphesied = 0;
          let thisHealed = 0;
          console.log(item);
          data[item].forEach((eachReport)=>{
            eachReport = JSON.parse(eachReport.data);
            thisReached += Number(eachReport.stats[0]);
            thisSaved += Number(eachReport.stats[1]);
            thisFilled += Number(eachReport.stats[2]);
            thisProphesied += Number(eachReport.stats[3]);
            thisHealed += Number(eachReport.stats[4]);
            list = list + `\n${eachReport.healing} (${thisUser})`
          })
          $('tbody').append(`<tr>
            <td>${count}</td>
            <td><a href="/lma/${splitted[2]}/evangelism">${thisUser}</a></td>
            <td>${thisReached}</td>
            <td>${thisSaved}</td>
            <td>${thisFilled}</td>
            <td>${thisProphesied}</td>
            <td>${thisHealed}</td>
            <td> </td>
            <td> </td>
          </tr>`);
          reached += thisReached;
          saved += thisSaved;
          filled += thisFilled;
          prophesied += thisProphesied;
          healed += thisHealed;
          count++;
        })
        document.querySelector("#reached").textContent = reached
        document.querySelector("#saved").textContent = saved
        document.querySelector("#filled").textContent = filled
        document.querySelector("#prophesied").textContent = prophesied
        document.querySelector("#healed").textContent = healed
        $('tbody').append(`<tr>
                  <td>Total</td>
                  <td></td>
                  <td>${reached}</td>
                  <td>${saved}</td>
                  <td>${filled}</td>
                  <td>${prophesied}</td>
                  <td>${healed}</td>
                  <td></td>
                  <td></td>
                </tr>`)
        list2 = "";
        console.log(list2);
      } else {
        $('tbody').append('<tr><td colspan="10">Nothing to show here</td></tr>');
        $(noReport).append(`<li><em>Nothing to show here</em></li>`)
      }
    },
    error: (e) => {
      console.log(e);
    }
  })
}

const evangelismOneFunc = (start, end) => {
  $('tbody').html('');
  $('tbody').append('<tr><td colspan="10">Please wait...</td></tr>');
  $(noReport).html('');
  $(noReport).append('<li><em>Please wait...</em></li>')
  $.ajax({
    url: `/api/evangelism/${start}/${end}`,
    type: 'GET',
    success: (data) => {
      console.log(data)
      // let data = result.present
      $('tbody').html('');
      // $(noReport).html('');
      if(data && Array.isArray(data) && data.length > 0){
        list = "";
        let count = 1;
        let reached = 0;
        let saved = 0;
        let filled = 0;
        let prophesied = 0;
        let healed = 0;
        // let elemCount = 0;
        data.forEach((elem) => {
            let thisRow = $('tbody');
            if(elem.data){
              let thisData = JSON.parse(elem.data);
              console.log(thisData)
                reached = reached + Number(thisData.stats[0]);
                saved = saved + Number(thisData.stats[1]);
                filled = filled + Number(thisData.stats[2]);
                prophesied = prophesied + Number(thisData.stats[3]);
                healed = healed + Number(thisData.stats[4]);
                thisRow.append(`<tr>
                  <td>${count}</td>
                  <td>${moment(elem.date).format("DD/MM/YYYY")}</td>
                  <td>${thisData.stats[0]}</td>
                  <td>${thisData.stats[1]}</td>
                  <td>${thisData.stats[2]}</td>
                  <td>${thisData.stats[3]}</td>
                  <td>${thisData.stats[4]}</td>
                  <td>${thisData.details}</td>
                  <td>${thisData.healing}</td>
                </tr>`)
                list = list + `\n${thisData.details}`
            } else {
            }
            count++;
            document.querySelector("#reached").textContent = reached
            document.querySelector("#saved").textContent = saved
            document.querySelector("#filled").textContent = filled
            document.querySelector("#prophesied").textContent = prophesied
            document.querySelector("#healed").textContent = healed
        })
        $('tbody').append(`<tr>
          <td>Total</td>
          <td></td>
          <td>${reached}</td>
          <td>${saved}</td>
          <td>${filled}</td>
          <td>${prophesied}</td>
          <td>${healed}</td>
          <td></td>
          <td></td>
        </tr>`)
        list2 = "";
        console.log(list2)
      } else {
        $('tbody').append('<tr><td colspan="10">Nothing to show here</td></tr>');
        $(noReport).append(`<li><em>Nothing to show here</em></li>`)
      }
    },
    error: (e) => {
      console.log(e);
    }
  })
}


if (dateChooserEvglsm) {
  if(fellowshipChooser){
      fellowshipChooser.addEventListener("change", (e) => {
      if(dateChooserEvglsm[0].value && dateChooserEvglsm[1].value){
        evangelismAllFunc(fellowshipChooser.value, dateChooserEvglsm[0].value, dateChooserEvglsm[1].value)
      }
    })
  }

  dateChooserEvglsm.forEach((item) => {
    item.addEventListener("change", (e) => {
      if(dateChooserEvglsm[0].value && dateChooserEvglsm[1].value){
        if(fellowshipChooser){
          evangelismAllFunc(fellowshipChooser.value, dateChooserEvglsm[0].value, dateChooserEvglsm[1].value)
        } else {
          evangelismOneFunc(dateChooserEvglsm[0].value, dateChooserEvglsm[1].value)
        }
      }
    })
  })
}



$.fn.removeText = function(){
  this.each(function(){

     // Get elements contents
     var $cont = $(this).contents();

      // Loop through the contents
      $cont.each(function(){
         var $this = $(this);

          // If it's a text node
          if(this.nodeType == 3){
            $this.value = ""; // Remove it 
          } else if(this.nodeType == 1){ // If its an element node
            // $this.removeText(); //Recurse
          }
      });
  });
}

newElement.forEach((item) => {
  // Duplicate Element
  item.addEventListener("click", (e) => {
    let thisParent = e.target.parentNode.previousElementSibling;
    $("#firstname").removeAttr("id");
    let thisElement = $(thisParent.querySelector(".duplicate-element").outerHTML).append(`<i class="del-element far fa-trash-alt fa-1.5x float-right"></i>`);
    $(thisParent).append(thisElement);
    console.log("Duplicate Element", document.querySelectorAll(".duplicate-element").length);
    numReached.value++;
    thisParent.lastElementChild.firstElementChild.setAttribute("id", "firstname");
      newElement[0].style.visibility = "hidden";
  })
});



window.addEventListener("load", function(e){
  let abc = e.target.querySelector("#edit-playground");
  if (abc) {
    newElement[0].style.visibility = "visible";
  }
  if(prayerGroupReport){
    let status = prayerGroupReport.querySelector("select[name='status']");
    console.log(status);
    console.log(status.value);
    if(status.value == "Member"){
      let zone = prayerGroupReport.querySelector("select[name='zone']");
      let prayerGroup = prayerGroupReport.querySelector("select[name='prayer-group']");
      console.log(prayerGroup);
      zone.required = false;
      prayerGroup.required = false;
    }
  }
})

if(editPlayground){
  editPlayground.addEventListener("change", (e) => {
    if(editPlayground.querySelector("#firstname").value && editPlayground.querySelector("#firstname").value.length != 0){
      newElement[0].style.visibility = "visible";
    }
  })
}

function getOccurrence(array, value) {
  return array.filter((v) => (v === value)).length;
}

if(elementPlayground){
  // Remove elements
  elementPlayground.forEach((item) => {
    item.addEventListener("click", (e) => {
      let delName = "del-element";
      if(e.target.className.includes(delName)){
        let thisNode = e.target.parentNode.previousElementSibling.firstElementChild;
        thisNode.setAttribute("id", "firstname");
        if(thisNode.value && thisNode.value.length > 0){
          newElement[0].style.visibility = "visible";
        }
        e.target.parentNode.remove();
        console.log("Remove Duplicate Elements", document.querySelectorAll(".duplicate-element").length);
        numReached.value--;
      }
    })
  })



  // Show or hide ADD button
  elementPlayground.forEach((item) => {
    item.addEventListener("input", (e) => {
      if(e.target.getAttribute("id") == "firstname"){
        if(e.target.value.length > 0){
          if(newElement[0]){
            newElement[0].style.visibility = "visible";
          } else {
            newElementEdit[0].style.visibility = "visible";
          }
        } else {
          if(newElement[0]){
            newElement[0].style.visibility = "hidden";
          } else {
            newElementEdit[0].style.visibility = "hidden";
          }
        }
      }
    })
  });



  //Saved, filled, prophesied Statistics
  elementPlayground.forEach((item)=>{
    item.addEventListener("change", (e)=>{
      if(Array.from(e.target.classList).includes("status")){
        const prevVal = [];
        let statusStats = document.querySelectorAll(".status");
        statusStats.forEach((item)=>{
          prevVal.push(item.value);
        })
        document.querySelector("#saved").value = getOccurrence(prevVal, "Saved");
        document.querySelector("#filled").value = getOccurrence(prevVal, "Filled");
        document.querySelector("#prophesied").value = getOccurrence(prevVal, "Prophesied");
      }
    })
  })
}




if(prayerGroupCoord){
  prayerGroupCoord.addEventListener("click", (e) => {
    console.log(e.target.tagName);
    if(e.target.tagName == "A" && e.target.getAttribute("id") == "gen-code"){
      e.preventDefault();
      const ranNum = () => {
        let abc = Math.floor(10000*Math.random());
        len = Math.ceil(Math.log10(abc + 1));
        if (len < 4){
            let pwr =  4 - len;
            abc = abc* (10**pwr);
        }
        return abc;
      }
      let thisRanNum = ranNum();
      prayerGroupCoord.querySelector("#code").value = "Wait...";
      let userId = prayerGroupCoord.querySelector("#code").dataset.userId;
      console.log(userId);
      $.ajax({
        type: 'POST',
        url: '/prayergroup/admin',
        data: {userId, thisRanNum},
        success: (data) => {
          console.log(data);
          prayerGroupCoord.querySelector("#code").value = data;
          // Say code expires in one hour;
        },
        error: (e) => {
          console.log("There was a problem");
          prayerGroupCoord.querySelector("#code").value = "Try Again...";
        }
      })
    } else if (e.target.tagName == "SPAN") {
        let url = e.target.getAttribute("link");
        $.ajax({
          type: "DELETE",
          url: url,
          success: (data) => {},
        });
        e.target.parentNode.remove();
    }
  })
}


if(prayerGroupReport){
  let status = prayerGroupReport.querySelector("select[name='status']");
  console.log(status);
  console.log(status.value);
  if(status.value == "Member"){
    let zone = prayerGroupReport.querySelector("select[name='zone']");
    let prayerGroup = prayerGroupReport.querySelector("select[name='prayer-group']");
    console.log(prayerGroup)
    zone.required = false;
    prayerGroup.required = false;
  }
  status.addEventListener("change", (e)=>{
    let zone = prayerGroupReport.querySelector("select[name='zone']");
    let prayerGroup = prayerGroupReport.querySelector("select[name='prayer-group']");
    console.log(prayerGroup);
    if(e.target.value == "Member"){
      zone.required = false;
      prayerGroup.required = false;
  } else {
      zone.required = true;
      prayerGroup.required = true;
    }
  })
}