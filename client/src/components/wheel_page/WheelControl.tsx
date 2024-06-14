import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    useLocation
} from "react-router-dom"
import ValuesControl from './ValuesControl';

interface Value {
    id: number;
    value: string;
    wheel_id: number;
}

interface Wheel {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    Values: Value[];
}

const WheelControl: React.FC = () => {
    //initialize state can be type Wheel or undefined
    const [wheel, setwheels] = useState<Wheel | undefined>(undefined);

    //get the id number from the url
    const location = useLocation().pathname.split('').pop()

    useEffect(() => {
        //get wheel data from the database
        axios.get<Wheel>(`/api/data/${location}`)
            .then(response => {
                console.log(response)
                setwheels(response.data);

            })
            .catch(error => {
                console.error('There was an error fetching the departments!', error);

            });
    }, []);



    // console.log(location, "location")
    //   console.log(wheel, "get stuff?")

    return (
        <>

            WheelControl
            {/* display the data from the database */}
            <h1>{wheel?.title}</h1>
            {/* pass the wheel values to the ValuesControl component */}
            <ValuesControl wheel={wheel} />
        </>
    )
}


export default WheelControl

