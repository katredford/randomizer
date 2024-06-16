import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { WheelContext } from '../context/WheelContext';
import ValuesControl from './ValuesControl';

const WheelControl: React.FC = () => {
    const {id} = useParams<{ id: string}> ();
    const {oneWheel, loading, getOneWheel} = useContext(WheelContext)

    useEffect(() => {
        getOneWheel(Number(id))
    }, [id])


    if(loading) {
        return <div>Loading...</div>
    }

    if(!oneWheel) {
        return <div>Wheel not found</div>
    }

    return(
        <>
            WheelControl
            {/* display the data from the database */}
            <h1>{oneWheel?.title}</h1>
          {/* pass the wheel values to the ValuesControl component */}
            {Array.isArray(oneWheel?.Values) && oneWheel.Values.length > 0 && <ValuesControl wheel={oneWheel} />}
           
        </>
    )
}

export default WheelControl


