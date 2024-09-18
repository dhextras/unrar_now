"use client";

import React, { useState, useCallback, useRef } from "react";
import { createExtractorFromData, UnrarError, ArcFile } from "node-unrar-js";

export default function Home() {
  const [files, setFiles] = useState<ArcFile<Uint8Array>[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readRarFile = useCallback(async (file: File): Promise<ArrayBuffer> => {
    return new Promise<ArrayBuffer>((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        resolve(event.target?.result as ArrayBuffer);
      });
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      setFiles([]);
      setLoading(true);
      try {
        const data = await readRarFile(file);
        const wasmBinary = await (
          await fetch("/_next/static/chunks/unrar.wasm", {
            credentials: "same-origin",
          })
        ).arrayBuffer();
        const extractor = await createExtractorFromData({ wasmBinary, data });
        const { files } = extractor.extract({
          files: (fileHeader) => !fileHeader.flags.encrypted,
        });
        const fileArray = Array.from(files).filter(
          (file: ArcFile<Uint8Array>) => !file.fileHeader.flags.directory,
        );
        setFiles(fileArray);
      } catch (err) {
        if (err instanceof UnrarError) {
          alert(
            `Unrar exception: Reason[${err.reason}], Message: [${err.message}]`,
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [readRarFile],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event.dataTransfer.files[0];
      if (file && file.name.endsWith(".rar")) {
        handleFile(file);
      } else {
        alert("Please drop a valid .rar file.");
      }
    },
    [handleFile],
  );

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const downloadAll = useCallback(() => {
    files.forEach((file) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([file.extraction || ""], { type: "application/octet-stream" }),
      );
      link.download = file.fileHeader.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }, [files]);

  return (
    <div className="bg-white text-gray-900 max-w-[768px] w-auto mx-auto mt-12">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md">
            <p className="text-lg font-semibold">Extracting...</p>
            <span className="loader"></span>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold">RAR File Extractor Online</h1>
      <p className="text-sm mt-4">
        Easily extract RAR files with our free and secure Unrar Now tool—no
        software installation needed. Compatible with Windows, Mac, Android, and
        IOS. More over it is Blazzzzingly fast.
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Upload file</h2>
        <p className="text-sm mt-2">
          To access the files from your .rar archive, simply use the form below
          to extract its contents.
        </p>
        <div
          className="mt-4 border-2 border-dashed border-gray-300 bg-gray-100 rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".rar"
            id="file-input"
            ref={fileInputRef}
          />
          <div className="text-4xl mb-4">⬆️</div>
          <p className="font-medium text-lg">Click to upload or drag & drop</p>
          <p className="text-sm text-gray-500 mt-2">No maximum file size</p>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 bg-black text-white rounded-md hover:opacity-70 transition duration-300"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            {loading ? "Processing..." : "Click to upload RAR file"}
          </button>
        </div>
      </section>

      {files.length > 0 && (
        <section className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Extracted Files</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              onClick={downloadAll}
            >
              Download All
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-100 rounded"
              >
                <span className="flex-grow">{file.fileHeader.name}</span>
                <span className="text-sm text-gray-500 mr-4">
                  {formatFileSize(file.extraction?.byteLength || 0)}
                </span>
                <a
                  href={URL.createObjectURL(
                    new Blob([file.extraction || ""], {
                      type: "application/octet-stream",
                    }),
                  )}
                  download={file.fileHeader.name}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Features</h2>
        <div className="mt-4 space-y-4">
          <div className="border border-gray-300 bg-gray-100 rounded-md p-4">
            <h3 className="text-xl font-semibold">🆓 Free</h3>
            <p className="text-sm mt-2">
              We offer a fully free online service, with no hidden costs or fees
              associated with the web app.
            </p>
          </div>
          <div className="border border-gray-300 bg-gray-100 rounded-md p-4">
            <h3 className="text-xl font-semibold">🗂️ Multiple RAR Formats</h3>
            <p className="text-sm mt-2">
              We ensure compatibility with various RAR formats, supporting files
              compressed by different algorithms.
            </p>
          </div>
          <div className="border border-gray-300 bg-gray-100 rounded-md p-4">
            <h3 className="text-xl font-semibold">
              📱 Cross-Platform Compatibility
            </h3>
            <p className="text-sm mt-2">
              Access our platform and unarchive RAR files on any
              internet-connected device, including Mac, Windows, Linux, iPhone,
              or Android.
            </p>
          </div>
          <div className="border border-gray-300 bg-gray-100 rounded-md p-4">
            <h3 className="text-xl font-semibold">💡 Easy and Convenient</h3>
            <p className="text-sm mt-2">
              Our online service offers a convenient, software-free solution for
              extracting RAR files.
            </p>
          </div>
          <div className="border border-gray-300 bg-gray-100 rounded-md p-4">
            <h3 className="text-xl font-semibold">🔒 Secure and Private</h3>
            <p className="text-sm mt-2">
              Your privacy and security are our top priorities. All RAR file
              extraction processes are carried out through a secure connection
              to ensure the safety of your files and personal information.
            </p>
          </div>
          <div className="border border-gray-300 bg-gray-100 rounded-md p-4">
            <h3 className="text-xl font-semibold">👁️ File Preview</h3>
            <p className="text-sm mt-2">
              We provide a preview feature that allows you to inspect the
              contents of a RAR file before extracting, enabling you to select
              the files you want to extract.
            </p>
          </div>
          {/* Add more feature sections */}
        </div>
      </section>

      <section className="mt-8 mb-8">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <ul className="mt-4 space-y-4">
          <li className="border border-gray-300 bg-gray-100 rounded-md p-4">
            <div className="font-semibold">What is a RAR file?</div>
            <p className="text-sm mt-2">
              A RAR file is a compressed archive format used to store one or
              more files in a compressed state. RAR stands for &apos;Roshal
              Archive,&apos; named after its creator, Eugene Roshal. It is a
              proprietary format commonly associated with the WinRAR software,
              which is widely used to create and extract RAR files.
            </p>
          </li>
          <li className="border border-gray-300 bg-gray-100 rounded-md p-4">
            <div className="font-semibold">How to unzip a RAR file?</div>
            <p className="text-sm mt-2">
              The easiest way to extract RAR files is to use our website.
              It&apos;s free, simple, and secure—no software download or
              purchase required.
            </p>
          </li>
          <li className="border border-gray-300 bg-gray-100 rounded-md p-4">
            <div className="font-semibold">Do you store my RAR file?</div>
            <p className="text-sm mt-2">
              No, we do not store your RAR files or their extracted contents.
            </p>
          </li>
          {/* Add more FAQ items */}
        </ul>
      </section>
    </div>
  );
}
