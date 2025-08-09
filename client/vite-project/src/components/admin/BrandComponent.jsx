import { useEffect, useState } from 'react';
import BrandAPI from '@api/brandapi';
import Modal from './ModelComponent.jsx';
import '@styles/pages/_admin.scss';

function BrandComponent() {
    const [brands, setBrands] = useState([]);
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
        name: '',
        image: ''
    });

    const loadingInitialData = async () => {
        setLoadingData(true);
        try {
            console.log('🔄 Đang tải dữ liệu ban đầu...');
            await fetchBrands(1, '');
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
            fetchBrands(page, search);
        }
    }, [page, search, loadingData]);

    const fetchBrands = async (pageNum = 1, searchTerm = '') => {
        setLoading(true);
        try {
            console.log(
                `🔄 fetchBrands called with: page=${pageNum}, search="${searchTerm}"`
            );

            // Try to use getPaging if available, otherwise use getAll
            let response;
            try {
                response = await BrandAPI.getPaging({
                    page: pageNum || 1,
                    search: searchTerm || ''
                });
            } catch (error) {
                // Fallback to getAll if getPaging not implemented
                console.log('📝 Fallback to getAll method');
                const allBrands = await BrandAPI.getAll();

                // Filter by search term if provided
                const filteredBrands = searchTerm
                    ? allBrands.filter((brand) =>
                          brand.name
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase())
                      )
                    : allBrands;

                // Manual pagination
                const itemsPerPage = 10;
                const startIndex = (pageNum - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedData = filteredBrands.slice(
                    startIndex,
                    endIndex
                );

                response = {
                    data: paginatedData,
                    pagination: {
                        currentPage: pageNum,
                        totalPage: Math.ceil(
                            filteredBrands.length / itemsPerPage
                        ),
                        totalItems: filteredBrands.length
                    }
                };
            }

            console.log('✅ Response từ BrandAPI:', response);

            if (!response || !response.data) {
                setBrands([]);
                setTotalPage(1);
                setTotalItems(0);
                setPage(1);
                return;
            }

            const brandsData = response.data || [];
            const pagination = response.pagination || {};

            console.log('📊 Brands Data:', brandsData);
            console.log('📊 Pagination:', pagination);

            const currentPage = pagination.currentPage || pageNum || 1;
            const totalPageCount = pagination.totalPage || 1;
            const totalItemsCount = pagination.totalItems || 0;

            setBrands(brandsData);
            setPage(currentPage);
            setTotalPage(totalPageCount);
            setTotalItems(totalItemsCount);

            console.log(`✅ State updated: ${brandsData.length} brands loaded`);
        } catch (error) {
            console.error('❌ Error in fetchBrands:', error);
            setMessage(`❌ ${error.message}`);
            setBrands([]);
            setTotalPage(1);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    // ✅ MODAL FUNCTIONS
    const openCreateModal = () => {
        setForm({
            name: '',
            image: ''
        });
        setModalMode('create');
        setEditingId(null);
        setErrors({});
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setForm({
            name: item.name || '',
            image: item.image || ''
        });
        setModalMode('edit');
        setEditingId(item.id);
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setForm({
            name: '',
            image: ''
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
            newErrors.name = 'Tên thương hiệu là bắt buộc';
        } else if (form.name.length > 255) {
            newErrors.name = 'Tên thương hiệu không được dài quá 255 ký tự';
        }

        if (form.image && !isValidUrl(form.image)) {
            newErrors.image = 'URL hình ảnh không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage('❌ Vui lòng kiểm tra lại thông tin');
            return;
        }

        setLoading(true);

        try {
            const brandData = {
                name: form.name.trim(),
                image: form.image.trim() || null
            };

            let result;
            if (modalMode === 'edit') {
                console.log('🔄 Đang cập nhật thương hiệu:', editingId);
                result = await BrandAPI.update(editingId, brandData);
                setMessage('✅ Cập nhật thương hiệu thành công!');
            } else {
                console.log('🔄 Đang tạo thương hiệu mới');
                result = await BrandAPI.create(brandData);
                setMessage('✅ Thêm thương hiệu thành công!');
            }

            console.log('✅ Kết quả:', result);

            closeModal();
            await fetchBrands(page, search);

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
        if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) {
            return;
        }

        setLoading(true);
        try {
            console.log('🗑️ Đang xóa thương hiệu:', id);

            await BrandAPI.delete(id);
            setMessage('✅ Xóa thương hiệu thành công!');

            await fetchBrands(page, search);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Lỗi xóa thương hiệu:', error);
            setMessage('❌ Lỗi xóa thương hiệu: ' + error.message);
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
                <h2>🏷️ Quản lý thương hiệu</h2>
                <button
                    className='btn btn-success'
                    onClick={openCreateModal}
                    disabled={loading}
                >
                    ➕ Thêm thương hiệu
                </button>
            </div>

            {/* Search Bar */}
            <div className='search-bar'>
                <div className='search-info'>
                    Tổng <strong>{totalItems}</strong> thương hiệu
                </div>
                <form className='search-form' onSubmit={handleSearchSubmit}>
                    <input
                        name='search'
                        className='search-input'
                        placeholder='Tìm kiếm thương hiệu...'
                        defaultValue={search}
                    />
                    <button type='submit' className='btn-search'>
                        🔍 Tìm kiếm
                    </button>
                </form>
            </div>

            {/* Brands Table */}
            <div className='table-container'>
                <table className='data-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên thương hiệu</th>
                            <th>Hình ảnh</th>
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
                        ) : brands.length === 0 ? (
                            <tr>
                                <td
                                    colSpan='6'
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#999'
                                    }}
                                >
                                    🏷️ Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            brands.map((item) => (
                                <tr key={item.id}>
                                    <td className='table-id'>{item.id}</td>
                                    <td className='brand-name'>
                                        <div
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {item.name || '-'}
                                        </div>
                                    </td>
                                    <td className='brand-image'>
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ddd'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        'none';
                                                    e.target.nextElementSibling.style.display =
                                                        'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#f0f0f0',
                                                display: item.image
                                                    ? 'none'
                                                    : 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '4px',
                                                fontSize: '20px'
                                            }}
                                        >
                                            🏷️
                                        </div>
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
                        Trang {page} / {totalPage} - Tổng {totalItems} thương
                        hiệu
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
                        ? '➕ Thêm thương hiệu mới'
                        : `✏️ Chỉnh sửa thương hiệu #${editingId}`
                }
                size='lg'
            >
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label className='form-label'>
                            🏷️ Tên thương hiệu *
                        </label>
                        <input
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            className={`form-input ${
                                errors.name ? 'error' : ''
                            }`}
                            placeholder='Nhập tên thương hiệu...'
                            required
                        />
                        {errors.name && (
                            <span className='form-error'>{errors.name}</span>
                        )}
                    </div>

                    <div className='form-group'>
                        <label className='form-label'>🖼️ Hình ảnh</label>
                        <input
                            name='image'
                            value={form.image}
                            onChange={handleChange}
                            className={`form-input ${
                                errors.image ? 'error' : ''
                            }`}
                            placeholder='URL hình ảnh...'
                            type='url'
                        />
                        {errors.image && (
                            <span className='form-error'>{errors.image}</span>
                        )}
                        {form.image && (
                            <div style={{ marginTop: '8px' }}>
                                <img
                                    src={form.image}
                                    alt='Preview'
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
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
                </form>
            </Modal>
        </div>
    );
}

export default BrandComponent;
