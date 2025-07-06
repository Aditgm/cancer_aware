import React, { useState, useRef } from "react";
import Modal from "./Modal";
import { IconProgress, IconFile, IconX, IconUpload } from "@tabler/icons-react";

const FileUploadModal = ({
  isOpen,
  onClose,
  onFileChange,
  onFileUpload,
  uploading,
  uploadSuccess,
  filename,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const errors = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

    if (file.size > maxSize) {
      errors.push(`${file.name} is too large. Maximum size is 5MB.`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name} is not a supported file type. Please upload PNG, PDF, JPEG, or WEBP files.`);
    }

    return errors;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    setErrors([]);
    const newErrors = [];
    const validFiles = [];

    files.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        newErrors.push(...fileErrors);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    
    // For now, we'll upload the first file (can be enhanced for multiple files)
    const file = selectedFiles[0];
    const event = { target: { files: [file] } };
    onFileChange(event);
    onFileUpload();
  };

  const resetModal = () => {
    setSelectedFiles([]);
    setErrors([]);
    setDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Modal
      title="Upload Medical Reports"
      isOpen={isOpen}
      onClose={handleClose}
      onAction={handleUpload}
      actionLabel={uploading ? "Uploading..." : "Upload and Analyze"}
      actionDisabled={selectedFiles.length === 0 || uploading}
    >
      <div className="space-y-4">
        {/* Drag and Drop Area */}
        <div
          className={`relative flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors ${
            dragActive
              ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
              : "border-slate-300 dark:border-slate-700"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <IconUpload
            size={48}
            className={`transition-colors ${
              dragActive ? "text-blue-500" : "text-slate-400"
            }`}
          />
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Drop your files here or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              PNG, PDF, JPEG, WEBP - Max 5MB per file
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            multiple
            accept=".png,.pdf,.jpeg,.jpg,.webp"
            onChange={handleFileInput}
          />
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <div className="text-sm text-red-700 dark:text-red-400">
              {errors.map((error, index) => (
                <div key={index} className="flex items-center gap-2">
                  <IconX size={16} />
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <IconFile size={20} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <IconX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <IconProgress size={20} className="animate-spin text-blue-500" />
            <div className="text-sm text-blue-700 dark:text-blue-400">
              Uploading and analyzing your medical report...
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
            <div className="text-sm text-green-700 dark:text-green-400">
              ✓ File uploaded and analyzed successfully!
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FileUploadModal;
