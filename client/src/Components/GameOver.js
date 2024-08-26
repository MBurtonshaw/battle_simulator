import {useContext} from 'react';
import {Context} from '../Contexts/context';

function GameOver() {
  
  const { data } = useContext(Context);
  const [ state ] = data;

    return (
      <div className="">
        <h1 className='text-center'>Game Over</h1>
        <a href='/high_scores'><button>High Scores</button></a>
      </div>
    );
  }
  
  export default GameOver;
  