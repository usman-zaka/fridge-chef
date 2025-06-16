let apiKey;

fetch('/api/key')
    .then(res => res.json())
    .then(data => {
        apiKey = data.apiKey;
        console.log("got api")
    })


function getSearchElement() {
    let search = document.getElementById("searchInput");
    console.log(search);
    return search.value;
}

function getDietries() {
    const selectedDiet = document.querySelector('input[name="diet"]:checked');
    if (!selectedDiet) {
        return '';
    }
    return selectedDiet.value;
}

function getMaxCal() {
    const cal = document.getElementById("calorieSlider");
    return cal.value;
}

let page = 0;
function hideSuggested() {
    document.getElementById("Suggested-recipes").style.display = "none";
}

// Hide saved section
function hideSavedSection() {
    document.getElementById("saved-recipes-section").style.display = "none";
}

async function getRecipes() {
    hideSavedSection();
    document.getElementById("loader").style.display = "block";

    let query = getSearchElement();
    let diet = getDietries();
    let maxCal = getMaxCal();

    const container = document.getElementById("recipe-container");
    container.innerHTML = "";

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=9&offset=${page * 9}&apiKey=${apiKey}&diet=${diet}&maxCalories=${maxCal}`);
        const data = await response.json();
        console.log(response);
        console.log(data);
        document.getElementById("advancedOptions").style.display = "none";

        if (data.results && data.results.length > 0) {

            data.results.forEach((recipe) => {

                const recipeDiv = document.createElement("div");
                recipeDiv.className = "recipe";

                const titleLink = document.createElement("a");
                titleLink.innerText = recipe.title;
                titleLink.href = `recipe.html?includeNutrition=true&id=${recipe.id}`;
                titleLink.target = "_blank";

                const title = document.createElement("h2");
                title.appendChild(titleLink);

                const imagelink = document.createElement("a");
                imagelink.href = `recipe.html?includeNutrition=true&id=${recipe.id}`;
                imagelink.target = "_blank";

                const image = document.createElement("img");
                image.src = recipe.image;
                image.alt = recipe.title;

                imagelink.appendChild(image);
                recipeDiv.appendChild(imagelink);
                recipeDiv.appendChild(title);
                container.appendChild(recipeDiv);
            });
        } else {
            container.innerHTML = "<p>No recipes found. Try a different search.</p>";
        }


    } catch (error) {
        container.innerHTML = "<p>Error fetching recipes. Please try again later.</p>";
    }

    document.getElementById("loader").style.display = "none";
}

// function to load different recipes depending on user navigation
function changePage(num) {
    page += num;
    if (page < 0) page = 0;
    getRecipes();
}

// code to dynamically change display value of slider
const calorieSlider = document.getElementById("calorieSlider");
const calorieValue = document.getElementById("calorieValue");

calorieSlider.addEventListener("input", () => {
    calorieValue.textContent = calorieSlider.value;
});

// to toggle advanced features
function toggleAdvanced() {
    const panel = document.getElementById("advancedOptions");
    if (panel.style.display === "none") panel.style.display = "block";
    else {
        panel.style.display = "none";
    }
}

document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload
    // Call your search function here
    getRecipes(); // replace with your actual function
});