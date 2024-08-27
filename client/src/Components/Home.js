import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Contexts/context';

function Home() {

  const { data, actions } = useContext(Context);
  const [state] = data;
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const regex = new RegExp('^[A-Za-z]{1,14}$');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  function startGame() {
    if (regex.test(name)) {
      actions.addHero(name).then(result => navigate(`/intro/${result.heroId}`));
    } else {
      window.alert('Please... enter a name.')
      window.alert('...with valid letters only!...')
      window.alert('...and no spaces.')
    }

  }

  return (
    <div className="Home">
      <h1>Welcome to the Battle Simulator!</h1>
        <div className="container w-50 m-auto mt-5">
          <label className='w-100 m-auto mt-5' htmlFor='name'>Umm..... could you remind me of your name?</label>
          <input
            className='mt-5'
            type='text'
            name='name'
            id='name'
            value={name}
            onChange={handleNameChange}
            maxLength={14} // Limit input length on the client side
          />
          <div className='w-100 m-auto p-5'>
          <button className='py-1 px-4' onClick={() => { startGame() }}>Start Game</button>
          </div>

      </div>
    </div>
  );
}

export default Home;
