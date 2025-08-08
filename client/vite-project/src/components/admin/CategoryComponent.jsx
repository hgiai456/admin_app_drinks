import { useEffect, useState } from 'react';
import CategoryAPI from '@api/categoryapi';
import Modal from './ModelComponent.jsx';
import '@styles/pages/_admin.scss';

function CategoryComponent() {
    const [categories, setCategories] = useState([]);
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
            // Initial load without pagination for now
            await fetchCategories(1, '');
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
            fetchCategories(page, search);
        }
    }, [page, search, loadingData]);

    const fetchCategories = async (pageNum = 1, searchTerm = '') => {
        setLoading(true);
        try {
            console.log(
                `🔄 fetchCategories called with: page=${pageNum}, search="${searchTerm}"`
            );

            // Try to use getPaging if available, otherwise use getAll
            let response;
            try {
                response = await CategoryAPI.getPaging({
                    page: pageNum || 1,
                    search: searchTerm || ''
                });
            } catch (error) {
                // Fallback to getAll if getPaging not implemented
                console.log('📝 Fallback to getAll method');
                const allCategories = await CategoryAPI.getAll();

                // Filter by search term if provided
                const filteredCategories = searchTerm
                    ? allCategories.filter((cat) =>
                          cat.name
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase())
                      )
                    : allCategories;

                // Manual pagination
                const itemsPerPage = 10;
                const startIndex = (pageNum - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedData = filteredCategories.slice(
                    startIndex,
                    endIndex
                );

                response = {
                    data: paginatedData,
                    pagination: {
                        currentPage: pageNum,
                        totalPage: Math.ceil(
                            filteredCategories.length / itemsPerPage
                        ),
                        totalItems: filteredCategories.length
                    }
                };
            }

            console.log('✅ Response từ CategoryAPI:', response);

            if (!response || !response.data) {
                setCategories([]);
                setTotalPage(1);
                setTotalItems(0);
                setPage(1);
                return;
            }

            const categoriesData = response.data || [];
            const pagination = response.pagination || {};

            console.log('📊 Categories Data:', categoriesData);
            console.log('📊 Pagination:', pagination);

            const currentPage = pagination.currentPage || pageNum || 1;
            const totalPageCount = pagination.totalPage || 1;
            const totalItemsCount = pagination.totalItems || 0;

            setCategories(categoriesData);
            setPage(currentPage);
            setTotalPage(totalPageCount);
            setTotalItems(totalItemsCount);

            console.log(
                `✅ State updated: ${categoriesData.length} categories loaded`
            );
        } catch (error) {
            console.error('❌ Error in fetchCategories:', error);
            setMessage(`❌ ${error.message}`);
            setCategories([]);
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
            newErrors.name = 'Tên danh mục là bắt buộc';
        } else if (form.name.length > 255) {
            newErrors.name = 'Tên danh mục không được dài quá 255 ký tự';
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
            const categoryData = {
                name: form.name.trim(),
                image: form.image.trim() || null
            };

            let result;
            if (modalMode === 'edit') {
                console.log('🔄 Đang cập nhật danh mục:', editingId);
                result = await CategoryAPI.update(editingId, categoryData);
                setMessage('✅ Cập nhật danh mục thành công!');
            } else {
                console.log('🔄 Đang tạo danh mục mới');
                result = await CategoryAPI.create(categoryData);
                setMessage('✅ Thêm danh mục thành công!');
            }

            console.log('✅ Kết quả:', result);

            closeModal();
            await fetchCategories(page, search);

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
        if (!confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            return;
        }

        setLoading(true);
        try {
            console.log('🗑️ Đang xóa danh mục:', id);

            await CategoryAPI.delete(id);
            setMessage('✅ Xóa danh mục thành công!');

            await fetchCategories(page, search);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Lỗi xóa danh mục:', error);
            setMessage('❌ Lỗi xóa danh mục: ' + error.message);
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
                <h2>📁 Quản lý danh mục</h2>
                <button
                    className='btn btn-success'
                    onClick={openCreateModal}
                    disabled={loading}
                >
                    ➕ Thêm danh mục
                </button>
            </div>

            {/* Search Bar */}
            <div className='search-bar'>
                <div className='search-info'>
                    Tổng <strong>{totalItems}</strong> danh mục
                </div>
                <form className='search-form' onSubmit={handleSearchSubmit}>
                    <input
                        name='search'
                        className='search-input'
                        placeholder='Tìm kiếm danh mục...'
                        defaultValue={search}
                    />
                    <button type='submit' className='btn-search'>
                        🔍 Tìm kiếm
                    </button>
                </form>
            </div>

            {/* Categories Table */}
            <div className='table-container'>
                <table className='data-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên danh mục</th>
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
                        ) : categories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan='6'
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#999'
                                    }}
                                >
                                    📁 Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            categories.map((item) => (
                                <tr key={item.id}>
                                    <td className='table-id'>{item.id}</td>
                                    <td className='category-name'>
                                        <div
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {item.name || '-'}
                                        </div>
                                    </td>
                                    <td className='category-image'>
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
                                            📁
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
                        Trang {page} / {totalPage} - Tổng {totalItems} danh mục
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
            <Modal
                show={showModal}
                onClose={closeModal}
                title={
                    modalMode === 'create'
                        ? '➕ Thêm sản phẩm mới'
                        : `✏️ Chỉnh sửa sản phẩm #${editingId}`
                }
                size='lg'
            >
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label className='form-label'>📝 Tên danh mục</label>
                        <input
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            className={`form-input ${
                                errors.name ? 'error' : ''
                            }`}
                            placeholder='Nhập tên sản phẩm...'
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
                            className='form-input'
                            placeholder='URL hình ảnh...'
                            type='url'
                        />
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

export default CategoryComponent;
