// WheelProvider.tsx
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
// import { useParams } from 'react-router-dom';

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


//hold an array of wheels so we can manage and update multiple
interface WheelContextType {
    wheels: Wheel[];
    loading: boolean;
    oneWheel: Wheel | null;
    getOneWheel: (id: number) => void
    addWheel: (input: string) => void
    addValue: (wheel_id: number, value: string) => void
    updateValue: (wheel_id: number, value_id: number, value: string) => void
    deleteValue: (wheel_id: number, value_id: number) => Promise<void>;
    triggerSpinAnimation: () => void;
    spinAnimationTriggered: boolean;

}

export const WheelContext = createContext<WheelContextType>({
    wheels: [],
    loading: true,
    oneWheel: null,
    getOneWheel: () => { },
    addWheel: () => { },
    addValue: () => { },
    updateValue: () => { },
    deleteValue: async () => { },
    triggerSpinAnimation: () => {},
    spinAnimationTriggered: false,
});


export const WheelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wheels, setWheels] = useState<Wheel[]>([]);
    const [oneWheel, setOneWheel] = useState<Wheel | null>(null);
    const [loading, setLoading] = useState(false);
    const [spinAnimationTriggered, setSpinAnimationTriggered] = useState(false);


    //useCallback is to memoize
    // memoization is the process of caching the result of a function call and 
    // returning the cached result when the same inputs occur again, rather than 
    // recalculating the result
    const getAllWheels = useCallback(async () => {
        try {
            const response = await axios.get<Wheel[]>('/api/data/');
            const wheelsWithValues = response.data.map(wheel => ({
                ...wheel,
                Values: wheel.Values || [],
            }));
            setWheels(wheelsWithValues);
        } catch (error) {
            console.error('There was an error fetching the wheels data!', error);
        } finally {
            setLoading(false);
        }
    }, []);


    //async means we can wait for the resolution of the promise with await
    const getOneWheel = useCallback(async (id: number) => {
        setLoading(true);
        console.log("get one wheel")
        //try block will execute the code unless errors occur
        try {
            //axios is fetching the things at the api/data/:id endpoint
            const response = await axios.get(`/api/data/${id}`);
            //set the response from the axios to setOneWheel
            setOneWheel(response.data);

            //catch the errors
        } catch (error) {
            console.error("Error getting one wheel data:", error);

            //finally block always executes regardless of whether or not there are errors
        } finally {
            //set loading state to false
            setLoading(false);
        }
    }, []);


    const addWheel = useCallback(async (inputValue: string) => {
        try {
            //await is used to wait for the request to complete and get the response object
            const response = await axios.post<Wheel>('/api/data', {
                title: inputValue,
            });

            //creatges a new wheel object, and inicialises "Values" property as empty array
            const newWheel = { ...response.data, Values: [] };
            setWheels(prevWheels => [...prevWheels, newWheel]);
        } catch (error) {
            console.error('there is an error adding the wheel title')
        }
        //the [] is the second argument of "useCallback" hook typically
        // for when the functio doesn't rely on external state or props to execute
    }, [])


    const addValue = useCallback(async (wheel_id: number, value: string) => {
        try {
            await axios.post(`/api/wheelVal/${wheel_id}`, { value }, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(value)
        } catch (error) {
            console.error("Error adding value:", error);
        }
    }, []);

    const updateValue = useCallback(async (wheel_id: number, value_id: number, value: string) => {
        try {
            await axios.put(`/api/data/updateVal/${wheel_id}/${value_id}`, { value }, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(value)
        } catch (error) {
            console.error("Error adding value:", error);
        }
    }, []);

    const deleteValue = useCallback(async (wheel_id: number, value_id: number) => {
        try {
            const response = await axios.delete(`/api/data/updateVal/${wheel_id}/${value_id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("Deleted value successfully:", response.data);
        } catch (error) {
            console.error("Error deleting value:", error);
        }
    }, []);

    const triggerSpinAnimation = useCallback(() => {
        setSpinAnimationTriggered(true);
       
        // console.log("booooop ")
        // const event = new CustomEvent('spinAnimationTriggered');
        // window.dispatchEvent(event);
    }, []);

    useEffect(() => {
     
       if(spinAnimationTriggered){
           console.log("Wheel CONTEXT CONTEXT", spinAnimationTriggered)
        triggerSpinAnimation()
       }
    }, [spinAnimationTriggered]);

    useEffect(() => {
        getAllWheels();
    }, [getAllWheels]);


    const values = {
        wheels,
        oneWheel,
        loading,
        getOneWheel,
        addWheel,
        addValue,
        updateValue,
        deleteValue,
        spinAnimationTriggered,
        triggerSpinAnimation
    }

    return (
        <WheelContext.Provider value={values}>
            {children}
        </WheelContext.Provider>
    );
};
