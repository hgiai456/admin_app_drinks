// ProdetailComponent.js
import { useEffect, useState } from 'react';
// Import your ProdetailAPI
import ProdetailAPI from '../api/prodetails'; // Adjust path as needed

function ProdetailComponent() {
    const [prodetails, setProdetails] = useState([]);
    const [form, setForm] = useState({
        name: '',
        prouduct_id: '',
        size_id: '',
        store_id: '',
        buyturn: '',
        specification: '',
        price: '',
        oldprice: '',
        quantity: '',
        img1: '',
        img2: '',
        img3: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        fetchProdetails(page);
    }, [page]);

    const fetchProdetails = async (pageNum = 1) => {
        setLoading(true);
        try {
            const data = await ProdetailAPI.getPaging({ page: pageNum });
            setProdetails(data.data);
            setTotalPage(data.totalPage || 1);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc';
        if (!form.prouduct_id)
            newErrors.prouduct_id = 'ID sản phẩm là bắt buộc';
        if (!form.size_id) newErrors.size_id = 'ID size là bắt buộc';
        if (!form.store_id) newErrors.store_id = 'ID cửa hàng là bắt buộc';
        if (!form.price || isNaN(form.price) || form.price <= 0) {
            newErrors.price = 'Giá phải là số dương';
        }
        if (form.oldprice && (isNaN(form.oldprice) || form.oldprice <= 0)) {
            newErrors.oldprice = 'Giá cũ phải là số dương';
        }
        if (!form.quantity || isNaN(form.quantity) || form.quantity < 0) {
            newErrors.quantity = 'Số lượng phải là số không âm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage('Vui lòng kiểm tra lại thông tin!');
            return;
        }

        setLoading(true);
        try {
            if (editingId) {
                await ProdetailAPI.update(editingId, form);
                setMessage('Cập nhật thành công!');
            } else {
                await ProdetailAPI.create(form);
                setMessage('Thêm mới thành công!');
            }
            resetForm();
            fetchProdetails();
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            name: '',
            prouduct_id: '',
            size_id: '',
            store_id: '',
            buyturn: '',
            specification: '',
            price: '',
            oldprice: '',
            quantity: '',
            img1: '',
            img2: '',
            img3: ''
        });
        setEditingId(null);
        setErrors({});
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

        setLoading(true);
        try {
            await ProdetailAPI.delete(id);
            setMessage('Xóa thành công!');
            fetchProdetails();
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setForm({
            name: item.name || '',
            prouduct_id: item.prouduct_id || '',
            size_id: item.size_id || '',
            store_id: item.store_id || '',
            buyturn: item.buyturn || '',
            specification: item.specification || '',
            price: item.price || '',
            oldprice: item.oldprice || '',
            quantity: item.quantity || '',
            img1: item.img1 || '',
            img2: item.img2 || '',
            img3: item.img3 || ''
        });
        setEditingId(item.id);
        setErrors({});
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
            <h2>Quản lý sản phẩm chi tiết</h2>

            {message && (
                <div
                    style={{
                        color: message.includes('thành công') ? 'green' : 'red',
                        padding: 10,
                        marginBottom: 20,
                        border: `1px solid ${
                            message.includes('thành công') ? 'green' : 'red'
                        }`,
                        borderRadius: 5,
                        backgroundColor: message.includes('thành công')
                            ? '#f0f8f0'
                            : '#fdf0f0'
                    }}
                >
                    {message}
                </div>
            )}

            <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
                {/* Danh sách bên trái */}
                <div style={{ flex: 2 }}>
                    <h3>Danh sách sản phẩm chi tiết</h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 20 }}>
                            <div>Đang tải...</div>
                        </div>
                    ) : (
                        <>
                            <table
                                border='1'
                                cellPadding='8'
                                style={{
                                    width: '100%',
                                    borderCollapse: 'collapse'
                                }}
                            >
                                <thead>
                                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                                        <th>ID</th>
                                        <th>Tên</th>
                                        <th>Giá</th>
                                        <th>Giá cũ</th>
                                        <th>Số lượng</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prodetails.map((item) => (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{formatPrice(item.price)}</td>
                                            <td>
                                                {item.oldprice
                                                    ? formatPrice(item.oldprice)
                                                    : '-'}
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                    style={{
                                                        marginRight: 10,
                                                        padding: '5px 10px',
                                                        backgroundColor:
                                                            '#007bff',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: 3,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    style={{
                                                        padding: '5px 10px',
                                                        backgroundColor:
                                                            '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: 3,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Phân trang */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginTop: 16
                                }}
                            >
                                <button
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page === 1}
                                >
                                    Trang trước
                                </button>
                                <span>
                                    Trang {page} / {totalPage}
                                </span>
                                <button
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(totalPage, p + 1)
                                        )
                                    }
                                    disabled={page === totalPage}
                                >
                                    Trang sau
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Form thêm/sửa bên phải */}
                <div style={{ flex: 1 }}>
                    <h3>{editingId ? 'Sửa' : 'Thêm mới'} sản phẩm chi tiết</h3>

                    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                        <div style={{ marginBottom: 15 }}>
                            <input
                                name='name'
                                placeholder='Tên chi tiết *'
                                value={form.name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: 8,
                                    marginBottom: 5,
                                    border: errors.name
                                        ? '1px solid red'
                                        : '1px solid #ccc',
                                    borderRadius: 4
                                }}
                            />
                            {errors.name && (
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: 10,
                                marginBottom: 15
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <input
                                    name='prouduct_id'
                                    placeholder='ID sản phẩm *'
                                    value={form.prouduct_id}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: 8,
                                        border: errors.prouduct_id
                                            ? '1px solid red'
                                            : '1px solid #ccc',
                                        borderRadius: 4
                                    }}
                                />
                                {errors.prouduct_id && (
                                    <div
                                        style={{
                                            color: 'red',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {errors.prouduct_id}
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <input
                                    name='size_id'
                                    placeholder='ID size *'
                                    value={form.size_id}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: 8,
                                        border: errors.size_id
                                            ? '1px solid red'
                                            : '1px solid #ccc',
                                        borderRadius: 4
                                    }}
                                />
                                {errors.size_id && (
                                    <div
                                        style={{
                                            color: 'red',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {errors.size_id}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: 15 }}>
                            <input
                                name='store_id'
                                placeholder='ID cửa hàng *'
                                value={form.store_id}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: 8,
                                    border: errors.store_id
                                        ? '1px solid red'
                                        : '1px solid #ccc',
                                    borderRadius: 4
                                }}
                            />
                            {errors.store_id && (
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {errors.store_id}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: 15 }}>
                            <input
                                name='buyturn'
                                placeholder='Lượt mua (buyturn)'
                                value={form.buyturn}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 8,
                                    border: '1px solid #ccc',
                                    borderRadius: 4
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: 15 }}>
                            <textarea
                                name='specification'
                                placeholder='Mô tả (specification)'
                                value={form.specification}
                                onChange={handleChange}
                                rows='3'
                                style={{
                                    width: '100%',
                                    padding: 8,
                                    border: '1px solid #ccc',
                                    borderRadius: 4,
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: 10,
                                marginBottom: 15
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <input
                                    name='price'
                                    placeholder='Giá *'
                                    value={form.price}
                                    onChange={handleChange}
                                    type='number'
                                    style={{
                                        width: '100%',
                                        padding: 8,
                                        border: errors.price
                                            ? '1px solid red'
                                            : '1px solid #ccc',
                                        borderRadius: 4
                                    }}
                                />
                                {errors.price && (
                                    <div
                                        style={{
                                            color: 'red',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {errors.price}
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <input
                                    name='oldprice'
                                    placeholder='Giá cũ'
                                    value={form.oldprice}
                                    onChange={handleChange}
                                    type='number'
                                    style={{
                                        width: '100%',
                                        padding: 8,
                                        border: errors.oldprice
                                            ? '1px solid red'
                                            : '1px solid #ccc',
                                        borderRadius: 4
                                    }}
                                />
                                {errors.oldprice && (
                                    <div
                                        style={{
                                            color: 'red',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {errors.oldprice}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: 15 }}>
                            <input
                                name='quantity'
                                placeholder='Số lượng *'
                                value={form.quantity}
                                onChange={handleChange}
                                type='number'
                                style={{
                                    width: '100%',
                                    padding: 8,
                                    border: errors.quantity
                                        ? '1px solid red'
                                        : '1px solid #ccc',
                                    borderRadius: 4
                                }}
                            />
                            {errors.quantity && (
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {errors.quantity}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: 15 }}>
                            <input
                                name='img1'
                                placeholder='Ảnh 1 (img1)'
                                value={form.img1}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 8,
                                    marginBottom: 5,
                                    border: '1px solid #ccc',
                                    borderRadius: 4
                                }}
                            />
                            <input
                                name='img2'
                                placeholder='Ảnh 2 (img2)'
                                value={form.img2}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 8,
                                    marginBottom: 5,
                                    border: '1px solid #ccc',
                                    borderRadius: 4
                                }}
                            />
                            <input
                                name='img3'
                                placeholder='Ảnh 3 (img3)'
                                value={form.img3}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 8,
                                    border: '1px solid #ccc',
                                    borderRadius: 4
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                type='submit'
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '10px 20px',
                                    backgroundColor: loading
                                        ? '#ccc'
                                        : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading
                                    ? 'Đang xử lý...'
                                    : editingId
                                    ? 'Cập nhật'
                                    : 'Thêm mới'}
                            </button>

                            {editingId && (
                                <button
                                    type='button'
                                    onClick={resetForm}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Hủy
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProdetailComponent;
