import {useContext} from 'react';
import {Context} from '../Contexts/context';

function HighScores() {
  
  const { data } = useContext(Context);
  const [ state ] = data;

    return (
      <div className="">
        <h1 className='text-center'>High Scores</h1>
        <a href='/level_up'><button>LevelUp</button></a>
      </div>
    );
  }
  
  export default HighScores;
  