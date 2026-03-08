import { useEffect, useState } from "react"

function Download() {

  const [visible, setVisible] = useState(false)

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const section = document.getElementById("download-section")

    if (section) observer.observe(section)

    return () => observer.disconnect()

  }, [])

  return (
    <section id="download-section" className="py-5 px-6 flex justify-center" style={{marginBottom:"200px"}}>

      <div
        className={`max-w-3xl w-full p-14 rounded-2xl border border-emerald-700 bg-[#04241c]/70 backdrop-blur-md shadow-2xl text-center transition-all duration-700 ${
          visible ? "zoom-section" : "opacity-0"
        }`}
      >

        <h2 className="text-5xl font-bold text-emerald-400 mb-8">
          Try VisAid v1.0.0
        </h2>

        <p className="text-xl text-gray-300 mb-12">

          Download the VisAid Chrome extension and experience voice-driven
          form filling designed to make digital services accessible for
          visually impaired users.

        </p>

        {/* Download Button */}

        <a
          href="/visaid-extension.zip"
          className="pulse-button inline-block bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-semibold px-14 py-5 rounded-xl shadow-lg shadow-emerald-900/40 transition transform hover:scale-110"
        >
          Download Extension
        </a>

        <p className="text-gray-400 text-sm mt-6 mb-10">
          Chrome Extension • MVP Version 1.0.0
        </p>

        {/* Installation Instructions */}

        <div className="text-left border-t border-emerald-800 pt-8">

          <h3 className="text-xl font-semibold text-emerald-400 mb-4">
            Installation Guide
          </h3>

          <ol className="space-y-2 text-gray-300 text-lg list-decimal list-inside">

            <li>Download the extension zip file.</li>

            <li>Extract the downloaded folder.</li>

            <li>Open <span className="text-white">chrome://extensions</span> in Chrome.</li>

            <li>Enable <span className="text-white">Developer Mode</span>.</li>

            <li>Click <span className="text-white">Load Unpacked</span> and select the extracted VisAid folder.</li>

          </ol>

        </div>

      </div>
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </section>
  )
}

export default Download