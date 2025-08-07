import { useEffect, useState } from 'react';
import ProductAPI from '@api/productapi';
import CategoryAPI from '@api/categoryapi';
import Modal from './ModelComponent.jsx';
import '@styles/pages/_admin.scss';

function ProductComponent() {
    const [products, setProducts] = useState([]);
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
        description: '',
        image: '',
        brand_id: '',
        category_id: '',
        price: ''
    });

    const loadingInitialData = async () => {
        setLoadingData(true);
        try {
            console.log('🔄 Đang tải dữ liệu ban đầu...');
            const categoriesData = await CategoryAPI.getAll();
            setCategories(categoriesData || []);
            console.log('✅ Đã tải categories:', categoriesData);
        } catch (error) {
            console.error('❌ Lỗi tải dữ liệu ban đầu:', error);
            setMessage('❌ Lỗi tải dữ liệu: ' + error.message);
        } finally {
            setLoadingData(false);
        }
    };

    // ✅ USEEFFECTS (giống Prodetail)
    useEffect(() => {
        //Tải dữ liệu khi gọi lần 1
        loadingInitialData();
    }, []);

    useEffect(() => {
        //Tải dữ liệu khi gọi lần 2 khi page và search thay đổi
        if (!loadingData) {
            fetchProducts(page, search);
        }
    }, [page, search, loadingData]);

    const fetchProducts = async (pageNum = 1, searchTerm = '') => {
        setLoading(true);
        try {
            console.log(
                `🔄 fetchProducts called with: page=${pageNum}, search="${searchTerm}"`
            );

            // ✅ CALL API VỚI PARAMS RÕ RÀNG
            const response = await ProductAPI.getPaging({
                page: pageNum || 1,
                search: searchTerm || ''
            });

            console.log('✅ Response từ ProductAPI:', response);

            // ✅ XỬ LÝ RESPONSE MỚI
            if (!response || !response.data) {
                setProducts([]);
                setTotalPage(1);
                setTotalItems(0);
                setPage(1);
                return;
            }

            const productsData = response.data || [];
            const pagination = response.pagination || {};

            // ✅ XỬ LÝ PRICE TỪ PRODUCT_DETAILS
            const processedProducts = productsData.map((product) => ({
                ...product,
                price: product.product_details?.[0]?.price || 0 // ✅ Lấy price từ product_details
            }));

            console.log('📊 Processed Products:', processedProducts);
            console.log('📊 Pagination:', pagination);

            // ✅ SET STATE
            const currentPage = pagination.currentPage || pageNum || 1;
            const totalPageCount = pagination.totalPage || 1;
            const totalItemsCount = pagination.totalItems || 0;

            // ✅ SET STATE AN TOÀN
            setProducts(processedProducts);
            setPage(currentPage);
            setTotalPage(totalPageCount);
            setTotalItems(totalItemsCount);

            console.log(
                `✅ State updated: ${productsData.length} products loaded`
            );
        } catch (error) {
            console.error('❌ Error in fetchProducts:', error);
            setMessage(`❌ ${error.message}`);

            // ✅ RESET STATE KHI LỖI
            setProducts([]);
            setTotalPage(1);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };
    // ✅ MODAL FUNCTIONS (giống Prodetail)
    const openCreateModal = () => {
        setForm({
            name: '',
            description: '',
            image: '',
            brand_id: '',
            category_id: '',
            price: ''
        });
        setModalMode('create');
        setEditingId(null);
        setErrors({});
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setForm({
            name: item.name || '',
            description: item.description || '',
            image: item.image || '',
            brand_id: item.brand_id?.toString() || '',
            category_id: item.category_id?.toString() || '',
            price: item.price?.toString() || ''
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
            description: '',
            image: '',
            brand_id: '',
            category_id: '',
            price: ''
        });
        setEditingId(null);
        setErrors({});
    };

    // ✅ FORM HANDLERS (giống Prodetail)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Clear error khi user input
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = 'Tên sản phẩm là bắt buộc';
        } else if (form.name.length > 255) {
            newErrors.name = 'Tên sản phẩm không được dài quá 255 ký tự';
        }

        if (!form.brand_id) {
            newErrors.brand_id = 'Thương hiệu là bắt buộc';
        }

        if (!form.category_id) {
            newErrors.category_id = 'Danh mục là bắt buộc';
        }

        if (form.price && isNaN(parseFloat(form.price))) {
            newErrors.price = 'Giá phải là số hợp lệ';
        }

        if (form.price && parseFloat(form.price) < 0) {
            newErrors.price = 'Giá không được âm';
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
            // ✅ Tạo Product instance hoặc object data
            const productData = {
                name: form.name.trim(),
                description: form.description.trim(),
                image: form.image.trim(),
                brand_id: parseInt(form.brand_id),
                category_id: parseInt(form.category_id),
                price: parseFloat(form.price) || 0
            };

            let result;
            if (modalMode === 'edit') {
                console.log('🔄 Đang cập nhật sản phẩm:', editingId);
                result = await ProductAPI.update(editingId, productData);
                setMessage('✅ Cập nhật sản phẩm thành công!');
            } else {
                console.log('🔄 Đang tạo sản phẩm mới');
                result = await ProductAPI.create(productData);
                setMessage('✅ Thêm sản phẩm thành công!');
            }

            console.log('✅ Kết quả:', result);

            // Đóng modal và refresh data
            closeModal();
            await fetchProducts(page, search);

            // Clear message sau 3 giây
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Lỗi submit form:', error);
            setMessage('❌ ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ ACTION HANDLERS (giống Prodetail)
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            return;
        }

        setLoading(true);
        try {
            console.log('🗑️ Đang xóa sản phẩm:', id);

            await ProductAPI.delete(id);
            setMessage('✅ Xóa sản phẩm thành công!');

            // Refresh data
            await fetchProducts(page, search);

            // Clear message sau 3 giây
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Lỗi xóa sản phẩm:', error);
            setMessage('❌ Lỗi xóa sản phẩm: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchTerm = formData.get('search') || '';
        setSearch(searchTerm);
        setPage(1); // Reset về trang 1 khi search
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

    // ✅ HELPER FUNCTIONS (giống Prodetail)
    const getCategoryName = (categoryId) => {
        const category = categories.find((c) => c.id === categoryId);
        return category ? category.name : `Category #${categoryId}`;
    };

    const formatPrice = (price) => {
        if (!price || price === 0) return '-';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // ✅ LOADING STATE (giống Prodetail)
    if (loadingData) {
        return (
            <div className='loading-state'>
                <div className='loading-text'>🔄 Đang tải dữ liệu...</div>
            </div>
        );
    }

    // ✅ MAIN RENDER (sử dụng SCSS classes)
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
                <h2>🛍️ Quản lý sản phẩm</h2>
                <button
                    className='btn btn-success'
                    onClick={openCreateModal}
                    disabled={loading}
                >
                    ➕ Thêm sản phẩm
                </button>
            </div>

            {/* Search Bar */}
            <div className='search-bar'>
                <div className='search-info'>
                    Tổng <strong>{totalItems}</strong> sản phẩm
                </div>
                <form className='search-form' onSubmit={handleSearchSubmit}>
                    <input
                        name='search'
                        className='search-input'
                        placeholder='Tìm kiếm sản phẩm...'
                        defaultValue={search}
                    />
                    <button type='submit' className='btn-search'>
                        🔍 Tìm kiếm
                    </button>
                </form>
            </div>

            {/* Products Table */}
            <div className='table-container'>
                <table className='data-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Hình ảnh</th>
                            <th>Danh mục</th>
                            <th>Brand ID</th>
                            <th>Giá</th>

                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan='8'
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px'
                                    }}
                                >
                                    🔄 Đang tải...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan='8'
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#999'
                                    }}
                                >
                                    📦 Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            products.map((item) => (
                                <tr key={item.id}>
                                    <td className='table-id'>{item.id}</td>
                                    <td className='product-name'>
                                        <div style={{ maxWidth: '200px' }}>
                                            <div
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {item.name || '-'}
                                            </div>
                                            {item.description && (
                                                <div
                                                    style={{
                                                        fontSize: '12px',
                                                        color: '#666',
                                                        marginTop: '4px',
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {item.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className='product-image'>
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
                                            📷
                                        </div>
                                    </td>
                                    <td className='category-name'>
                                        <span className='category-badge'>
                                            {getCategoryName(item.category_id)}
                                        </span>
                                    </td>
                                    <td className='brand-name'>
                                        <span className='brand-badge'>
                                            Brand #{item.brand_id}
                                        </span>
                                    </td>
                                    <td className='price'>
                                        {formatPrice(item.price)}
                                    </td>
                                    <td className='date'>
                                        {formatDate(item.createdAt)}
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
                        Trang {page} / {totalPage} - Tổng {totalItems} sản phẩm
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

                        {/* Hiển thị số trang */}
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
                        ? '➕ Thêm sản phẩm mới'
                        : `✏️ Chỉnh sửa sản phẩm #${editingId}`
                }
                size='lg'
            >
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label className='form-label'>📝 Tên sản phẩm *</label>
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
                        <label className='form-label'>📋 Mô tả sản phẩm</label>
                        <textarea
                            name='description'
                            value={form.description}
                            onChange={handleChange}
                            className='form-input'
                            rows='3'
                            placeholder='Nhập mô tả sản phẩm...'
                        />
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

                    <div className='form-row'>
                        <div className='form-group'>
                            <label className='form-label'>📁 Danh mục *</label>
                            <select
                                name='category_id'
                                value={form.category_id}
                                onChange={handleChange}
                                className={`form-input ${
                                    errors.category_id ? 'error' : ''
                                }`}
                                required
                            >
                                <option value=''>-- Chọn danh mục --</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        [{category.id}] {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <span className='form-error'>
                                    {errors.category_id}
                                </span>
                            )}
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>🏷️ Brand ID *</label>
                            <input
                                type='number'
                                name='brand_id'
                                value={form.brand_id}
                                onChange={handleChange}
                                className={`form-input ${
                                    errors.brand_id ? 'error' : ''
                                }`}
                                placeholder='Nhập Brand ID...'
                                required
                                min='1'
                            />
                            {errors.brand_id && (
                                <span className='form-error'>
                                    {errors.brand_id}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='form-group'>
                            <label className='form-label'>
                                💰 Giá sản phẩm
                            </label>
                            <input
                                type='number'
                                name='price'
                                value={form.price}
                                onChange={handleChange}
                                className={`form-input ${
                                    errors.price ? 'error' : ''
                                }`}
                                placeholder='0'
                                min='0'
                                step='1000'
                            />
                            {errors.price && (
                                <span className='form-error'>
                                    {errors.price}
                                </span>
                            )}
                        </div>
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

export default ProductComponent;
