let apiKey;


function loadRecipe(recipeID) {
    window.location.href = `recipe.html?includeNutrition=true&id=${recipeID}`;
    console.log("loading recipe");
}

window.onload = async function () {
    const images = document.querySelectorAll('.images img');
    const keyResponse = await fetch('/api/key');
    const keyData = await keyResponse.json();
    apiKey = keyData.apiKey;

    for (let i = 0; i < images.length; i++) {
        const response = await fetch(`https://api.spoonacular.com/recipes/random?number=1&apiKey=${apiKey}`);
        const data = await response.json();

        if (data.recipes && data.recipes.length > 0) {
            const recipe = data.recipes[0];
            const recipeID = recipe.id;
            const imageUrl = recipe.image;

            images[i].src = imageUrl;
            images[i].onclick = () => loadRecipe(recipeID);
        }
    }
};
