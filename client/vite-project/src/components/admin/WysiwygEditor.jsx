import { useRef, useMemo, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@styles/components/_wysiwyg-editor.scss";
import Button from "@components/common/Button.jsx";
import { Image, Bold, Italic, List, Link2, AlignLeft } from "lucide-react";
import ImagePicker from "./ImagePicker";

/**
 * 🔥 WRAPPER để bypass StrictMode warnings
 */
function StrictModeBypass({ children }) {
  return children;
}

/**
 * WYSIWYG Editor Component với ImagePicker integration
 */
function WysiwygEditor({
  value = "",
  onChange,
  placeholder = "Nhập nội dung...",
  minHeight = 300,
  disabled = false,
}) {
  const quillRef = useRef(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 🔥 FIX: Đợi component mounted xong mới render ReactQuill
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ===== CUSTOM TOOLBAR =====
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["blockquote", "code-block"],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
    "blockquote",
    "code-block",
  ];

  // ===== HANDLERS =====
  const handleChange = (content, delta, source, editor) => {
    if (onChange) {
      onChange(content);
    }
    const text = editor.getText();
    setCharCount(text.length);
  };

  const handleImageClick = () => {
    setShowImagePicker(true);
  };

  const handleImageSelect = (imagePath) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      // 🔥 FIX: Kiểm tra editor có focus và selection hợp lệ
      try {
        const range = editor.getSelection(true);
        if (range) {
          editor.insertEmbed(range.index, "image", imagePath);
          editor.setSelection(range.index + 1);
        } else {
          // Nếu không có selection, insert ở cuối
          const length = editor.getLength();
          editor.insertEmbed(length - 1, "image", imagePath);
        }
      } catch (error) {
        console.error("Error inserting image:", error);
        // Fallback: insert ở cuối document
        const length = editor.getLength();
        editor.insertEmbed(length - 1, "image", imagePath);
      }
    }
    setShowImagePicker(false);
  };

  const applyFormat = (format, value) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      // 🔥 FIX: Kiểm tra selection trước khi format
      try {
        const range = editor.getSelection(true);
        if (range) {
          editor.format(format, value);
        }
      } catch (error) {
        console.error("Error applying format:", error);
      }
    }
  };

  // 🔥 FIX: Không render ReactQuill cho đến khi component mounted
  if (!mounted) {
    return (
      <div className="wysiwyg-editor-wrapper">
        <div className="loading-editor">🔄 Đang tải editor...</div>
      </div>
    );
  }

  return (
    <div className="wysiwyg-editor-wrapper">
      {/* QUICK TOOLBAR */}
      <div className="quick-toolbar">
        <Button
          type="button"
          variant="outline-primary"
          size="sm"
          icon={<Bold size={16} />}
          onClick={() => applyFormat("bold", true)}
          title="In đậm (Ctrl+B)"
        />
        <Button
          type="button"
          variant="outline-primary"
          size="sm"
          icon={<Italic size={16} />}
          onClick={() => applyFormat("italic", true)}
          title="In nghiêng (Ctrl+I)"
        />
        <Button
          type="button"
          variant="outline-primary"
          size="sm"
          icon={<List size={16} />}
          onClick={() => applyFormat("list", "bullet")}
          title="Danh sách"
        />
        <Button
          type="button"
          variant="outline-primary"
          size="sm"
          icon={<Link2 size={16} />}
          onClick={() => {
            const url = prompt("Nhập URL:");
            if (url) applyFormat("link", url);
          }}
          title="Chèn link"
        />
        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={<Image size={16} />}
          onClick={handleImageClick}
          title="Chèn ảnh"
        />
        <Button
          type="button"
          variant="outline-primary"
          size="sm"
          icon={<AlignLeft size={16} />}
          onClick={() => applyFormat("align", "left")}
          title="Căn trái"
        />

        <div className="char-counter">
          {charCount} ký tự
          {charCount > 5000 && (
            <span className="warning"> (Vượt quá 5000 ký tự)</span>
          )}
        </div>
      </div>

      {/* EDITOR - 🔥 WRAP với StrictModeBypass */}
      <StrictModeBypass>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={disabled}
          style={{ minHeight: `${minHeight}px` }}
          preserveWhitespace
        />
      </StrictModeBypass>

      {/* IMAGE PICKER MODAL */}
      <ImagePicker
        show={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
}

export default WysiwygEditor;
