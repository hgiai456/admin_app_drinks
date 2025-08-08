import { useEffect, useState } from 'react';
import BrandAPI from '@api/brandapi';

function Brand() {
    const [brands, setBrands] = useState([]);
    const [form, setForm] = useState({
        name: '',
        image: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        const data = await BrandAPI.getAll();
        setBrands(data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await BrandAPI.update(editingId, form);
        } else {
            await BrandAPI.create(form);
        }
        setForm({ name: '', image: '' });
        setEditingId(null);
        fetchBrands();
    };

    const handleDelete = async (id) => {
        await BrandAPI.delete(id);
        fetchBrands();
    };

    const handleEdit = (brand) => {
        setForm({
            name: brand.name,
            image: brand.image || ''
        });
        setEditingId(brand.id);
    };

    const handleCancel = () => {
        setForm({ name: '', image: '' });
        setEditingId(null);
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <h2>Quản lý thương hiệu</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <input
                    name='name'
                    placeholder='Tên thương hiệu'
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    name='image'
                    placeholder='Link ảnh'
                    value={form.image}
                    onChange={handleChange}
                />
                <button type='submit'>
                    {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
                {editingId && (
                    <button type='button' onClick={handleCancel}>
                        Hủy
                    </button>
                )}
            </form>
            <table border='1' cellPadding='8' style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên thương hiệu</th>
                        <th>Ảnh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((brand) => (
                        <tr key={brand.id}>
                            <td>{brand.id}</td>
                            <td>{brand.name}</td>
                            <td>
                                {brand.image && (
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        width={40}
                                        height={40}
                                    />
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(brand)}>
                                    Sửa
                                </button>
                                <button onClick={() => handleDelete(brand.id)}>
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

export default Brand;
