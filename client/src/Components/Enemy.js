import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../Contexts/context';
import enemies from '../enemies.json';
import draw_sword from '../sounds/draw_sword.mp3';

function Enemy() {

  const { data, actions } = useContext(Context);
  const [state] = data;
  const { heroId, enemyId } = useParams();
  const [enemy, setEnemy] = useState('');
  const [hero, setHero] = useState('');
  const sword_draw = new Audio(draw_sword);
  const navigate = useNavigate();

  async function getData() {
    setEnemy(enemies.enemies[enemyId]);
    actions.getHero(heroId).then(response => { setHero(response) });
  }

  function startBattle() {
    if (enemy.id === 1) {
      sword_draw.play();
    }
    navigate(`/${heroId}/battle/${enemyId}`);
  }

  useEffect(() => { getData() }, [])
  return (
    <div className="Enemy m-auto text-center">
      <div className='mt-2'>
        <h1 className=''>New Opponent Has Appeared!</h1>
        <div className='mt-5'>
          <h2 className=''>{`${enemy.name}`}</h2>
          <img src={`${enemy.picture}`} alt={`${enemy.name}, fighting pose`} />
        </div>
        <div className='p-5'>
          <button onClick={startBattle} className='green_button'>To Battle!</button>
        </div>
      </div>
    </div>
  );
}

export default Enemy;
