import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../Contexts/context';

function Intro() {

  const { data, actions } = useContext(Context);
  const [state] = data;

  const [hero, setHero] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [enemyId, setEnemyId] = useState('');

  useEffect(() => {
    // Fetch and set the hero data when the component mounts
    const fetchHero = async () => {
      const heroData = await actions.getHero(id); // Ensure getHero returns a promise
      heroData.spellsList = [];
      heroData.inventory = [];
      setHero(heroData);
      if (hero.enemiesDefeated > 0) {
        setEnemyId(hero.enemiesDefeated);
      } else {
        setEnemyId(0);
      }
      setLoading(false);
    };

    fetchHero();

  }, [actions]);

  if (loading) {

    return (
      <div className="Intro">
        <h1 className='text-center'>Loading...</h1>
      </div>
    );
  } else {
    if (hero.level === 1) {
      return (
        <div className="Intro">
          <h1 className='text-center mt-5'>{`${hero.name}, the Hero!`}</h1>
          <div className="mt-2">
            <label className='mt-5' for="heroLevel">Level: </label>
            <p id="heroLevel" name="heroLevel" className='py-2'>{hero.level}</p>
            <label className='mt-2' for="heroHealth">Health: </label>
            <p id="heroHealth" name="heroHealth" className='py-2'>{hero.healthPoints}</p>
            <label className='mt-2' for="heroMagic">Magic: </label>
            <p id="heroMagic" name="heroMagic" className='py-2'>{hero.magicPoints}</p>
            <label className='mt-2' for="heroDamage">Damage: </label>
            <p id="heroDamage" name="heroDamage" className='py-2'>{hero.damage}</p>
          </div>
          <button className='m-4 py-1 px-3' onClick={() => navigate(`/${hero.heroId}/enemy/${enemyId}`)}>Next</button>
        </div>
      );
    } else {
      return (
        <div className="Intro">
          <h1 className='text-center mt-5'>{`${hero.name} is level ${hero.level}!`}</h1>
          <div className="mt-2">
            <label className='mt-5' for='heroName'>Name:</label>
            <p id='heroName' name='heroName' className='py-1'>{hero.name}</p>
            <label className='mt-2' for='heroLevel'>Level:</label>
            <p id='heroLevel' name='heroLevel' className='py-1'>{hero.level}</p>
            <label className='mt-2' for='heroHealth'>Health:</label>
            <p id='heroHealth' name='heroHealth' className='py-1'>{hero.healthPoints}</p>
            <label className='mt-2' for='heroMagic'>Magic:</label>
            <p id='heroMagic' name='heroMagic' className='py-1'>{hero.magicPoints}</p>
            <label className='mt-2' for='heroDamage'>Damage:</label>
            <p id='heroDamage' name='heroDamage' className='py-1'>{hero.damage}</p>
            <label className='mt-2' for='heroExp'>Experience:</label>
            <p id='heroExp' name='heroExp' className='py-1'>{hero.exp}</p>
            <label className='mt-2' htmlFor="heroSpells">Spells List: </label>
            <ul name="heroSpells">
              {hero.spellsList.map(spell => { <li className='py-1'>{spell}</li> })}
            </ul>
            <label className='mt-2' htmlFor="heroItems">Inventory: </label>
            <ul name="heroItems">
              {hero.inventory.map(item => { <li className='py-1'>{item}</li> })}
            </ul>
            <label className='mt-2' htmlFor="heroScore">Enemies Defeated: </label>
            <p name="heroScore" id="heroScore">{hero.enemies_defeated}</p>
          </div>
          <button className='m-4 py-1 px-3' onClick={() => navigate(`/${hero.heroId}/enemy/${enemyId}`)}>Next</button>
        </div>
      );
    }
  }
}

export default Intro;
