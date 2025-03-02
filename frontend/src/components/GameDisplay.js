import React from 'react'
import Game from '../components/Game.js'
import CrewMembers from '../components/CrewMembers.js'
import Stats from '../components/Stats.js'
import Input from '../components/Input.js'
import CrewChat from '../components/CrewChat.js'
import ProgressBar from '../components/ProgressBar.js'

const Display = ({state, dispatch}) => {
  return (
    <>
        <div className="top-half">
          <ProgressBar />
          <Game />
        </div>
        <div className='bottom-half'>
          <div>
            <CrewMembers/>
            <div className='bottom-left-quarter'>
              <Stats/>
              <CrewChat />
            </div>
          </div>
          <Input state={state} dispatch={dispatch}/>
        </div>
    </>
  )
}

export default Display