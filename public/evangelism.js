const createPlayground = document.querySelector("#create-playground");
const createElement = document.querySelector("#create-element");


if(createPlayground){
  createElement.addEventListener("click", (e)=> {
    let prevDetails = createPlayground.querySelector("#details").value;
    console.log("h3y!")
    $(createPlayground).append(`<div class="form-group duplicate-element">
    <input class="form-control firstname" type="text" name="details[firstname]" placeholder="Firstname" id="firstname" autofocus>
    <input class="form-control" type="text" name="details[lastname]" placeholder="Lastname">
    <input class="form-control" type="tel" name="details[mobile]" placeholder="Phone Number" minlength="11" maxlength="11">
    <input class="form-control" type="email" name="details[email]" placeholder="Email">
    <select class="form-control" name="details[gender]">
        <option value="Female">Female</option>
        <option value="Male">Male</option>
    </select>
    <select class="form-control" name="details[status]">
        <option value="Saved">Saved</option>
        <option value="Filled">Filled</option>
        <option value="Prophesied">Prophesied</option>
    </select>
    <select class="form-control" name="details[language]">
        <option value="--">-Select primary language-</option>
        <option value="Amhari">Amhari</option>
        <option value="Arabic">Arabic</option>
        <option value="Bengali">Bengali</option>
        <option value="Chinese">Chinese</option>
        <option value="English">English</option>
        <option value="English (Pidgin)">English (Pidgin)</option>
        <option value="French">French</option>
        <option value="German">German</option>
        <option value="Hausa">Hausa</option>
        <option value="Hindi">Hindi</option>
        <option value="Igbo">Igbo</option>
        <option value="Indonesian">Indonesian</option>
        <option value="Italian">Italian</option>
        <option value="Japanese">Japanese</option>
        <option value="Lahnda">Lahnda</option>
        <option value="Oromo">Oromo</option>
        <option value="Portuguese">Portuguese</option>
        <option value="Russian">Russian</option>
        <option value="Spanish">Spanish</option>
        <option value="Swahili">Swahili</option>
        <option value="Shona">Shona</option>
        <option value="Yoruba">Yoruba</option>
        <option value="Zulu">Zulu</option>
    </select>
    <textarea class="form-control" name="details[address]" placeholder="Address"></textarea>
    <textarea class="form-control" name="details[info]" placeholder="Additional Information">${prevDetails}</textarea>
    <i class="del-element far fa-trash-alt fa-1.5x float-right"></i>
    </div>`);
  })

  // Remove elements
  createPlayground.addEventListener("click", (e) => {
      let delName = "del-element";
      if(e.target.className.includes(delName)){
        let thisNode = e.target.parentNode.previousElementSibling.firstElementChild
        thisNode.setAttribute("id", "firstname");
        if(thisNode.value && thisNode.value.length > 0){
          createElement[0].style.visibility = "visible";
        }
        e.target.parentNode.remove();
      }
    })
}


  