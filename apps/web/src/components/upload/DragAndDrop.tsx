import { useState, useRef } from 'react';

interface UploadedFile {
	file: File;
	id: string;
	name: string;
	size: number;
	type: string;
}

interface DragAndDropProps {
	onDrop: (files: UploadedFile[]) => void;
}

export const DragAndDrop = ({ onDrop }: DragAndDropProps) => {
	const [isDragOver, setIsDragOver] = useState<boolean>(false);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);
		const files = e.dataTransfer.files;
		processFiles(files);
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			processFiles(files);
		}
	};

	const processFiles = (files: FileList) => {
		if (files && files.length > 0) {
			const newFiles = Array.from(files).map(file => ({
				file,
				id: Math.random().toString(36).substring(2, 15),
				name: file.name,
				size: file.size,
				type: file.type,
			}));

			const updatedFiles = [...uploadedFiles, ...newFiles];
			setUploadedFiles(updatedFiles);

			if (onDrop) {
				onDrop(updatedFiles);
			}
		}
	};

	const handleFileClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemoveFile = (id: string) => {
		const updatedFiles = uploadedFiles.filter(file => file.id !== id);
		setUploadedFiles(updatedFiles);

		if (onDrop) {
			onDrop(updatedFiles);
		}
	};

	return (
		<div className="w-full">
			<div
				className={`drop-zone border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-4 transition-colors ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={handleFileClick}
			>
				<input type="file" className="hidden" onChange={handleFileInputChange} ref={fileInputRef} multiple />
				<div className="flex flex-col items-center">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
					</svg>
					<p className="text-sm text-gray-500">
						<span className="font-semibold">클릭</span>하여 파일을 선택하거나,
						<span className="font-semibold"> 드래그 앤 드롭</span>으로 파일을 추가하세요
					</p>
					<p className="text-xs text-gray-400 mt-1">최대 10MB 크기의 DOCX 파일을 지원합니다</p>
				</div>
			</div>

			{uploadedFiles.length > 0 && (
				<div className="thumbnails">
					<h3 className="text-sm font-semibold mb-2">업로드된 파일</h3>
					<div className="space-y-2">
						{uploadedFiles.map(file => (
							<div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
								<div className="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<div className="text-sm truncate max-w-xs">{file.name}</div>
								</div>
								<button
									onClick={e => {
										e.stopPropagation();
										handleRemoveFile(file.id);
									}}
									className="text-red-500 hover:text-red-700"
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
