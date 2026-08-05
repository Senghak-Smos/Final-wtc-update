function About() {
  return (
    <section id="about" className="py-16 px-4 md:px-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <br />
      <div className="text-center mb-12">
        <h1 className="font-adlam text-3xl sm:text-4xl text-gray-900 border-b-2 border-gray-800 inline-block pb-1">
          About C-E-R
        </h1>
        <br />
        <p className="font-biorhyme text-gray-600 mt-4 text-base sm:text-lg">
          Your Smart Companion for C-E-R (Calculate Electrical Room) & Planning
        </p>
      </div>
      <br /><br />
      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-[1100px] mx-auto">
        {/* Mission Card */}
        <div className="shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 rounded-[10px] bg-white border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-adlam text-gray-800 mb-4 ">
              <u className="text-blue-700">Our Mission</u>
            </h2>
            <p className="font-inter font-bold text-gray-600 leading-relaxed text-sm sm:text-base">
              At C-E-R, our goal is to simplify electrical planning for any
              space, making it fast, accurate, and effortless. We help you
              calculate the precise number of LED bulbs, air conditioner
              capacities (BTU/HP), fan requirements, and wiring lengths based on
              your actual room dimensions. By doing so, we help you eliminate
              unnecessary costs, avoid purchasing mistakes, and ensure optimal
              energy efficiency.
            </p>
          </div>
        </div>
        
        {/* Why Choose Us Card */}
        <div className="shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 rounded-[10px] bg-white border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-adlam text-gray-800 mb-4">
              <u className="text-green-600">Why Choose Us?</u>
            </h2>
            <ul className="font-bold list-disc list-inside space-y-3 font-inter text-gray-600 text-sm sm:text-base">
              <li>
                <strong className="text-gray-800">Engineering Standards:</strong> Accurate calculations based on standard
                lighting levels (Lux) and cooling requirements (BTU).
              </li>
              <li>
                <strong className="text-gray-800">Cost Efficiency:</strong> Prevents over-purchasing and helps you select
                the right-sized appliances.
              </li>
              <li>
                <strong className="text-gray-800">Instant Results:</strong> Simple inputs provide quick, clear, and
                actionable estimates for your room setup.
              </li>
            </ul>
          </div>
        </div>
      </div><br /><br /><br /><br />
    </section>
  );
}

export default About;