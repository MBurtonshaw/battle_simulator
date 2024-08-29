import { useContext, useState, useEffect } from 'react';
import { Context } from '../Contexts/context';

function HighScores() {

  const { data, actions } = useContext(Context);
  const [state] = data;
  const [highScores, setHighScores] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getData() {
    const scores = await actions.getHighScores();
    if (scores) {
      setHighScores(scores);
    }
    setLoading(false);
  }

  useEffect(() => { getData() }, []);

  function score_loader() {
    if (highScores) {
      return (
        <div className='text-center row w-50 m-auto pt-4'>
          <div className='col'>
            <label htmlFor='heroName' className='fs-4 pb-5'>Hero</label>
            {highScores.map((score, i) =>
              <p key={i} name='heroName' id='heroName' className='py-2 fs-6'>{`${score.heroName}, level ${score.heroLevel}`}</p>
            )}
          </div>
          <div className='col'>
            <label htmlFor='heroScore' className='fs-4 pb-5'>Score</label>
            {highScores.map((score, i) =>
              <p key={i} name='heroScore' id='heroScore' className='py-2 fs-6'>{score.score}</p>
            )}
          </div>
        </div>
      );

    }
  }

  if (loading) {
    return (
      <div>
        <h1 className='text-center'>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="">
        <h1 className='text-center mt-3'>High Scores</h1>
        <div className='high_score_div mt-5'>
          {score_loader()}
        </div>
        <div className='text-center mt-5'>
        <a href='/'><button className='py-1 px-3'>Home</button></a>
        </div>

      </div>
    );
  }
}

export default HighScores;
