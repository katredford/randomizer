
import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
import ValuesControl from './ValuesControl';
import AddValueForm from './AddValueForm';
import PortalContainer from './PortalContainer';
import WheelComponent from '../wheel/WheelComponent';
import { Toaster } from 'react-hot-toast'
import { SiStarship } from 'react-icons/si'
import { motion } from 'framer-motion'
import { ValueItem } from '../ValueItem'


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

                    <button onClick={triggerSpinAnimation}>Trigger Animation</button>
                </>
            ) : (

                <div className="max-w-lg px-5 m-auto">
                    <h1 className="flex flex-col items-center gap-5 px-5 py-10 text-xl font-bold text-center rounded-xl bg-zinc-900">
                        <SiStarship className="text-5xl" />
                        add values to  your wheel
                    </h1>
                </div>
            )
            }


            <button onClick={handleOpenPortal}>Open Portal</button>
            <button onClick={handleClosePortal}>Close Portal</button>
            {isPortalOpen && (
                <PortalContainer >
                    <WheelComponent />
                </PortalContainer>
            )}

        </>
    );
};

export default WheelControl;











