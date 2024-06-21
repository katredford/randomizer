
//FC is functional component used to define in typescript
import { FC, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
import './wheel.css';



//functional component that recievs title and items props from valuesControl
    const WheelComponent: FC= () => {
        const { id } = useParams<{ id: string }>();
        const { oneWheel, loading, getOneWheel} = useWheel(); // Destructure updateValue function from custom context
     

        useEffect(() => {
            if (id) {
                getOneWheel(Number(id));
                
            }
        }, [id, getOneWheel]);
    
    

    
    //radious of the wheel
    const radius: number = 200;
    //color of the lines
    const strokeColor: string = 'black';
    //thickness of the lines
    const strokeWidth: number = 4;
    
    // function to generate the SVG path for a slice
    const generateSlicePath = (index: number, total: number): string => {
        //calculates the angle of each slice by divideing the circle
        // 2π by the number of items
        const angle = (2 * Math.PI) / total;

        //calculate the start and end angles of the slice
        const startAngle = index * angle;
        const endAngle = startAngle + angle;

        // calculate the start and end points of the slice
        const startX = radius + radius * Math.cos(startAngle);
        const startY = radius + radius * Math.sin(startAngle);
        const endX = radius + radius * Math.cos(endAngle);
        const endY = radius + radius * Math.sin(endAngle);

        //determines whether the arc should be greater than 180 degrees.
        //it's set to 1 if the angle is greater than π, otherwise, it's 0.
        const largeArcFlag = angle > Math.PI ? 1 : 0;


        //svg paths:
        //M =move to takes 2 points
        //L =lineTo : creating a line
        //A =eliptical arch: for the circle edge
        //Z =close path
        return `M ${radius},${radius} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z`;
    };

    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!oneWheel) {
        return <div>Wheel not found</div>;
    }

    return (
        <>
        <h1>{oneWheel?.title}</h1>
        {/* creates an SVG element with a width and height equal to 
        twice the radius (to accommodate the full circle).    */}
    <svg width={2 * radius} height={2 * radius}>
            {oneWheel?.Values.map((_, i) => (
                <path
                    key={i}
                    d={generateSlicePath(i, oneWheel.Values.length)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                />
            ))}
        </svg>
        </>
    );
};

export default WheelComponent;






