
import React, { useState } from 'react';
import { Note } from '../../types';

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: Omit<Note, 'id' | 'timestamp' | 'date'>) => Promise<void>;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave }) => {
    const [text, setText] = useState('');
    const [category, setCategory] = useState<'reminder' | 'goal' | 'idea' | 'review'>('reminder');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!text.trim()) {
            alert('Please enter a note.');
            return;
        }
        setIsSaving(true);
        try {
            await onSave({ text, category });
            onClose();
        } catch (error) {
            console.error("Failed to save note", error);
            alert("Error saving note.");
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[var(--bg)] rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Add Financial Note</h3>
                <div className="mb-4">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Note</label>
                    <textarea value={text} onChange={e => setText(e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]" rows={4} placeholder="Enter your financial note or reminder..."></textarea>
                </div>
                <div className="mb-6">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                        <option value="reminder">📅 Reminder</option>
                        <option value="goal">🎯 Goal</option>
                        <option value="idea">💡 Idea</option>
                        <option value="review">📊 Review</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 p-3 rounded-lg bg-[var(--surface)] font-semibold" onClick={onClose}>Cancel</button>
                    <button className="flex-1 p-3 rounded-lg bg-blue-500 text-white font-semibold flex items-center justify-center" onClick={handleSave} disabled={isSaving}>
                         {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save Note'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;
