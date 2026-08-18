import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  ArrowRight,
  RefreshCw,
  Info,
  Layers,
  FileCheck,
} from 'lucide-react';
import { useOptimizationStore } from '../../store/useOptimizationStore';
import {
  parseAndValidateCSV,
  downloadSampleCSV,
  CSVParseResult,
  sampleCSVContent,
} from '../../utils/csvParser';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { setDeliveries, setStep } = useOptimizationStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(() =>
    parseAndValidateCSV(sampleCSVContent)
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Invalid file format. Please upload a valid CSV file.');
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setTimeout(() => {
        const result = parseAndValidateCSV(content);
        setParseResult(result);
        setIsProcessing(false);
      }, 400); // Simulate smooth parsing transition
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setParseResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadDemoDataset = () => {
    setSelectedFile(new File([sampleCSVContent], 'sample_chicago_deliveries.csv', { type: 'text/csv' }));
    setIsProcessing(true);
    setTimeout(() => {
      setParseResult(parseAndValidateCSV(sampleCSVContent));
      setIsProcessing(false);
    }, 300);
  };

  const handleContinue = () => {
    if (parseResult && parseResult.validCount > 0 && parseResult.errors.length === 0) {
      setDeliveries(parseResult.deliveries);
      setStep(2);
      navigate('/configure');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isValidForContinue =
    parseResult &&
    parseResult.validCount > 0 &&
    parseResult.errors.length === 0 &&
    !parseResult.headerError;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          Step 1 of 4 — Data Ingestion
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Upload Delivery CSV Data</h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Upload a structured CSV file containing customer delivery addresses and order demand quantities for vehicle routing.
        </p>
      </div>

      {/* Upload Zone & Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drag and Drop Zone (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".csv"
            className="hidden"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-slate-900/90 border-2 border-dashed rounded-2xl p-8 lg:p-10 text-center space-y-4 transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Drag & Drop CSV file here
              </h3>
              <p className="text-xs text-slate-400">
                Supports standard <code className="text-blue-400 font-mono">.csv</code> format up to 5MB (Max 500 rows)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
              >
                Choose CSV File
              </button>
              <button
                type="button"
                onClick={downloadSampleCSV}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
            </div>
          </div>

          {/* Active File Banner */}
          {selectedFile && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedFile.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    Size: {formatFileSize(selectedFile.size)} • Type: CSV
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearFile}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Requirements & Demo Data Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span>CSV Schema Requirements</span>
          </h3>

          <div className="space-y-2 text-xs text-slate-400">
            <p>Your file must contain a header row with these exact column names:</p>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-blue-400 font-bold">delivery_id</span>
                <span className="text-slate-500">(Unique string)</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-blue-400 font-bold">address</span>
                <span className="text-slate-500">(Full text address)</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-blue-400 font-bold">demand</span>
                <span className="text-slate-500">(Positive integer &gt; 0)</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 block">Need quick test data?</span>
            <button
              onClick={handleLoadDemoDataset}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load 25-Delivery Demo Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Parsing Loading State */}
      {isProcessing && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-3 animate-pulse">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-200">Validating & Parsing CSV File...</p>
          <p className="text-xs text-slate-500">Checking headers, duplicate IDs, and demand values.</p>
        </div>
      )}

      {/* Validation Results & Preview Section */}
      {parseResult && !isProcessing && (
        <div className="space-y-6">
          {/* Validation Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              title="Total Records"
              value={parseResult.validCount + parseResult.invalidCount}
              subtitle="Parsed Rows"
              icon={FileSpreadsheet}
              iconColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
            />
            <StatCard
              title="Valid Rows"
              value={parseResult.validCount}
              subtitle="Ready for Routing"
              icon={CheckCircle2}
              badgeText="Passed"
              iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            />
            <StatCard
              title="Invalid Rows"
              value={parseResult.invalidCount}
              subtitle="Validation Errors"
              icon={XCircle}
              badgeText={parseResult.invalidCount > 0 ? 'Requires Fix' : 'Clean'}
              iconColor={parseResult.invalidCount > 0 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-slate-400 bg-slate-800 border-slate-700'}
            />
            <StatCard
              title="Total Demand"
              value={`${parseResult.totalDemand} units`}
              subtitle="Total Cargo Load"
              icon={Layers}
              iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
            />
          </div>

          {/* Header Error Banner */}
          {parseResult.headerError && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-3 text-rose-300 text-xs">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-200">CSV Header Error</h4>
                <p className="mt-1 leading-relaxed">{parseResult.headerError}</p>
              </div>
            </div>
          )}

          {/* Row Validation Errors Panel */}
          {parseResult.errors.length > 0 && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Validation Errors Found ({parseResult.errors.length})</span>
                </span>
                <span className="text-[11px] text-slate-500">Fix CSV file and re-upload to proceed</span>
              </div>

              <div className="max-h-48 overflow-y-auto divide-y divide-slate-800 text-xs">
                {parseResult.errors.map((err, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-slate-300">
                    <span className="font-mono text-slate-400">Row #{err.rowNumber} ({err.deliveryId || 'N/A'})</span>
                    <span className="text-rose-400 font-medium">{err.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Preview Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white tracking-tight">Delivery Data Preview</h2>
              </div>
              <span className="text-xs text-slate-400">
                Showing {parseResult.deliveries.length} validated delivery locations
              </span>
            </div>

            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Delivery ID</th>
                    <th className="p-3">Address</th>
                    <th className="p-3 text-right">Demand (Units)</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {parseResult.deliveries.map((d, index) => (
                    <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono text-slate-500">{index + 1}</td>
                      <td className="p-3 font-mono font-bold text-blue-400">{d.delivery_id}</td>
                      <td className="p-3 text-slate-200">{d.address}</td>
                      <td className="p-3 text-right font-mono font-semibold text-slate-100">{d.demand}</td>
                      <td className="p-3 text-center">
                        <Badge status="Ready" variant="emerald" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info className="w-4 h-4 text-slate-500" />
          <span>Geocoding and distance matrices will be computed in Step 2.</span>
        </div>

        <button
          onClick={handleContinue}
          disabled={!isValidForContinue}
          className={`flex items-center gap-2 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all ${
            isValidForContinue
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:scale-105 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Continue to Configuration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
