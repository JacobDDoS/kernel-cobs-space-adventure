import React, { useState } from 'react'
import Game from '../components/Game.js'
import CrewMembers from '../components/CrewMembers.js'
import Stats from '../components/Stats.js'
import Input from '../components/Input.js'
import CrewChat from '../components/CrewChat.js'

const Display = ({state, dispatch}) => {
  const [chatLog, setChatLog] = useState([]);
  return (
    <>
        <Game state={state} dispatch={dispatch} setChatLog={setChatLog}/>
        <div className='bottom-half'>
          <div>
            <CrewMembers/>
            <div className='bottom-left-quarter'>
              <Stats/>
              {chatLog !== null ? <CrewChat chatLog={chatLog} setChatLog={setChatLog}/> : null}
            </div>
          </div>
          <Input state={state} dispatch={dispatch}/>
        </div>
    </>
  )
}

export default Display