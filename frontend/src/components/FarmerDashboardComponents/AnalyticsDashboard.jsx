import React from "react";
import { Chart as ChartJS } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

const AnalyticsDashboard = () => {
    return (
        <div>
            <h1>Farmer Analytics</h1>
            <Bar
                data={{
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [
                        {
                            label: "My First dataset",
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132)",
                            data: [0, 10, 5, 2, 20, 30, 45],
                        },  
                        
                    ]
            }}
            />
        </div>
    );
};

export default AnalyticsDashboard;