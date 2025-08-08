// client/vite-project/src/ordercomponent.jsx
import { useEffect, useState } from 'react';
import { getOrders, getOrderById, updateOrderStatus } from '@api/orderapi';
import { orderStatusMap } from '@models/order';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    Pagination,
    Typography,
    Box,
    Grid,
    Avatar,
    InputLabel,
    FormControl
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import ErrorIcon from '@mui/icons-material/Error';

// Mapping trạng thái (ví dụ, bạn cần đồng bộ với orderStatusMap của bạn)
// Ví dụ:
// 1: Đang xử lý, 2: Đã vận chuyển, 3: Đã thành công, 4: Đã hủy, 5: Trả hàng, 6: Đã thất bại
const statusColors = {
    1: '#1976d2', // Đang xử lý - xanh dương
    2: '#ff9800', // Đã vận chuyển - cam
    3: '#2e7d32', // Đã thành công - xanh lá
    4: '#2e7d32', // Đã hủy - đỏ
    5: '#d32f2f', // Trả hàng - đỏ
    6: '#d32f2f', // Đã thất bại - đỏ
    7: '#d32f2f' // Đã hủy - đỏ
};
const statusIcons = {
    1: <AssignmentIcon />, // Đang xử lý
    2: <LocalShippingIcon />, // Đã vận chuyển
    3: <CheckCircleIcon />, // Đã thành công
    4: <CheckCircleIcon />, // Đã thành công
    5: <CancelIcon />, // Trả hàng
    6: <ReplayIcon />, // Đã thất bại
    7: <CancelIcon /> // Đã hủy
};

export default function OrderComponent() {
    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState(1);
    const [stats, setStats] = useState({});
    // Lọc trạng thái
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const fetchOrders = async (page) => {
        const res = await getOrders(page, 5);
        setOrders(res.data.data);
        setTotalOrders(res.data.totalOrders);
        // Thống kê trạng thái
        const stat = {};
        res.data.data.forEach((o) => {
            stat[o.status] = (stat[o.status] || 0) + 1;
        });
        setStats(stat);
    };

    const handleDetail = async (id) => {
        const res = await getOrderById(id);
        setSelectedOrder(res.data.data);
        setDetailDialogOpen(true);
    };

    const handleUpdate = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setUpdateDialogOpen(true);
    };

    const handleUpdateStatus = async () => {
        await updateOrderStatus(selectedOrder.id, newStatus);
        setUpdateDialogOpen(false);
        fetchOrders(page);
    };

    // Lọc đơn hàng theo trạng thái
    const filteredOrders =
        filterStatus === 'all'
            ? orders
            : orders.filter(
                  (order) => String(order.status) === String(filterStatus)
              );

    return (
        <div>
            <Typography variant='h4' gutterBottom>
                Quản lý đơn hàng
            </Typography>
            {/* Thống kê trạng thái đẹp hơn */}
            <Box sx={{ p: 2, mb: 2 }}>
                <Typography variant='h6' sx={{ mb: 2 }}>
                    Thống kê trạng thái đơn hàng
                </Typography>
                <Grid container spacing={2}>
                    {Object.entries(orderStatusMap).map(([key, label]) => (
                        <Grid item xs={12} sm={6} md={3} key={key}>
                            <Paper
                                elevation={3}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    bgcolor: statusColors[key] + '22'
                                }}
                            >
                                <Avatar
                                    sx={{ bgcolor: statusColors[key], mr: 2 }}
                                >
                                    {statusIcons[key]}
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant='subtitle1'
                                        sx={{
                                            color: statusColors[key],
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                    <Typography
                                        variant='h6'
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {stats[key] || 0}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Bộ lọc trạng thái */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl size='small' sx={{ minWidth: 200 }}>
                    <InputLabel>Lọc theo trạng thái</InputLabel>
                    <Select
                        label='Lọc theo trạng thái'
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <MenuItem value='all'>Tất cả</MenuItem>
                        {Object.entries(orderStatusMap).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Bảng đơn hàng */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Khách/SĐT</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => {
                            console.log('order.status:', order.status);
                            return (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        {order.phone ||
                                            order.user_id ||
                                            order.session_id}
                                    </TableCell>
                                    <TableCell>{order.address}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    bgcolor:
                                                        statusColors[
                                                            order.status
                                                        ]
                                                }}
                                            >
                                                {statusIcons[order.status]}
                                            </Avatar>
                                            <span>
                                                {orderStatusMap[order.status]}
                                            </span>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {order.total.toLocaleString()}đ
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() =>
                                                handleDetail(order.id)
                                            }
                                        >
                                            Chi tiết
                                        </Button>
                                        <Button
                                            onClick={() => handleUpdate(order)}
                                        >
                                            Cập nhật
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {/* Phân trang */}
                <Pagination
                    count={Math.ceil(totalOrders / 5)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    sx={{ m: 2 }}
                />
            </TableContainer>

            {/* Dialog chi tiết */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth='md'
                fullWidth
            >
                <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <div>
                            <div>
                                <b>ID:</b> {selectedOrder.id}
                            </div>
                            <div>
                                <b>Trạng thái:</b>{' '}
                                {orderStatusMap[selectedOrder.status]}
                            </div>
                            <div>
                                <b>Địa chỉ:</b> {selectedOrder.address}
                            </div>
                            <div>
                                <b>Điện thoại:</b> {selectedOrder.phone}
                            </div>
                            <div>
                                <b>Ghi chú:</b> {selectedOrder.note}
                            </div>
                            <div>
                                <b>Chi tiết sản phẩm:</b>
                                <ul>
                                    {selectedOrder.order_details?.map(
                                        (item) => (
                                            <li key={item.id}>
                                                <b>
                                                    {item.product_detail?.name}
                                                </b>{' '}
                                                - SL: {item.quantity} - Giá:{' '}
                                                {item.price.toLocaleString()}đ
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailDialogOpen(false)}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog cập nhật trạng thái */}
            <Dialog
                open={updateDialogOpen}
                onClose={() => setUpdateDialogOpen(false)}
            >
                <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                <DialogContent>
                    <Select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        fullWidth
                    >
                        {Object.entries(orderStatusMap).map(([key, label]) => (
                            <MenuItem key={key} value={Number(key)}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleUpdateStatus} variant='contained'>
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
