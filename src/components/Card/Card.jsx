import React from 'react'
import './Card.css'


const Card = ({cardname , cardpara , cardcost, cardpic}) => {
  return (
    <div className="card">
        <img src={cardpic} alt="" />
        <div className="card-content">
            <h1 className="card-title">{cardname}</h1>
            <p className="card-para"> {cardpara}</p>
            <div className="card-temp">
              <h1 className='cost'>{cardcost}</h1>
              <button className='buy-button'>Buy</button>
            </div>
        </div>
    </div>
  )
}

export default Card