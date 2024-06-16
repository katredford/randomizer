import { useState, useContext } from 'react';
import {useWheel } from '../context/useWheel'

interface AddValueFormProps {
    wheel_id: number;
    // onValueadded: It is called within handleSubmit after a new value has 
    // been successfully added to the wheel. The primary purpose of this callback
    // is to allow the parent component to react to the addition of a new value
    onValueAdded: () => void; // new prop for callback
}

const AddValueForm: React.FC<AddValueFormProps> = ( {wheel_id, onValueAdded}) => {
    const { addValue, getOneWheel } = useWheel();
    const [inputValue, setInputValue] = useState<string>('')


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
    
        if(inputValue) {
            addValue(wheel_id, inputValue)
            onValueAdded()
            setInputValue('')
        }
    }

    return (
        <>
        <form>
            <label>
                slice value
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    />
                <button
                    onClick={handleSubmit}
                    >submit</button>
            </label>

        </form>
        </>
    )
}

export default AddValueForm