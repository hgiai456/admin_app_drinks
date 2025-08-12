import { useEffect, useState } from 'react';
import { getOrders, getOrderById, updateOrderStatus } from '@api/orderapi';
import { orderStatusMap } from '@models/order';
import Modal from './ModelComponent.jsx';
import '@styles/pages/_admin.scss';

// Status colors và icons
const statusColors = {
    1: '#1976d2', // Đang xử lý - xanh dương
    2: '#ff9800', // Đã vận chuyển - cam
    3: '#2e7d32', // Đã thành công - xanh lá
    4: '#2e7d32', // Đã giao - xanh lá
    5: '#d32f2f', // Trả hàng - đỏ
    6: '#d32f2f', // Đã thất bại - đỏ
    7: '#d32f2f' // Đã hủy - đỏ
};

const statusIcons = {
    1: '⏳', // Đang xử lý
    2: '🚚', // Đã vận chuyển
    3: '✅', // Đã thành công
    4: '✅', // Đã giao
    5: '↩️', // Trả hàng
    6: '❌', // Đã thất bại
    7: '🚫' // Đã hủy
};

function OrderComponent() {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('detail');
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errors, setErrors] = useState({});
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Selected order và status update
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState(1);
    const [stats, setStats] = useState({});

    const loadingInitialData = async () => {
        setLoadingData(true);
        try {
            console.log('🔄 Đang tải dữ liệu ban đầu...');
            await fetchOrders(1, '', 'all');
        } catch (error) {
            console.error('❌ Lỗi tải dữ liệu ban đầu:', error);
            setMessage('❌ Lỗi tải dữ liệu: ' + error.message);
        } finally {
            setLoadingData(false);
        }
    };

    // ✅ USEEFFECTS
    useEffect(() => {
        loadingInitialData();
    }, []);

    useEffect(() => {
        if (!loadingData) {
            fetchOrders(page, search, filterStatus);
        }
    }, [page, search, filterStatus, loadingData]);

    const fetchOrders = async (
        pageNum = 1,
        searchTerm = '',
        statusFilter = 'all'
    ) => {
        setLoading(true);
        try {
            console.log(
                `🔄 fetchOrders called with: page=${pageNum}, search="${searchTerm}", status="${statusFilter}"`
            );

            // Gọi API với pagination
            const response = await getOrders(pageNum, 10); // 10 items per page

            console.log('✅ Response từ OrderAPI:', response);

            if (!response || !response.data || !response.data.data) {
                setOrders([]);
                setTotalPage(1);
                setTotalItems(0);
                setPage(1);
                setStats({});
                return;
            }

            let ordersData = response.data.data || [];
            const totalOrdersCount = response.data.totalOrders || 0;

            // Filter by search term
            if (searchTerm) {
                ordersData = ordersData.filter(
                    (order) =>
                        order.phone
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        order.address
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        order.id?.toString().includes(searchTerm) ||
                        order.user_id?.toString().includes(searchTerm) ||
                        order.session_id
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                );
            }

            // Filter by status
            if (statusFilter !== 'all') {
                ordersData = ordersData.filter(
                    (order) => String(order.status) === String(statusFilter)
                );
            }

            // Calculate stats
            const orderStats = {};
            ordersData.forEach((order) => {
                orderStats[order.status] = (orderStats[order.status] || 0) + 1;
            });

            console.log('📊 Orders Data:', ordersData);
            console.log('📊 Stats:', orderStats);

            setOrders(ordersData);
            setTotalPage(Math.ceil(totalOrdersCount / 10));
            setTotalItems(totalOrdersCount);
            setStats(orderStats);

            console.log(`✅ State updated: ${ordersData.length} orders loaded`);
        } catch (error) {
            console.error('❌ Error in fetchOrders:', error);
            setMessage(`❌ ${error.message}`);
            setOrders([]);
            setTotalPage(1);
            setTotalItems(0);
            setStats({});
        } finally {
            setLoading(false);
        }
    };

    // ✅ MODAL FUNCTIONS
    const openDetailModal = async (order) => {
        try {
            setLoading(true);
            console.log('🔍 Đang tải chi tiết đơn hàng:', order.id);

            const response = await getOrderById(order.id);
            const orderDetail = response.data.data;

            setSelectedOrder(orderDetail);
            setModalMode('detail');
            setEditingId(order.id);
            setErrors({});
            setShowModal(true);
        } catch (error) {
            console.error('❌ Lỗi tải chi tiết đơn hàng:', error);
            setMessage('❌ Lỗi tải chi tiết đơn hàng: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const openUpdateModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setModalMode('update');
        setEditingId(order.id);
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
        setEditingId(null);
        setNewStatus(1);
        setErrors({});
    };

    // ✅ ACTION HANDLERS
    const handleUpdateStatus = async () => {
        if (!selectedOrder || !newStatus) {
            setMessage('❌ Vui lòng chọn trạng thái');
            return;
        }

        setLoading(true);
        try {
            console.log(
                '🔄 Đang cập nhật trạng thái đơn hàng:',
                selectedOrder.id,
                newStatus
            );

            await updateOrderStatus(selectedOrder.id, newStatus);
            setMessage('✅ Cập nhật trạng thái đơn hàng thành công!');

            closeModal();
            await fetchOrders(page, search, filterStatus);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Lỗi cập nhật trạng thái:', error);
            setMessage('❌ Lỗi cập nhật trạng thái: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchTerm = formData.get('search') || '';
        setSearch(searchTerm);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (
            newPage >= 1 &&
            newPage <= totalPage &&
            newPage !== page &&
            !loading
        ) {
            setPage(newPage);
        }
    };

    const handleStatusFilterChange = (status) => {
        setFilterStatus(status);
        setPage(1);
    };

    // ✅ HELPER FUNCTIONS
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0đ';
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    };

    const getStatusBadge = (status) => {
        const color = statusColors[status] || '#666';
        const icon = statusIcons[status] || '❓';
        const label = orderStatusMap[status] || 'Không xác định';

        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: color + '22',
                    color: color,
                    border: `1px solid ${color}44`
                }}
            >
                <span style={{ fontSize: '14px' }}>{icon}</span>
                {label}
            </span>
        );
    };

    // ✅ LOADING STATE
    if (loadingData) {
        return (
            <div className='loading-state'>
                <div className='loading-text'>🔄 Đang tải dữ liệu...</div>
            </div>
        );
    }

    // ✅ MAIN RENDER
    return (
        <div className='prodetail-container'>
            {/* Message Alert */}
            {message && (
                <div
                    className={`message ${
                        message.includes('✅') ? 'success' : 'error'
                    }`}
                >
                    {message}
                    <button onClick={() => setMessage('')}>×</button>
                </div>
            )}

            {/* Header */}
            <div className='header'>
                <h2>📦 Quản lý đơn hàng</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                    }}
                >
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        📊 Tổng: <strong>{totalItems}</strong> đơn hàng
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px'
                }}
            >
                {Object.entries(orderStatusMap).map(([key, label]) => {
                    const color = statusColors[key] || '#666';
                    const icon = statusIcons[key] || '❓';
                    const count = stats[key] || 0;

                    return (
                        <div
                            key={key}
                            style={{
                                background: 'white',
                                border: `2px solid ${color}22`,
                                borderRadius: '12px',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}
                            onClick={() => handleStatusFilterChange(key)}
                        >
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: color + '22',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px'
                                }}
                            >
                                {icon}
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontWeight: 'bold',
                                        color: color,
                                        fontSize: '14px'
                                    }}
                                >
                                    {label}
                                </div>
                                <div
                                    style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}
                                >
                                    {count}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search Bar và Filter */}
            <div className='search-bar'>
                <div className='search-info'>
                    Hiển thị <strong>{orders.length}</strong> /{' '}
                    <strong>{totalItems}</strong> đơn hàng
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                    }}
                >
                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) =>
                            handleStatusFilterChange(e.target.value)
                        }
                        style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '14px'
                        }}
                    >
                        <option value='all'>Tất cả trạng thái</option>
                        {Object.entries(orderStatusMap).map(([key, label]) => (
                            <option key={key} value={key}>
                                {statusIcons[key]} {label}
                            </option>
                        ))}
                    </select>

                    {/* Search Form */}
                    <form className='search-form' onSubmit={handleSearchSubmit}>
                        <input
                            name='search'
                            className='search-input'
                            placeholder='Tìm kiếm đơn hàng (ID, SĐT, địa chỉ)...'
                            defaultValue={search}
                        />
                        <button type='submit' className='btn-search'>
                            🔍 Tìm kiếm
                        </button>
                    </form>
                </div>
            </div>

            {/* Orders Table */}
            <div className='table-container'>
                <table className='data-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Khách hàng</th>
                            <th>Địa chỉ</th>
                            <th>Trạng thái</th>
                            <th>Tổng tiền</th>
                            <th>Ngày đặt</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan='7'
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px'
                                    }}
                                >
                                    🔄 Đang tải...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td
                                    colSpan='7'
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#999'
                                    }}
                                >
                                    📦 Không có đơn hàng nào
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td className='table-id'>#{order.id}</td>
                                    <td>
                                        <div style={{ fontSize: '14px' }}>
                                            📞 {order.phone || 'N/A'}
                                        </div>
                                        {order.user_id && (
                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    color: '#666'
                                                }}
                                            >
                                                👤 User: {order.user_id}
                                            </div>
                                        )}
                                        {order.session_id && (
                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    color: '#666'
                                                }}
                                            >
                                                🔗 Session:{' '}
                                                {order.session_id.slice(0, 8)}
                                                ...
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontSize: '12px'
                                            }}
                                            title={order.address}
                                        >
                                            🏠 {order.address || '-'}
                                        </div>
                                    </td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td
                                        className='price'
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        {formatCurrency(order.total)}
                                    </td>
                                    <td
                                        className='date'
                                        style={{ fontSize: '12px' }}
                                    >
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className='actions'>
                                        <div className='action-buttons'>
                                            <button
                                                className='btn-edit'
                                                onClick={() =>
                                                    openDetailModal(order)
                                                }
                                                disabled={loading}
                                                style={{ fontSize: '12px' }}
                                            >
                                                👁️ Chi tiết
                                            </button>
                                            <button
                                                className='btn-delete'
                                                onClick={() =>
                                                    openUpdateModal(order)
                                                }
                                                disabled={loading}
                                                style={{
                                                    fontSize: '12px',
                                                    background: '#ff9800',
                                                    borderColor: '#ff9800'
                                                }}
                                            >
                                                ✏️ Cập nhật
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
                <div className='pagination'>
                    <div className='pagination-info'>
                        Trang {page} / {totalPage} - Tổng {totalItems} đơn hàng
                    </div>
                    <div className='pagination-controls'>
                        <button
                            className='btn-nav'
                            onClick={() => handlePageChange(1)}
                            disabled={page === 1 || loading}
                        >
                            ⏪ Đầu
                        </button>
                        <button
                            className='btn-nav'
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1 || loading}
                        >
                            ⬅️ Trước
                        </button>

                        {Array.from(
                            { length: Math.min(5, totalPage) },
                            (_, i) => {
                                const startPage = Math.max(1, page - 2);
                                const pageNum = startPage + i;
                                if (pageNum > totalPage) return null;

                                return (
                                    <button
                                        key={pageNum}
                                        className={`btn-page ${
                                            page === pageNum ? 'active' : ''
                                        }`}
                                        onClick={() =>
                                            handlePageChange(pageNum)
                                        }
                                        disabled={loading}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                        )}
                        <button
                            className='btn-nav'
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPage || loading}
                        >
                            Tiếp ➡️
                        </button>
                        <button
                            className='btn-nav'
                            onClick={() => handlePageChange(totalPage)}
                            disabled={page === totalPage || loading}
                        >
                            Cuối ⏩
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <Modal
                show={showModal}
                onClose={closeModal}
                title={
                    modalMode === 'detail'
                        ? `👁️ Chi tiết đơn hàng #${editingId}`
                        : `✏️ Cập nhật trạng thái đơn hàng #${editingId}`
                }
                size='lg'
            >
                {modalMode === 'detail' && selectedOrder ? (
                    // Detail Modal Content
                    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {/* Order Info */}
                            <div
                                style={{
                                    background: '#f8f9fa',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}
                            >
                                <h4
                                    style={{
                                        margin: '0 0 12px 0',
                                        color: '#333'
                                    }}
                                >
                                    📦 Thông tin đơn hàng
                                </h4>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px'
                                    }}
                                >
                                    <div>
                                        <strong>ID:</strong> #{selectedOrder.id}
                                    </div>
                                    <div>
                                        <strong>Trạng thái:</strong>{' '}
                                        {getStatusBadge(selectedOrder.status)}
                                    </div>
                                    <div>
                                        <strong>📞 Điện thoại:</strong>{' '}
                                        {selectedOrder.phone || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>💰 Tổng tiền:</strong>{' '}
                                        <span
                                            style={{
                                                color: '#28a745',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {formatCurrency(
                                                selectedOrder.total
                                            )}
                                        </span>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <strong>🏠 Địa chỉ:</strong>{' '}
                                        {selectedOrder.address || 'N/A'}
                                    </div>
                                    {selectedOrder.note && (
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <strong>📝 Ghi chú:</strong>{' '}
                                            {selectedOrder.note}
                                        </div>
                                    )}
                                    <div>
                                        <strong>📅 Ngày đặt:</strong>{' '}
                                        {formatDate(selectedOrder.createdAt)}
                                    </div>
                                    <div>
                                        <strong>🔄 Cập nhật:</strong>{' '}
                                        {formatDate(selectedOrder.updatedAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4
                                    style={{
                                        margin: '0 0 12px 0',
                                        color: '#333'
                                    }}
                                >
                                    🛍️ Chi tiết sản phẩm (
                                    {selectedOrder.order_details?.length || 0}{' '}
                                    sản phẩm)
                                </h4>
                                <div
                                    style={{
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {selectedOrder.order_details?.map(
                                        (item, index) => (
                                            <div
                                                key={item.id}
                                                style={{
                                                    padding: '12px 16px',
                                                    borderBottom:
                                                        index <
                                                        selectedOrder
                                                            .order_details
                                                            .length -
                                                            1
                                                            ? '1px solid #e9ecef'
                                                            : 'none',
                                                    background:
                                                        index % 2 === 0
                                                            ? '#fff'
                                                            : '#f8f9fa'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between',
                                                        alignItems:
                                                            'flex-start',
                                                        gap: '12px'
                                                    }}
                                                >
                                                    <div style={{ flex: 1 }}>
                                                        <div
                                                            style={{
                                                                fontWeight:
                                                                    'bold',
                                                                marginBottom:
                                                                    '4px',
                                                                color: '#333'
                                                            }}
                                                        >
                                                            {item
                                                                .product_details
                                                                ?.name ||
                                                                `Sản phẩm #${item.product_detail_id}`}
                                                        </div>
                                                        {item.product_detail
                                                            ?.size && (
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        '12px',
                                                                    color: '#666',
                                                                    marginBottom:
                                                                        '4px'
                                                                }}
                                                            >
                                                                📏 Size:{' '}
                                                                {
                                                                    item
                                                                        .product_detail
                                                                        .size
                                                                }
                                                            </div>
                                                        )}
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '14px',
                                                                color: '#666'
                                                            }}
                                                        >
                                                            SL:{' '}
                                                            <strong>
                                                                {item.quantity}
                                                            </strong>{' '}
                                                            ×{' '}
                                                            {formatCurrency(
                                                                item.price
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontWeight: 'bold',
                                                            fontSize: '16px',
                                                            color: '#28a745'
                                                        }}
                                                    >
                                                        {formatCurrency(
                                                            item.quantity *
                                                                item.price
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div
                            className='form-buttons'
                            style={{ marginTop: '24px' }}
                        >
                            <button
                                type='button'
                                className='btn btn-secondary'
                                onClick={closeModal}
                            >
                                ❌ Đóng
                            </button>
                            <button
                                type='button'
                                className='btn btn-success'
                                onClick={() => openUpdateModal(selectedOrder)}
                                style={{
                                    background: '#ff9800',
                                    borderColor: '#ff9800'
                                }}
                            >
                                ✏️ Cập nhật trạng thái
                            </button>
                        </div>
                    </div>
                ) : modalMode === 'update' ? (
                    // Update Modal Content
                    <div>
                        <div style={{ marginBottom: '20px' }}>
                            <div
                                style={{
                                    background: '#f8f9fa',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    marginBottom: '16px'
                                }}
                            >
                                <strong>Đơn hàng:</strong> #{selectedOrder?.id}{' '}
                                - {selectedOrder?.phone}
                            </div>

                            <div className='form-group'>
                                <label className='form-label'>
                                    🔄 Trạng thái mới
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) =>
                                        setNewStatus(Number(e.target.value))
                                    }
                                    className='form-input'
                                    style={{ fontSize: '14px' }}
                                >
                                    {Object.entries(orderStatusMap).map(
                                        ([key, label]) => (
                                            <option
                                                key={key}
                                                value={Number(key)}
                                            >
                                                {statusIcons[key]} {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div
                                style={{
                                    background: '#e7f3ff',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #b3d9ff',
                                    fontSize: '14px'
                                }}
                            >
                                <strong>💡 Lưu ý:</strong> Việc thay đổi trạng
                                thái sẽ ảnh hưởng đến quy trình xử lý đơn hàng.
                                Vui lòng đảm bảo trạng thái phù hợp với tình
                                trạng thực tế của đơn hàng.
                            </div>
                        </div>

                        <div className='form-buttons'>
                            <button
                                type='button'
                                className='btn btn-secondary'
                                onClick={closeModal}
                                disabled={loading}
                            >
                                ❌ Hủy
                            </button>
                            <button
                                type='button'
                                className='btn btn-success'
                                onClick={handleUpdateStatus}
                                disabled={loading}
                                style={{
                                    background: '#ff9800',
                                    borderColor: '#ff9800'
                                }}
                            >
                                {loading
                                    ? '⏳ Đang cập nhật...'
                                    : '💾 Cập nhật trạng thái'}
                            </button>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
}

export default OrderComponent;
