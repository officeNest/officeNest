import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

const faqs = [
  {
    question: "What are the available office sizes?",
    answer: "We offer various office sizes, from small private offices to large coworking spaces, to suit your needs."
  },
  {
    question: "What is included in the office rental price?",
    answer: "Our rental price includes utilities, high-speed internet, cleaning services, and access to shared facilities."
  },
  {
    question: "Can I rent an office for a short-term period?",
    answer: "Yes! We offer flexible rental terms, including daily, weekly, and monthly plans."
  },
  {
    question: "Are meeting rooms available?",
    answer: "Yes, we provide fully equipped meeting rooms that can be booked separately as needed."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-center text-3xl font-bold mb-6 text-gray-900">
        Frequently Asked <span className="text-[#0C2BA1]">Questions</span>
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full p-4 text-left bg-gray-100 hover:bg-gray-200 transition"
            >
              <div className="flex items-center gap-2">
                <FaQuestionCircle className="text-[#0C2BA1]" />
                <span className="font-medium text-gray-900">{faq.question}</span>
              </div>
              <span className="text-[#0C2BA1] text-xl font-bold">
                {openIndex === index ? "-" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="p-4 bg-[#0C2BA1]/10 text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
