const searchForm = document.getElementById("github-form");
const searchInput = document.getElementById("search");
const userDisplayList = document.getElementById("user-list");
const repositoryDisplayList = document.getElementById("repos-list");
const modeToggle = document.getElementById("toggle");

// Event listener to toggle between user and repository search modes
modeToggle.addEventListener("click", () => {
  modeToggle.textContent = modeToggle.innerText === "Choice: Users" ? "Choice: Repos" : "Choice: Users";
});

// Form submission event listener to conduct the search operation based on the toggle state
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userDisplayList.textContent = "";  // Clear existing user list contents
  repositoryDisplayList.textContent = ""; // Clear existing repository list contents

  // Determine search context (user or repository) and execute the appropriate fetch call
  if(modeToggle.innerText==="Choice: Users"){ // User search
    fetch(`https://api.github.com/search/users?q=${searchInput.value}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((res) => res.json())
    .then((data) => // Iterate over the search results and display each user
      data.items.forEach((item) => {
        let profile = document.createElement("li");
        profile.innerHTML = `
              <h1>username: <i>${item.login}</i></h1>
              <a href=${item.html_url}>Visit profile </a>
              <button id=${item.id}>View repositories </button>
              <br>
              <img src=${item.avatar_url} alt="avatar" width="400">
              <hr>
              `;
        userDisplayList.appendChild(profile); // Append the user element to the user list

        initReposDisplay(item.id, item.login); // Fetch and display repositories for this user
      })
    );
  }
  else { // Repository search
    fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((res) => res.json())
    .then((data) => // Iterate over the search results and display each repository
      data.items.forEach((item) => {
        let repository = document.createElement("li");
        repository.innerHTML = `
              <h1>Repository name: <i>${item.name}</i></h1>
              <h2>Owner: ${item.owner.login}</h2>
              <a href=${item.html_url}>Visit repo </a>
              <hr>

              `;
        repositoryDisplayList.appendChild(repository); // Append the repo element to the repository list
      })
    );
  }

});

// Display repositories for a given user
// This function is triggered by clicking the "View repositories" button next to each user
function initReposDisplay(id, login) {
  let reposAccessButton = document.getElementById(id);
  reposAccessButton.addEventListener("click", () => {
    repositoryDisplayList.textContent = ""; // Clear existing repository list contents

    // Fetch and display the repositories for the chosen user
    fetch(`https://api.github.com/users/${login}/repos`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })
      .then((res) => res.json())
      .then((data) =>
        data.forEach((item) => {
          let repositoryItem = document.createElement("li");
          repositoryItem.innerHTML = `

                      <h2><a href=${item.html_url}>${item.name}</a></h2>

                  `;
          repositoryDisplayList.appendChild(repositoryItem); // Append repository element to the list
        })
      );
  });
}