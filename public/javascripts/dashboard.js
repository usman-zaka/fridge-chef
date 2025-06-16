async function loadSavedRecipes() {
  const container = document.getElementById('saved-recipe-list');
  if (!container) return;

  try {
    // const res = await fetch('/saved/list');
    const res = await fetch('/saved/list', {
      method: 'GET',
      credentials: 'include'
    });
    const savedRecipes = await res.json();

    if (!Array.isArray(savedRecipes)) {
      console.error("Expected array, got:", savedRecipes);
      container.innerHTML = "<p>Error loading saved recipes.</p>";
      return;
    }

    container.innerHTML = '';

    if (savedRecipes.length === 0) {
      container.innerHTML = "<p>You haven't saved any recipes yet.</p>";
      return;
    }

    savedRecipes.forEach(recipe => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");

      card.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
        <div style="width: 200px; height: 200px; overflow: hidden; border-radius: 8px; margin-bottom: 10px;">
          <img src="${recipe.image_url}" alt="${recipe.recipe_title}"
               style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
        </div>
        <h4 style="margin: 10px 0;">${recipe.recipe_title}</h4>
        <a href="recipe.html?id=${recipe.recipe_id}">
          <button>View Recipe</button>
        </a>
      </div>
    `;



      container.appendChild(card);
    });

  } catch (err) {
    console.error("Failed to load saved recipes:", err);
    container.innerHTML = "<p>Error loading saved recipes.</p>";
  }
}


document.addEventListener("DOMContentLoaded", loadSavedRecipes);

// return saved recipes to downloadable csv file
function exportSavedCSV(recipes){
  const columns =["Recipe Name", "Recipe ID", "Image link"];


  const rows = recipes.map(function(recipe){
    return [
      `"${recipe.recipe_title}"`,
       `"${recipe.recipe_id}"`,
      `"${recipe.image_url}"`
    ];
  });

  // col + row into csv string
  const csvstuff = [columns.join(","), ...rows.map(function(row){
    return row.join(",");
  })].join("\n");

  // downloadable file
  var blob = new Blob([csvstuff], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);
  var downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = 'savedRecipes.csv';
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

// button function
document.getElementById("export2csv").addEventListener("click", function(){
  fetch('saved/list', {
    method: 'GET',
    credentials: 'include'
  })
  .then(function(responsz){
    return responsz.json();
  })
  .then(function(savedRec){
  if(Array.isArray(savedRec)){
    exportSavedCSV(savedRec);
  } else {
    console.log("error fetching recipes.");
  }
  })
  .catch(function(err) {
    console.error("Failed CSV export", err);
});
});