// AllWheels.tsx
import React, { useEffect, useState, useContext } from 'react';
import WheelCard from './WheelCard';
import { WheelContext } from '../context/WheelContext';

const AllWheels: React.FC = () => {
    const { wheels, loading } = useContext(WheelContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
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
