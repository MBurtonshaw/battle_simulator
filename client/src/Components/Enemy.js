import {useContext, useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {Context} from '../Contexts/context';
import enemies from '../enemies.json';

function Enemy() {
  
  const { data, actions } = useContext(Context);
  const [ state ] = data;
  const { enemyId } = useParams();
  const [ enemy, setEnemy ] = useState('');
  const [ hero, setHero ] = useState('');

  async function getData() {
    setEnemy(enemies.enemies[enemyId]);
  }

  useEffect(() => {getData()}, [])
  useEffect(() => {setHero(data[0].hero)}, [])
    return (
      <div className="row align-items-center w-75 m-auto">
        <div className='col text-center'>
          <h1 className='col text-center'>{`${enemy.name}`}</h1>
          <p>{`Health: ${enemy.healthPoints}`}</p>
        </div>
        <div className='col text-center'>
          <h1>{`${hero.name}`}</h1>
          <div className='row w-50 m-auto'>
            <p className='col'>{`Health: ${hero.healthPoints}`}</p><p className='col'>{`Magic: ${hero.magicPoints}`}</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Enemy;
  