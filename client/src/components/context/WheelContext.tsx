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
}

export const WheelContext = createContext<WheelContextType>({
    wheels: [],
    loading: true,
    oneWheel: null,
    getOneWheel: () => {},
    addWheel: () => {},
    addValue: () => {}
});


export const WheelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wheels, setWheels] = useState<Wheel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [oneWheel, setOneWheel] = useState<Wheel | null>(null);
    

    //useCallback is to memoize
    // memoization is the process of caching the result of a function call and 
    // returning the cached result when the same inputs occur again, rather than 
    // recalculating the result
    const getAllWheels = useCallback(() => {
        axios.get<Wheel[]>('/api/data/')
            .then(response => {
                const wheelsWithValues = response.data.map(wheel => ({
                    ...wheel,
                    Values: wheel.Values || [],
                }));
                setWheels(wheelsWithValues);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the wheels data!', error);
                setLoading(false);
            });
    }, []);

    const getOneWheel = useCallback((id: number) => {
        setLoading(true);
        axios.get<Wheel>(`/api/data/${id}`)
            .then(response => {
                const wheelWithValues = {
                    ...response.data,
                    Values: response.data.Values || [],
                };
                setOneWheel(wheelWithValues);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the specific wheel data!', error);
                setLoading(false);
            });
    }, []);

    const addWheel = useCallback((inputValue: string) => {
        axios.post<Wheel>('/api/data', {
            title: inputValue,
        })
            .then(response => {
                const newWheel = { ...response.data, Values: [] };
                setWheels(prevWheels => [...prevWheels, newWheel]);
            })
            .catch(error => {
                console.error('There was an error adding the wheel title!', error);
            });
    }, []);

      const addValue = useCallback((wheel_id: number, value: string) => {
        axios.post<Value>(`/api/wheelVal/${wheel_id}`, {
            value: value,
        })
            .then(response => {
                setWheels(prevWheels =>
                    prevWheels.map(wheel =>
                        wheel.id === wheel_id ? { ...wheel, Values: [...wheel.Values, response.data] } : wheel
                    )
                );
                if (oneWheel && oneWheel.id === wheel_id) {
                    setOneWheel({
                        ...oneWheel,
                        Values: [...oneWheel.Values, response.data],
                    });
                }
            })
            .catch(error => {
                console.error('There was an error adding the value to the wheel!', error);
            });
    }, [oneWheel]);


    useEffect(() => {
        getAllWheels();
    }, [getAllWheels]);

  

    const values = {
        wheels, 
        oneWheel, 
        loading, 
        getOneWheel,
        addWheel,
        addValue
    }

    return (
        <WheelContext.Provider value={values}>
            {children}
        </WheelContext.Provider>
    );
};
