import React from 'react';

interface File {
    key: string;
    size: number;
    uploaded: string;
    download?: string;
}

interface FileTableProps {
    files: File[];
}

interface Column {
    key: keyof File | 'download';
    label: string;
    render?: (value: any, file: File) => string | React.ReactElement;
}

const columns: Column[] = [
    {
        key: 'key',
        label: 'File Name',
        render: (_, file: File) => (
            <a 
                href={`/download?file=${file.key}`}
                className="text-blue-500 hover:text-blue-700"
            >
                {file.key.split('/').pop()}
            </a>
        )
    },
    {
        key: 'size',
        label: 'Size',
        render: (value: number) => `${(value / 1024).toFixed(2)} KB`
    },
    {
        key: 'uploaded',
        label: 'Uploaded',
        render: (value: string) => new Date(value).toLocaleString()
    }
];

export const FileTable: React.FC<FileTableProps> = ({ files }) => {


    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-xl font-semibold text-gray-800 mb-6">JumpServer Offline Installation Packages</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th 
                                        key={column.key} 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {files.map((file) => (
                                <tr key={file.key} className="hover:bg-gray-50">
                                    {columns.map((column) => (
                                        <td 
                                            key={column.key} 
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {column.render 
                                                ? column.render(file[column.key], file) 
                                                : file[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}; 