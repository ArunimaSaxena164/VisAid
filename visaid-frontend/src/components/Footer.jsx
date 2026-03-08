function Footer() {
  return (
    <footer className="mt-36 bg-[#02140f]/85 backdrop-blur-md border-t border-emerald-800 text-center">

      <div className="py-10 px-6 space-y-4">

        {/* Project Name */}

        <h2 className="text-3xl font-bold text-emerald-400">
          VisAid
        </h2>

        {/* Navigation Links */}

        <div className="flex justify-center gap-8 text-gray-300 text-l">

          <a href="#features-section" className="hover:text-emerald-400 transition">
            Features
          </a>

          <a href="#how-section" className="hover:text-emerald-400 transition">
            How It Works
          </a>

          <a href="#download-section" className="hover:text-emerald-400 transition">
            Download
          </a>

        </div>

        {/* Team Info */}

        <p className="text-gray-400 text-md">
          Built by <span className="text-white">Team Drishtikon</span> • AI for Bharat Hackathon
        </p>

        {/* Copyright */}

        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} VisAid
        </p>

      </div>

    </footer>
  )
}

export default Footer