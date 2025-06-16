const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
let apiKey;

// to securely get the api key
fetch('/api/key')
  .then(res => res.json())
  .then(data => {
    apiKey = data.apiKey;
    loadRecipe();
  })
  .catch(err => {
    console.error("fetching API key failed:", err);
    document.getElementById("error").textContent = "Error loading API key.";
  });

async function loadRecipe() {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}&includeNutrition=true`);
    const data = await response.json();

    // const data = {
    //   title: "Test Lasagna",
    //   image: "https://via.placeholder.com/400x250",
    //   instructions: "Layer sauce and cheese. Bake at 375°F for 45 minutes.",
    //   healthScore: 80,
    //   extendedIngredients: [
    //     { name: "cheese" },
    //     { name: "tomato sauce" },
    //     { name: "pasta sheets" }
    //   ],
    //   nutrition: {
    //     nutrients: [
    //       { name: "Calories", amount: 550, unit: "kcal" },
    //       { name: "Fat", amount: 22, unit: "g" },
    //       { name: "Protein", amount: 28, unit: "g" },
    //       { name: "Fiber", amount: 3, unit: "g" }
    //     ]
    //   }
    // };


    if (!response.ok || !data.title) throw new Error("Invalid data");
    // if (!data.title) throw new Error("Invalid mock data");


    document.getElementById("recipeTitle").textContent = data.title;
    document.getElementById("recipeImage").src = data.image;
    document.getElementById("instructions").innerHTML = data.instructions || "Instructions not available";

    const wantedNutrients = ["Calories", "Fat", "Protein", "Fiber"];
    const nutritionText = wantedNutrients.map(name => {
      const n = data.nutrition.nutrients.find(n => n.name === name);
      return n ? `${name}: ${n.amount} ${n.unit}` : '';
    }).join('<br>');
    document.getElementById("nutrition").innerHTML = nutritionText + `<br><strong>Health Score:</strong> ${data.healthScore}`;

    const ingredients = data.extendedIngredients.map(ing => ing.name.toLowerCase().trim());
    const email = localStorage.getItem("email");
    const ul = document.getElementById("ingredients");

    // Fridge check
    const checkRes = await fetch('/fridge/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ingredients })
    });

    const result = await checkRes.json();
    ul.innerHTML = "";
    result.ingredients.forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      ul.appendChild(li);
    });

    const errorDiv = document.getElementById("error");
    errorDiv.style.display = "none";
    document.querySelectorAll(".action-buttons-dynamic").forEach(btn => btn.remove());

    if (result.canCook) {
      const cookBtn = document.createElement("button");
      cookBtn.textContent = "Cook Now";
      cookBtn.classList.add("action-buttons-dynamic");
      cookBtn.style.marginTop = "20px";
      cookBtn.onclick = async () => {
        await fetch('/fridge/use', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, ingredients })
        });
        alert("Recipe cooked. Ingredients removed from your fridge.");
        window.location.href = "dashboard.html";
      };
      ul.after(cookBtn);
    } else {
      errorDiv.style.display = "block";
      errorDiv.style.color = "red";
      errorDiv.style.fontWeight = "bold";
      errorDiv.textContent = "Missing ingredients: " + result.missing.join(", ");

      const restockBtn = document.createElement("button");
      restockBtn.textContent = "Restock Ingredients";
      restockBtn.classList.add("action-buttons-dynamic");
      restockBtn.style.marginTop = "15px";
      restockBtn.onclick = async () => {
        await fetch('/fridge/restock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, ingredients: result.missing })
        });

        const message = document.createElement("div");
        message.textContent = "Ingredients restocked!";
        message.style.color = "green";
        message.style.fontWeight = "bold";
        message.style.marginTop = "15px";
        message.style.transition = "opacity 0.5s ease";
        ul.after(message);
        setTimeout(() => {
          message.style.opacity = 0;
          setTimeout(() => message.remove(), 1000);
        }, 2000);

        await loadRecipe(); // refresh to check again
      };
      ul.after(restockBtn);
    }

    // === Save / Unsave Toggle Logic ===
    const toggleBtn = document.getElementById("saveToggle");
    const saveMsg = document.getElementById("saveMsg");

    const savedCheck = await fetch('/saved/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, recipe_id: recipeId })
    });
    const resultCheck = await savedCheck.json();
    console.log("Saved check result:", resultCheck);

    updateSaveToggle(resultCheck.isSaved === true); // force strict boolean

    toggleBtn.onclick = async () => {
      if (toggleBtn.classList.contains("saved")) {
        await fetch('/saved/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, recipe_id: recipeId })
        });
        updateSaveToggle(false);
      } else {
        await fetch('/saved/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            recipe_id: recipeId,
            recipe_title: data.title,
            image_url: data.image
          })
        });
        updateSaveToggle(true);
        saveMsg.style.display = "block";
        setTimeout(() => { saveMsg.style.opacity = 0; }, 1000);
        setTimeout(() => {
          saveMsg.style.display = "none";
          saveMsg.style.opacity = 1;
        }, 1500);
      }
    };

    function updateSaveToggle(saved) {
      console.log("Toggle updated. Is saved?", saved);
      if (saved) {
        toggleBtn.classList.add("saved");
        toggleBtn.classList.remove("unsaved");
      } else {
        toggleBtn.classList.add("unsaved");
        toggleBtn.classList.remove("saved");
      }
    }

  } catch (err) {
    console.error("Error loading recipe:", err);
    document.getElementById("error").style.display = "block";
  }
}

