
import React, { useState, useRef, useEffect } from 'react';

import { motion } from 'framer-motion'

import { Input } from '../Input'

import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin7Line } from 'react-icons/ri'
import { toast } from 'react-hot-toast'
import cn from 'classnames'


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
    console.log(wheel)
    const editInputRef = useRef<HTMLInputElement>(null)



    useEffect(() => {
        if (editingValueId !== null && editInputRef.current) {
            editInputRef.current.focus()
        }
    }, [editingValueId])

    // changes states to the thing that got clicked on value and valueID
    const handleEditStart = (valueId: number, originalValue: string) => {
        setEditingValueId(valueId);
        setEditedValue(originalValue);

        if (editInputRef.current) {
            editInputRef.current.focus()
        }

    };

    const handleUpdate = (valueId: number, wheelId: number) => {
        if (editedValue.trim() !== '') {
            onUpdateValue(wheelId, valueId, editedValue)
            onValueChanged();

            //reset state
            setEditingValueId(null);
            setEditedValue('');
            toast.success('Todo updated successfully!')
        } else {
            toast.error('Todo field cannot be empty!')
        }
    }


    const handleDelete = (wheelId: number, valueId: number) => {
        deleteValue(wheelId, valueId);
        onValueChanged();
        toast.success('Todo deleted successfully!')

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
            <motion.ul className="grid max-w-lg gap-2 px-5 m-auto">
                {/* map over sorted values */}
                {sortedValues.map((valObj) => (
                    // for each valObj create an li
                    <motion.li
                        className={cn(
                            'p-5 rounded-xl bg-zinc-900'
                        )}
                        key={valObj.id}
                    >
                        {editingValueId === valObj.id ? (
                            <motion.div
                                layout
                                key={valObj.id}
                                className="flex gap-2">

                                <Input
                                    ref={editInputRef}
                                    type="text"
                                    value={editedValue}
                                    onChange={e => setEditedValue(e.target.value)}
                                />

                                <button
                                    className="px-5 py-2 text-sm font-normal text-orange-300 bg-orange-900 border-2 border-orange-900 active:scale-95 rounded-xl"
                                    onClick={() => handleUpdate(valObj.id, valObj.wheel_id)}
                                >
                                    Save
                                </button>
                            </motion.div>


                        ) : (


                            <div className="flex flex-col gap-5">
                                <motion.span
                                    layout
                                >
                                    <span>{valObj.value}</span>
                                </motion.span>
                                <div className="flex justify-between gap-5 text-white">


                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditStart(valObj.id, valObj.value)}
                                            className="flex items-center gap-1 "
                                        >
                                            <FaRegEdit />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(valObj.wheel_id, valObj.id)}
                                            className="flex items-center gap-1 text-red-500"
                                        >
                                            <RiDeleteBin7Line />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.li>
                ))}
            </motion.ul>
        </>
    );
};

export default ValuesControl;

