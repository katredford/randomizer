import { FC } from 'react';
import "./wheel.css"
const Wheel: FC = () => {
    const radius: number = 200;
    const strokeColor: string = 'black';
    const strokeWidth: number = 4;

    const slices = [
        //svg paths:
        //M =move to takes 2 points
        //L =lineTo : creating a line
        //A =eliptical arch: for the circle edge
        //Z =close path

        // Slice 1
        `M ${radius},${radius}
       L ${radius},0
       A ${radius},${radius} 0 0 1 ${2 * radius},${radius}
       Z`,
        //   // Slice 2
        `M ${radius},${radius}
       L ${2 * radius},${radius}
       A ${radius},${radius} 0 0 1 ${radius},${2 * radius}
       Z`,
        // Slice 3
        `M ${radius},${radius}
       L ${radius},${2 * radius}
       A ${radius},${radius} 0 0 1 0,${radius}
       Z`,
        // Slice 4
        `M ${radius},${radius}
       L 0,${radius}
       A ${radius},${radius} 0 0 1 ${radius},0
       Z`,
    ];

    return (
        //svg with dynamic values for width and height
        <svg 
        //  viewBox="4000 100 100 100"
        width={2 * radius} height={2 * radius}>
            {/* map over slices array to creat each section of the pie */}
            {slices.map((slice, i) => {
                console.log(slice); // Log the path data to the console
                return (
                    <path key={i} d={slice} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
                );
            })}
            {/* Lines to separate the slices */}
            <line x1={radius} y1={0} x2={radius} y2={2 * radius} stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={0} y1={radius} x2={2 * radius} y2={radius} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
    );

}

export default Wheel