const startPrBtn = document.querySelector("#startPrBtn");
const endPrBtn = document.querySelector("#endPrBtn");


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
              newPrCh.setAttribute("class", "container")
              newPrCh.innerHTML =
                `Good day sir/ma, </br>
                I am done praying </br>
                ${time}`;
              newDiv.append(newPrCh);
              prChform.append(newDiv);
            } else {
              thisNode.html("");
              thisNode.append("<p>There was a problem, please re-login to end praying.</p>");
              let prevLocation = window.location;
              let str = `<div class="container">
                              <div class="row justify-content-center p-2">
                                  <div class="col-lg-6 col-md-8 col-sm-10 col-xs-12 card card-body bg-light transp" >
                                      <h1 class="text-center" >Welcome!</h1>
                                      <h5 class="m-2 text-center" >Let's log you in</h5>
                                      <br>
                                      <div class="text-center container" id="logger">
                                          <div class="d-flex form-group flex-column align-items-start">
                                              <label for="username">Username:</label>
                                              <input class="form-control" type="text" id="username" name="username" placeholder="Username or Email">
                                          </div>
                                          <div class="d-flex form-group flex-column align-items-start">
                                              <label for="password">Password:</label>
                                              <input class="form-control" type="password" id="password" name="password" placeholder="Password">
                                              <div class="d-flex">
                                                  <input type="checkbox" class="my-2 mr-2 password-visible"/> <small class="my-2">Show Password</small>
                                              </div>
                                          </div>
                                          <div class="row justify-content-center">
                                              <button class="col-6 btn btn-primary" id="btn-logger">Submit</button>
                                          </div>
                                      </div>
                                      <p class="text-center">or</p>
                                      <p class="text-center">Sign in with <a class="no-underline" href="/google/auth/google"><span style="color: #4183F1">G</span><span style="color: #EA4335">o</span><span style="color: #FBBC05">o</span><span style="color: #4183F1">g</span><span style="color: #34A853">l</span><span style="color: #EA4335">e</span></a></p>
                                      <p class="text-center"><a href="/forgot">Forgot Password</a></p>
                                      <hr>
                                  </div>
                              </div>
                          </div>`
                $(prayerChainNew).html('');
                $(prayerChainNew).append(str);
            }
          },
        });
      }

      thisNode.html("");     
      thisNode.append(`<div class="container">
          <p>Are you sure?</p>
          <div class="">
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

if(prayerChainNew){
  prayerChainNew.addEventListener("click", (e)=>{
    let logger = prayerChainNew.querySelector("#logger");
    let submit = prayerChainNew.querySelector("#btn-logger");
    if(submit){
      // submit.preventDefault();
      let username = logger.querySelector("#username").value;
      let password = logger.querySelector("#password").value;
      console.log(username, password);
      $.ajax({
        type: "POST",
        url: "/logger",
        data: { username: username, password: password },
        success: (data) => {
          console.log(data);
          location.reload();
        },
        error: (e) => {
          console.log("There was a problem!!!!!!!");
        }
      })
    }
  })
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
        console.log("Heeeeeeeeeeeeeeeeey!");
        console.log(window.location);
        console.log(window.location.replace("/login"));
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
      window.location.hash = "/login";
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
    weekChooserAllLMA.value = moment().locale("en-gb").week();
    prChFunction(moment().locale("en-gb").week()); 
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
