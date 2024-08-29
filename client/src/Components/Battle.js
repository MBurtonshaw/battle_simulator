import { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../Contexts/context';
import enemies from '../enemies.json';

function Battle() {
  const { data, actions } = useContext(Context);
  const { heroId, enemyId } = useParams();
  const [enemy, setEnemy] = useState(null);
  const [nextEnemyId, setNextEnemyId] = useState(enemyId + 1);
  const [hero, setHero] = useState(null);
  const [enemyHealth, setEnemyHealth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [victoryHandled, setVictoryHandled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      try {
        const heroResponse = await actions.getHero(heroId);
        setHero(heroResponse);
      } catch (error) {
        console.error('Failed to fetch hero data', error);
      }

      const enemyData = enemies.enemies[enemyId];
      if (enemyData) {
        setEnemy(enemyData);
        setEnemyHealth(enemyData.healthPoints); 
      } else {
        console.error('Enemy not found');
      }

      setLoading(false);
    }

    getData();
  }, [heroId, enemyId]); 

  useEffect(() => {
    if (enemyHealth === 0 && enemy) {
      const handleVictory = async () => {
        try {
          await actions.defeatEnemy(heroId, enemy.expGiven);
          const updatedHero = await actions.getHero(heroId);
          if (updatedHero.expPoints >= 100) {
            navigate(`/level_up/${heroId}`);
          } else {
            const nextId = Number(enemyId) + 1;
            navigate(`/${heroId}/enemy/${nextId}`);
          }
        } catch (error) {
          console.error('Failed to handle victory:', error);
        }
      };

      handleVictory();
    }
  }, [enemyHealth, heroId, enemy, actions, navigate]);

  const attack = (damage) => {
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
    <div className="row align-items-center w-75 m-auto mt-5">
      <div className='col text-center'>
        <img className='battle_img' src={'../../../img/hero_fighter.png'} alt={'The hero, a fantasy fighter with a sword'} />
        <div className='row w-50 m-auto'>
        <h1>{hero.name}</h1>
          <p className='col'>{`Health: ${hero.healthPoints}`}</p>
          <p className='col'>{`Magic: ${hero.magicPoints}`}</p>
        </div>
      </div>
      <div className='col text-center'>
        <img className='battle_img' src={`${enemy.picture}`} alt={`${enemy.name}, a fantasy character posing to fight`} />
        <div className='row w-50 m-auto'>
        <h1>{enemy.name}</h1>
        <p>{`Health: ${enemyHealth}`}</p>
        </div>
      </div>
      <div className='text-center mt-5'>
            <h5 className='mt-5'>Actions: </h5>
            <button className='mt-3' onClick={() => attack(hero.damage)}>Attack</button>
          </div>
    </div>
  );
}

export default Battle;