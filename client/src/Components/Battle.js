import { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../Contexts/context';
import enemies from '../enemies.json';

function Battle() {
  const { data, actions } = useContext(Context);
  const { heroId, enemyId } = useParams();
  const [enemy, setEnemy] = useState(null);
  const [hero, setHero] = useState(null);
  const [enemyHealth, setEnemyHealth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [victoryHandled, setVictoryHandled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      console.log('Fetching data'); // Debugging log
      try {
        const heroResponse = await actions.getHero(heroId);
        setHero(heroResponse);
      } catch (error) {
        console.error('Failed to fetch hero data', error);
      }

      const enemyData = enemies.enemies[enemyId];
      if (enemyData) {
        setEnemy(enemyData);
        setEnemyHealth(enemyData.healthPoints); // Initialize health only once
      } else {
        console.error('Enemy not found');
      }

      setLoading(false);
    }

    getData();
  }, [heroId, enemyId]); // Dependencies for useEffect

  useEffect(() => {
    if (enemyHealth === 0 && enemy) {
      const handleVictory = async () => {
        try {
          await actions.defeatEnemy(heroId, enemy.expGiven);
          const updatedHero = await actions.getHero(heroId);
          if (updatedHero.expPoints >= 100) {
            navigate(`/level_up/${heroId}`);
          } else {
            navigate(`/intro/${heroId}`);
          }
          console.log('Handling victory - Finished'); // Debugging log
        } catch (error) {
          console.error('Failed to handle victory:', error);
        }
      };

      handleVictory();
    }
  }, [enemyHealth, heroId, enemy, actions, navigate]);

  const attack = (damage) => {
    console.log('Attack called'); // Debugging log
    if (enemy && hero) {
      setEnemyHealth((prevHealth) => {
        const newHealth = Math.max(prevHealth - damage, 0);
        return newHealth;
      });
    }
  };

  if (loading) {
    return (
      <div className='text-center mt-5 pt-5'>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!hero || !enemy) {
    return (
      <div className='text-center mt-5 pt-5'>
        <h1>Error: Data not found</h1>
      </div>
    );
  }


  return (
    <div className="row align-items-center w-75 m-auto">
      <div className='col text-center'>
        <h1>{hero.name}</h1>
        <div className='row w-50 m-auto'>
          <p className='col'>{`Health: ${hero.healthPoints}`}</p>
          <p className='col'>{`Magic: ${hero.magicPoints}`}</p>
          <div>
            <h5>Actions: </h5>
            <button onClick={() => attack(hero.damage)}>Attack</button>
          </div>
        </div>
      </div>
      <div className='col text-center'>
        <h1>{enemy.name}</h1>
        <p>{`Health: ${enemyHealth}`}</p>
      </div>
    </div>
  );
}

export default Battle;