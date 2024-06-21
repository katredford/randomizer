// AllWheels.tsx
import React, { useContext } from 'react';
import WheelCard from './WheelCard';
import { WheelContext } from '../context/WheelContext';
import WheelForm from "./WheelForm"

const AllWheels: React.FC = () => {
    const { wheels, loading } = useContext(WheelContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <WheelForm />
            <h1>Wheel Titles</h1>
            <ul>
                {wheels.map(wheel => (
                    <WheelCard key={wheel.id} {...wheel} />
                ))}
            </ul>
        </div>
    );
};

export default AllWheels;
