import { useEffect, useState } from 'react';
import SizeAPI from '@api/sizeapi';

function SizeComponent() {
    const [sizes, setSizes] = useState([]);
    const [form, setForm] = useState({
        name: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        fetchSizes();
    }, []);

    const fetchSizes = async () => {
        try {
            const data = await SizeAPI.getAll();
            setSizes(data);
        } catch (error) {
            console.error('Error fetching sizes:', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            alert('Tên size là bắt buộc!');
            return;
        }
        const sizeData = {
            name: form.name.trim()
        };
        try {
            let result;
            if (editingId) {
                result = await SizeAPI.update(editingId, sizeData);
            } else {
                result = await SizeAPI.create(sizeData);
            }
            setForm({ name: '' });
            setEditingId(null);
            setShowDialog(false);
            await fetchSizes();
            alert(editingId ? 'Cập nhật thành công!' : 'Tạo size thành công!');
        } catch (error) {
            let errorMessage =
                'Có lỗi xảy ra khi ' +
                (editingId ? 'cập nhật' : 'tạo') +
                ' size';
            if (error.message.includes('400')) {
                errorMessage += '\nLỗi: Dữ liệu không hợp lệ';
            } else if (error.message.includes('404')) {
                errorMessage += '\nLỗi: Không tìm thấy size';
            } else if (error.message.includes('500')) {
                errorMessage += '\nLỗi: Lỗi server';
            } else if (error.message.includes('Cannot read properties')) {
                errorMessage += '\nLỗi: Cấu trúc response từ server không đúng';
            }
            errorMessage += '\nChi tiết: ' + error.message;
            alert(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa size này?')) {
            return;
        }
        try {
            await SizeAPI.delete(id);
            fetchSizes();
            alert('Xóa thành công!');
        } catch (error) {
            alert('Có lỗi xảy ra khi xóa size: ' + error.message);
        }
    };

    const handleEdit = (size) => {
        setForm({
            name: size.getName()
        });
        setEditingId(size.getId());
        setShowDialog(true);
    };

    const handleAddNew = () => {
        setForm({ name: '' });
        setEditingId(null);
        setShowDialog(true);
    };

    const handleCancel = () => {
        setForm({ name: '' });
        setEditingId(null);
        setShowDialog(false);
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

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}
            >
                <h2>Quản lý Size</h2>
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
                    + Thêm size mới
                </button>
            </div>

            {/* Dialog */}
            <div style={dialogOverlayStyle} onClick={handleCancel}>
                <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ marginTop: 0, marginBottom: 20 }}>
                        {editingId ? 'Cập nhật size' : 'Thêm size mới'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            name='name'
                            placeholder='Tên size (VD: S, M, L, XL, 38, 39, 40...)'
                            value={form.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
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

            <table
                border='1'
                cellPadding='10'
                style={{ width: '100%', borderCollapse: 'collapse' }}
            >
                <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ width: '10%' }}>ID</th>
                        <th style={{ width: '30%' }}>Tên Size</th>
                        <th style={{ width: '25%' }}>Ngày tạo</th>
                        <th style={{ width: '25%' }}>Ngày cập nhật</th>
                        <th style={{ width: '10%' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {sizes.map((size) => (
                        <tr key={size.getId()}>
                            <td style={{ textAlign: 'center' }}>
                                {size.getId()}
                            </td>
                            <td style={{ fontWeight: 'bold' }}>
                                {size.getName()}
                            </td>
                            <td>
                                {size.getCreatedAt()
                                    ? new Date(
                                          size.getCreatedAt()
                                      ).toLocaleString('vi-VN')
                                    : '-'}
                            </td>
                            <td>
                                {size.getUpdatedAt()
                                    ? new Date(
                                          size.getUpdatedAt()
                                      ).toLocaleString('vi-VN')
                                    : '-'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => handleEdit(size)}
                                    style={{
                                        marginRight: 5,
                                        padding: 5,
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 3
                                    }}
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(size.getId())}
                                    style={{
                                        padding: 5,
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 3
                                    }}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {sizes.length === 0 && (
                <div
                    style={{ textAlign: 'center', padding: 20, color: '#666' }}
                >
                    Chưa có size nào. Hãy thêm size mới!
                </div>
            )}
        </div>
    );
}

export default SizeComponent;
