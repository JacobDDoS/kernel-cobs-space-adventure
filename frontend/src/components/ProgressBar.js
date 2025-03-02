import React, {useState} from 'react'
import ship from '../assets/corn.png'

const MaxShipProgress = 1000

const ProgressBar = () => {
    const [shipProgress, setShipProgress] = useState(1000)
    
    function getShipProgress() {
        return (
            (shipProgress / MaxShipProgress) * 97
        ) 
    }

    return (
        <div className="progBarContainer">
            <hr />
            <img src={ship} style={{left: `${getShipProgress()}%`}} />
        </div>
    )
}

export default ProgressBar