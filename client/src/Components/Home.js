import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Contexts/context';
import ahem from '../sounds/ahem.mp3';
import fanfare from '../sounds/fanfare.mp3';

function Home() {

  const { data, actions } = useContext(Context);
  const [state] = data;
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [ver1, setVer1] = useState(true);
  const [ver2, setVer2] = useState(false);
  const [ver3, setVer3] = useState(false);

  const cough = new Audio(ahem);
  const music = new Audio(fanfare);

  const regex = new RegExp('^[A-Za-z]{1,14}$');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  function startGame() {
    if (regex.test(name)) {
      actions.addHero(name).then(result => navigate(`/${result.heroId}`));
    } else {
      window.alert('Please... enter a name.')
      window.alert('...with valid letters only!...')
      window.alert('...and no spaces.')
    }

  }
  function load() {
    return music.play();
  }

  function switchTo2() {
    setVer1(false);
    setVer2(true);
    music.play();
  }

  function switchTo3() {
    setVer2(false);
    setVer3(true);
    cough.play();
  }

  if (ver1) {
    return (
      <div id='Home' className="Home">
        <div className='home_container w-50 m-auto p-5'>
          <h1 className=''>Excuse me, kind hero... may I ask you a favor?</h1>
          <div className='mt-5 p-5'>
            <div className='mt-5 pt-5'>
            <div className='w-100 m-auto mt-5 p-5 pt-5'>
              <button className='green_button' onClick={() => { switchTo2() }}>Sure</button>

            </div>
            <div className='w-100 m-auto p-5 pt-3'>
              <button className='blue_button' onClick={() => { navigate('/high_scores') }}>High Scores</button>

            </div>
              </div>
           
          </div>
        </div>

      </div>

    );
  }
  if (ver2) {
    return (
      <div id='Home' className="Home">
        <div className='home_container w-50 m-auto p-5'>
          <h1 className=''>I come from a kingdom under attack by a group of fierce bandits!</h1>
          <div className='p-5'>
            <p className='fs-5'>The thieves ask a bounty too great for the citizens to pay.</p>
            <p className='fs-5'>I fear what they may do if we miss another payment...</p>
            <p className='fs-5'>We don't have a lot to offer,</p>
            <p className='fs-5'>but I'm sure the bandits will have treasures of their own.</p>
            <p className='fs-5'>On behalf of my people, I ask for your help.</p>
          </div>
          <div className='w-100 m-auto p-5 pt-3'>
            <button className='green_button' onClick={() => { switchTo3() }}>Agree</button>

          </div>
          <div className='w-100 m-auto p-5 pt-3'>
            <button className='blue_button' onClick={() => { navigate('/high_scores') }}>High Scores</button>

          </div>
        </div>


          
      </div>
    );
  }
  if (ver3) {
    return (
      <div id='Home' className="Home">
        <div className='home_container w-50 m-auto p-5'>
        <h1 className='pt-5'>Welcome to the Battle Simulator!</h1>
        <div className="container w-50 m-auto mt-5">
          <label className='w-100 m-auto mt-5 fs-5' htmlFor='name'>Umm..... could you remind me of your name?</label>
          <input
            className='mt-5'
            type='text'
            name='name'
            id='name'
            value={name}
            onChange={handleNameChange}
            maxLength={14} // Limit input length on the client side
          />
        </div>
       
        <div className='w-100 m-auto mt-5 p-5'>
          <button className='green_button' onClick={() => { startGame() }}>Start Game</button>

        </div>
        <div className='w-100 m-auto p-5 pt-3'>
          <button className='blue_button' onClick={() => { navigate('/high_scores') }}>High Scores</button>

        </div>
        </div>
      </div>
    );
  }
}

export default Home;
