import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../Contexts/context';

function Lose() {
  const { data, actions } = useContext(Context);
  const [state] = data;

  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { heroId } = useParams();
  const navigate = useNavigate();

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
        <h1 className='text-center mt-2'>{`${hero.name}, the Hero - has been defeated!`}</h1>
        <h3 className='text-center mt-2'>The kingdom mourns their protector, and the inner council will soon seek another...</h3>
        <div className='mt-3'>
          <img src='../../../img/hero_fighter.png' alt='The hero, a fantasy fighter with a sword' />
        </div>
        <div className="mt-3 w-50 m-auto">
          <div className=''>
            <label className='fs-4' htmlFor="heroLevel">Level: </label>
            <p id="heroLevel" name="heroLevel" className='py-2 fs-5'>{hero.level}</p>
          </div>
          <div className=''>
            <label className='fs-4' htmlFor="heroScore">Enemies Defeated: </label>
            <p id="heroScore" name="heroScore" className='py-2 fs-5'>{hero.enemiesDefeated}</p>
          </div>
        </div>
        <button className='m-3 py-1 px-3' onClick={() => navigate(`/high_scores`)}>Next</button>
      </div>
    );
  }
}

export default Lose;