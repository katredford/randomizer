
import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
import ValuesControl from './ValuesControl';
import AddValueForm from './AddValueForm';
import PortalContainer from './PortalContainer';
import WheelComponent from '../wheel/WheelComponent';
import TestWheelComponent from '../wheel/TestWheelComponent';


const WheelControl: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { oneWheel, loading, getOneWheel, updateValue, deleteValue, triggerSpinAnimation } = useWheel();
    const [refresh, setRefresh] = useState(0);
    const [isPortalOpen, setIsPortalOpen] = useState(false);

    useEffect(() => {
        getOneWheel(Number(id));
    }, [id, getOneWheel, refresh]);

    const refreshWheelData = useCallback(() => {
        setRefresh(prev => prev + 1);
    }, []);

    const handleOpenPortal = () => {
        setIsPortalOpen(true);
    };

    const handleClosePortal = () => {
        setIsPortalOpen(false);
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

                    <button autoFocus onClick={triggerSpinAnimation}>Trigger Animation</button>
                </>
            ) : (
                <div>No values found for this wheel.</div>
            )}

            <button onClick={handleOpenPortal}>Open Portal</button>
            <button onClick={handleClosePortal}>Close Portal</button>
            {isPortalOpen && (
                <PortalContainer >
                    <WheelComponent />
                </PortalContainer>
            )}
        <TestWheelComponent />
        </>
    );
};

export default WheelControl;











