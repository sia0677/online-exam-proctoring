import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ExamTaker() {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [warning, setWarning] = useState("");
  const [warningCount, setWarningCount] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState({ total: 0, correct: 0 });
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Load exam from localStorage
    const localExams = JSON.parse(localStorage.getItem("localExams") || "[]");
    const foundExam = localExams.find(e => e.id === examId || e._id === examId);
    
    if (foundExam) {
      setExam(foundExam);
      setTimeLeft(foundExam.durationMinutes * 60);
    } else {
      // Fallback dummy questions if not found (for testing without backend)
      setExam({
        title: "Sample Fallback Exam",
        questions: [
          { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "HighText Machine Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correctOption: 0 },
          { id: 2, question: "Which company developed React?", options: ["Google", "Facebook", "Microsoft", "Amazon"], correctOption: 1 },
        ]
      });
      setTimeLeft(10 * 60);
    }
  }, [examId]);

  // WEBCAM ACCESS
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setWarning("⚠ Camera access denied! Proctoring requires a webcam.");
      }
    };
    startWebcam();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // TIMER
  useEffect(() => {
    if (isSubmitted || !exam) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Time's up! Submitting exam automatically.");
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, exam, answers]); // Depend on answers so submitExam gets latest state

  // FULL SCREEN & TAB SWITCH DETECTION
  useEffect(() => {
    if (isSubmitted) return;

    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        handleViolation("⚠ Exited full screen mode!");
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        handleViolation("⚠ Tab switching detected!");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isSubmitted, warningCount, answers]);

  const handleViolation = (msg) => {
    setWarning(msg);
    const newCount = warningCount + 1;
    setWarningCount(newCount);
    
    if (newCount >= 3) {
      alert(`Violation limit reached (3/3). Your exam has been auto-submitted.`);
      submitExam();
    } else {
      alert(`${msg} Warning ${newCount}/3.`);
    }
  };

  // ENTER FULL SCREEN
  const startFullscreen = async () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    }
    setWarning("");
  };

  const handleOptionChange = (qid, optionIdx) => {
    if (isSubmitted) return;
    setAnswers({
      ...answers,
      [qid]: optionIdx,
    });
  };

  const submitExam = () => {
    if (isSubmitted) return;
    
    // Calculate Result
    let correct = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.correctOption) {
        correct += 1;
      }
    });

    setScore({ total: exam.questions.length, correct });
    setIsSubmitted(true);
    
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
    
    // Stop webcam
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!exam) return <div style={{ padding: '2rem', color: 'var(--text-main)' }}>Loading exam...</div>;

  // RESULTS SCREEN
  if (isSubmitted) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-color)", color: "var(--text-main)", display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "Arial" }}>
        <div style={{ background: "var(--sidebar-bg)", padding: "3rem", borderRadius: "15px", textAlign: "center", border: "1px solid var(--border-color)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
          <h1 style={{ color: "var(--primary)", marginBottom: "1rem" }}>Exam Completed</h1>
          <h2 style={{ marginBottom: "2rem" }}>{exam.title}</h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{score.total}</div>
              <div style={{ color: 'var(--text-muted)' }}>Total Questions</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{score.correct}</div>
              <div style={{ color: 'var(--text-muted)' }}>Correct Answers</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {Math.round((score.correct / score.total) * 100)}%
              </div>
              <div style={{ color: 'var(--text-muted)' }}>Final Score</div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ padding: "12px 24px", background: "var(--primary)", border: "none", borderRadius: "8px", color: "#000", fontWeight: "bold", cursor: "pointer" }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // EXAM TAKING SCREEN
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{
        minHeight: "100vh",
        background: "var(--bg-color)",
        color: "var(--text-main)",
        padding: "30px",
        fontFamily: "Arial",
        userSelect: "none"
      }}
    >
      {/* Webcam Feed (Picture in Picture style) */}
      <div style={{
        position: 'fixed', bottom: '20px', right: '20px', width: '200px', height: '150px',
        background: '#000', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--border-color)', zIndex: 100
      }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1>{exam.title}</h1>
        <div style={{ background: timeLeft < 60 ? "#ef4444" : "var(--primary)", color: "#000", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold" }}>
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      <button
        onClick={startFullscreen}
        style={{ padding: "10px 20px", background: "#10b981", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", marginBottom: "20px", fontWeight: "bold" }}
      >
        Enter Fullscreen (Required)
      </button>

      {warning && (
        <div style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", color: "#ef4444", padding: "15px", borderRadius: "10px", marginBottom: "20px", fontWeight: "bold" }}>
          {warning} (Warnings: {warningCount}/3)
        </div>
      )}

      <div>
        {exam.questions.map((q, index) => (
          <div key={q.id} style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "15px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              Q{index + 1}. {q.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {q.options.map((option, i) => (
                <label key={i} style={{ display: "flex", alignItems: 'center', padding: '10px', background: answers[q.id] === i ? 'rgba(212,175,55,0.1)' : 'var(--glass-bg)', border: answers[q.id] === i ? '1px solid var(--primary)' : '1px solid var(--glass-border)', borderRadius: '8px', cursor: "pointer", transition: 'all 0.2s' }}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={i}
                    checked={answers[q.id] === i}
                    onChange={() => handleOptionChange(q.id, i)}
                    style={{ marginRight: "15px", accentColor: 'var(--primary)' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={submitExam}
        style={{ padding: "15px 30px", background: "var(--primary)", border: "none", borderRadius: "10px", color: "#000", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}
      >
        Submit Exam
      </button>
    </div>
  );
}