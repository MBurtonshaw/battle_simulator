import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Intro from './Components/Intro';
import Enemy from './Components/Enemy';
import Battle from './Components/Battle';
import GameOver from './Components/GameOver';
import HighScores from './Components/HighScores';
import LevelUp from './Components/LevelUp';
import Win from './Components/Win';
import Lose from './Components/Lose';
import { Provider } from './Contexts/context';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Provider>
          <Routes>
            <Route
              strict path='/'
              element={
                <Home />
              }
            />
            <Route
              path='/:id'
              element={
                <Intro />
              }
            />
            <Route
              path='/:heroId/enemy/:enemyId'
              element={
                <Enemy />
              }
            />
            <Route
              path='/:heroId/battle/:enemyId'
              element={
                <Battle />
              }
            />
            <Route
              path='/game_over'
              element={
                <GameOver />
              }
            />
            <Route
              path='/high_scores'
              element={
                <HighScores />
              }
            />
            <Route
              path='/level_up/:heroId'
              element={
                <LevelUp />
              }
            />
            <Route
              path='/:heroId/win'
              element={
                <Win />
              }
            />
            <Route
              path='/:heroId/lose'
              element={
                <Lose />
              }
            />
            <Route
              path='/high_scores'
              element={
                <HighScores />
              }
            />
          </Routes>
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
