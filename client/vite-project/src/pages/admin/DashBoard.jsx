import React, { useState, useEffect } from "react";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Coffee,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import OrderService from "@services/order.service.js";
import UserService from "@services/user.service.js";
import ProductService from "@services/product.service.js";
import "@styles/pages/_dashboard.scss";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    customerGrowth: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [targetRevenue, setTargetRevenue] = useState(20000000);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod, selectedDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [ordersRes, usersRes, productsRes] = await Promise.all([
        OrderService.getAll({ page: 1, limit: 1000 }),
        UserService.getAllUsers(),
        ProductService.getAllProducts(),
      ]);

      const orders = ordersRes?.data || ordersRes || [];
      const users = usersRes || [];
      const products = productsRes || [];

      const customers = users.filter((u) => u.role === 1);
      const filteredOrders = filterOrdersByPeriod(
        orders,
        selectedPeriod,
        selectedDate,
      );
      const totalRevenue = filteredOrders
        .filter((o) => o.status === 4)
        .reduce((sum, o) => sum + (o.total || 0), 0);

      const previousOrders = filterOrdersByPreviousPeriod(
        orders,
        selectedPeriod,
        selectedDate,
      );
      const previousRevenue = previousOrders
        .filter((o) => o.status === 4)
        .reduce((sum, o) => sum + (o.total || 0), 0);

      const revenueGrowth =
        previousRevenue > 0
          ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
          : 0;

      const orderGrowth =
        previousOrders.length > 0
          ? ((filteredOrders.length - previousOrders.length) /
              previousOrders.length) *
            100
          : 0;

      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      const newCustomers = customers.filter(
        (c) => new Date(c.createdAt) >= last30Days,
      ).length;
      const customerGrowth =
        customers.length > 0 ? (newCustomers / customers.length) * 100 : 0;

      const chartData = calculateChartData(
        orders,
        selectedPeriod,
        selectedDate,
      );

      const topProds = products
        .filter((p) => p.total_buyturn > 0)
        .sort((a, b) => b.total_buyturn - a.total_buyturn)
        .slice(0, 5);

      setStats({
        totalCustomers: customers.length,
        totalOrders: filteredOrders.length,
        totalRevenue: totalRevenue,
        totalProducts: products.length,
        customerGrowth,
        orderGrowth,
        revenueGrowth,
      });

      setMonthlyData(chartData);
      setTopProducts(topProds);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByPeriod = (orders, period, date) => {
    const currentDate = new Date(date);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      if (period === "day") {
        return (
          orderDate.getDate() === currentDate.getDate() &&
          orderDate.getMonth() === currentDate.getMonth() &&
          orderDate.getFullYear() === currentDate.getFullYear()
        );
      } else if (period === "month") {
        return (
          orderDate.getMonth() === currentDate.getMonth() &&
          orderDate.getFullYear() === currentDate.getFullYear()
        );
      } else if (period === "year") {
        return orderDate.getFullYear() === currentDate.getFullYear();
      }
      return true;
    });
  };

  const filterOrdersByPreviousPeriod = (orders, period, date) => {
    const currentDate = new Date(date);

    if (period === "day") {
      const previousDay = new Date(currentDate);
      previousDay.setDate(previousDay.getDate() - 1);
      return filterOrdersByPeriod(orders, period, previousDay);
    } else if (period === "month") {
      const previousMonth = new Date(currentDate);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      return filterOrdersByPeriod(orders, period, previousMonth);
    } else if (period === "year") {
      const previousYear = new Date(currentDate);
      previousYear.setFullYear(previousYear.getFullYear() - 1);
      return filterOrdersByPeriod(orders, period, previousYear);
    }
    return [];
  };

  const calculateChartData = (orders, period, date) => {
    const currentDate = new Date(date);

    if (period === "day") {
      return Array.from({ length: 24 }, (_, hour) => {
        const hourOrders = orders.filter((o) => {
          const orderDate = new Date(o.createdAt);
          return (
            orderDate.getHours() === hour &&
            orderDate.getDate() === currentDate.getDate() &&
            orderDate.getMonth() === currentDate.getMonth() &&
            orderDate.getFullYear() === currentDate.getFullYear()
          );
        });

        const revenue = hourOrders
          .filter((o) => o.status === 4)
          .reduce((sum, o) => sum + (o.total || 0), 0);

        return {
          label: `${hour}h`,
          orders: hourOrders.length,
          revenue: revenue,
        };
      });
    } else if (period === "month") {
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      ).getDate();

      return Array.from({ length: daysInMonth }, (_, day) => {
        const dayNum = day + 1;
        const dayOrders = orders.filter((o) => {
          const orderDate = new Date(o.createdAt);
          return (
            orderDate.getDate() === dayNum &&
            orderDate.getMonth() === currentDate.getMonth() &&
            orderDate.getFullYear() === currentDate.getFullYear()
          );
        });

        const revenue = dayOrders
          .filter((o) => o.status === 4)
          .reduce((sum, o) => sum + (o.total || 0), 0);

        return {
          label: `${dayNum}`,
          orders: dayOrders.length,
          revenue: revenue,
        };
      });
    } else if (period === "year") {
      const months = [
        "T1",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "T8",
        "T9",
        "T10",
        "T11",
        "T12",
      ];

      return months.map((month, index) => {
        const monthOrders = orders.filter((o) => {
          const orderDate = new Date(o.createdAt);
          return (
            orderDate.getMonth() === index &&
            orderDate.getFullYear() === currentDate.getFullYear()
          );
        });

        const revenue = monthOrders
          .filter((o) => o.status === 4)
          .reduce((sum, o) => sum + (o.total || 0), 0);

        return {
          label: month,
          orders: monthOrders.length,
          revenue: revenue,
        };
      });
    }
    return [];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);

    if (selectedPeriod === "day") {
      newDate.setDate(newDate.getDate() + direction);
    } else if (selectedPeriod === "month") {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (selectedPeriod === "year") {
      newDate.setFullYear(newDate.getFullYear() + direction);
    }

    setSelectedDate(newDate);
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate);

    if (selectedPeriod === "day") {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } else if (selectedPeriod === "month") {
      return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
    } else if (selectedPeriod === "year") {
      return `Năm ${date.getFullYear()}`;
    }
    return "";
  };

  // Tính toán scale cho biểu đồ
  const calculateChartScale = () => {
    const maxOrders = Math.max(...monthlyData.map((d) => d.orders), 0);

    if (maxOrders === 0) return { max: 10, steps: [0, 2, 4, 6, 8, 10] };

    // Làm tròn lên để có số đẹp
    const roundedMax = Math.ceil(maxOrders / 5) * 5;
    const finalMax = Math.max(roundedMax, 5);
    const step = finalMax / 5;

    const steps = [];
    for (let i = 0; i <= 5; i++) {
      steps.push(Math.round(step * i));
    }

    return { max: finalMax, steps: steps.reverse() };
  };

  const chartScale = calculateChartScale();
  const targetProgress = Math.min(
    (stats.totalRevenue / targetRevenue) * 100,
    100,
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner">
            <Coffee size={48} />
          </div>
          <p>Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>
            <Coffee size={28} />
            Dashboard
          </h1>
          <p className="subtitle">Tổng quan hoạt động kinh doanh</p>
        </div>
        <div className="header-right">
          <div className="date-filter">
            <button
              className={selectedPeriod === "day" ? "active" : ""}
              onClick={() => {
                setSelectedPeriod("day");
                setSelectedDate(new Date());
              }}
            >
              <Clock size={16} /> Ngày
            </button>
            <button
              className={selectedPeriod === "month" ? "active" : ""}
              onClick={() => {
                setSelectedPeriod("month");
                setSelectedDate(new Date());
              }}
            >
              <Calendar size={16} /> Tháng
            </button>
            <button
              className={selectedPeriod === "year" ? "active" : ""}
              onClick={() => {
                setSelectedPeriod("year");
                setSelectedDate(new Date());
              }}
            >
              <Target size={16} /> Năm
            </button>
          </div>
        </div>
      </div>

      {/* DATE NAVIGATION */}
      <div className="date-navigation">
        <button className="nav-btn" onClick={() => handleDateChange(-1)}>
          <ChevronLeft size={20} />
        </button>
        <span className="current-date">{formatSelectedDate()}</span>
        <button
          className="nav-btn"
          onClick={() => handleDateChange(1)}
          disabled={new Date(selectedDate) >= new Date()}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card customers">
          <div className="stat-icon">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Khách hàng</p>
            <h2 className="stat-value">{formatNumber(stats.totalCustomers)}</h2>
            <div
              className={`stat-growth ${stats.customerGrowth >= 0 ? "positive" : "negative"}`}
            >
              {stats.customerGrowth >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>{Math.abs(stats.customerGrowth).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">
            <ShoppingBag size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Đơn hàng</p>
            <h2 className="stat-value">{formatNumber(stats.totalOrders)}</h2>
            <div
              className={`stat-growth ${stats.orderGrowth >= 0 ? "positive" : "negative"}`}
            >
              {stats.orderGrowth >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>{Math.abs(stats.orderGrowth).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Doanh thu</p>
            <h2 className="stat-value">{formatNumber(stats.totalRevenue)}</h2>
            <div
              className={`stat-growth ${stats.revenueGrowth >= 0 ? "positive" : "negative"}`}
            >
              {stats.revenueGrowth >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>{Math.abs(stats.revenueGrowth).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">
            <Coffee size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Sản phẩm</p>
            <h2 className="stat-value">{formatNumber(stats.totalProducts)}</h2>
            <div className="stat-growth neutral">
              <span>Tổng số sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        {/* CHART SECTION */}
        <div className="chart-card">
          <div className="card-header">
            <h3>
              <TrendingUp size={20} />
              Biểu đồ đơn hàng{" "}
              {selectedPeriod === "day"
                ? "theo giờ"
                : selectedPeriod === "month"
                  ? "theo ngày"
                  : "theo tháng"}
            </h3>
          </div>
          <div className="chart-wrapper">
            {/* Y-Axis Labels */}
            <div className="chart-y-axis">
              {chartScale.steps.map((value, index) => (
                <span key={index} className="y-label">
                  {value}
                </span>
              ))}
            </div>

            {/* Chart Area */}
            <div className="chart-area">
              {/* Grid Lines */}
              <div className="chart-grid">
                {chartScale.steps.map((_, index) => (
                  <div key={index} className="grid-line" />
                ))}
              </div>

              {/* Bars */}
              <div className="chart-bars">
                {monthlyData.map((data, index) => {
                  const heightPercent =
                    chartScale.max > 0
                      ? (data.orders / chartScale.max) * 100
                      : 0;

                  return (
                    <div key={index} className="bar-wrapper">
                      <div className="bar-container">
                        <div
                          className="bar"
                          style={{ height: `${heightPercent}%` }}
                          title={`${data.orders} đơn hàng\n${formatPrice(data.revenue)}`}
                        >
                          {data.orders > 0 && (
                            <span className="bar-value">{data.orders}</span>
                          )}
                        </div>
                      </div>
                      <span className="bar-label">{data.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="dashboard-sidebar">
          {/* Target Card */}
          <div className="target-card">
            <div className="card-header">
              <h3>
                <Target size={20} />
                Mục tiêu doanh thu
              </h3>
            </div>
            <p className="target-subtitle">Theo dõi tiến độ đạt mục tiêu</p>

            <div className="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle className="bg" cx="50" cy="50" r="45" />
                <circle
                  className="progress"
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDasharray: `${targetProgress * 2.83} 283`,
                  }}
                />
              </svg>
              <div className="progress-text">
                <span className="percentage">{targetProgress.toFixed(1)}%</span>
                <span
                  className={`growth ${stats.revenueGrowth >= 0 ? "positive" : "negative"}`}
                >
                  {stats.revenueGrowth >= 0 ? "+" : ""}
                  {stats.revenueGrowth.toFixed(1)}%
                </span>
              </div>
            </div>

            <p className="target-message">
              {targetProgress >= 100
                ? "🎉 Chúc mừng! Bạn đã hoàn thành mục tiêu!"
                : `Đã đạt ${formatPrice(stats.totalRevenue)}. Tiếp tục cố gắng! 💪`}
            </p>

            <div className="target-stats">
              <div className="target-stat">
                <span className="label">Mục tiêu</span>
                <span className="value">{formatNumber(targetRevenue)}</span>
              </div>
              <div className="target-stat">
                <span className="label">Doanh thu</span>
                <span className="value highlight">
                  {formatNumber(stats.totalRevenue)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="top-products-card">
            <div className="card-header">
              <h3>
                <Award size={20} />
                Sản phẩm bán chạy
              </h3>
            </div>
            <div className="products-list">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={product.id} className="product-item">
                    <div className="rank">#{index + 1}</div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=50&h=50&q=80&fit=crop";
                      }}
                    />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <span className="sales">
                        🔥 {product.total_buyturn} lượt mua
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-products">
                  <Coffee size={32} />
                  <p>Chưa có dữ liệu</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
