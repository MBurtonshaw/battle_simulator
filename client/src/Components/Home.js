import {useContext, useState, useEffect} from 'react';
import {Context} from '../Contexts/context';

function Home() {

  const { data, actions } = useContext(Context);
  const [ state ] = data;
  const [name, setName] = useState('');

  return (
    <div className="Home">
      <h1 className='text-center'>Welcome to the Battle Simulator!</h1>
      <label htmlFor='name'>Umm..... could you remind me of your name?</label>
      <input type='text' name='name' id='name' onChange={() => {setName(document.getElementById('name').value)}}></input>
      <a href='/intro'><button>Intro</button></a>
      <button onClick={() => {actions.addHero(name)}}>Create hero</button>

    </div>
  );
}

export default Home;
