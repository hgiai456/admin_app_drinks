import { useEffect, useState } from 'react';
import BannerService from '@services/banner.service.js';

function BannerComponent() {
    const [banners, setBanners] = useState([]);
    const [form, setForm] = useState({
        title: '',
        image: '',
        status: 1
    });
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            setError(null);
            setMessage('');
            
            // ✅ Gọi instance method từ BaseService
            const result = await BannerService.getAll();

            if (result.success) {
                setBanners(result.data || []);
                console.log('✅ Banners loaded:', result.data);
            } else {
                setError(result.message || 'Lỗi không xác định');
            }
        } catch (err) {
            console.error('❌ Fetch Error:', err);
            setError(`Lỗi khi tải dữ liệu: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false); //  QUAN TRỌNG
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === 'status' ? parseInt(value) : value
        });
    };
 const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            setMessage('');

            const bannerData = {
                name: form.title, // Backend expects 'name'
                image: form.image || null,
                status: form.status
            };

            let result;
            if (editingId) {
                result = await BannerService.update(editingId, bannerData);
            } else {
                result = await BannerService.create(bannerData);
            }

            if (result.success) {
                setMessage(editingId ? '✅ Cập nhật thành công' : '✅ Thêm thành công');
                setForm({ title: '', image: '', status: 1 });
                setEditingId(null);
                setShowDialog(false);
                await fetchBanners();
            } else {
                setError(result.message || 'Có lỗi xảy ra');
            }
        } catch (err) {
            console.error('❌ Submit Error:', err);
            setError(`Lỗi khi lưu: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };
const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return;

        try {
            setLoading(true);
            setError(null);
            setMessage('');
            
            const result = await BannerService.delete(id);
            
            if (result.success) {
                setMessage('✅ Xóa thành công');
                await fetchBanners();
            } else {
                setError(result.message || 'Không thể xóa banner');
            }
        } catch (err) {
            console.error('❌ Delete Error:', err);
            setError(`Lỗi khi xóa: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = (banner) => {
        setForm({
            title: banner.name || '',
            image: banner.image || '',
            status: banner.status || 1
        });
        setEditingId(banner.id);
        setShowDialog(true);
    };

    const handleAddNew = () => {
        setForm({ title: '', image: '', status: 1 });
        setEditingId(null);
        setShowDialog(true);
    };

    const handleCancel = () => {
        setForm({ title: '', image: '', status: 1 });
        setEditingId(null);
        setShowDialog(false);
    };

    const getStatusText = (status) => {
        return status === 1 ? 'Hoạt động' : 'Không hoạt động';
    };

    const getStatusColor = (status) => {
        return status === 1 ? '#4CAF50' : '#f44336';
    };

    // Dialog styles
    const dialogOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: showDialog ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };

    const dialogStyle = {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        marginBottom: '15px'
    };

    const buttonGroupStyle = {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
        marginTop: '10px'
    };

    const buttonStyle = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#007bff',
        color: 'white'
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
        color: 'white'
    };

    if (loading && banners.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                Đang tải...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}
            >
                <h2>Quản lý Banner</h2>
                <button
                    onClick={handleAddNew}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    + Thêm banner mới
                </button>
            </div>

            {error && (
                <div
                    style={{
                        color: 'red',
                        backgroundColor: '#ffebee',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        border: '1px solid #f44336'
                    }}
                >
                    {error}
                </div>
            )}

            {/* Dialog */}
            <div style={dialogOverlayStyle} onClick={handleCancel}>
                <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ marginTop: 0, marginBottom: 20 }}>
                        {editingId ? 'Cập nhật banner' : 'Thêm banner mới'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            name='title'
                            placeholder='Tên Banner'
                            value={form.title}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            name='image'
                            placeholder='Link ảnh'
                            value={form.image}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                        <select
                            name='status'
                            value={form.status}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value={1}>Hoạt động</option>
                            <option value={0}>Không hoạt động</option>
                        </select>
                        <div style={buttonGroupStyle}>
                            <button
                                type='button'
                                onClick={handleCancel}
                                style={secondaryButtonStyle}
                            >
                                Hủy
                            </button>
                            <button type='submit' style={primaryButtonStyle}>
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th
                                style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    borderBottom: '2px solid #dee2e6',
                                    fontWeight: 'bold'
                                }}
                            >
                                ID
                            </th>
                            <th
                                style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    borderBottom: '2px solid #dee2e6',
                                    fontWeight: 'bold'
                                }}
                            >
                                Tên Banner
                            </th>
                            <th
                                style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    borderBottom: '2px solid #dee2e6',
                                    fontWeight: 'bold'
                                }}
                            >
                                Ảnh
                            </th>
                            <th
                                style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    borderBottom: '2px solid #dee2e6',
                                    fontWeight: 'bold'
                                }}
                            >
                                URL Ảnh
                            </th>
                            <th
                                style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    borderBottom: '2px solid #dee2e6',
                                    fontWeight: 'bold'
                                }}
                            >
                                Trạng thái
                            </th>
                            <th
                                style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    borderBottom: '2px solid #dee2e6',
                                    fontWeight: 'bold'
                                }}
                            >
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.length === 0 ? (
                            <tr>
                                <td
                                    colSpan='6'
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#666'
                                    }}
                                >
                                    Chưa có banner nào
                                </td>
                            </tr>
                        ) : (
                            banners.map((banner, index) => (
                                <tr
                                    key={banner.id}
                                    style={{
                                        backgroundColor:
                                            index % 2 === 0 ? '#fff' : '#f8f9fa'
                                    }}
                                >
                                    <td
                                        style={{
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6'
                                        }}
                                    >
                                        {banner.id}
                                    </td>
                                    <td
                                        style={{
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6'
                                        }}
                                    >
                                        {banner.name}
                                    </td>
                                    <td
                                        style={{
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6'
                                        }}
                                    >
                                        {banner.image ? (
                                            <img
                                                src={banner.image}
                                                alt={banner.name}
                                                style={{
                                                    width: '80px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ddd'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        'none';
                                                    e.target.nextSibling.style.display =
                                                        'block';
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: '80px',
                                                    height: '50px',
                                                    backgroundColor: '#f0f0f0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    color: '#666',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Không có ảnh
                                            </div>
                                        )}
                                        <div
                                            style={{
                                                display: 'none',
                                                color: '#666',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Không thể tải ảnh
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6'
                                        }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontSize: '13px',
                                                color: '#666'
                                            }}
                                        >
                                            {banner.image || 'Chưa có ảnh'}
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6'
                                        }}
                                    >
                                        <span
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                color: 'white',
                                                backgroundColor: getStatusColor(
                                                    banner.status
                                                )
                                            }}
                                        >
                                            {getStatusText(banner.status)}
                                        </span>
                                    </td>
                                    <td
                                        style={{
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            disabled={loading}
                                            style={{
                                                backgroundColor: '#FF9800',
                                                color: 'white',
                                                padding: '6px 12px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: loading
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                                marginRight: '5px',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(banner.id)
                                            }
                                            disabled={loading}
                                            style={{
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                padding: '6px 12px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: loading
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BannerComponent;
