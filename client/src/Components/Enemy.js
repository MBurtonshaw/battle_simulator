import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../Contexts/context';
import enemies from '../enemies.json';

function Enemy() {

  const { data, actions } = useContext(Context);
  const [state] = data;
  const { heroId, enemyId } = useParams();
  const [enemy, setEnemy] = useState('');
  const [hero, setHero] = useState('');

  async function getData() {
    setEnemy(enemies.enemies[enemyId]);
    actions.getHero(heroId).then(response => { setHero(response) });
  }

  useEffect(() => { getData() }, [])
  return (
    <div className="w-75 m-auto text-center">
      <div className='mt-2'>
        <h1 className=''>New Opponent Has Appeared!</h1>
        <div className='mt-5'>
          <h2 className=''>{`${enemy.name}`}</h2>
          <img src={`${enemy.picture}`} alt={`${enemy.name}, fighting pose`} />
        </div>
        <div className='p-5'>
          <a href={`/${heroId}/battle/${enemyId}`}><button className='green_button'>To Battle!</button></a>
        </div>
      </div>
    </div>
  );
}

export default Enemy;
