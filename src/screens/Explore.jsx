import React from 'react'
import './Explore.css'
import Searchbar from '../components/Searchbar/Searchbar';
import Card from '../components/Card/Card';
import pic1 from '../assets/dimg.jpg'

const Explore = () => {
  return (
    <div className="explore">
      <Searchbar/>
      <div className="explore-card">
        <Card cardname="Genesis Piece" cardpara="One of 12 lost pieces..." cardcost="100$"  cardpic={pic1}/>
        <Card cardname="Genesis Piece" cardpara="One of 12 lost pieces..." cardcost="100$"  cardpic={pic1}/>
        <Card cardname="Genesis Piece" cardpara="One of 12 lost pieces..." cardcost="100$"  cardpic={pic1}/>
        <Card cardname="Genesis Piece" cardpara="One of 12 lost pieces..." cardcost="100$"  cardpic={pic1}/>
        <Card cardname="Genesis Piece" cardpara="One of 12 lost pieces..." cardcost="100$"  cardpic={pic1}/>
        <Card cardname="Genesis Piece" cardpara="One of 12 lost pieces..." cardcost="100$"  cardpic={pic1}/>
      </div>
    </div>
  )
}

export default Explore