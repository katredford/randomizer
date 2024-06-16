
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
import ValuesControl from './ValuesControl';
import AddValueForm from './AddValueForm';

const WheelControl: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { oneWheel, loading, getOneWheel } = useWheel();
    const [added, setAdded] = useState(false); // state to track if a value has been added

    // get the wheel data initially
    useEffect(() => {
        getOneWheel(Number(id));
    }, [id, getOneWheel]);


    // get the wheel data when a value is added
    useEffect(() => {
        if (added) {
            getOneWheel(Number(id));
            setAdded(false); // Reset the added state
        }
    }, [added, id, getOneWheel]);

    const refreshWheelData = useCallback(() => {
        setAdded(true); // set added to true to trigger refresh
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!oneWheel) {
        return <div>Wheel not found</div>;
    }

    return (
        <>
            <h1>{oneWheel.title}</h1>
            <AddValueForm wheel_id={Number(id)} onValueAdded={refreshWheelData}  />
            {oneWheel.Values && oneWheel.Values.length > 0 ? (
                <ValuesControl wheel={oneWheel} />
            ) : (
                <div>No values found for this wheel.</div>
            )}
        </>
    );
};

export default WheelControl;



