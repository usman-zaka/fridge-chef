# FridgeChef

FridgeChef is a web application designed to make cooking easier and more convenient. Using the Spoonacular API, users can quickly search for delicious recipes tailored to their dietary needs. Whether you're vegan, vegetarian, or just looking to cook with what you already have at home, FridgeChef delivers a personalized cooking experience.

## 🌟 Features

- 🔎 **Search Recipes**: Search for a wide range of recipes using the Spoonacular API.
- 🥦 **Virtual Fridge**: Add ingredients you have on hand and find recipes that match.
- 🥗 **Dietary Filters**: Filter recipes based on dietary preferences (e.g., vegan, vegetarian).
- 💾 **Save Recipes**: Save your favorite recipes for easy access later.
- 📤 **Export Recipes**: Export your saved recipes to a CSV file for offline use.

## 🚀 Getting Started

Follow these instructions to set up and run the FridgeChef application locally.

### Prerequisites

- Node.js
- npm
- MySQL

### Installation

1. Clone the repository:
   ``` bash
   git clone https://github.com/UAdelaide/25S1_WDC_UG_Groups_10.git (HTTPS)

   git clone git@github.com:UAdelaide/25S1_WDC_UG_Groups_10.git (SSH)
   ```
2. Rebuild as a docker container: 
   
   The application is containerised in a docker container. Using the .devcontainer.json file, rebuild the application as a docker container. In vscode, you will usually get a popup immediately.
   However, if you missed it then you can just do View > Command Palette > Dev Containers: Reopen in Container. 
   
3. Install dependencies:
   ``` bash
   npm install
   ```

### Running the application
1. Start the MySQL service:
   ``` bash
   service mysql start
   ```

2. Start the application:
   ``` bash
   npm start
   ```

## 🧰 Built With

- Express.js – Backend web framework for Node.js

- JavaScript – Application logic

- HTML & CSS – Frontend structure and styling

- Spoonacular API – Recipe and food data API

## Known Issues / Limitations
The main limitation is regarding the Spoonacular API. Once the daily limit is reached, users will be unable to further query the API and search for recipes until the next day. 
