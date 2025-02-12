// import React from "react";
import { motion } from "framer-motion";

const teamMembers = [
  { name: "Belal Kahaleh", role: "Scrum Master" },
  { name: "Nour Salah", role: "Product Owner" },
  { name: "Mohammed Ajlouni", role: "Quality Assurance" },
  { name: "Ahmad AlJabareen", role: "Developer" },
  { name: "Mohammed Sarrawi", role: "Developer" },
  { name: "Ahlam Almomani", role: "Developer" },
  { name: "Ahmad Alnajjar", role: "Developer" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* العنوان */}
      <motion.h2
        className="text-5xl font-bold text-[#0C2BA1] text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        About Us
      </motion.h2>

      {/* Mission and Image Section */}
      <motion.div
        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* النص */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <p className="text-gray-700 text-lg mb-6">
            Welcome to <strong className="text-[#0C2BA1]">Flexora</strong>, your
            ultimate destination for finding and renting office spaces easily
            and securely. We provide a seamless experience for tenants and
            property owners.
          </p>
          <h3 className="text-2xl font-semibold text-[#0C2BA1] mb-4">
            Our Mission
          </h3>
          <p className="text-gray-700 text-lg">
            We aim to simplify the rental process by offering a variety of
            options that suit all budgets while ensuring transparency and
            security.
          </p>
        </motion.div>

        {/* الصورة */}
        <motion.div
          className="lg:w-1/2 flex justify-center"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <img
            src="src/pages/about us.jpg"
            alt="Office Space"
            className="rounded-xl shadow-2xl w-full lg:w-4/5 transform hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      </motion.div>

      {/* فريق العمل */}
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <h3 className="text-4xl font-bold text-[#0C2BA1] text-center mb-12">
          Meet Our Team
        </h3>

        {/* Belal Kahaleh منفصل بالأعلى */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto text-center mb-12 transform hover:scale-105 transition-transform duration-300 border border-text-[#0C2BA1]"
          whileHover={{ scale: 1.05 }}
        >
          <h4 className="text-3xl font-bold text-[#0C2BA1] mb-2">
            Belal Kahaleh
          </h4>
          <p className="text-gray-700 text-lg font-medium">Scrum Master</p>
        </motion.div>

        {/* باقي الأعضاء - كل 3 في سطر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.slice(1).map((member, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300 border border-gray-200"
              whileHover={{ scale: 1.05 }}
            >
              <h4 className="text-2xl font-semibold text-[#0C2BA1] mb-2">
                {member.name}
              </h4>
              <p className="text-gray-700 text-lg font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default About;
