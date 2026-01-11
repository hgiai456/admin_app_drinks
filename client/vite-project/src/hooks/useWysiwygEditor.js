import { useState, useCallback } from "react";

/**
 * Custom hook để quản lý WYSIWYG Editor state
 * @param {string} initialContent - Nội dung khởi tạo
 * @returns {object} - Editor state và methods
 */
export function useWysiwygEditor(initialContent = "") {
  const [content, setContent] = useState(initialContent);

  // Handle content change
  const handleChange = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  // Set content programmatically
  const setEditorContent = useCallback((newContent) => {
    setContent(newContent || "");
  }, []);

  // Reset content
  const reset = useCallback(() => {
    setContent("");
  }, []);

  // Check if empty (remove HTML tags and check)
  const isEmpty = useCallback(() => {
    if (!content) return true;
    const stripped = content.replace(/<[^>]*>/g, "").trim();
    return stripped.length === 0;
  }, [content]);

  // Get text length (without HTML tags)
  const getTextLength = useCallback(() => {
    if (!content) return 0;
    const stripped = content.replace(/<[^>]*>/g, "");
    return stripped.length;
  }, [content]);

  // Get plain text (without HTML)
  const getPlainText = useCallback(() => {
    if (!content) return "";
    return content.replace(/<[^>]*>/g, "").trim();
  }, [content]);

  return {
    content,
    handleChange,
    setContent: setEditorContent,
    reset,
    isEmpty,
    getTextLength,
    getPlainText,
  };
}

// Default export (optional, for backward compatibility)
export default useWysiwygEditor;
