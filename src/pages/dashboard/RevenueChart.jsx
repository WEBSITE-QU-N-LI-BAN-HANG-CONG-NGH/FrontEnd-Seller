// src/components/dashboard/RevenueChart.jsx

import React from "react";
import { formatCurrency } from "../../utils/format.js";

const RevenueChart = ({ data = {} }) => {
    // Chuyển đổi dữ liệu từ object thành array để làm biểu đồ
    const chartData = Object.entries(data || {}).map(([month, amount]) => ({
        month,
        amount: amount
    }));

    // Tính giá trị max để scale
    const maxAmount = Math.max(...chartData.map(item => item.amount || 0), 1);

    return (
        <div className="chart-container">
            <div className="bar-chart">
                {chartData.map((item, index) => (
                    <div key={index} className="chart-column">
                        <div
                            className={`bar ${index === chartData.length - 1 ? "highlight" : ""}`}
                            style={{
                                height: `${(item.amount / maxAmount) * 220}px`,
                            }}
                        >
                            {index === chartData.length - 1 && (
                                <div className="bar-tooltip">{formatCurrency(item.amount)}</div>
                            )}
                        </div>
                        <div className="bar-label">{item.month}</div>
                    </div>
                ))}

                {chartData.length === 0 && (
                    <div className="no-data-message">
                        Không có dữ liệu doanh thu theo tháng
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueChart;