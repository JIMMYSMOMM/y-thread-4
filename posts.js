


if (window.location.pathname == "/posts.html"){
    document.getElementById(`logOut`).onclick = function(){
        window.location = `index.html`;
    }
}

// Automatically display the username when the page loads
window.onload = function() {
    let username = localStorage.getItem("username"); // Retrieve the stored username
    let useremail = localStorage.getItem("useremail"); // Retrieve the stored user email
    if (username) {
        if (window.location.pathname == "/posts.html"){
            document.getElementById(`topPageNameDisplay`).textContent = `${username}`;
            document.getElementById(`topPageInfoDisplay`).textContent = ` - ` + `${useremail}`;
        }
    } else {
        console.log("No username found.");
    }
};

// Fetch and display all posts
function getAllPosts() {
    const postContainer = document.getElementById("postsDiv");

    if (!postContainer) {
        console.error("Element with ID 'postsDiv' not found!");
        return;
    }

    fetch('/api/posts')
    .then(response => response.json())
    .then(posts => {
        console.log("Fetched Posts:", posts); // Debugging step

        postContainer.innerHTML = ''; // Clear the container first

        posts.forEach(post => {
            const postId = post.id; // Ensure post has an ID

            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <hr style="height: 5px; background-color: rgb(${post.tcr}, ${post.tcg}, ${post.tcb});">
                <p><strong>Creator:</strong> ${post.creatorname}</p>
                <h2 style="color: rgb(${post.tcr}, ${post.tcg}, ${post.tcb});">${post.title}</h2>
                <p>${post.base}</p>
                
                <hr style="height: 2px; background-color: rgb(${post.tcr}, ${post.tcg}, ${post.tcb});">
                <div id="comments-${postId}"></div>
                <input type="text" id="commentInput-${postId}" placeholder="Add a comment">
                <button onclick="addComment(${postId})">Post Comment</button>
                <hr style="height: 5px; background-color: rgb(${post.tcr}, ${post.tcg}, ${post.tcb});">
                
                <hr style="height: 20px; background-color: grey">
                
            `;
            postContainer.appendChild(postElement);

            //<button onclick="deletePost('${post.title}')">Delete</button>
            
            loadComments(postId);
        });
    })
    .catch(error => console.error('Error fetching posts:', error));
}

// Fetch and display comments for a specific post
function loadComments(post_id) {
    const commentsContainer = document.getElementById(`comments-${post_id}`);
    if (!commentsContainer) {
        console.error(`Element with ID 'comments-${post_id}' not found!`);
        return;
    }

    fetch(`api/comments?post_id=${post_id}`) // Changed from index.php
    .then(response => response.json())
    .then(comments => {
        console.log("Fetched Comments:", comments);
        commentsContainer.innerHTML = ''; // Clear the container first

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.innerHTML = `
                <p><strong>${comment.author}:</strong> ${comment.content}</p>
                <hr>
            `;
            commentsContainer.appendChild(commentElement);
        });
    })
    .catch(error => console.error('Error fetching comments:', error));
}

// Add a new comment
function addComment(post_id) {
    const inputField = document.getElementById(`commentInput-${post_id}`);
    if (!inputField) {
        console.error(`Input field for post ${post_id} not found!`);
        return;
    }

    const author = localStorage.getItem("username") || "Anonymous"; // Use stored username or default to Anonymous
    const content = inputField.value.trim();

    if (!content) {
        Swal.fire({
            title: "You trying to spam?",
            icon: "warning",
            confirmButtonText: "No, sir",
            cancelButtonText: "No, keep it",
            showCancelButton: false
        });
        return;
    }

    const commentData = {
        post_id: post_id,
        author: author,
        content: content
    };

    fetch('api/comments', { // Changed from index.php
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server Response:', data);
        inputField.value = ''; // Clear input field
        loadComments(post_id); // Reload comments after adding
    })
    .catch(error => console.error('Error:', error));
}

// Delete a post
function deletePost(title) {
    fetch(`/api/posts/title/${encodeURIComponent(title)}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        getAllPosts(); // Refresh post list after deletion
    })
    .catch(error => console.error("Error deleting post:", error));
}

// Call function to fetch and display posts
document.addEventListener("DOMContentLoaded", function() {
    getAllPosts();
});
