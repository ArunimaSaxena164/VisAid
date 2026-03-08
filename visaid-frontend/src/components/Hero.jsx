function Hero() {
  return (
    <section className="hero-animate pt-40 pb-40 px-6 text-center">
<br /><br />
      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
        VisAid AI
      </h1>

      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">

        An AI accessibility copilot helping visually impaired users
        complete complex web forms using voice guidance
        and document intelligence.

      </p>

      <div className="flex justify-center gap-6">

        {/* Try VisAid Button */}

        <a
          href="#download-section"
          className="w-52 text-center bg-emerald-500 hover:bg-emerald-900 transition duration-300 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-emerald-900/40"
        >
          Try VisAid v1.0.0
        </a>

        {/* Watch Demo Button */}

        <button className="w-52 border border-emerald-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-400 hover:text-black transition duration-300">

          Watch Demo

        </button>

      </div>
      <br /><br /><br /><br /><br />

      {/* Separator */}

      <div className="section-divider mt-36"></div>

    </section>
  )
}

export default Hero