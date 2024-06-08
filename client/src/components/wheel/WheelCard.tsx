import React, { useEffect, useState } from 'react';


interface Wheel {
    id: number;
    title: string;
    updatedAt: string;
}

const WheelCard: React.FC<Wheel> = (props) => {
  console.log(props, "wheel card")
    return (
        <div  key={props.id}> 
            what up?
          {/* {wheels.id} */}
         
          <h1>{props.title}</h1>
          <h3>{props.updatedAt}</h3>
        </div>
    );
};

export default WheelCard;