import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
import ValuesControl from './ValuesControl';
import AddValueForm from './AddValueForm';

import WheelComponent from '../wheel/WheelComponent';



const WheelControl: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { oneWheel, loading, getOneWheel, updateValue, deleteValue } = useWheel(); // Destructure updateValue function from custom context
    const [refresh, setRefresh] = useState(0); 

    useEffect(() => {
        getOneWheel(Number(id));
    }, [id, getOneWheel, refresh]);

    const refreshWheelData = useCallback(() => {
        setRefresh(prev => prev + 1);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!oneWheel) {
        return <div>Wheel not found</div>;
    }

    const itemNames = oneWheel.Values.map(value => value.value);


    return (
        <>
            <h1>{oneWheel.title}</h1>
            <AddValueForm wheel_id={Number(id)} onValueAdded={refreshWheelData} />
            {oneWheel.Values && oneWheel.Values.length > 0 ? (
                <>
                    <ValuesControl
                        wheel={oneWheel}
                        onUpdateValue={updateValue}
                        onValueChanged={refreshWheelData}
                        deleteValue={deleteValue}
                    />

                    <WheelComponent
                        title={oneWheel.title}
                        items={itemNames}
                    />
                </>
            ) : (
                <div>No values found for this wheel.</div>
            )}
        </>
    );
};

export default WheelControl;










