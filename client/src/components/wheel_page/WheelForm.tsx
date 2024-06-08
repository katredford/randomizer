import {useState} from 'react';
import axios from 'axios';

const WheelForm: React.FC = () => {
    const [inputValue, setInputValue] = useState <string> ('')
  

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        console.log(inputValue);
        
        axios.post<string>('/api/data', {
            title: inputValue
        })
        // .then(response => {
        //     console.log(response)
        //     // setwheels(response.data);
        //     // setLoading(false);
        // })
        .catch(error => {
            console.error('There was an error adding the wheel title!', error);
            
        });
    }



    return(
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