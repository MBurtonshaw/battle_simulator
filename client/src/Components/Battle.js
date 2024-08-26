import {useContext} from 'react';
import {Context} from '../Contexts/context';

function Battle() {
  
  const { data } = useContext(Context);
  const [ state ] = data;

    return (
      <div className="">
        <h1 className='text-center'>Battle Page</h1>
        <a href='/game_over'><button>GameOver</button></a>
      </div>
    );
  }
  
  export default Battle;
  