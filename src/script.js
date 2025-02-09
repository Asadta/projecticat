document.querySelector("#recipe-generator-form").addEventListener("submit", generateRecipe);

function generateRecipe(event) {
    event.preventDefault();

    let instructions = document.querySelector("#user-instructions").value.trim();
    if (instructions === "") {
        alert("Please enter at least one ingredient!");
        return;
    }

    let apiKey = "16t1b3fa04b8866116ccceb0d2do3a04";
    let prompt = `User ingredients: Generate two unique recipe names for ${instructions}`;
    let context = "You are an expert chef. Generate two different recipe names based on the provided ingredients.";

    let apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${apiKey}`;

    let recipeSelection = document.querySelector("#recipe-selection");
    let recipeList = document.querySelector("#recipe-list");
    let recipeElement = document.querySelector("#recipe");

    // Show loading state
    recipeSelection.classList.remove("hidden");
    recipeElement.classList.add("hidden");
    recipeList.innerHTML = `<li class="blink">Fetching recipe options...</li>`;

    axios.get(apiUrl)
        .then(response => {
            let recipes = response.data.answer.split("\n").filter(r => r.trim() !== "");
            displayRecipeOptions(recipes);
        })
        .catch(error => {
            console.error("Error fetching recipe options:", error);
            recipeList.innerHTML = "⚠️ Sorry, something went wrong. Please try again.";
        });
}

function displayRecipeOptions(recipes) {
    let recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = "";

    recipes.forEach((recipeName, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = recipeName;
        listItem.classList.add("recipe-option");
        listItem.onclick = () => fetchRecipeDetails(recipeName);
        recipeList.appendChild(listItem);
    });
}

function fetchRecipeDetails(recipeName) {
    let apiKey = "16t1b3fa04b8866116ccceb0d2do3a04";
    let prompt = `Generate a detailed recipe for ${recipeName}`;
    let context = "You are an expert chef. Format the response using HTML. Ingredients in <ul>, steps in <ol>, proper headings.";

    let apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${apiKey}`;

    let recipeElement = document.querySelector("#recipe");
    recipeElement.classList.remove("hidden");
    recipeElement.innerHTML = `<div class="blink">👩🏽‍🍳 Generating recipe for "${recipeName}"...</div>`;

    axios.get(apiUrl)
        .then(response => formatAndAnimateRecipe(response.data.answer))
        .catch(error => {
            console.error("Error fetching recipe details:", error);
            recipeElement.innerHTML = "⚠️ Sorry, something went wrong. Please try again.";
        });
}

function formatAndAnimateRecipe(recipeText) {
    let recipeElement = document.querySelector("#recipe");
    recipeElement.innerHTML = ""; 

    let formattedText = recipeText
        .replace(/\*\*Title:\*\* (.+)/, '<h1>$1</h1>')
        .replace(/\*\*Ingredients:\*\*/, '<h2>🍽️ Ingredients</h2><ul>')
        .replace(/\*\*Steps:\*\*/, '</ul><h2>📖 Instructions</h2><ol>')
        .replace(/- (.+)/g, '<li>$1</li>') + "</ol>"; 

    let typewriter = new Typewriter(recipeElement, {
        loop: false,
        delay: 40,
        cursor: "|",
    });

    typewriter
        .typeString(formattedText)
        .start();
}

const images = [
    "images/27531_ST_TENDERLOINS_13-7442687e434e4c4c95609ff0262773a2.jpg",
    "images/6-Special-Eid-Dishes-for-a-Perfect-Eid-Dinner.jpg",
    "images/3rd.jpg"
];

let currentIndex = 0;
const sliderContainer = document.querySelector(".slider");
const sliderImages = [];

images.forEach((src, index) => {
    let img = document.createElement("img");
    img.src = src;
    img.classList.add("slider-image");
    if (index === 0) img.classList.add("active");
    sliderContainer.appendChild(img);
    sliderImages.push(img);
});


function changeSlide(direction) {
    sliderImages[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + direction + images.length) % images.length;
    sliderImages[currentIndex].classList.add("active");
}


setInterval(() => changeSlide(1), 3000);

const prevButton = document.createElement("button");
prevButton.classList.add("prev");
prevButton.innerHTML = "&#10094;";
prevButton.onclick = () => changeSlide(-1);

const nextButton = document.createElement("button");
nextButton.classList.add("next");
nextButton.innerHTML = "&#10095;";
nextButton.onclick = () => changeSlide(1);

sliderContainer.appendChild(prevButton);
sliderContainer.appendChild(nextButton);
