import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    useLocation
  } from "react-router-dom"

  interface Wheel {
    id: number;
    title: string;
    updatedAt: string;
    Values: [string];
}

export default function WheelControl() {
    const [wheel, setwheels] = useState<Wheel>();
    const location = useLocation().pathname.split('').pop()

    useEffect(() => {
        axios.get<Wheel>(`/api/data/${location}`)
            .then(response => {
                console.log(response)
                setwheels(response.data);
               
            })
            .catch(error => {
                console.error('There was an error fetching the departments!', error);
                
            });
    }, []);

    

  console.log(location, "location")
  console.log(wheel, "get stuff?")

    return(
        <>
        
        WheelControl
        <h1>{wheel?.title}</h1>
        {/* {wheel?.Values.map(valObj => {
            {console.log(valObj.value)}
        })} */}
        </>
    )
}