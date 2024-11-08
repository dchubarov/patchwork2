import React from "react";

export interface PieProgressProps {
    value?: number;
    zeroIndicator?: boolean;
    thickness?: number;
    filled?: boolean;
    margin?: number;
}

const PieProgress: React.FC<PieProgressProps> = ({
                                                     value = 0,
                                                     zeroIndicator = false,
                                                     thickness = 1,
                                                     filled = true,
                                                     margin = 0,
                                                 }) => {
    let progress = Math.abs(value);
    if (progress > 0 && (progress % 100) === 0) progress = 100;
    else progress %= 100;

    const radius = 60 - thickness;
    const center = 60;
    const angle = (progress / 100) * 360;
    const radians = (angle - 90) * (Math.PI / 180);
    const x = center + radius * Math.cos(radians);
    const y = center + radius * Math.sin(radians);
    const largeArcFlag = progress > 50 ? 1 : 0;

    return (
        <svg viewBox="0 0 120 120"
             fill={filled ? "currentColor" : "none"}
             stroke="currentColor"
             strokeWidth={thickness}
             style={{margin: margin}}>
            {(angle > 0 && angle < 360) && <path
                d={`M ${center} ${center} L ${center} ${center - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y} Z`}/>}
            {(angle === 0 && zeroIndicator) &&
                <line x1={center} y1={center} x2={center} y2={center - radius - thickness}/>}
            {angle === 360 &&
                <circle r={radius} cx={center} cy={center}/>}
        </svg>
    );
}

export default PieProgress;
