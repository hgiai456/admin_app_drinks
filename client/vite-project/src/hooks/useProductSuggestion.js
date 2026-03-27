import { useEffect, useState, useRef } from "react";
import ProductService from "@services/product.service";

function useProductSuggestion(query) {
  const [suggestions, setSuggestions] = useState([]); //lưu những sản phẩm đề xuất
  const [loadingSearch, setLoadingSearch] = useState(false); //trạng thái đang tải

  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const keyword = query.trim();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }

    if (keyword.length < 2) {
      setSuggestions([]);
      setLoadingSearch(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoadingSearch(true);
        const controller = new AbortController();
        abortRef.current = controller;

        const items = await ProductService.getAll(
          keyword,
          8,
          controller.signal,
        );
        setSuggestions(items);
        console.log("🔍 Raw suggestions from API:", items);
        console.log(
          "📊 Suggestions structure:",
          items.map((item) => ({
            id: item.id,
            name: item.name,
            hasPrice: !!item.price,
            priceValue: item.price,
            hasProductDetails: !!item.product_details,
            productDetailsPrice: item.product_details?.[0]?.price,
            fullObject: item,
          })),
        );
      } catch (error) {
        if (error.name !== "AbortError") setSuggestions([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);
    console.log("Query changed:", query);
    console.log("Suggestions products:", suggestions);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return { suggestions, loadingSearch };
}

export default useProductSuggestion;
