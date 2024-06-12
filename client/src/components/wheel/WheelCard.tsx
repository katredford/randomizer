import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Wheel {
    id: number;
    title: string;
    updatedAt: string;
}

const WheelCard: React.FC<Wheel> = (props) => {
    // const currentPage = useLocation().pathname;
  console.log(props, "wheel card")

 
    return (
        <>
        <Link to={`/Wheel/${props.id}`}>
        <div  key={props.id}> 
            what up?
          {/* {wheels.id} */}
         
          <h1>{props.title}</h1>
          <h3>{props.updatedAt}</h3>
        </div>
        </Link>
        </>
    );
};

export default WheelCard;