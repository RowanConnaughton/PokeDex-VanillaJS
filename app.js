const PokemonCard = document.querySelector(".pokemon-card");
const pokemonName = document.querySelector(".pokemon-name");
const pokemonId = document.querySelector(".pokemon-id");
const pokeFrontImage = document.querySelector(".pokemon-card__image");

const pokemonTypeOne = document.querySelector(".pokemon-type-one");
const pokemonTypeTwo = document.querySelector(".pokemon-type-two");
const pokemonWeight = document.querySelector(".pokemon-weight");
const pokemonHeight = document.querySelector(".pokemon-hieght");
const pokemonDescriptionOne = document.querySelector(".pokemon-desc-one");
const pokemonDescriptionTwo = document.querySelector(".pokemon-desc-two");
const pokemonHp = document.querySelector(".pokemon-hp");
const pokemonAttack = document.querySelector(".pokemon-attack");
const pokemonDefense = document.querySelector(".pokemon-defense");
const pokemonMoveOne = document.querySelector(".pokemon-move-one");
const pokemonMoveTwo = document.querySelector(".pokemon-move-two");
const pokemonMoveThree = document.querySelector(".pokemon-move-three");

const pokeListItems = document.querySelectorAll(".list-item");
const previousButton = document.querySelector(".previous");
const nextButton = document.querySelector(".next");

// constants and variables
const TYPES = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

let prevUrl = null;
let nextUrl = null;

//functions

//capitalize string function
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

//reset card classes
const resetCard = () => {
  PokemonCard.classList.remove("hide");

  for (const type of TYPES) {
    PokemonCard.classList.remove(type);
  }
};

//get pokemon list
const fetchPokeList = async (url) => {
const pokemonListResponse =  await fetch(url);
const pokemonList =  await pokemonListResponse.json();


    
      const { results, previous, next } = pokemonList;

      prevUrl = previous;
      nextUrl = next;

      for (let i = 0; i < pokeListItems.length; i++) {
        const pokeListItem = pokeListItems[i];
        const resultData = results[i];

        if (resultData) {
          const { name, url } = resultData;
          const urlArray = url.split("/");
          const id = urlArray[urlArray.length - 2];

          pokeListItem.textContent = id + ". " + capitalize(name);
        } else {
          pokeListItem.textContent = "";
        }
      }
    
};

//check for pokemon move data

const checkMove = (move, moveElement) => {
  if (move) {
    moveElement.classList.remove("hide");
    moveElement.textContent = capitalize(move["move"]["name"]);
  } else {
    moveElement.classList.add("hide");
    moveElement.textContent = "";
  }
};

//get data for details for pokemon

const fetchPokeDetails = async (id) => {
 const detailsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)

 const details = await detailsResponse.json();

      resetCard();

      pokemonTypeOne.textContent = capitalize(details["types"][0]["type"]["name"]);
      const dataSecondType = details["types"][1];
      if (dataSecondType) {
        pokemonTypeTwo.classList.remove("hide");
        pokemonTypeTwo.textContent = capitalize(dataSecondType["type"]["name"]);
      } else {
        pokemonTypeTwo.classList.add("hide");
        pokemonTypeTwo.textContent = "";
      }

      const dataFirstMove = details["moves"][0];
      const dataSecondMove = details["moves"][1];
      const dataThirdMove = details["moves"][2];

      checkMove(dataFirstMove, pokemonMoveOne);
      checkMove(dataSecondMove, pokemonMoveTwo);
      checkMove(dataThirdMove, pokemonMoveThree);

      PokemonCard.classList.add(details["types"][0]["type"]["name"]);

      pokemonName.textContent = capitalize(details["name"]);
      pokemonId.textContent = "#" + details["id"].toString().padStart(3, "0");

      const strWeight = JSON.stringify(details["weight"]);
      let strWeightRes = strWeight.slice(0, -1) + "." + strWeight.slice(-1);
      pokemonWeight.textContent = strWeightRes;

      const strHeight = JSON.stringify(details["height"]);
      let strHeightRes = strHeight.slice(0, -1) + "." + strHeight.slice(-1);
      pokemonHeight.textContent = strHeightRes;

      pokemonHp.textContent = details["stats"][0]["base_stat"];
      pokemonAttack.textContent = details["stats"][1]["base_stat"];
      pokemonDefense.textContent = details["stats"][2]["base_stat"];

      const dataImage =
        details["sprites"]["other"]["dream_world"]["front_default"];
      const dataSprite = details["sprites"]["front_default"];
      pokeFrontImage.src = dataImage ? dataImage : dataSprite;
    
  //fetch description
 const descriptionResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)


if(descriptionResponse.status === 404) {
  pokemonDescriptionOne.textContent = "No Description";
  pokemonDescriptionTwo.textContent = "";
  return Promise.reject("error 404");
}

 const description = await descriptionResponse.json();
 

  const flavourTextEntries = description["flavor_text_entries"];

      for (const flavourText of flavourTextEntries) {
        if (flavourText["language"]["name"] === "en") {
          const descriptionArray = flavourText["flavor_text"].split(".");
          pokemonDescriptionOne.textContent = JSON.stringify(
            descriptionArray[0]
          ).replace(/\\n|\\f|\\|"/g, " ");
          pokemonDescriptionTwo.textContent = JSON.stringify(
            descriptionArray[1]
          ).replace(/\\n|\\f|\\|"/g, " ");
          break;
        }
      }


};

//fetch next pokemon list on click
const nextButtonClick = () => {
  if (nextUrl) {
    fetchPokeList(nextUrl);
    clearActiveState();
  }
};

//fetch prev pokemon list on click
const previousButtonClick = () => {
  if (prevUrl) {
    fetchPokeList(prevUrl);
    clearActiveState();
  }
};

//fetch pokemon details on list item click
const handlelistItemClick = (e) => {
  if (!e.target) {
    return;
  }

  const listItem = e.target;

  if (!listItem.textContent) {
    return;
  }

  const id = listItem.textContent.split(".")[0];

  clearActiveState();

  listItem.classList.add("active-item");

  fetchPokeDetails(id);
};

//remove active class from list items
const clearActiveState = () => {
  for (const pokeListItem of pokeListItems) {
    pokeListItem.classList.remove("active-item");
  }
};

//event listners

previousButton.addEventListener("click", previousButtonClick);
nextButton.addEventListener("click", nextButtonClick);

for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener("click", handlelistItemClick);
}

//init app
fetchPokeList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=40")
