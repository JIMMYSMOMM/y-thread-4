


let username = localStorage.getItem("username");

if (window.location.pathname !== "/list.html") {
    document.getElementById(`submitName`).onclick = function(){
        let username = document.getElementById(`name`).value;
        let useremail = document.getElementById(`email`).value;
        localStorage.setItem("username", username); // Save username in local storage
        localStorage.setItem("useremail", useremail); // save email/info to local storage
        window.location = `list.html`; // Navigate to list.html
    }
}

if (window.location.pathname == "/list.html"){
    document.getElementById(`logOut`).onclick = function(){
        window.location = `index.html`;
    }
    
}





// Automatically display the username when the page loads
window.onload = function() {
    let username = localStorage.getItem("username"); // Retrieve the stored username
    let useremail = localStorage.getItem("useremail"); // Retrieve the stored username
    if (username) {
        if (window.location.pathname == "/list.html"){
            document.getElementById(`topPageNameDisplay`).textContent = `${username}`;
            document.getElementById(`topPageInfoDisplay`).textContent = ` - ` + `${useremail}`;
            createUser(username, useremail);
            console.log(`Username loaded: ${username}`);
            console.log(`Email loaded: ${useremail}`);
        }

    } else {

        console.log("No username found.");
    }
};






if (window.location.pathname == "/list.html"){
    fetch("api/users")
    .then(response => response.json())
    .then(data => {
        let list = document.getElementById("userList");
        data.forEach(user => {
            let li = document.createElement("li");
            li.textContent = user.name + " - " + user.email;
            
            list.appendChild(li);
        });
    })
    .catch(error => console.error("Error fetching data:", error));
    
    
    function deleteUserByName(username) {
        fetch(`api/users/name/${username}`, {
            method: 'DELETE'
        })
    }

    function createUser(name, email) {
        fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();  // Use text() to get the raw response
        })
        .then(data => {
          console.log("Raw Response:", data); // Log the raw response to see what is being returned
          try {
            const jsonData = JSON.parse(data); // Try parsing the response as JSON
            console.log("Parsed Data:", jsonData);
          } catch (e) {
            console.error("Error parsing JSON:", e);
            throw new Error("Invalid JSON response");
          }
        })
        .catch(error => {
          console.error("Error creating user:", error);
          alert("Error creating user.");
        });
      }
      
      
    



}

