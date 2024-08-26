import {useContext} from 'react';
import {Context} from '../Contexts/context';

function LevelUp() {
  
  const { data } = useContext(Context);
  const [ state ] = data;

    return (
      <div className="">
        <h1 className='text-center'>Level Up</h1>
        <a href='/'><button>Home</button></a>
      </div>
    );
  }
  
  export default LevelUp;
  