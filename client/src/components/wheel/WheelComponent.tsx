//FC is functional component used to define in typescript
import { FC, useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
// import './wheel.css';

const WheelComponent: FC = () => {
    const { oneWheel, loading, spinAnimationTriggered } = useWheel();

    const [isSpinning, setIsSpinning] = useState(false);
    const [wheelPos, setWheelPos] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [endPos, setEndPos] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const slowDownRate = 1 / 1.8;
    const minSpins = 3 * Math.PI * 2;
    const spinTime = 200000;
    const requestRef = useRef<number>(0);

    const radius: number = 200;
    const strokeColor: string = 'black';
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

    const calculateTextPosition = (index: number, total: number): { x: number, y: number, angle: number } => {
        const angle = (2 * Math.PI) / total;
        const midAngle = index * angle + angle / 2;
        const textRadius = radius * 0.8;
        const x = radius + textRadius * Math.cos(midAngle);
        const y = radius + textRadius * Math.sin(midAngle);
        const rotation = (midAngle * 180) / Math.PI - 90;
        return { x, y, angle: rotation };
    };

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

    const wheelPosFunction = (currentTime: number, startTime: number, endTime: number, startPos: number, endPos: number) => {
        const x = ((currentTime - startTime) / (endTime - startTime)) ** slowDownRate;
        return x * (endPos - startPos) + startPos;
    };

    const animate = () => {
            //performance now method more precise than date.now()
        //captures the current time in millisecons
        const currentTime = performance.now();
        if (isSpinning) {
             //uses wheelPosFunction, to calculate new position of the wheel
            const newWheelPos = wheelPosFunction(currentTime, startTime, endTime, wheelPos, endPos);
            setWheelPos(newWheelPos);
            if (currentTime >= endTime) {
                setIsSpinning(false);
                setSpeed(0);
            }
        } else {
            setSpeed(speed * 0.95);
            setWheelPos(wheelPos + speed);
        }

         //requests the next animation frame using requestAnimationFrame(animate), 
        //which recursively calls the animate function. This creates a continuous loop 
        //for smooth animation.
        requestRef.current = requestAnimationFrame(animate);
    };

    const handleSpinClick = () => {
        setIsSpinning(true);
        const currentTime = performance.now();
        setStartTime(currentTime);
        setEndTime(currentTime + spinTime);

        const slices = oneWheel?.Values.length;
        const sliceAngle = (2 * Math.PI) / slices;
        const randomSlice = Math.floor(Math.random() * slices);
        const randomSliceCenter = randomSlice * sliceAngle + sliceAngle / 2;

        //important variable needed to calculate where the next spin should end so 
        //the next slice is centered at 0 degrees
        const currentWheelRotation = wheelPos % (2 * Math.PI);
        
        const newEndPos = wheelPos + minSpins - currentWheelRotation + randomSliceCenter;
        setEndPos(newEndPos);
    };

    useEffect(() => {
        if (spinAnimationTriggered) {
            handleSpinClick();
        }
    }, [spinAnimationTriggered]);

    useEffect(() => {

        //This line sets up an animation frame request. requestAnimationFrame(animate) 
        //schedules the animate function to be called before the next repaint. The return 
        //value is stored in requestRef.current so it can be referenced later. requestRef 
        //is a useRef hook, which is used to persist values between renders without 
        //causing re-renders
     
        requestRef.current = requestAnimationFrame(animate);

        //This line defines a cleanup function that cancels the scheduled animation frame
        // request when the component unmounts or when the useEffect dependencies change. 
        //This prevents memory leaks and ensures that no animation frames are requested when 
        //they are not needed.
        return () => cancelAnimationFrame(requestRef.current);

        //This array contains the dependencies for the useEffect hook. The effect will 
        //run whenever any of these dependencies (isSpinning, wheelPos, speed, spinAnimationTriggered)
        // change. It also ensures that the cleanup function is executed when 
        //any of these dependencies change.

    }, [isSpinning, wheelPos, speed, spinAnimationTriggered]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!oneWheel) {
        return <div>Wheel not found</div>;
    }

    return (
        <>
            <h1>{oneWheel?.title}</h1>
            <svg width={2 * radius} height={2 * radius} style={{ overflow: 'visible' }}>
                <g transform={`rotate(${(wheelPos * 180) / Math.PI - 90}, ${radius}, ${radius})`}>
                    {oneWheel.Values.map((value, i) => {
                        const { x, y, angle } = calculateTextPosition(i, oneWheel.Values.length);
                        const chunks = splitByWords(value.value, 25);
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
                                        y={y + j * 12}
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
                </g>
            </svg>
        </>
    );
};

export default WheelComponent;








































