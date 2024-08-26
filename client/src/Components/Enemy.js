import {useContext} from 'react';
import {Context} from '../Contexts/context';

function Enemy() {
  
  const { data } = useContext(Context);
  const [ state ] = data;

    return (
      <div className="">
        <h1 className='text-center'>Enemy Page</h1>
        <a href='/battle'><button>Battle</button></a>
      </div>
    );
  }
  
  export default Enemy;
  