const menu = document.querySelectorAll(".menu");
const otherMenu = document.querySelector(".other-menu");
let isLMA = false;

$.ajax({
    url: '/isloggedin',
    type: 'GET',
    success: (data) => {
        isLMA = data.isLMA;
    },
    error: (e) => {
        // console.log("There was a problem");
    }
})

obj = {
    'prayer': [
        {
            0: "Prayer Chain",
            1: "/prayerchain"
        },
        {
            0: "Prayer Group",
            1: "/prayer"
        }
    ],
    'discipleship': [
        {
            0: "Disciples",
            1: "/disciple"
        },
        {
            0: "Discipleship",
            1: "/discipleship"
        }
    ],
    'evangelism': [
        {
            0: "Evangelism",
            1: "/evangelism"
        },
        {
            0: "Overview",
            1: "/evangelism/overview"
        }
    ],
    'attendance': [
        {
            0: "Expected",
            1: "/expected"
        },
        {
            0: "Attendance",
            1: "/attendance"
        }
    ],
    'lma-discipleship': [
        {
            0: "All Disciples",
            1: "/lma/all/disciple"
        },
        {
            0: "All Discipleship",
            1: "/lma/all/discipleship"
        }
    ],
    'lma-attendance': [
        {
            0: "All Expected",
            1: "/lma/all/expected"
        },
        {
            0: "All Attendance",
            1: "/lma/all/attendance"
        }
    ],
    'lma-prayer': [
        {
            0: "All Prayer Chain",
            1: "/lma/all/prayerchain"
        },
        {
            0: "All Prayer Group",
            1: "/lma/all/prayer"
        },
        {
            0: "Report Prayer Group",
            1: "/prayergroup"
        },
        {
            0: "Prayer Group Leader",
            1: "/prayergroup/admin"
        }
    ],
    'lma-evangelism': [
        {
            0: "All Evangelism",
            1: "/lma/all/evangelism"
        }
    ],
    'lma-special': [
        {
            0: "Special Meetings",
            1: "/lma/special"
        },
    ],
    'lma-admin': [
        {
            0: "LMA Admin",
            1: "/lma"
        },
        {
            0: "Add or Remove Worker",
            1: "/lma/new",
        }
    ],
}

menu.forEach((item) => {
    item.addEventListener("click", (e) => {
        let id = e.target.dataset.id;
        if(e.target.tagName == "I"){
            id = e.target.parentNode.dataset.id;
        }
        $(otherMenu).html("");
        obj[id].forEach((item) => {
            $(otherMenu).append(`<li><a class="btn btn-sm" href="${item[1]}">${item[0]}</a></li>`);
        });
        if(isLMA && obj[`lma-${id}`]){
            obj[`lma-${id}`].forEach((item) => {
                $(otherMenu).append(`<li><a class="btn btn-sm" href="${item[1]}">${item[0]}</a></li>`);
            });
        }
    })
});