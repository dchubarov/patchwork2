import React from "react";

interface PieProgressProps {
    value?: number;
    zeroIndicator?: boolean;
}

const PieProgress: React.FC<PieProgressProps> = ({value = 0, zeroIndicator = false}) => {
    let progress = Math.abs(value);
    if (progress > 100) progress %= 100;

    const radius = 50;
    const center = 60;
    const angle = (progress / 100) * 360;
    const radians = (angle - 90) * (Math.PI / 180);
    const x = center + radius * Math.cos(radians);
    const y = center + radius * Math.sin(radians);
    const largeArcFlag = progress > 50 ? 1 : 0;

    return (
        <svg fill="currentColor" stroke="currentColor" viewBox="0 0 120 120">
            {(progress === 0 && zeroIndicator) && <line x1={center} y1={center} x2={center} y2={center - radius} strokeWidth={2}/>}
            {(progress > 0 && progress < 100) && <path d={`M ${center} ${center} L ${center} ${center - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y} Z`}/>}
            {progress === 100 && <circle r={radius} cx={center} cy={center}/>}
        </svg>
    );
}

export default PieProgress;
