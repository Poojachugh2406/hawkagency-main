
import { FileText, Lock, Upload } from "lucide-react";



// File Upload Component
const FileUpload: React.FC<{
  label: string;
  accept: string;
  value: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  disabled?:boolean;
}> = ({ label, accept, value, onChange, required = false , disabled}) => (
  <div className="space-y-2">
    <label className="flex items-center text-sm font-medium text-gray-700">
      <Upload className="w-4 h-4 mr-2 text-gray-500" />
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type="file"
        disabled ={disabled}
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${value
          ? "border-green-300 bg-green-50"
          : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
        }`}>
        <div className="flex flex-col items-center gap-2">
          {value ? (
            <>
              <FileText className="w-8 h-8 text-green-600" />
              <p className="text-sm font-medium text-green-700">{value.name}</p>
              <p className="text-xs text-green-600">File uploaded successfully</p>
            </>
          ) : (
            <>
            {disabled ? <Lock className="w-8 h-8 text-gray-600" /> : <Upload className="w-8 h-8 text-gray-400" />}
              
              <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default FileUpload;