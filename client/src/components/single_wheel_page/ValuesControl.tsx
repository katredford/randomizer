
import React, { useState, ChangeEvent } from 'react';

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

interface ValuesControlProps {
    wheel?: Wheel;
    //callback function to update a value, takes in the wheel_id, value_id, and value
    onUpdateValue: (wheel_id: number, value_id: number, new_value: string) => void;
    //refresh page after value is changed
    onValueChanged: () => void;
    deleteValue: (wheel_id: number, value_id: number) => void;
}


//recieves props from "WheelControl" component, wheel, onUpdateVale, onValueChanged
const ValuesControl: React.FC<ValuesControlProps> = ({ wheel, onUpdateValue, onValueChanged, deleteValue }) => {
    //holds the value id
    const [editingValueId, setEditingValueId] = useState<number | null>(null);
    //holds edited value
    const [editedValue, setEditedValue] = useState<string>('');

    // changes states to the thing that got clicked on value and valueID
    const handleEditStart = (valueId: number, originalValue: string) => {
        setEditingValueId(valueId);
        setEditedValue(originalValue);
    };

    //updates the edited value as user is typing
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditedValue(e.target.value);
    };

    //clears editingvalue when clicked
    const handleEditCancel = () => {
        setEditingValueId(null);
        setEditedValue('');
    };

    const handleEditSave = (valueId: number, wheelId: number) => {
        // calls onUpdateValue function passes the valueid wheelid and edited value
        onUpdateValue(wheelId, valueId, editedValue);
        //trigger refresh since value was changed
        onValueChanged();

        //reset state
        setEditingValueId(null);
        setEditedValue('');
    };

    const handleDelete = (wheelId: number, valueId: number) => {
        deleteValue(wheelId, valueId);
        onValueChanged();
    };

    //checks if there is a wheel
    if (!wheel) {
        return <div>No wheel data available</div>;
    }

    // Sort values by id in ascending order
    const sortedValues = [...wheel.Values].sort((a, b) => a.id - b.id);

    return (
        <>
            <h2>Value Control</h2>
            <ul>
                {/* map over sorted values */}
                {sortedValues.map((valObj) => (
                    // for each valObj create an li
                    <li key={valObj.id}>
                        {/* if editing display an input */}
                        {editingValueId === valObj.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedValue}
                                    onChange={handleInputChange}
                                />
                                <button onClick={() => handleEditSave(valObj.id, valObj.wheel_id)}>Save</button>
                                <button onClick={handleEditCancel}>Cancel</button>
                            </>
                        ) : (
                            // if not editing display the value in a span
                            <>
                                <span>{valObj.value}</span>
                                <button onClick={() => handleEditStart(valObj.id, valObj.value)}>Edit</button>
                                <button onClick={() => handleDelete(valObj.wheel_id, valObj.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ValuesControl;

