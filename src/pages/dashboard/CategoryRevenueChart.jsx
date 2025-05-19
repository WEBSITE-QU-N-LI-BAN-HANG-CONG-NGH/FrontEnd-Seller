// src/components/dashboard/CategoryRevenueChart.jsx

import React from "react";
import { formatCurrency } from "../../utils/format.js";

const CategoryRevenueChart = ({ data = {} }) => {
    // Chuyển đổi dữ liệu từ object thành array và sắp xếp theo amount
    const chartData = Object.entries(data || {})
        .map(([category, amount]) => ({
            category,
            amount: amount
        }))
        .sort((a, b) => b.amount - a.amount);

    // Tính tổng doanh thu để tính phần trăm
    const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);

    // Màu sắc cho các danh mục
    const colors = ['blue', 'primary', 'green', 'amber', 'orange'];

    return (
        <div className="revenue-distribution">
            <div className="distribution-chart">
                {chartData.map((item, index) => {
                    const percentage = totalAmount > 0
                        ? ((item.amount / totalAmount) * 100).toFixed(1)
                        : "0";

                    // Luân phiên giữa các màu
                    const colorClass = colors[index % colors.length];

                    return (
                        <div key={index} className="distribution-item">
                            <div className="distribution-header">
                                <span className="distribution-name">
                                    {item.category}
                                </span>
                                <span className="distribution-percent">
                                    {formatCurrency(item.amount)} ({percentage}%)
                                </span>
                            </div>
                            <div className="progress-container">
                                <div
                                    className={`progress-bar ${colorClass}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}

                {chartData.length === 0 && (
                    <div className="no-data-message">
                        Không có dữ liệu doanh thu theo danh mục
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryRevenueChart;