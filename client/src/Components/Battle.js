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
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isEnemyFrozen, setIsEnemyFrozen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      try {
        const heroResponse = await actions.getHero(heroId);
        if (heroResponse.level === 1) {
          heroResponse.spellsList = [];
        } else if (heroResponse.level === 2) {
          heroResponse.spellsList = ['Freeze'];
        } else {
          heroResponse.spellsList = ['Freeze', 'Fire'];
        }
        heroResponse.inventory = [];
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
          if (updatedHero.enemiesDefeated >= 10) {
            if (updatedHero.expPoints >= 100) {
              navigate(`/level_up/${heroId}`);
            } else {
              navigate(`/${heroId}/win`);
            }
          } else {
            if (updatedHero.expPoints >= 100) {
              navigate(`/level_up/${heroId}`);
            } else {
              const nextId = Number(enemyId) + 1;
              navigate(`/${heroId}/enemy/${nextId}`);
            }
          }
        } catch (error) {
          console.error('Failed to handle victory:', error);
        }
      };

      handleVictory();
    }
  }, [enemyHealth, heroId, enemy, actions, navigate]);

  const attack = async (damage) => {
    if (isPlayerTurn) {
      if (enemy && hero) {
        setEnemyHealth((prevHealth) => {
          const newHealth = Math.max(prevHealth - damage, 0);
          return newHealth;
        });
      }
      setIsPlayerTurn(false);

    }
  };

  const enemyAttack = useCallback(async () => {
    if (!isPlayerTurn && enemy && hero) {
      if (enemyHealth > 0) {
        if (!isEnemyFrozen) {
          try {
            // Deal damage to the hero
            await actions.takeDamage(heroId, enemy.damage);
            await actions.getHero(heroId);
            // Update hero's health and check for defeat
            setHero((prevHero) => {
              const newHealth = Math.max(prevHero.healthPoints - enemy.damage, 0);

              // Navigate to lose page if hero health drops to 0 or below
              if (newHealth <= 0) {
                navigate(`/${heroId}/lose`);
                return {
                  ...prevHero,
                  healthPoints: newHealth,
                };
              }

              // Continue the battle
              setIsPlayerTurn(true);
              return {
                ...prevHero,
                healthPoints: newHealth,
              };
            });
          } catch (error) {
            console.error('Failed to execute enemy attack:', error);
          }
        } else {
          setIsEnemyFrozen(false);
          setIsPlayerTurn(true);
        }

      }
    }
  }, [enemy, enemyHealth, heroId, actions, navigate]);

  useEffect(() => {
    if (!isPlayerTurn) {
      enemyAttack();
    }
  }, [isPlayerTurn, enemyAttack]);

  const castFreezeSpell = useCallback(async () => {
    if (hero.magicPoints >= 10) {
      await actions.castFreezeSpell(heroId, 10);
      let updatedHero = await actions.getHero(heroId);
      setHero(updatedHero);
      setIsEnemyFrozen(true);
    } else {
      window.alert("Not enough magic points to cast freeze spell!");
    }
  }
  )

  const castFireSpell = useCallback(async () => {
    if (hero.magicPoints >= 15) {
      await actions.castFireSpell(heroId, 15);
      let updatedHero = await actions.getHero(heroId);
      setHero(updatedHero);
      setEnemyHealth(0);
    } else {
      window.alert("Not enough magic points to cast fire spell!");
    }
  }
  )

  function buttonPlacer() {
    if (hero.level === 1) {
      return (
        <button id='attack_button' className='mt-1 action_button' onClick={() => attack(hero.damage)}>Attack</button>
      );
    } else if (hero.level === 2) {
      if (hero.magicPoints >= 10) {
        return (
          <div>
            <div>
              <button id='attack_button' className='mt-1 action_button' onClick={() => attack(hero.damage)}>Attack</button>
            </div>
            <div>
              <button id='freeze_button' className='mt-1 action_button' onClick={() => castFreezeSpell()}>Freeze Spell - 10mp</button>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div>
              <button id='attack_button' className='mt-1 action_button' onClick={() => attack(hero.damage)}>Attack</button>
            </div>
            <div>
              <button id='freeze_button_inactive' className='mt-1 inactive_button' onClick={() => castFreezeSpell()}>Freeze Spell - 10mp</button>
            </div>
          </div>
        );
      }
    } else {
      if (hero.magicPoints >= 15) {
        return (
          <div>
            <div>
              <button id='attack_button' className='mt-1 action_button' onClick={() => attack(hero.damage)}>Attack</button>
            </div>
            <div>
              <button id='freeze_button' className='mt-1 action_button' onClick={() => castFreezeSpell()}>Freeze Spell - 10mp</button>
            </div>
            <div>
              <button id='fire_button' className='mt-1 action_button' onClick={() => castFireSpell()}>Fire Spell - 15mp</button>
            </div>
          </div>
        );
      } else if (hero.magicPoints >= 10 && hero.magicPoints < 15) {
        return (
          <div>
            <div>
              <button id='attack_button' className='mt-1 action_button' onClick={() => attack(hero.damage)}>Attack</button>
            </div>
            <div>
              <button id='freeze_button' className='mt-1 action_button' onClick={() => castFreezeSpell()}>Freeze Spell - 10mp</button>
            </div>
            <div>
              <button id='fire_button_inactive' className='mt-1 inactive_button' onClick={() => castFireSpell()}>Fire Spell - 15mp</button>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div>
              <button id='attack_button' className='mt-1 action_button' onClick={() => attack(hero.damage)}>Attack</button>
            </div>
            <div>
              <button id='freeze_button_inactive' className='mt-1 inactive_button' onClick={() => castFreezeSpell()}>Freeze Spell - 10mp</button>
            </div>
            <div>
              <button id='fire_button_inactive' className='mt-1 inactive_button' onClick={() => castFireSpell()}>Fire Spell - 15mp</button>
            </div>
          </div>
        );
      }
    }
  }

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
        {buttonPlacer()}
      </div>
    </div>
  );
}

export default Battle;