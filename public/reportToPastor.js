const attendeesReportToPastor = document.querySelector(".attendees");


if(attendeesReportToPastor){
    attendeesReportToPastor.addEventListener("click", function(e){
      if(e.target.getAttribute("class") == "lma"){
        console.log(e.target)
        console.log(e.target.dataset.id);
        let elem = e.target;
        // if(elem.classList){
        //     elem.classList.toggle("line-through")
        // }
        if(elem.style.textDecoration == "line-through"){
          elem.style.textDecoration = "";
        } else {
          elem.style.textDecoration = "line-through";
        }
      }
      if(e.target.getAttribute("class") == "workers"){
        console.log(e.target)
        console.log(e.target.dataset.id);
        let reportId = this.getAttribute("id");
        let lmaId = e.target.dataset.id;
        let elem = e.target;
        if(elem.style.textDecoration == "line-through"){
          elem.style.textDecoration = "";
          $.ajax({
              url: `/api/reporttopastor/${reportId}/lma/${lmaId}`,
              type: "GET",
              success: (data) => {
                  console.log(data);
              },
              error: (err) => {
                  console.log(err);
              }
          })
        } else {
          elem.style.textDecoration = "line-through";
        }
      }
    })
  }