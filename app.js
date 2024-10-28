/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

// Array of words for the game
const wordsArray = [
  "example", "react", "javascript", "scramble", "coding",
  "development", "frontend", "backend", "programming", "interface"
];

const App = () => {
  const [words, setWords] = React.useState([]);
  const [currentWord, setCurrentWord] = React.useState("");
  const [scrambledWord, setScrambledWord] = React.useState("");
  const [guess, setGuess] = React.useState("");
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [passes, setPasses] = React.useState(3);
  const [gameOver, setGameOver] = React.useState(false);
  
  // Load game state from local storage or initialize
  React.useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('scrambleGameProgress'));
    if (storedProgress) {
      setPoints(storedProgress.points);
      setStrikes(storedProgress.strikes);
      setPasses(storedProgress.passes);
      setWords(storedProgress.words);
    } else {
      const shuffledWords = shuffle(wordsArray);
      setWords(shuffledWords);
    }
  }, []);

  // Set current word and scrambled word
  React.useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(words[0]);
      setScrambledWord(shuffle(words[0]));
    } else {
      setGameOver(true);
    }
    localStorage.setItem('scrambleGameProgress', JSON.stringify({
      points, strikes, passes, words
    }));
  }, [words, points, strikes, passes]);

  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      setWords(words.slice(1));
      setGuess("");
    } else {
      setStrikes(strikes + 1);
      if (strikes + 1 >= 3) {
        setGameOver(true);
      }
    }
  };

  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      setWords(words.slice(1));
    }
  };

  const restartGame = () => {
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    const shuffledWords = shuffle(wordsArray);
    setWords(shuffledWords);
    setGameOver(false);
  };

  return (
    <div className="App">
      <h1>Scramble Game</h1>
      {gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <button onClick={restartGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <h2>Current Word: {scrambledWord}</h2>
          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Your guess"
              required
            />
            <button type="submit">Guess</button>
          </form>
          <button onClick={handlePass} disabled={passes <= 0}>Pass</button>
          <h3>Points: {points}</h3>
          <h3>Strikes: {strikes}</h3>
          <h3>Passes Remaining: {passes}</h3>
          {strikes > 0 && <p>Incorrect guess! Try again!</p>}
        </div>
      )}
    </div>
  );
};

// Render the App component
ReactDOM.render(<App />, document.getElementById('root'));