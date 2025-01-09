import React from 'react';
import { Gauge as Graph, gaugeClasses } from '@mui/x-charts/Gauge';
import './sub.css';

interface GaugeProps {
    likeDislikeRatio: number;
}

const Gauge: React.FC<GaugeProps> = ({ likeDislikeRatio }) => {
    return (
        <div className='graph-wrapper'>
            <h4 className='graph-title'>Feedback Ratio</h4>
            <Graph
                width={150}
                height={150}
                value={likeDislikeRatio}
                text={`${likeDislikeRatio}%`}
                startAngle={-90}
                endAngle={90}
                sx={() => ({
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 40,
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                        fill: '#52b202', // Green color for the value arc
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                        fill: '#d32f2f', // Red color for the reference arc
                    },
                })}
            />
        </div>
    );
};

export default Gauge;