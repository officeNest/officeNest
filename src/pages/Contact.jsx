import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare } from "lucide-react";
import Swal from "sweetalert2"; // Import SweetAlert2
import Footer from "../components/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show SweetAlert on successful form submission
    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Thank you for reaching out. We will get back to you soon.',
      confirmButtonText: 'OK',
    });

    // Reset the form fields
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 mt-15">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Side - Content */}
            <motion.div 
              className="w-full lg:w-1/2 space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold text-[#0C2BA1] mb-6">
                  Get in Touch
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  We'd love to hear from you! Whether you have questions, feedback, or
                  just want to say hello, feel free to reach out to us.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-[#0C2BA1] opacity-10 rounded-xl transform -rotate-2"></div>
                <img
                  src="src/assets/contact-img.jpg"
                  alt="Get in Touch"
                  className="relative rounded-xl shadow-lg w-full max-w-md mx-auto lg:mx-0"
                />
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="flex items-center text-gray-700 text-lg font-medium mb-2">
                      <User className="text-[#0C2BA1] mr-2" />
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2BA1] focus:border-transparent transition-all duration-300"
                      placeholder="Your Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-gray-700 text-lg font-medium mb-2">
                      <Mail className="text-[#0C2BA1] mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2BA1] focus:border-transparent transition-all duration-300"
                      placeholder="Your Email"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-gray-700 text-lg font-medium mb-2">
                      <MessageSquare className="text-[#0C2BA1] mr-2" />
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2BA1] focus:border-transparent transition-all duration-300"
                      placeholder="Your Message"
                      rows="5"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-[#0C2BA1] text-white py-4 px-6 rounded-lg font-medium text-lg flex items-center justify-center gap-2 hover:bg-[#0a2280] transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send/>
                    Send Message
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
};

export default ContactUs;
