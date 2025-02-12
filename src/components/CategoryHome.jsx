import React from 'react'

function CategoryHome() {
  const categories = [
    {
      title: "Serviced Offices",
      description: "Office with services, fully furnished and ready to move in.",
      image: "https://i.pinimg.com/736x/86/15/37/86153751fc7cb3b54071177d154223b3.jpg",
    },
    {
      title: "Coworking Spaces",
      description: "Desks in a shared workspace, also known as a coworking space.",
      image: "https://i.pinimg.com/736x/30/d6/cb/30d6cb9776ce45c69093ce58bee6300e.jpg",
    },
    {
      title: "Commercial Spaces",
      description: "Long-term, unserviced industrial/workshops and leased spaces.",
      image: "https://i.pinimg.com/736x/1e/c5/59/1ec55995b80edeeab65ef7daa1e64427.jpg",
    },
    {
      title: "Private Offices",
      description: "Fully furnished, dedicated office spaces for individuals or small teams",
      image: "https://i.pinimg.com/736x/e2/b1/29/e2b129fbeb35854f85ce49bf3bb6d19a.jpg",
    },
  ];

  return (
    <>
    {/* Section Title */}
    <h2 className="text-3xl font-bold text-center text-gray-800 mt-10">
      Explore Offices By Category
    </h2>

    {/* Categories Section */}
    <div className="flex flex-wrap justify-center gap-6 py-10">
      {categories.map((category, index) => (
        <div
          key={index}
          className="relative group cursor-pointer shadow-lg rounded-lg overflow-hidden duration-500 w-64 h-80 bg-[#DEDEDE] text-gray-50 p-5"
        >
          {/* Image Section */}
          <div className="relative w-full h-60">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 duration-500"
              style={{ backgroundImage: `url('${category.image}')` }}
            ></div>
          </div>

          {/* Hover Effect with Text */}
          <div className="absolute w-56 left-0 p-5 -bottom-16 duration-500 group-hover:-translate-y-12">
            <div className="absolute -z-10 left-0 w-64 h-28 opacity-0 duration-500 group-hover:opacity-50 group-hover:bg-blue-900"></div>
            <span className="text-xl text-black font-bold">{category.title}</span>
            <p className="group-hover:opacity-100 w-56 duration-500 opacity-0">
              {category.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </>
  );
}

export default CategoryHome;