import CartService from "@services/cart.service.js";

export const triggerCartRefresh = () => {
  const event = new CustomEvent("refreshCartCount");
  window.dispatchEvent(event);
};
//  HELPER FUNCTION ĐỂ THÊM VÀO GIỎ HÀNG VÀ REFRESH
export const addToCartAndRefresh = async (
  cartId,
  productDetailId,
  quantity = 1,
  productName = "",
) => {
  try {
    await CartService.addToCart(cartId, productDetailId, quantity);

    // Trigger refresh cart count
    triggerCartRefresh();

    return {
      success: true,
      message: ` Đã thêm "${productName}" vào giỏ hàng!`,
    };
  } catch (error) {
    console.error(" Error adding to cart:", error);
    return {
      success: false,
      message: ` Lỗi khi thêm "${productName}" vào giỏ hàng!`,
    };
  }
};
