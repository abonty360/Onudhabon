import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';


import './CombinedProgressChart.css';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const CombinedProgressChart = ({ overallProgress, subjects }) => {

    const op = isNaN(overallProgress) ? 0 : overallProgress;
    const doughnutData = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [op, 100 - op],
                backgroundColor: ['#36A2EB', '#E0E0E0'],
                borderWidth: 1
            }
        ]
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: ctx => `${ctx.parsed}%` } }
        },
        cutout: '70%'
    };

    const barData = {
        labels: subjects.map(s => s.name),
        datasets: [
            {
                label: 'Subject Progress (%)',
                data: subjects.map(s => s.subjectProgress.toFixed(1)),
                backgroundColor: '#4CAF50'
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => `${ctx.parsed}%` } }
        },
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    };

    return (
        <div className="combined-progress-chart">
            <div className="chart-section">
                <h4>Overall Progress</h4>
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="overall-label">
                    {typeof overallProgress === 'number'
                        ? overallProgress.toFixed(1)
                        : '0.0'}%
                </div>
            </div>
            <div className="chart-section">
                <h4>Per Subject Progress</h4>
                <Bar data={barData} options={barOptions} />
            </div>
        </div>
    );
};

export default CombinedProgressChart;
