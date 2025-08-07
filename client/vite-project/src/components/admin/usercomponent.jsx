import { useEffect, useState } from 'react';
import UserAPI from '@api/userapi';
import User from '@models/usermodel';

function UserComponent() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        role: 0,
        avatar: '',
        phone: '',
        address: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await UserAPI.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!form.email || !form.name) {
            alert('Email và tên là bắt buộc!');
            return;
        }

        if (!editingId && !form.password) {
            alert('Password là bắt buộc khi tạo user mới!');
            return;
        }

        // Tạo plain object thay vì User instance
        const userData = {
            email: form.email.trim(),
            name: form.name.trim(),
            role: Number(form.role),
            avatar: form.avatar.trim(),
            phone: form.phone.trim(),
            address: form.address.trim()
        };

        // Chỉ thêm password nếu có
        if (form.password) {
            userData.password = form.password;
        }

        try {
            let result;
            if (editingId) {
                result = await UserAPI.update(editingId, userData);
            } else {
                result = await UserAPI.create(userData);
            }

            // Reset form
            setForm({
                email: '',
                password: '',
                name: '',
                role: 0,
                avatar: '',
                phone: '',
                address: ''
            });
            setEditingId(null);
            setShowDialog(false);

            // Reload users
            await fetchUsers();

            alert(editingId ? 'Cập nhật thành công!' : 'Tạo user thành công!');
        } catch (error) {
            let errorMessage =
                'Có lỗi xảy ra khi ' +
                (editingId ? 'cập nhật' : 'tạo') +
                ' user';
            if (error.message.includes('400')) {
                errorMessage += '\nLỗi: Dữ liệu không hợp lệ';
            } else if (error.message.includes('404')) {
                errorMessage += '\nLỗi: Không tìm thấy user';
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
        if (!confirm('Bạn có chắc chắn muốn xóa user này?')) {
            return;
        }

        try {
            await UserAPI.delete(id);
            fetchUsers();
            alert('Xóa thành công!');
        } catch (error) {
            alert('Có lỗi xảy ra khi xóa user: ' + error.message);
        }
    };

    const handleEdit = (user) => {
        setForm({
            email: user.getEmail(),
            password: '', // Không điền password khi edit
            name: user.getName(),
            role: user.getRole(),
            avatar: user.getAvatar() || '',
            phone: user.getPhone() || '',
            address: user.getAddress() || ''
        });
        setEditingId(user.getId());
        setShowDialog(true);
    };

    const handleAddNew = () => {
        setForm({
            email: '',
            password: '',
            name: '',
            role: 0,
            avatar: '',
            phone: '',
            address: ''
        });
        setEditingId(null);
        setShowDialog(true);
    };

    const handleCancel = () => {
        setForm({
            email: '',
            password: '',
            name: '',
            role: 0,
            avatar: '',
            phone: '',
            address: ''
        });
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
        maxWidth: '500px',
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
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}
            >
                <h2>Quản lý người dùng</h2>
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
                    + Thêm user mới
                </button>
            </div>

            {/* Dialog */}
            <div style={dialogOverlayStyle} onClick={handleCancel}>
                <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ marginTop: 0, marginBottom: 20 }}>
                        {editingId ? 'Cập nhật user' : 'Thêm user mới'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            name='email'
                            placeholder='Email'
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            name='password'
                            placeholder='Mật khẩu'
                            type='password'
                            value={form.password}
                            onChange={handleChange}
                            required={!editingId}
                            style={inputStyle}
                        />
                        <input
                            name='name'
                            placeholder='Tên'
                            value={form.name}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                        <input
                            name='role'
                            placeholder='Role'
                            value={form.role}
                            onChange={handleChange}
                            type='number'
                            style={inputStyle}
                        />
                        <input
                            name='avatar'
                            placeholder='Link avatar'
                            value={form.avatar}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                        <input
                            name='phone'
                            placeholder='Số điện thoại'
                            value={form.phone}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                        <input
                            name='address'
                            placeholder='Địa chỉ'
                            value={form.address}
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
                        <th>Email</th>
                        <th>Tên</th>
                        <th>Role</th>
                        <th>Avatar</th>
                        <th>SĐT</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.getId()}>
                            <td>{user.getId()}</td>
                            <td>{user.getEmail()}</td>
                            <td>{user.getName()}</td>
                            <td>{user.getRole()}</td>
                            <td>
                                {user.getAvatar() && (
                                    <img
                                        src={user.getAvatar()}
                                        alt={user.getName()}
                                        width={40}
                                        height={40}
                                    />
                                )}
                            </td>
                            <td>{user.getPhone()}</td>
                            <td>{user.getAddress()}</td>
                            <td>
                                <button
                                    onClick={() => handleEdit(user)}
                                    style={{ marginRight: 5 }}
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(user.getId())}
                                >
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

export default UserComponent;
