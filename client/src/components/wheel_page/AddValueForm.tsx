import { useState, useContext } from 'react';
import { WheelContext } from '../context/WheelContext'

const AddValueForm: React.FC<{wheel_id: number }> = ( {wheel_id}) => {
    const { addValue } = useContext(WheelContext);
    const [inputValue, setInputValue] = useState<string>('')


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
    
        if(inputValue) {
            addValue(wheel_id, inputValue)
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