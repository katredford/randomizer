
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


// Defines the properties (props) that the ValuesControl component expects. 
// In this case, it expects a prop named wheel which can either be a Wheel object or undefined.
interface ValuesControlProps {
    wheel?: Wheel;
}


// The component receives props defined by ValuesControlProps, 
// meaning it expects a wheel prop which can be a Wheel object or undefined.
const ValuesControl: React.FC<ValuesControlProps> = (props) => {
    if (!props.wheel) {
        return <div>No wheel data available</div>;
    }
    console.log("value control", props.wheel.Values[0].value)
    return (
        <>
            VALUE CONTROL
            {props.wheel?.Values.map((valObj) => {

                { console.log(valObj.value) }
                return <li key={valObj.id}>{valObj.value}</li>
            })}
        </>
    )
}

export default ValuesControl