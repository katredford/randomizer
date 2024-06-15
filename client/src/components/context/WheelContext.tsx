// WheelProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
}

export const WheelContext = createContext<WheelContextType>({
    wheels: [],
    loading: true,
    oneWheel: null,
    getOneWheel: () => {}
});


export const WheelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wheels, setWheels] = useState<Wheel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [oneWheel, setOneWheel] = useState<Wheel | null>(null);
    
    function getAllWheels() {
    
        axios.get<Wheel[]>('/api/data/')
            .then(response => {
                setWheels(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the wheels data!', error);
                setLoading(false);
            });
    }

    function getOneWheel(id: Number) {
        // const { id } = useParams<{ id: string }>();
        setLoading(true);
        axios.get<Wheel>(`/api/data/${id}`)
            .then(response => {
                setOneWheel(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the specific wheel data!', error);
                setLoading(false);
            });
    }


    useEffect(() => {
        getAllWheels()
        // getOneWheel()
    }, []);
    // useEffect(() => {
    //     // getAllWheels()
    //     getOneWheel()
    // }, []);

    return (
        <WheelContext.Provider value={{ wheels, oneWheel, loading, getOneWheel }}>
            {children}
        </WheelContext.Provider>
    );
};
