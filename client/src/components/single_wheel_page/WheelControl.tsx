
import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
import ValuesControl from './ValuesControl';
import AddValueForm from './AddValueForm';




const WheelControl: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { oneWheel, loading, getOneWheel, updateValue, deleteValue, triggerSpinAnimation } = useWheel(); 
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
            newWindow.postMessage({ type: 'click', spinAnimationTriggered: true }, '*');
            window.focus()
          };
    
          // Listen for messages from the child window
          window.addEventListener('message', (event) => {
            // Handle messages from child window, if needed
            window.focus();
          });
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

                    <button autoFocus onClick={openWheelInNewWindow}>Open Wheel</button>
                    <button onClick={triggerSpinAnimation}>Trigger Animation</button>
                </>
            ) : (
                <div>No values found for this wheel.</div>
            )}
        </>
    );
};

export default WheelControl;










