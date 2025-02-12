import { useState } from "react";

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
    alert("Thank you for reaching out!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
      {/* Left Side - Text Section */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
          Contact Us
        </h2>

        <p className="text-gray-700 text-lg mb-6">
          Wed love to hear from you! Whether you have questions, feedback, or
          just want to say hello, feel free to reach out to us.
        </p>

        {/* صورة تحت النص */}
        <img
          src="src/assets/contact-img.jpg"
          alt="Get in Touch"
          className="w-full max-w-md h-auto mx-auto md:mx-0"
        />
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full md:w-1/2">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-6 shadow-2xl shadow-blue-300 rounded-lg"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Message"
              rows="4"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 w-full rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
