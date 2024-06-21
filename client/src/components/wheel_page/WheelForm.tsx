import { useState, useContext } from 'react';

import { WheelContext } from '../context/WheelContext';

const WheelForm: React.FC = () => {
    const { addWheel } = useContext(WheelContext);
    const [inputValue, setInputValue] = useState<string>('')


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        console.log(inputValue);

        if (inputValue.trim()) {
            addWheel(inputValue);
            setInputValue('');

        }
    }


    return (
        <>
            <form>
                <label>Wheel Title:
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

export default WheelForm