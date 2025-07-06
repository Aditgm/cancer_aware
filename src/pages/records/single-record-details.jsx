import React, { useState } from "react";
import {
  IconChevronRight,
  IconFileUpload,
  IconProgress,
  IconX,
  IconFile,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/index";
import ReactMarkdown from "react-markdown";
import FileUploadModal from "./components/file-upload-modal";
import RecordDetailsHeader from "./components/record-details-header";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

function SingleRecordDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [processing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(
    state.analysisResult || "",
  );
  const [filename, setFilename] = useState("");
  const [filetype, setFileType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState(state.files || []);
  const [analysisData, setAnalysisData] = useState(state.analysisData || null);
  const [analyzing, setAnalyzing] = useState(false);

  const { updateRecord } = useStateContext();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUploadSuccess(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    setFileType(file.type);
    setFilename(file.name);
    setFile(file);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const performAIAnalysis = async (file, fileMetadata) => {
    setAnalyzing(true);
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    try {
      const base64Data = await readFileAsBase64(file);
      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ];

      // Enhanced prompt for comprehensive medical analysis
      const analysisPrompt = `You are an expert medical AI analyst specializing in cancer diagnosis and treatment planning. Analyze the provided medical document/image and provide a comprehensive, structured analysis.

Please provide your analysis in the following JSON format (respond with ONLY the JSON, no additional text):

{
  "summary": "Brief overview of the medical findings",
  "diagnosis": {
    "primary": "Main diagnosis if identified",
    "secondary": "Secondary conditions if any",
    "confidence": "High/Medium/Low confidence level"
  },
  "riskFactors": ["List of identified risk factors"],
  "recommendations": {
    "immediate": ["Immediate actions needed"],
    "shortTerm": ["Short-term recommendations (1-3 months)"],
    "longTerm": ["Long-term recommendations (3+ months)"]
  },
  "treatmentOptions": {
    "conventional": ["Standard treatment options"],
    "alternative": ["Alternative/complementary options"],
    "lifestyle": ["Lifestyle modifications"]
  },
  "monitoring": {
    "frequency": "Recommended monitoring frequency",
    "tests": ["Specific tests to monitor"],
    "symptoms": ["Symptoms to watch for"]
  },
  "prognosis": {
    "outlook": "General prognosis outlook",
    "factors": ["Factors affecting prognosis"]
  },
  "detailedAnalysis": "Comprehensive written analysis in clear, patient-friendly language"
}

Focus on providing actionable, evidence-based recommendations while maintaining medical accuracy and patient safety.`;

      const result = await model.generateContent([analysisPrompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse the JSON response
      let parsedAnalysis;
      try {
        parsedAnalysis = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        // Fallback to treating it as plain text
        parsedAnalysis = {
          summary: "Analysis completed",
          detailedAnalysis: text,
          diagnosis: { primary: "Analysis provided", confidence: "Medium" },
          recommendations: { immediate: ["Review with healthcare provider"] },
          treatmentOptions: { conventional: ["Consult with medical professional"] },
          monitoring: { frequency: "As recommended by doctor", tests: ["Follow medical advice"] },
          prognosis: { outlook: "Consult healthcare provider for prognosis" }
        };
      }

      return parsedAnalysis;
    } catch (error) {
      console.error("Error in AI analysis:", error);
      throw error;
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadSuccess(false);

    try {
      // Create file metadata
      const fileMetadata = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      };

      // Perform AI analysis
      const analysis = await performAIAnalysis(file, fileMetadata);
      
      // Update the record with new file and analysis
      const updatedFiles = [...files, fileMetadata];
      const updatedRecord = await updateRecord({
        documentID: state.id,
        analysisResult: analysis.detailedAnalysis,
        analysisData: analysis,
        kanbanRecords: "",
        files: updatedFiles,
      });

      // Update local state
      setAnalysisResult(analysis.detailedAnalysis);
      setAnalysisData(analysis);
      setFiles(updatedFiles);
      setUploadSuccess(true);
      setIsModalOpen(false);
      setFilename("");
      setFile(null);
      setFileType("");
      
      console.log("File uploaded and analysis completed:", updatedRecord);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (fileId) => {
    try {
      const updatedFiles = files.filter(f => f.id !== fileId);
      await updateRecord({
        documentID: state.id,
        files: updatedFiles,
      });
      setFiles(updatedFiles);
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  const processTreatmentPlan = async () => {
    setIsProcessing(true);

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Your role and goal is to be an that will be using this treatment plan ${analysisResult} to create Columns:
                - Todo: Tasks that need to be started
                - Doing: Tasks that are in progress
                - Done: Tasks that are completed
          
                Each task should include a brief description. The tasks should be categorized appropriately based on the stage of the treatment process.
          
                Please provide the results in the following  format for easy front-end display no quotating or what so ever just pure the structure below:

                {
                  "columns": [
                    { "id": "todo", "title": "Todo" },
                    { "id": "doing", "title": "Work in progress" },
                    { "id": "done", "title": "Done" }
                  ],
                  "tasks": [
                    { "id": "1", "columnId": "todo", "content": "Example task 1" },
                    { "id": "2", "columnId": "todo", "content": "Example task 2" },
                    { "id": "3", "columnId": "doing", "content": "Example task 3" },
                    { "id": "4", "columnId": "doing", "content": "Example task 4" },
                    { "id": "5", "columnId": "done", "content": "Example task 5" }
                  ]
                }
                            
                `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsedResponse = JSON.parse(text);

    console.log(text);
    console.log(parsedResponse);
    const updatedRecord = await updateRecord({
      documentID: state.id,
      kanbanRecords: text,
    });
    console.log(updatedRecord);
    navigate("/screening-schedules", { state: parsedResponse });
    setIsProcessing(false);
  };

  const renderAnalysisSection = () => {
    if (!analysisData && !analysisResult) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            <IconFile size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No Analysis Available</p>
            <p className="text-sm">Upload a medical report to get AI-powered analysis</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {analysisData ? (
          <>
            {/* Summary Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Summary
              </h3>
              <p className="text-blue-800 dark:text-blue-200">{analysisData.summary}</p>
            </div>

            {/* Diagnosis Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#2a2a35] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Diagnosis
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Primary:</span>
                    <p className="text-gray-900 dark:text-white">{analysisData.diagnosis?.primary || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Confidence:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      analysisData.diagnosis?.confidence === 'High' ? 'bg-green-100 text-green-800' :
                      analysisData.diagnosis?.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analysisData.diagnosis?.confidence || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="bg-white dark:bg-[#2a2a35] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Risk Factors
                </h3>
                <ul className="space-y-1">
                  {analysisData.riskFactors?.map((factor, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      {factor}
                    </li>
                  )) || <li className="text-sm text-gray-500">No specific risk factors identified</li>}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-[#2a2a35] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recommendations
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Immediate Actions</h4>
                  <ul className="space-y-1">
                    {analysisData.recommendations?.immediate?.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">• {rec}</li>
                    )) || <li className="text-sm text-gray-500">Consult healthcare provider</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">Short Term (1-3 months)</h4>
                  <ul className="space-y-1">
                    {analysisData.recommendations?.shortTerm?.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">• {rec}</li>
                    )) || <li className="text-sm text-gray-500">Follow medical advice</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Long Term (3+ months)</h4>
                  <ul className="space-y-1">
                    {analysisData.recommendations?.longTerm?.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">• {rec}</li>
                    )) || <li className="text-sm text-gray-500">Maintain healthy lifestyle</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Treatment Options */}
            <div className="bg-white dark:bg-[#2a2a35] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Treatment Options
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Conventional</h4>
                  <ul className="space-y-1">
                    {analysisData.treatmentOptions?.conventional?.map((option, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">• {option}</li>
                    )) || <li className="text-sm text-gray-500">Standard medical treatments</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-600 dark:text-purple-400 mb-2">Alternative</h4>
                  <ul className="space-y-1">
                    {analysisData.treatmentOptions?.alternative?.map((option, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">• {option}</li>
                    )) || <li className="text-sm text-gray-500">Complementary therapies</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-teal-600 dark:text-teal-400 mb-2">Lifestyle</h4>
                  <ul className="space-y-1">
                    {analysisData.treatmentOptions?.lifestyle?.map((option, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">• {option}</li>
                    )) || <li className="text-sm text-gray-500">Lifestyle modifications</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Monitoring */}
            <div className="bg-white dark:bg-[#2a2a35] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Monitoring Plan
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{analysisData.monitoring?.frequency || "As recommended by doctor"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Tests to Monitor</h4>
                  <ul className="space-y-1">
                    {analysisData.monitoring?.tests?.map((test, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400">• {test}</li>
                    )) || <li className="text-sm text-gray-500">Follow medical advice</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white dark:bg-[#2a2a35] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Detailed Analysis
              </h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{analysisData.detailedAnalysis}</ReactMarkdown>
              </div>
            </div>
          </>
        ) : (
          // Fallback to old format
          <div className="bg-white dark:bg-[#2a2a35] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Analysis Result
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{analysisResult}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto mt-8 mb-6 rounded-xl bg-[#1c1c24] p-6 shadow-lg">
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold text-white">{state.recordName}</div>
          <div className="text-xs text-gray-400">
            Created: {state.createdAt ? new Date(state.createdAt).toLocaleString() : "Unknown"}
          </div>
          <div className="text-xs text-green-400 font-semibold">
            Files: {files.length}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-2">Files</h3>
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-[#2a2a35] hover:bg-[#3a3a45] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <IconFile size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{file.name}</div>
                      <div className="text-xs text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    title="Remove file"
                  >
                    <IconX size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 italic text-center py-4">No files uploaded yet.</div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-[26px]">
        <button
          type="button"
          onClick={handleOpenModal}
          className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
        >
          <IconFileUpload />
          Upload Reports
        </button>
        <FileUploadModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onFileChange={handleFileChange}
          onFileUpload={handleFileUpload}
          uploading={uploading}
          uploadSuccess={uploadSuccess}
          filename={filename}
        />
        <RecordDetailsHeader recordName={state.recordName} />
        
        {/* Enhanced Analysis Display */}
        <div className="w-full">
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="inline-block min-w-full p-1.5 align-middle">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#13131a]">
                  <div className="border-b border-gray-200 px-6 py-4 dark:border-neutral-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                      AI-Powered Medical Analysis
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Comprehensive analysis of your medical reports using advanced AI
                    </p>
                  </div>
                  <div className="px-6 py-4">
                    {analyzing ? (
                      <div className="flex items-center justify-center py-8">
                        <IconProgress size={24} className="animate-spin text-blue-500 mr-3" />
                        <span className="text-gray-600 dark:text-gray-400">Analyzing medical report...</span>
                      </div>
                    ) : (
                      renderAnalysisSection()
                    )}
                  </div>
                  {(analysisData || analysisResult) && (
                    <div className="border-t border-gray-200 px-6 py-4 dark:border-neutral-700">
                      <button
                        type="button"
                        onClick={processTreatmentPlan}
                        className="inline-flex items-center gap-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                      >
                        Create Treatment Plan
                        <IconChevronRight size={20} />
                        {processing && (
                          <IconProgress
                            size={16}
                            className="animate-spin"
                          />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleRecordDetails;
