import { useContext, useState, useEffect } from 'react';
import { Context } from '../Contexts/context';

function Intro() {

  const { data, actions } = useContext(Context);
  const [state] = data;

  const [hero, setHero] = useState({});
  const [loading, setLoading] = useState(true);
  const [ currentId, setCurrentId ] = useState('');

  useEffect(() => {
    // Fetch and set the hero data when the component mounts
    const fetchHero = async () => {
      const heroData = await actions.getHero(1); // Ensure getHero returns a promise
      heroData.spellsList = [];
      heroData.inventory = [];
      setHero(heroData);
      setLoading(false);
    };

    fetchHero();

  }, [actions]);

  if (loading) {

    return (
      <div className="intro">
        <h1 className='text-center'>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="intro">
        <h1 className='text-center'>Welcome to the Battle Simulator!</h1>
        <a href='/enemy'><button>Enemy</button></a>
        <p>Name: {hero.name}</p>
        <p>Level: {hero.level}</p>
        <p>HealthPoints: {hero.healthPoints}</p>
        <p>MagicPoints: {hero.magicPoints}</p>
        <p>Damage: {hero.damage}</p>
        <p>Exp: {hero.exp}</p>
        <label htmlFor="spells">Spells List: </label>
        <ul name="spells">

        </ul>
        <label htmlFor="items">Inventory: </label>
        <ul name="items">
          {hero.inventory.map(item => { <li>{item}</li> })}
        </ul>
        <p>Enemies Defeated: {hero.enemies_defeated}</p>
      </div>
    );
  }


}

export default Intro;
