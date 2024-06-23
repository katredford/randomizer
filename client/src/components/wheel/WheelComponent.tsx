

//FC is functional component used to define in typescript
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
import './wheel.css';



//functional component that recievs title and items props from valuesControl
const WheelComponent: FC = () => {
    const { id } = useParams<{ id: string }>();
    const { oneWheel, loading, getOneWheel, spinAnimationTriggered } = useWheel(); // Destructure updateValue function from custom context
    // const [spinAnimationTriggered, setSpinAnimationTriggered] = useState(false);

    useEffect(() => {
        if (id) {
            getOneWheel(Number(id));
        }
    }, [id, getOneWheel]);

    useEffect(() => {
        if (spinAnimationTriggered) {
            // Trigger the spin animation
            console.log("Spin animation triggered!");
            // Add any additional logic for when the animation is triggered
            setTimeout(() => setSpinAnimationTriggered(false), 1000);

           
        }
    }, [spinAnimationTriggered]);


console.log("Wheel Component", spinAnimationTriggered)


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

    // Function to calculate the position of the text within each slice
    const calculateTextPosition = (index: number, total: number): { x: number, y: number, angle: number } => {
        const angle = (2 * Math.PI) / total;
        const midAngle = index * angle + angle / 2;
        const textRadius = radius * .8;
        const x = radius + textRadius * Math.cos(midAngle);
        const y = radius + textRadius * Math.sin(midAngle);
        const rotation = (midAngle * 180) / Math.PI - 90;
        return { x, y, angle: rotation };
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!oneWheel) {
        return <div>Wheel not found</div>;
    }

    // function to split text into chunks by preserving whole words
    const splitByWords = (text: string, maxLength: number): string[] => {
        const chunks: string[] = [];
        let currentChunk = '';

        text.split(' ').forEach(word => {
            if (currentChunk.length + word.length <= maxLength) {
                currentChunk += (currentChunk === '' ? '' : ' ') + word;
            } else {
                chunks.push(currentChunk);
                currentChunk = word;
            }
        });

        if (currentChunk !== '') {
            chunks.push(currentChunk);
        }

        return chunks;
    };


    return (
        <>
            <h1>{oneWheel?.title}</h1>
            {/* creates an SVG element with a width and height equal to 
        twice the radius (to accommodate the full circle).    */}
            <svg width={2 * radius} height={2 * radius} style={{ overflow: 'visible' }} 
            className={spinAnimationTriggered ? 'spin-animation' : ''}>

                {oneWheel.Values.map((value, i) => {
                    const { x, y, angle } = calculateTextPosition(i, oneWheel.Values.length);
                    // Split value.value into chunks of 30 characters
                    const chunks = splitByWords(value.value, 25)
                    return (
                        <g key={i}>
                            <path
                                d={generateSlicePath(i, oneWheel.Values.length)}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                            />
                            {chunks.map((chunk, j) => (
                                <text
                                    key={`${i}-${j}`}
                                    x={x}
                                    y={y + j * 12} // adjust y position of each line, brings it closer to outer edge
                                    transform={`rotate(${angle + 180}, ${x}, ${y})`}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    style={{ fontSize: '12px' }}
                                >
                                    {chunk}
                                </text>
                            ))}
                        </g>
                    );
                })}
            </svg>
        </>
    );
};


export default WheelComponent;








































