import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateExam = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(10);
  const [questions, setQuestions] = useState([
    { id: Date.now(), question: '', options: ['', '', '', ''], correctOption: 0 }
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), question: '', options: ['', '', '', ''], correctOption: 0 }
    ]);
  };

  const handleRemoveQuestion = (id) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value, optIndex = null) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        if (field === 'options') {
          const newOpts = [...q.options];
          newOpts[optIndex] = value;
          return { ...q, options: newOpts };
        }
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const handleSaveExam = () => {
    if (!title.trim()) return alert('Please enter an exam title.');
    for (let q of questions) {
      if (!q.question.trim()) return alert('Please fill in all question text.');
      if (q.options.some(opt => !opt.trim())) return alert('Please fill in all options.');
    }

    const newExam = {
      id: Date.now().toString(),
      title,
      durationMinutes: parseInt(duration),
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctOption: parseInt(q.correctOption)
      })),
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('localExams') || '[]');
    localStorage.setItem('localExams', JSON.stringify([...existing, newExam]));

    alert('Exam Created Successfully!');
    navigate('/exams');
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          <ArrowLeft size={18} /> Back
        </button>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Create New Exam</h1>
        
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Exam Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="form-input"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                placeholder="e.g. Physics Midterm"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Duration (minutes)</label>
              <input 
                type="number" 
                min="1"
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                className="form-input"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
              />
            </div>
          </div>
        </div>

        {questions.map((q, qIndex) => (
          <div key={q.id} className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: 'var(--primary)' }}>Question {qIndex + 1}</h3>
              {questions.length > 1 && (
                <button onClick={() => handleRemoveQuestion(q.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <input 
              type="text" 
              value={q.question}
              onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
              placeholder="Enter question here"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: '20px' }}>{String.fromCharCode(65 + oIndex)}</span>
                  <input 
                    type="text" 
                    value={opt}
                    onChange={(e) => updateQuestion(q.id, 'options', e.target.value, oIndex)}
                    placeholder={`Option ${oIndex + 1}`}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Correct Answer:</label>
              <select 
                value={q.correctOption}
                onChange={(e) => updateQuestion(q.id, 'correctOption', e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
              >
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleAddQuestion} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
            <Plus size={18} /> Add Question
          </button>
          
          <button onClick={handleSaveExam} className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
            <Save size={18} /> Save Exam
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateExam;
