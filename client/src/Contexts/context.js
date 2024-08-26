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
          setLatestHeroId: this.setLatestHeroId
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
        // using the getMessage function from /HOCs/data
        let hero = await this.data.getHero(id);
        //setting the response to state (Provider component)
        return hero;
        // this.state.hero = note;
      } catch (error) {
        this.setState({
          error
        });
      }
    }

    addHero = async (name) => {
      try {
        // Add a new hero
        const newHero = await this.data.addHero(name);
        // Assuming newHero contains heroId
        this.setLatestHeroId(newHero.heroId); // Correctly set the latest hero ID
        return newHero;
      } catch (error) {
        this.setState({ error });
      }
    }
  
    setLatestHeroId = (id) => {
      this.setState({ latestHeroId: id });
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

