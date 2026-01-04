import { useEffect, useState } from 'react';
import SizeService from '@services/size.service.js';
import Modal from '@components/admin/ModelComponent.jsx';
import '@styles/pages/_admin.scss';

function SizeManagement() {
    const [sizes, setSizes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errors, setErrors] = useState({});
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');

    const [form, setForm] = useState({
        name: ''
    });

    const loadingInitialData = async () => {
        setLoadingData(true);
        try {
            console.log('🔄 Đang tải dữ liệu ban đầu...');
            await fetchSizes(1, '');
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
            fetchSizes(page, search);
        }
    }, [page, search, loadingData]);

    const fetchSizes = async (pageNum = 1, searchTerm = '') => {
        setLoading(true);
        try {
            console.log(
                `🔄 fetchSizes called with: page=${pageNum}, search="${searchTerm}"`
            );

            // Try to use getPaging if available, otherwise use getAll
            let response;
            try {
                response = await SizeService.getPaging({
                    page: pageNum || 1,
                    search: searchTerm || ''
                });
            } catch (error) {
                // Fallback to getAll if getPaging not implemented
                console.log('📝 Fallback to getAll method');
                const allSizes = await SizeService.getAll();

                // Filter by search term if provided
                const filteredSizes = searchTerm
                    ? allSizes.filter((size) =>
                          size.name
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase())
                      )
                    : allSizes;

                // Manual pagination
                const itemsPerPage = 10;
                const startIndex = (pageNum - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedData = filteredSizes.slice(startIndex, endIndex);

                response = {
                    data: paginatedData,
                    pagination: {
                        currentPage: pageNum,
                        totalPage: Math.ceil(
                            filteredSizes.length / itemsPerPage
                        ),
                        totalItems: filteredSizes.length
                    }
                };
            }

            console.log('✅ Response từ SizeAPI:', response);

            if (!response || !response.data) {
                setSizes([]);
                setTotalPage(1);
                setTotalItems(0);
                setPage(1);
                return;
            }

            const sizesData = response.data || [];
            const pagination = response.pagination || {};

            console.log('📊 Sizes Data:', sizesData);
            console.log('📊 Pagination:', pagination);

            const currentPage = pagination.currentPage || pageNum || 1;
            const totalPageCount = pagination.totalPage || 1;
            const totalItemsCount = pagination.totalItems || 0;

            setSizes(sizesData);
            setPage(currentPage);
            setTotalPage(totalPageCount);
            setTotalItems(totalItemsCount);

            console.log(`✅ State updated: ${sizesData.length} sizes loaded`);
        } catch (error) {
            console.error('❌ Error in fetchSizes:', error);
            setMessage(`❌ ${error.message}`);
            setSizes([]);
            setTotalPage(1);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    // ✅ MODAL FUNCTIONS
    const openCreateModal = () => {
        setForm({
            name: ''
        });
        setModalMode('create');
        setEditingId(null);
        setErrors({});
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setForm({
            name: item.name || ''
        });
        setModalMode('edit');
        setEditingId(item.id);
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setForm({
            name: ''
        });
        setEditingId(null);
        setErrors({});
    };

    // ✅ FORM HANDLERS
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = 'Tên kích thước là bắt buộc';
        } else if (form.name.length > 50) {
            newErrors.name = 'Tên kích thước không được dài quá 50 ký tự';
        } else if (form.name.trim().length < 1) {
            newErrors.name = 'Tên kích thước phải có ít nhất 1 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage('❌ Vui lòng kiểm tra lại thông tin');
            return;
        }

        setLoading(true);

        try {
            const sizeData = {
                name: form.name.trim()
            };

            let result;
            if (modalMode === 'edit') {
                console.log('🔄 Đang cập nhật kích thước:', editingId);
                result = await SizeService.update(editingId, sizeData);
                setMessage('✅ Cập nhật kích thước thành công!');
            } else {
                console.log('🔄 Đang tạo kích thước mới');
                result = await SizeService.create(sizeData);
                setMessage('✅ Thêm kích thước thành công!');
            }

            console.log('✅ Kết quả:', result);

            closeModal();
            await fetchSizes(page, search);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Lỗi submit form:', error);
            setMessage('❌ ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ ACTION HANDLERS
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa kích thước này không?')) {
            return;
        }

        setLoading(true);
        try {
            console.log('🗑️ Đang xóa kích thước:', id);

            await SizeService.delete(id);
            setMessage('✅ Xóa kích thước thành công!');

            await fetchSizes(page, search);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Lỗi xóa kích thước:', error);
            setMessage('❌ Lỗi xóa kích thước: ' + error.message);
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

    // ✅ HELPER FUNCTIONS
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getSizeTypeIcon = (sizeName) => {
        if (!sizeName) return '📏';
        const name = sizeName.toLowerCase();
        if (name.includes('s') || name.includes('nhỏ')) return '🟦';
        if (name.includes('m') || name.includes('vừa')) return '🟩';
        if (name.includes('l') || name.includes('lớn')) return '🟨';
        if (name.includes('xl') || name.includes('siêu')) return '🟥';
        return '📏';
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
                <h2>📏 Quản lý kích thước</h2>
                <button
                    className='btn btn-success'
                    onClick={openCreateModal}
                    disabled={loading}
                >
                    ➕ Thêm kích thước
                </button>
            </div>

            {/* Search Bar */}
            <div className='search-bar'>
                <div className='search-info'>
                    Tổng <strong>{totalItems}</strong> kích thước
                </div>
                <form className='search-form' onSubmit={handleSearchSubmit}>
                    <input
                        name='search'
                        className='search-input'
                        placeholder='Tìm kiếm kích thước...'
                        defaultValue={search}
                    />
                    <button type='submit' className='btn-search'>
                        🔍 Tìm kiếm
                    </button>
                </form>
            </div>

            {/* Sizes Table */}
            <div className='table-container'>
                <table className='data-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên kích thước</th>
                            <th>Loại</th>
                            <th>Ngày tạo</th>
                            <th>Ngày cập nhật</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan='6'
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px'
                                    }}
                                >
                                    🔄 Đang tải...
                                </td>
                            </tr>
                        ) : sizes.length === 0 ? (
                            <tr>
                                <td
                                    colSpan='6'
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#999'
                                    }}
                                >
                                    📏 Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            sizes.map((item) => (
                                <tr key={item.id}>
                                    <td className='table-id'>{item.id}</td>
                                    <td className='size-name'>
                                        <div
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <span style={{ fontSize: '20px' }}>
                                                {getSizeTypeIcon(item.name)}
                                            </span>
                                            {item.name || '-'}
                                        </div>
                                    </td>
                                    <td className='size-type'>
                                        <span
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: '16px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                backgroundColor:
                                                    item.name
                                                        ?.toLowerCase()
                                                        .includes('s') ||
                                                    item.name
                                                        ?.toLowerCase()
                                                        .includes('nhỏ')
                                                        ? '#e3f2fd'
                                                        : item.name
                                                              ?.toLowerCase()
                                                              .includes('m') ||
                                                          item.name
                                                              ?.toLowerCase()
                                                              .includes('vừa')
                                                        ? '#e8f5e8'
                                                        : item.name
                                                              ?.toLowerCase()
                                                              .includes('l') ||
                                                          item.name
                                                              ?.toLowerCase()
                                                              .includes('lớn')
                                                        ? '#fff3e0'
                                                        : item.name
                                                              ?.toLowerCase()
                                                              .includes('xl') ||
                                                          item.name
                                                              ?.toLowerCase()
                                                              .includes('siêu')
                                                        ? '#ffebee'
                                                        : '#f5f5f5',
                                                color:
                                                    item.name
                                                        ?.toLowerCase()
                                                        .includes('s') ||
                                                    item.name
                                                        ?.toLowerCase()
                                                        .includes('nhỏ')
                                                        ? '#1976d2'
                                                        : item.name
                                                              ?.toLowerCase()
                                                              .includes('m') ||
                                                          item.name
                                                              ?.toLowerCase()
                                                              .includes('vừa')
                                                        ? '#388e3c'
                                                        : item.name
                                                              ?.toLowerCase()
                                                              .includes('l') ||
                                                          item.name
                                                              ?.toLowerCase()
                                                              .includes('lớn')
                                                        ? '#f57c00'
                                                        : item.name
                                                              ?.toLowerCase()
                                                              .includes('xl') ||
                                                          item.name
                                                              ?.toLowerCase()
                                                              .includes('siêu')
                                                        ? '#d32f2f'
                                                        : '#666'
                                            }}
                                        >
                                            {item.name
                                                ?.toLowerCase()
                                                .includes('s') ||
                                            item.name
                                                ?.toLowerCase()
                                                .includes('nhỏ')
                                                ? 'Nhỏ'
                                                : item.name
                                                      ?.toLowerCase()
                                                      .includes('m') ||
                                                  item.name
                                                      ?.toLowerCase()
                                                      .includes('vừa')
                                                ? 'Vừa'
                                                : item.name
                                                      ?.toLowerCase()
                                                      .includes('l') ||
                                                  item.name
                                                      ?.toLowerCase()
                                                      .includes('lớn')
                                                ? 'Lớn'
                                                : item.name
                                                      ?.toLowerCase()
                                                      .includes('xl') ||
                                                  item.name
                                                      ?.toLowerCase()
                                                      .includes('siêu')
                                                ? 'Siêu lớn'
                                                : 'Khác'}
                                        </span>
                                    </td>
                                    <td className='date'>
                                        {formatDate(item.createdAt)}
                                    </td>
                                    <td className='date'>
                                        {formatDate(item.updatedAt)}
                                    </td>
                                    <td className='actions'>
                                        <div className='action-buttons'>
                                            <button
                                                className='btn-edit'
                                                onClick={() =>
                                                    openEditModal(item)
                                                }
                                                disabled={loading}
                                            >
                                                ✏️ Sửa
                                            </button>
                                            <button
                                                className='btn-delete'
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                disabled={loading}
                                            >
                                                🗑️ Xóa
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
                        Trang {page} / {totalPage} - Tổng {totalItems} kích
                        thước
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

            {/* Modal Form */}
            <Modal
                show={showModal}
                onClose={closeModal}
                title={
                    modalMode === 'create'
                        ? '➕ Thêm kích thước mới'
                        : `✏️ Chỉnh sửa kích thước #${editingId}`
                }
                size='lg'
            >
                <form onSubmit={handleSubmit}>
                    <div className='form-row'>
                        <div className='form-group'>
                            <label className='form-label'>
                                📏 Tên kích thước *
                            </label>
                            <input
                                name='name'
                                value={form.name}
                                onChange={handleChange}
                                className={`form-input ${
                                    errors.name ? 'error' : ''
                                }`}
                                placeholder='VD: S, M, L, XL, 38, 39, 40...'
                                required
                            />
                            {errors.name && (
                                <span className='form-error'>
                                    {errors.name}
                                </span>
                            )}
                            <small style={{ color: '#666', fontSize: '12px' }}>
                                💡 Gợi ý: S, M, L, XL (quần áo), 38, 39, 40
                                (giày), Nhỏ, Vừa, Lớn (đồ uống)
                            </small>
                        </div>

                        {/* Form Buttons */}
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
                                type='submit'
                                className='btn btn-success'
                                disabled={loading}
                            >
                                {loading
                                    ? '⏳ Đang xử lý...'
                                    : modalMode === 'edit'
                                    ? '💾 Cập nhật'
                                    : '➕ Thêm mới'}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default SizeManagement;
