import React from "react";
import { useState } from "react";
import axios from "axios";
import { ProgressLabel, Spinner } from "@chakra-ui/react";


function Home() {
  const [file, setFile] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [initialSize, setInitialSize] = useState('')
  const [finalSize, setFinalSize] = useState('')
  const [timeElapsed, setTimeElapsed] = useState('')
  const [loading, setLoading] = useState('');
  // when user uploads a file this event is triggered
  
 
  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank"); 
    } else {
      console.log("No download URL");
    }
  };


  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile); 
    } else {
      console.log("Please upload a PDF file.");
    }
  }

  const startCompress = async (event) => {
    event.preventDefault()
    console.log("button clicked")
    setLoading(true)
    const response = await fetch("http://localhost:5125/upload"); //default is get. Getting the preassigned url
    const { url, key } = await response.json(); //storing the  preassigned url and the key 
    const uploadResponse = await fetch(url, {  
      method: "PUT", // this url endpoint is attached to the code where the aws account is linked to upload the file in S3 on put command
      headers: {
        "Type": "application/pdf" ,
      },
      body: file, // attached file is the body
    });

    const poll = setInterval(async () => {
      const res = await axios.post('http://localhost:5125/check', {name: key})
      console.log(res)
      if (res.data.completed) {
        setLoading(false)
        setDownloadUrl(res.data.url)
        setInitialSize(res.data.initialSize)
        setFinalSize(res.data.finalSize)
        setTimeElapsed(res.data.elapsed)
        clearInterval(poll)
      }

    }, 5000)
  }

  return (
    <div class = "compressor"> 
      <h1>PDF Compressor</h1>
      <form id="pdfForm">
        <input type="file" id="pdfInput" accept="application/pdf" onChange={handleChange}/>
        <button type="submit" onClick={startCompress}>Compress PDF</button>
      </form>
      {loading ? < Spinner size="md"/> : null }
      {downloadUrl ? (
        <><button onClick={handleDownload}>Download PDF</button><ul>
          <li>Initial size: {initialSize}</li>
          <li> Size after compressing: {finalSize}</li>
          <li>time elapsed : {timeElapsed} </li>
        </ul></>
      ): null}
    </div>
  );
}

export default Home;




