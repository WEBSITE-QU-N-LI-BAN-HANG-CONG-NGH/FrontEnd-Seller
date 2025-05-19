// src/components/dashboard/DailyRevenueChart.jsx

import React from "react";
import { formatCurrency } from "../../utils/format.js";

const DailyRevenueChart = ({ data = {} }) => {
    // Chuyển đổi dữ liệu từ object thành array để làm biểu đồ
    const chartData = Object.entries(data || {}).map(([date, amount]) => ({
        date,
        amount: amount
    }));

    // Chỉ hiển thị tối đa 15 ngày để đảm bảo biểu đồ không quá đông
    const displayData = chartData.slice(-15);

    // Tính giá trị max để scale
    const maxAmount = Math.max(...displayData.map(item => item.amount || 0), 1);

    return (
        <div className="chart-container">
            <div className="bar-chart">
                {displayData.map((item, index) => (
                    <div key={index} className="chart-column">
                        <div
                            className={`bar ${index === displayData.length - 1 ? "highlight" : ""}`}
                            style={{
                                height: `${(item.amount / maxAmount) * 220}px`,
                            }}
                        >
                            <div className="bar-tooltip">{formatCurrency(item.amount)}</div>
                        </div>
                        <div className="bar-label">{item.date}</div>
                    </div>
                ))}

                {displayData.length === 0 && (
                    <div className="no-data-message">
                        Không có dữ liệu doanh thu theo ngày
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyRevenueChart;