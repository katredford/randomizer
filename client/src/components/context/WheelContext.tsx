import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Define the interfaces
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

// Create the context with a default undefined value
export const WheelContext = createContext<Wheel | undefined>(undefined);

// Create a provider component
export const WheelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const { id } = useParams<{ id: string }>();
   
    const [wheel, setWheel] = useState<Wheel | undefined>(undefined);

    useEffect(() => {
        if (id) {
            axios.get<Wheel>(`/api/data/${id}`)
          
                .then(response => {
                    setWheel(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the wheel data!', error);
                });
        }
        }, [id]);
        // }, []);
        useEffect(() => {
            console.log("WHEEL WHEEL", wheel);
        }, [wheel]);
    
        const value = wheel || { 
            id: 0, 
            title: '', 
            createdAt: '', 
            updatedAt: '', 
            Values: [] 
        };
        return (
            <WheelContext.Provider value={value}>
                {children}
            </WheelContext.Provider>
        );
};


