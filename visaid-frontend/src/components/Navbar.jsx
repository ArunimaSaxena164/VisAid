function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#02140f]/85 border-b border-[#0f766e]">

      <div className="flex items-center px-12 py-5">

        {/* Left Logo */}

        <h1 className="text-3xl font-bold text-emerald-400"  style={{fontSize:"34px"}}>
          VisAid
        </h1>

        {/* Right Menu */}

        <div className="ml-auto flex gap-10 text-lg text-gray-200 font-medium">

          <a
            href="#features-section"
            className="hover:text-emerald-400 transition-colors duration-300"
            style={{fontSize:"24px"}}
          >
            Features
          </a>

          <a
            href="#how-section"
            className="hover:text-emerald-400 transition-colors duration-300"
             style={{fontSize:"23px"}}
          >
            How It Works
          </a>

          <a
            href="#download-section"
            className="hover:text-emerald-400 transition-colors duration-300"
             style={{fontSize:"23px"}}
          >
            Download
          </a>

        </div>

      </div>

    </nav>
  )
}

export default Navbar