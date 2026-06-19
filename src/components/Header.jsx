import { useState, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

export default function Header({ onToggle, searchText, onSearch, onSearchClick, onVoiceResult }) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const handleMicClick = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Aapka browser voice search support nahi karta");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN"; // Hindi ke liye "hi-IN" kar dena
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (onVoiceResult) {
                onVoiceResult(transcript); // parent ko direct value bhejo
            } else if (onSearch) {
                onSearch(transcript);
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    return (
        <header className="dashboard-header">
            <div className="header-left">
                <button className="menu-btn" onClick={onToggle}>☰</button>
                <h2>Notes</h2>
            </div>

            <div className="search-bar d-flex align-items-center gap-2">
                <input
                    type="text"
                    placeholder="Search notes"
                    value={searchText}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <button
                    type="button"
                    className={`btn ${isListening ? "btn-danger" : "btn-outline-secondary"}`}
                    onClick={handleMicClick}
                    title="Voice Search"
                >
                    {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
            </div>

            <button type="button" className="btn btn-success" onClick={onSearchClick}>Search Now</button>
        </header>
    );
}