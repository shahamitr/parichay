'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, Send, ChevronDown, User } from 'lucide-react';
import MathCaptcha from '@/components/ui/MathCaptcha';
import HoneypotField from '@/components/ui/HoneypotField';
import { useBotProtection } from '@/hooks/useBotProtection';

interface Question {
  id: string;
  question: string;
  answer: string | null;
  askerName: string;
  createdAt: string;
  answeredAt?: string;
}

interface QASectionProps {
  branchId: string;
  primaryColor?: string;
}

export default function QASection({ branchId, primaryColor = '#4F46E5' }: QASectionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { honeypotProps, getFormMeta, validateBeforeSubmit } = useBotProtection('qa_url');
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  useEffect(() => {
    fetch(`/api/questions?branchId=${branchId}`)
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions || []))
      .catch(() => {});
  }, [branchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBeforeSubmit()) { setSubmitted(true); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId,
          question: questionText,
          askerName: name,
          ...getFormMeta(),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setQuestionText('');
        setName('');
      }
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <section ref={containerRef} className="py-10 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Questions & Answers</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Ask anything about this business</p>
        </motion.div>

        {/* Existing Q&A */}
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 mb-6"
          >
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[14px] font-medium text-gray-900">{q.question}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Asked by {q.askerName}
                      {q.createdAt && ` · ${new Date(q.createdAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                {q.answer && (
                  <div className="mt-3 ml-8 pl-3 border-l-2" style={{ borderColor: primaryColor }}>
                    <p className="text-[13px] text-gray-700">{q.answer}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Business response
                      {q.answeredAt && ` · ${new Date(q.answeredAt).toLocaleDateString()}`}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Ask Button / Form */}
        {submitted ? (
          <div className="text-center py-6 bg-emerald-50 rounded-xl">
            <p className="text-emerald-700 font-medium">✓ Question submitted! We'll notify you when it's answered.</p>
          </div>
        ) : !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-[14px] font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Ask a Question
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-xl p-5">
            <input
              value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Your name"
            />
            <textarea
              value={questionText} onChange={(e) => setQuestionText(e.target.value)} required
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
              placeholder="What would you like to know about this business?"
            />
            <HoneypotField {...honeypotProps} />
            <MathCaptcha onVerify={setCaptchaValid} />
            <button
              type="submit" disabled={submitting || !captchaValid || !name || questionText.length < 10}
              className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Question'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
