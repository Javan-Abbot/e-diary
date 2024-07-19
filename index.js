document.addEventListener('DOMContentLoaded', () => {
    // declare my fetch endpoint

    const fetchEndpoint = "http://localhost:3000/diary-entries";

    let dateTimeInput = document.querySelector("#dateTimeInput");

    // create a new date object

    let today = new Date();
    let formattedDateTime = today.toISOString().substring(0, 16);
    dateTimeInput.value = formattedDateTime;

    let getLocation = document.querySelector("#getLocation");


    const form = document.querySelector("#login-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent form submission

        // Access input field values inside the submit event listener
        const userName = form.userName.value;
        const password = form.password.value;
        const buttonsDiv = document.querySelector(".buttons");
        let signInForm = document.querySelector("#login-form");
        let diaryEntryForm = document.querySelector("#hidden-div");
        if (userName === "abbot" && password === "12345") {
            fetch(fetchEndpoint)
            .then((res) => res.json())
            .then((data) =>
                data.forEach(
                    (diaryEntry) => getPost(diaryEntry)
                )
            );

        let diaryEntryForm = document.querySelector("#hidden-div");
        diaryEntryForm.style.display = "none";
        } else {
            alert("Incorrect! Enter a valid username and password.");
        }
        form.reset();

        // diaryEntryForm.style.display = "none";
        signInForm.style.display = "none";
        buttonsDiv.style.display = "flex";
    });

    const createPostButton = document.querySelector("#create-post-button");
    createPostButton.addEventListener("click", (e) => {
        let diaryEntryForm = document.querySelector("#hidden-div");
        diaryEntryForm.style.display = "block";

    })
    function getPost(object) {
        //  Add code here to display fetch
        // Also add code to hide the create post div
        // create elements
        const hiddenDivFetch = document.querySelector("#hidden-div-fetch")
        const hiddenDivFetcher = document.createElement("div");
        let postTitle = document.createElement("h3");
        let postContent = document.createElement("p");
        let postDate = document.createElement("p");
        let postLocation = document.createElement("p");
        let postWeatherStatus = document.createElement("p");
        const postUpdateBtn = document.createElement("button");
        const postDeleteBtn = document.createElement("button");
        //  append the elements
        hiddenDivFetcher.append(postTitle);
        hiddenDivFetcher.append(postContent);
        hiddenDivFetcher.append(postDate);
        hiddenDivFetcher.append(postLocation);
        hiddenDivFetcher.append(postWeatherStatus);
        hiddenDivFetcher.append(postUpdateBtn);
        hiddenDivFetcher.append(postDeleteBtn);
        // add content to the buttons
        postUpdateBtn.textContent = "Update Post";
        postDeleteBtn.textContent = "Delete Post";
        postTitle.textContent = object.title;
        postContent.textContent = object.content;
        postDate.textContent = object.date;
        postLocation.textContent = object.location;
        postWeatherStatus.textContent = object.weatherStatus;

        // Append the hiddenDivFetcher to the hiddenDivFetch element
        hiddenDivFetch.appendChild(hiddenDivFetcher);

        postUpdateBtn.addEventListener("click", (e) => {
            const updatedPost = prompt("Enter new post Title: ");
            if (updatedPost) {
                object.title = updatedPost;
                postTitle.textContent = updatedPost;
                updatePost(object);
            }
        })
        postDeleteBtn.addEventListener("click", (e) => {
            hiddenDivFetcher.remove()
            deletePost(object.id)
        })

    };
    // create a function DELETE
    function deletePost(id) {
        fetch(`http://localhost:3000/diary-entries/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())

    }
    //   create a function UPDATE
    function updatePost(object) {
        fetch(`http://localhost:3000/diary-entries/${object.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(object)
        })
            .then(resp => resp.json())
            .then(data => getPost(data))
    }

       // create a function CREATE POST
    function createPost(object) {
        fetch(fetchEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(object),
        }).then((res) => res.json())
            .then(data => getPost(object))
    }


    const submitPostBtn = document.querySelector("#submit-entry");
    submitPostBtn.addEventListener("submit", (e) => {
        e.preventDefault();
        const diaryEntry = {
            title: document.querySelector("#title").value,
            content: document.querySelector("#text-area").value,
            date: document.querySelector("#dateTimeInput").value,
            location: document.querySelector("#getLocation").value,
            weatherStatus: document.querySelector("#weather-status-value").value,
        };

        // calling the createPost function
        createPost(object);

    });


    const getLocationButton = document.querySelector("#get-location-button");
    getLocationButton.addEventListener("click", (e) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Display the location in the input field
                const locationInput = document.getElementById('getLocation');
                locationInput.value = `Latitude: ${latitude}, Longitude: ${longitude}`;
            }, function (error) {
                console.error('Error getting geolocation:', error);
                alert('Unable to retrieve your location. Please enable location services and try again.');
            });
        } else {
            alert('Geolocation is not supported in this browser.');
        }
    })





});
