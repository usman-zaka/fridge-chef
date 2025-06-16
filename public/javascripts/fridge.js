const email = localStorage.getItem("email");
if (!email) {
    window.location.href = "signin.html";
}

const list = document.getElementById("ingredientList");
const form = document.getElementById("addIngredientForm");
const input = document.getElementById("ingredientInput");
const qtyInput = document.getElementById("ingredientQty");
const clearBtn = document.getElementById("clearFridgeBtn");

async function fetchIngredients() {
    const res = await fetch(`/fridge/list?email=${encodeURIComponent(email)}`);
    const ingredients = await res.json();

    list.innerHTML = "";
    ingredients.forEach(({ name, quantity, ingredient_id }) => {
        const li = document.createElement("li");
        li.textContent = `${name} (${quantity})`;
        li.style.margin = "10px 0";

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✖";
        removeBtn.style.marginLeft = "10px";
        removeBtn.style.color = "red";
        removeBtn.onclick = async () => {
            await fetch(`/fridge/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, ingredient_id })
            });
            await fetchIngredients();
        };

        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = input.value.trim();
    const quantity = parseFloat(qtyInput.value);

    if (!name || isNaN(quantity)) return;

    await fetch(`/fridge/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, quantity })
    });

    // Show "ingredient added" message
    const message = document.getElementById("statusMessage");
    message.style.display = "block";
    message.textContent = "Ingredient added!";
    setTimeout(() => {
        message.style.display = "none";
    }, 2000);


    input.value = "";
    qtyInput.value = "";

    await fetchIngredients(); // Refresh the list
});

clearBtn.addEventListener("click", async () => {
    await fetch("/fridge/delete-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    await fetchIngredients();
});

// Load fridge contents on page load
fetchIngredients();
