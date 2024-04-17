fetchData();
async function fetchData(){
    try{
        const pokemon = document.getElementById("pokemonName").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if(!response.ok){
            throw new Error ("Could not fetch data");
    }
        else{
            const data = await response.json();
            console.log(data);
            const pokemonSprite=data.sprites.front_default;
            const displaySprite = document.getElementById("pokemonSprite");
            displaySprite.src = pokemonSprite;
            displaySprite.style.display="block";
        }

    }
    catch(error){
        console.error(error);
    }
}