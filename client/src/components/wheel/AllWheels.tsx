import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WheelCard from './WheelCard';

interface Wheel {
    id: number;
    title: string;
    updatedAt: string;
}

const AllWheels: React.FC = () => {
    const [wheels, setwheels] = useState<Wheel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get<Wheel[]>('/api/data')
            .then(response => {
                console.log(response)
                setwheels(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the departments!', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>wheel titles</h1>
            <ul>
                {wheels.map(wheel => (
                    // <li key={dept.id}>{dept.title}</li>
                    <WheelCard {...wheel}/>
                ))}
            </ul>

        </div>
    );
};

export default AllWheels;