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
        <div className='text-center row w-75 m-auto pt-4'>
          <div className='col'>
            <label htmlFor='heroName' className='fs-2 pb-5'>Hero</label>
            {highScores.map((score, i) =>
              <p key={i} name='heroName' id='heroName' className='py-2 fs-4'>{score.heroName}</p>
            )}
          </div>
          <div className='col'>
            <label htmlFor='heroLevel' className='fs-2 pb-5'>Level</label>
            {highScores.map((score, i) =>
              <p key={i} name='heroLevel' id='heroLevel' className='py-2 fs-4'>{score.heroLevel}</p>
            )}
          </div>
          <div className='col'>
            <label htmlFor='heroScore' className='fs-2 pb-5'>Score</label>
            {highScores.map((score, i) =>
              <p key={i} name='heroScore' id='heroScore' className='py-2 fs-4'>{score.score}</p>
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
      <div className="Scores">
        <h1 className='text-center mt-3'>HIGH SCORES</h1>
        <div className='high_score_div mt-5'>
          {score_loader()}
        </div>
        <div className='text-center m-5 pb-5'>
          <a href='/'><button className='green_button'>Home</button></a>
        </div>

      </div>
    );
  }
}

export default HighScores;
