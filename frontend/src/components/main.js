import React from "react"
import axios from "axios"
import "../css/main.css";
import arrow from "../assets/arrow.png";

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPokeNum: 0,
            currentPokemon: {},
            pokeImg: "",
            pokeUrl: "",
            pokemon: [],
            searchValue: "",
            errorMsg: false
        }
        this.nextPokemon = this.nextPokemon.bind(this);
        this.previousPokemon = this.previousPokemon.bind(this);
        this.update = this.update.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
      // compile a list of all pokemon and save them into an array
      // store the first pokemon URL to show at first render
        axios.get("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=807")
            .then(res => {
                const pokemon = res.data.results;
                const pokeUrl = res.data.results[0].url
                this.setState({pokemon, pokeUrl})
            })
    }

    componentDidUpdate() {
        //when changing pokemon update API get request to the new Url
        //save their image, number, and other stats 
        axios.get(this.state.pokeUrl).then(res => {
            const currentPokemon = res.data;
            const pokeImg = res.data.sprites.front_default;
            const currentPokeNum = currentPokemon.id - 1
            this.setState({currentPokemon, pokeImg, currentPokeNum})
        })
    }


    nextPokemon() {
      // Change the pokemon URl by incrementing in our pokemon array. If on last pokemon switch back to first
        let currentPokeNum = this.state.currentPokeNum;
            if (currentPokeNum === 806) {
                currentPokeNum = 0;
            } else {
                currentPokeNum++;
            }
        const pokeUrl = this.state.pokemon[currentPokeNum].url
        this.setState({currentPokeNum, pokeUrl});
    }

    previousPokemon() {
       // Change the pokemon URl by decrementing in our pokemon array. If on first pokemon switch back to last
        let currentPokeNum = this.state.currentPokeNum;
        if (currentPokeNum === 0) {
            currentPokeNum = 806;
        } else {
            currentPokeNum--;
        }
        const pokeUrl = this.state.pokemon[currentPokeNum].url
        this.setState({currentPokeNum, pokeUrl});
    }

    update() {
      // store any changes in the user input to have ready for search on completion 
         return (e) => {
           this.setState({
             searchValue: e.currentTarget.value,
           });
         };
    }
    
    search() {
      // iterates through our pokemon array in constant time and finds the searched pokemon, then switch the pokeUrl which
      // will trigger the componentDidUpdate and change the pokemon appropriatley. Then clear the search. 
        let name = this.state.searchValue.toLowerCase();
        for (let i = 0; i < this.state.pokemon.length; i++) {
            const currentPoke = this.state.pokemon[i];
            if(currentPoke.name === name) {
                this.setState({pokeUrl: currentPoke.url, searchValue: ""})
                return null; //without this you would call the error message with a good search as well
            }
        }
        // only call this method if no pokemon was found with the search
       this.errorMessage();
    }

    errorMessage() {
      // if user inputs a non existing pokemon it will show the error in place of the pokemon stats for 3 seconds
        this.setState({errorMsg: true});
        setTimeout(() => {
              this.setState({ errorMsg: false });
        }, 3000);
    }

    render() {
        const {pokeImg, currentPokemon, errorMsg} = this.state;

        return (
          <div className="secondary-container">
            <div className="third-container">
                  <div className="search-container">
                      <input 
                      className="search-input"
                      placeholder="Search..."
                      value={this.state.searchValue}
                      onChange={this.update()}
                      />
                      <button className="search-button" onClick={this.search}>Go!</button>
                  </div>
              <div className="image-parent-container">
                <div className="image-container">
                  <img className="image" src={pokeImg} alt="pokemon"></img>
                </div>
              </div>
              {!errorMsg ?
              <div className="poke-stats-container">
                <h3 className="number">#{currentPokemon.id}</h3>
                <p className="name">Name: {currentPokemon.name}</p>
                <p className="height">Height: {currentPokemon.height}</p>
                <p className="weight">Weight: {currentPokemon.weight}</p>
              </div>
              :
               <div className="poke-stats-container">
                <h1 className="error">Could not find any pokemon by that name</h1>
               </div>
                }
              <div className="arrow-container">
                <img className="left-arrow" src={arrow} alt="arrow" onClick={this.previousPokemon}></img>
                <img
                  className="right-arrow"
                  src={arrow}
                  alt="arrow"
                  onClick={this.nextPokemon}
                ></img>
              </div>
            </div>
          </div>
        );
    }
};


