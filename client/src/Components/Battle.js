import { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../Contexts/context';
import enemies from '../enemies.json';
import sword_hit from '../sounds/sword_slash.mp3';
import crackling_fire from '../sounds/crackling_fire.wav';
import eerie_wind from '../sounds/eerie_wind.wav';
import uncork from '../sounds/uncork.wav';
import drink from '../sounds/drink.wav';
import eating from '../sounds/eating.mp3';

function Battle() {
  const { data, actions } = useContext(Context);
  const { heroId, enemyId } = useParams();
  const [enemy, setEnemy] = useState(null);
  const [hero, setHero] = useState(null);
  const [enemyHealth, setEnemyHealth] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isEnemyFrozen, setIsEnemyFrozen] = useState(false);
  const navigate = useNavigate();
  const clash = new Audio(sword_hit);
  const fire = new Audio(crackling_fire);
  const freeze = new Audio(eerie_wind);
  const corked = new Audio(uncork);
  const gulp = new Audio(drink);
  const chewing = new Audio(eating);

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
          if (enemy.itemDropped !== '') {
            await actions.addItem(heroId, enemy.itemDropped);
          }
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
        clash.play();
        setEnemyHealth((prevHealth) => {
          const newHealth = Math.max(prevHealth - damage, 0);
          return newHealth;
        });
        setIsPlayerTurn(false);
        setTimeout(() => {
          setIsPlayerTurn(true);
        }, 1000); 
      }
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
      setTimeout(() => {
        enemyAttack();
      }, 1000); 
    }
  }, [isPlayerTurn, enemyAttack]);

  const castFreezeSpell = useCallback(async () => {
    if (hero.magicPoints >= 10) {
      freeze.play();
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
      fire.play();
      await actions.castFireSpell(heroId, 15);
      let updatedHero = await actions.getHero(heroId);
      setHero(updatedHero);
      setEnemyHealth(0);
    } else {
      window.alert("Not enough magic points to cast fire spell!");
    }
  }
  )

  function spellButtonPlacer() {
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

  async function consumeInventory(item) {
    try {
      if (item === 'Food') {
        chewing.play();
      } else {
        corked.play();
        gulp.play();
      }
      const updatedHero = await actions.useItem(heroId, item);
      setHero(updatedHero); // Update the hero state with the new values
      setIsPlayerTurn(false);
      // Delay the enemy attack to allow item effects to be visible
      setTimeout(() => {
        setIsPlayerTurn(false); // Ensure the enemy attacks after using an item
      }, 1000); // 1-second delay before the enemy attacks
  
    } catch (error) {
      console.error('Failed to use item:', error);
    }
  }

  function inventoryButtonPlacer() {
    if (hero.inventory) {
      return (
        hero.inventory.map((item, i) => {
          if (item.name === 'Food') {
            return (
              <div key={i}>
                <button id='food_button' className='mt-1 action_button' onClick={() => consumeInventory(item.name)}>{item.name}</button>
              </div>
            )
          }
          if (item.name === 'Potion') {
            return (
              <div key={i}>
                <button id='potion_button' className='mt-1 action_button' onClick={() => consumeInventory(item.name)}>{item.name}</button>
              </div>
            )
          }
        })
      )
    }
    return (
      ''
    );
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
    <div className="Battle m-auto text-center">
      <div className='mt-2'>
        <h1>{`${hero.name} vs ${enemy.name}`}</h1>
      </div>
      <div className='row align-items-center mt-5'>
        <div id='hero_div' className='col text-center'>
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
        <div className='row w-50 m-auto p-2'>
          <div className='col text-center my-5'>
            <h5 className='mt-5'>Actions: </h5>
            {spellButtonPlacer()}
          </div>
          <div className='col text-center my-5'>
            <h5 className='mt-5'>Items: </h5>
            {inventoryButtonPlacer()}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Battle;