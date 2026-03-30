import { useState, useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import './App.css'

function App() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const previewRef = useRef(null)

  const generatePDF = async () => {
    if (!previewRef.current) return
    const canvas = await html2canvas(previewRef.current)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save('certificate.pdf')
  }

  return (
    <div className="app">
      <h1>Certificate Generator</h1>
      <div className="form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button onClick={generatePDF} disabled={!firstName || !lastName}>
          Generate Certificate
        </button>
      </div>
      <div className="preview" ref={previewRef}>
        <div className="certificate">
          <h2>Congratulations!</h2>
          <p>This certificate is awarded to</p>
          <h3>{firstName} {lastName}</h3>
          <p>for outstanding achievement and dedication.</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default App
