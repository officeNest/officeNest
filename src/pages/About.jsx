import { motion } from "framer-motion";
import Footer from "../components/Footer";

const teamMembers = [
  { name: "Belal Kahaleh", role: "Scrum Master" },
  { name: "Nour Sroor", role: "Product Owner" },
  { name: "Mohammed Ajlouni", role: "Quality Assurance" },
  { name: "Ahmad Al-Jabareen", role: "Developer" },
  { name: "Mohammed Sarrawi", role: "Developer" },
  { name: "Ahlam Al-Momani", role: "Developer" },
  { name: "Ahmad Al-Najjar", role: "Developer" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <motion.div 
        className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-[#0C2BA1] opacity-5 pattern-grid-lg"></div>
        <motion.h1
          className="text-6xl font-bold text-center mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-[#0C2BA1]">About</span> Us
        </motion.h1>
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xl text-gray-600">
            Welcome to <span className="font-semibold text-[#0C2BA1]">Flexora</span>, 
            where finding your perfect office space becomes an effortless journey
          </p>
        </motion.div>
      </motion.div>

      {/* Mission Section */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="lg:w-1/2"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-[#0C2BA1] mb-8">Our Mission</h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  At Flexora, we're revolutionizing the way people find and rent office spaces. 
                  Our platform provides a seamless experience for both tenants and property owners, 
                  ensuring transparency and security at every step.
                </p>
                <p>
                  We aim to simplify the rental process by offering a variety of options that suit 
                  all budgets while maintaining the highest standards of service quality.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-[#0C2BA1] opacity-10 rounded-xl transform rotate-2"></div>
                <img
                  src="src/assets/One London Wall.jpg"
                  alt="Office Space"
                  className="relative rounded-xl shadow-xl w-full transform transition-transform duration-500 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-5xl font-bold text-center text-[#0C2BA1] mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Meet Our Team
          </motion.h2>

          {/* Team Leader Card */}
          <motion.div 
            className="max-w-3xl mx-auto mb-16"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-[#0C2BA1] to-blue-600 p-1 rounded-2xl">
              <div className="bg-white p-8 rounded-2xl text-center">
                <h3 className="text-3xl font-bold text-[#0C2BA1] mb-2">
                  {teamMembers[0].name}
                </h3>
                <p className="text-xl text-gray-600 font-medium">
                  {teamMembers[0].role}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.slice(1).map((member, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 transition-all duration-300 group-hover:shadow-xl">
                  <h4 className="text-2xl font-bold text-[#0C2BA1] mb-2">
                    {member.name}
                  </h4>
                  <p className="text-lg text-gray-600 font-medium">
                    {member.role}
                  </p>
               

                </div>
              </motion.div>
              
            ))}

          </div>

        </div>

      </motion.section>
      <Footer/>

    </div>
    
  );
};

export default About;