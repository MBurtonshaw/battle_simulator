import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../Contexts/context';

function LevelUp() {
  const { data, actions } = useContext(Context);
  const [state] = data;

  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { heroId } = useParams();
  const navigate = useNavigate();
  const [enemyId, setEnemyId] = useState('');

  async function getData() {
    setLoading(true);
    setError(null);
    try {
      let heroData = await actions.getHero(heroId);

      if (heroData) {
        heroData.spellsList = [];
        heroData.inventory = [];
        setHero(heroData);

        if (heroData.expPoints >= 100) {
          await actions.checkForLevelUp(heroId);

          // Fetch updated hero data after level up
          let updatedHeroData = await actions.getHero(heroId);
          setHero(updatedHeroData);
        }

        // Update enemyId based on the hero's data
        const newEnemyId = heroData.enemiesDefeated > 0 ? heroData.enemiesDefeated : 0;
        setEnemyId(newEnemyId);
      } else {
        setError('Hero not found');
      }
    } catch (err) {
      console.error('Error fetching hero data:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false); // Ensure loading is set to false after data fetching
    }
  }

  useEffect(() => {
    getData();
  }, [heroId]);

  function spellsList() {
    if (hero && hero.spellsList && hero.spellsList.length > 0) {
      return hero.spellsList.map((spell, index) => (
        <li key={index} className='nonchalant'>{spell}</li>
      ));
    }
    return <li className='nonchalant'>No spells available</li>; // Optional fallback
  }

  function inventory() {
    if (hero && hero.inventory && hero.inventory.length > 0) {
      return hero.inventory.map((item, index) => (
        <li key={index} className='nonchalant'>{item}</li>
      ));
    }
    return <li className='nonchalant'>Inventory is empty</li>; // Optional fallback
  }

  function determineNav() {
    if (hero.enemiesDefeated >= 10) {
      return navigate(`/${hero.heroId}/win`);
    } else {
      return navigate(`/${hero.heroId}/enemy/${enemyId}`);
    }
  }
      

  if (error) {
    return (
      <div className="error">
        <h1 className='text-center'>{`Error: ${error}`}</h1>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="error">
        <h1 className='text-center'>Hero data is not available.</h1>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="loader">
        <h1 className='text-center'>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="Intro">
        <h1 className='text-center mt-2'>{`${hero.name}, the Hero - is now level ${hero.level}!`}</h1>
        <div className='mt-3'>
          <img src='../../../img/hero_fighter.png' alt='The hero, a fantasy fighter with a sword' />
        </div>
        <div className="mt-3 row w-50 m-auto">
          <div className='col'>
            <label className='fs-4' htmlFor="heroLevel">Level: </label>
            <p id="heroLevel" name="heroLevel" className='py-2 fs-5'>{hero.level}</p>
          </div>
          <div className='col'>
            <label className='fs-4' htmlFor="heroHealth">Health: </label>
            <p id="heroHealth" name="heroHealth" className='py-2 fs-5'>{hero.healthPoints}</p>
          </div>
          <div className='col'>
            <label className='fs-4' htmlFor="heroMagic">Magic: </label>
            <p id="heroMagic" name="heroMagic" className='py-2 fs-5'>{hero.magicPoints}</p>
          </div>
          <div className='col'>
            <label className='fs-4' htmlFor="heroDamage">Damage: </label>
            <p id="heroDamage" name="heroDamage" className='py-2 fs-5'>{hero.damage}</p>
          </div>
        </div>
        <div className='row w-25 m-auto mt-2'>
          <div className='col'>
            <h3>Spells</h3>
            <ul>
              {spellsList()}
            </ul>
          </div>
          <div className='col'>
            <h3>Inventory</h3>
            <ul>
              {inventory()}
            </ul>
          </div>
        </div>
        <button className='m-3 py-1 px-3' onClick={() => determineNav()}>Next</button>
      </div>
    );
  }
}

export default LevelUp;