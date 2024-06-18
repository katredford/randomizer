import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
import ValuesControl from './ValuesControl';
import AddValueForm from './AddValueForm';

const WheelControl: React.FC = () => {
    //get id value from url
    const { id } = useParams<{ id: string }>();
    // destructure functions from custom context useWheel
    const { oneWheel, loading, getOneWheel } = useWheel();
    //state to force re-render
    const [refresh, setRefresh] = useState(0); // State to force re-render

    // Fetch the wheel data whenever the component mounts or the id changes
    useEffect(() => {
        
        getOneWheel(Number(id));
    }, [id, getOneWheel, refresh]);

    // Callback function to refresh the wheel data
    const refreshWheelData = useCallback(() => {
        console.log("refreshWheelData called");
        setRefresh(prev => prev + 1); // Force re-render by updating state
    }, []);

    useEffect(() => {
        // This useEffect is for additional side effects when oneWheel changes
        
    }, [oneWheel]);

    if (loading) {
        return <div>Loading...</div>;
    }

    //when no wheel is found
    if (!oneWheel) {
        return <div>Wheel not found</div>;
    }

    return (
        <>
            <h1>{oneWheel.title}</h1>
            <AddValueForm wheel_id={Number(id)} onValueAdded={refreshWheelData} />
            {oneWheel.Values && oneWheel.Values.length > 0 ? (
                <ValuesControl wheel={oneWheel} />
            ) : (
                <div>No values found for this wheel.</div>
            )}
        </>
    );
};

export default WheelControl;







