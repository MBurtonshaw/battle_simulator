import React, { createContext, Component } from "react";
import Data from '../HOCs/Data';

export const Context = createContext({}); 

export class Provider extends Component {

  constructor() {
    super();
        this.data = new Data();
  }
  
    state = {
      hero: {
        name: "",
        level: 1,
        healthPoints: 50,
        magicPoints: 20,
        damage: 10,
        exp: 0,
        spellsList: [],
        inventory: [],
        enemies_defeated: 0
      },
      error: null,
      latestHeroId: null
    }
  
    render() {

      const value = {
        data: [this.state],
        actions: {
          getHero: this.getHero,
          addHero: this.addHero,
          setLatestHeroId: this.setLatestHeroId,
          attack: this.attack,
          defeatEnemy: this.defeatEnemy,
          checkForLevelUp: this.checkForLevelUp,
          getHighScores: this.getHighScores,
          takeDamage: this.takeDamage
        }
      }
  
      return (
        <Context.Provider value={ value }>
          { this.props.children }
        </Context.Provider>  
      );
    }
    getHero = async (id) => {
      try {
        const hero = await this.data.getHero(id);
        this.setState({ hero }); // Update state with the fetched hero data
        return hero;
      } catch (error) {
        this.setState({ error });
      }
    }
  
    addHero = async (name) => {
      try {
        const newHero = await this.data.addHero(name);
        this.setLatestHeroId(newHero.heroId);
        await this.getHero(newHero.heroId); // Fetch and update state with the new hero's details
        return newHero;
      } catch (error) {
        this.setState({ error });
      }
    }

    setLatestHeroId = (id) => {
      this.setState({ latestHeroId: id });
    }

    defeatEnemy = async (heroId, exp) => {
      try {
        await this.data.defeatEnemy(heroId, exp);
      } catch(error) {
        this.setState({error});
      }
    }

    takeDamage = async (heroId, damage) => {
      try{
        await this.data.takeDamage(heroId, damage);
      } catch(error) {
        this.setState({error});
      }
    }

    checkForLevelUp = async (heroId) => {
      try {
        await this.data.checkForLevelUp(heroId);
      } catch(error) {
        this.setState({error});
      }
    }

    getHighScores = async () => {
      try {
        let response = await this.data.getHighScores();
        return response;
      } catch(error) {
        this.setState({error});
      }
    }

  }

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param { class } Component - A React component.
 * @returns { function } A higher-order component.
 */

export default function withContext( Component ) {
  return function ContextComponent( props ) {
    return (
      <Context.Consumer>
        { context => <Component { ...props } context={ context } />}
      </Context.Consumer>
    );
  }
}








