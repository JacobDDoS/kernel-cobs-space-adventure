import React from 'react'
import Game from '../components/Game.js'
import CrewMembers from '../components/CrewMembers.js'
import Stats from '../components/Stats.js'
import Input from '../components/Input.js'
import CrewChat from '../components/CrewChat.js'

const Display = ({state, dispatch}) => {
  return (
    <>
        <Game />
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