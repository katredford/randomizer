import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Department {
    id: number;
    name: string;
}

const BackendTest: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get<Department[]>('/api/data')
            .then(response => {
                console.log(response)
                setDepartments(response.data);
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
            <h1>Departments</h1>
            <ul>
                {departments.map(dept => (
                    <li key={dept.id}>{dept.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default BackendTest