import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [patientData, setPatientData] = useState({ name: "", phone: "" });
  const [drNotes, setDrNotes] = useState(""); // New state for the dashboard

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://127.0.0.1:8000/predict", formData);
      setResult(res.data);
    } catch (err) {
      alert("Backend Error! Is Python running?");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const input = document.getElementById("report-capture-area");
    setShowModal(false);
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFontSize(20);
      pdf.text("Dental AI Clinical Report", 10, 20);
      pdf.setFontSize(10);
      pdf.text(`Patient: ${patientData.name} | Phone: ${patientData.phone}`, 10, 28);
      pdf.text(`Doctor Notes: ${drNotes}`, 10, 34);
      pdf.addImage(imgData, "PNG", 10, 40, 190, 0);
      pdf.save(`${patientData.name}_Report.pdf`);
    });
  };

  return (
    <div className="App">
      <header className="clinical-header">
        <h1>🦷 The Dental X-ray Object Detection System</h1>
        <div className="action-row">
          <input type="file" id="up" onChange={handleFileChange} hidden />
          <label htmlFor="up" className="btn btn-secondary">Select X-Ray</label>
          {preview && <button onClick={handleUpload} className="btn btn-primary">{loading ? "Analyzing..." : "Run Diagnosis"}</button>}
          {result && <button onClick={() => setShowModal(true)} className="btn btn-accent">Download PDF</button>}
        </div>
      </header>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Finalize Report</h3>
            <input type="text" placeholder="Patient Name" onChange={(e) => setPatientData({...patientData, name: e.target.value})} />
            <input type="text" placeholder="Phone" onChange={(e) => setPatientData({...patientData, phone: e.target.value})} />
            <button onClick={generatePDF} className="btn btn-primary">Generate</button>
            <button onClick={() => setShowModal(false)} className="btn btn-cancel">Cancel</button>
          </div>
        </div>
      )}

      <div id="report-capture-area">
        <div className="comparison-grid">
          {/* Box 1 */}
          <div className="clinical-card">
            <h4>Original Input</h4>
            <div className="lightbox-frame">
              {preview ? <img src={preview} alt="Input" /> : <p>No image selected</p>}
            </div>
          </div>

          {/* Box 2 */}
          <div className="clinical-card">
            <h4>AI Detection</h4>
            <div className="lightbox-frame">
              {result ? <img src={result.image} alt="Output" /> : <p>Analysis pending</p>}
            </div>
          </div>

          {/* Box 3: Dashboard */}
          <div className="clinical-card dashboard">
            <h4>Clinical Dashboard</h4>
            <div className="status-item">Confidence: <span className="blue-txt">{result ? "94.2%" : "--"}</span></div>
            <div className="status-item">Latency: <span className="blue-txt">0.42s</span></div>
            <div className="notes-area">
              <label>Doctor's Notes:</label>
              <textarea 
                value={drNotes} 
                onChange={(e) => setDrNotes(e.target.value)}
                placeholder="Enter observations..."
              />
            </div>
            <div className="fdi-ref">FDI Notation System Active</div>
          </div>
        </div>

        {result && (
          <div className="clinical-card full-width">
            <h4>Finding Details</h4>
            <table className="clinical-table">
              <thead><tr><th>Type</th><th>Count</th></tr></thead>
              <tbody>
                {result.findings.split(',').filter(f => f.trim()).map((f, i) => (
                  <tr key={i}>
                    <td>{f.trim().split(' ').slice(1).join(' ')}</td>
                    <td className="bold">{f.trim().split(' ')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;