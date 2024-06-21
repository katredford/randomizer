
import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
import ValuesControl from './ValuesControl';
import AddValueForm from './AddValueForm';


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


    const openWheelInNewWindow = () => {
        if (!oneWheel) return;

        const newWindow = window.open(`/wheelComponent/${id}`, oneWheel.title, 'width=600,height=400');
        if (newWindow) {
            newWindow.onload = () => {
                
            };
        }
    };
    
    



    if (loading) {
        return <div>Loading...</div>;
    }

    if (!oneWheel) {
        return <div>Wheel not found</div>;
    }




    return (
        <>
            <h1>{oneWheel.title}</h1>
            <AddValueForm wheel_id={Number(id)} onValueAdded={refreshWheelData} />
            {oneWheel.Values && oneWheel.Values.length > 0 ? (
                <>
                    {/* <ValuesControl
                        wheel={oneWheel}
                        onUpdateValue={updateValue}
                        onValueChanged={refreshWheelData}
                        deleteValue={deleteValue}
                    /> */}
                        <ValuesControl
                        wheel={oneWheel}
                        onUpdateValue={(wheelId, valueId, value) => {
                            updateValue(wheelId, valueId, value);
                            refreshWheelData();
                        }}
                        onValueChanged={refreshWheelData}
                        deleteValue={(wheelId, valueId) => {
                            deleteValue(wheelId, valueId).then(refreshWheelData);
                        }}
                    />

                    <button onClick={openWheelInNewWindow}>Open Wheel</button>
                </>
            ) : (
                <div>No values found for this wheel.</div>
            )}
        </>
    );
};

export default WheelControl;










