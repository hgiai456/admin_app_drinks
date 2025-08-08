import { useEffect, useState } from 'react';
import StoreAPI from '@api/storeapi';

function Store() {
    const [stores, setStores] = useState([]);
    const [form, setForm] = useState({
        storeName: '',
        address: '',
        phoneNumber: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        const data = await StoreAPI.getAll();
        setStores(data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await StoreAPI.update(editingId, form);
        } else {
            await StoreAPI.create(form);
        }
        setForm({ storeName: '', address: '', phoneNumber: '' });
        setEditingId(null);
        setShowDialog(false);
        fetchStores();
    };

    const handleDelete = async (id) => {
        await StoreAPI.delete(id);
        fetchStores();
    };

    const handleEdit = (store) => {
        setForm({
            storeName: store.storeName,
            address: store.address,
            phoneNumber: store.phoneNumber || ''
        });
        setEditingId(store.id);
        setShowDialog(true);
    };

    const handleAddNew = () => {
        setForm({ storeName: '', address: '', phoneNumber: '' });
        setEditingId(null);
        setShowDialog(true);
    };

    const handleCancel = () => {
        setForm({ storeName: '', address: '', phoneNumber: '' });
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
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}
            >
                <h2>Quản lý cửa hàng</h2>
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
                    + Thêm cửa hàng mới
                </button>
            </div>

            {/* Dialog */}
            <div style={dialogOverlayStyle} onClick={handleCancel}>
                <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ marginTop: 0, marginBottom: 20 }}>
                        {editingId ? 'Cập nhật cửa hàng' : 'Thêm cửa hàng mới'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            name='storeName'
                            placeholder='Tên cửa hàng'
                            value={form.storeName}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            name='address'
                            placeholder='Địa chỉ'
                            value={form.address}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            name='phoneNumber'
                            placeholder='Số điện thoại'
                            value={form.phoneNumber}
                            onChange={handleChange}
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

            <table border='1' cellPadding='8' style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên cửa hàng</th>
                        <th>Địa chỉ</th>
                        <th>SĐT</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map((store) => (
                        <tr key={store.id}>
                            <td>{store.id}</td>
                            <td>{store.storeName}</td>
                            <td>{store.address}</td>
                            <td>{store.phoneNumber}</td>
                            <td>
                                <button onClick={() => handleEdit(store)}>
                                    Sửa
                                </button>
                                <button onClick={() => handleDelete(store.id)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Store;
