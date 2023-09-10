import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '../dist/output.css'
import confetti from 'canvas-confetti'

const TURNS ={
  'X':'X',
  'O':'O'
}

const WINNER_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [2,4,6],
  [1,4,7],
  [2,5,8],
  [0,4,8]
]

function CellBoard({children, updateBoard, index})
{
  const handleClick = ()=>{
    
    updateBoard(index)
  }

  return(
    <div key={index} onClick={handleClick} className='font-bold w-16 h-16 border-2 border-white rounded-md flex items-center justify-center transition bg-gray-800 hover:cursor-pointer'>
        {children}
    </div>
  )
}

function CellTurn({children, isSelected})
{
  var turnClasses = isSelected ?
  'bg-rose-600':
  'bg-gray-950'

  return (
    <div className={`rounded-lg ${turnClasses} font-bold w-12 h-12 flex items-center justify-center transition`}>
      <span>{children}</span>
    </div>
  )
}

function App() {

  const [board, setBoard] = useState(Array(9).fill(null))

  const [turn, setTurn] = useState(TURNS.X)

  const [winner, setWinner] = useState(null)

  const viewWinner = (boardCheck) =>{
    for(const combo of WINNER_COMBOS)
    {
      const [a,b,c] = combo
      if(boardCheck[a] && boardCheck[a] === boardCheck[b] && boardCheck[a] === boardCheck[c])
      {
        return boardCheck[a]
      } 
    }

    return null
  }

  const updateBoard = (index)=>{
    if(board[index] || winner) return

    var newBoard = [...board]
    newBoard[index] = turn == TURNS.X ? <span className='text-rose-600'>{turn}</span> : <span className='text-white-600'>{turn}</span>
    
    setBoard(newBoard)

    var newTurn = turn == TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    var newWinner = viewWinner(newBoard.map(
      (turns)=>{
        return(turns ? turns.props.children: null)
      }
    ))

    if(newWinner)
    {
      if(newWinner == TURNS.X) confetti({colors: ['#e11d48']})
      else confetti({colors: ['#fff']})
      
      setWinner(newWinner)
    }else if(newBoard.every((cell) => cell !== null))
    {
      setWinner(false)
    }
  }

  const resetGame = ()=>
  {
    setBoard(Array(9).fill(null))

    setTurn(TURNS.X)

    setWinner(null)
  }

  var winnerText = <span className='h-10'></span>
  console.log(winner)
  if(winner)
  {
    winnerText=<span className='h-10 text-center'>Gano: {turn == TURNS.O ? <span className='text-rose-600 font-bold'>{winner}</span> : <span className='text-white font-bold'>{winner}</span> }</span>
  }else if(winner === false)
  {
    winnerText = <span className='h-10'>Empate</span>
  }
  

  return (
    <>
    <main className='w-screen h-screen bg-gray-900 text-white flex flex-col gap-4 items-center justify-center'>
      <span>
        <h1 className='text-3xl font-black'>Tic-Tac-Toe</h1>

      </span>
      {winnerText}
      <section className='grid grid-cols-3 gap-2'>
        {
          board.map((cell, index)=>{
            return(
              <CellBoard key={index} index={index} updateBoard={updateBoard}>
                {board[index]}
              </CellBoard>
            )
          })
        }
      </section>
      <section className='flex gap-6'>
        <CellTurn isSelected={turn == TURNS.X}>
          {TURNS.X}
        </CellTurn>
        <CellTurn isSelected={turn == TURNS.O}>
          {TURNS.O}
        </CellTurn>

      </section>
      <div className='bg-rose-600 rounded-lg overflow-hidden'>
        <button type="button" className='bg-rose-600 py-3 w-[208px] text-white font-bold rounded-lg' onClick={resetGame}>Reset Game</button>
      </div>
    </main>
    </>
  )
}

export default App
