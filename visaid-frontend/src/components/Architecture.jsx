import { useEffect, useState } from "react"

function Architecture() {

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

    const section = document.getElementById("architecture-section")

    if (section) observer.observe(section)

    return () => observer.disconnect()

  }, [])

  const components = [
    "User",
    "Chrome Extension",
    "PDF & Form Processing",
    "Backend API",
    "AI Model",
    "Voice Guidance",
    "Form Completion"
  ]

  return (
    <section id="architecture-section" className="py-32 px-6">

      <h2 className="text-5xl font-bold text-center text-emerald-400 mb-20">
        System Architecture
      </h2>

      <div className={`flex flex-wrap justify-center items-center gap-6 ${visible ? "zoom-section" : "opacity-0"}`}>

        {components.map((component, index) => (

          <div key={index} className="flex items-center">

            <div
              className={`px-8 py-6 rounded-xl border border-emerald-700 bg-[#04241c]/70 backdrop-blur-md shadow-lg text-lg font-semibold text-center transition-all duration-300 hover:scale-105 hover:bg-[#063b2f] ${
                visible ? "fade-right" : ""
              }`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {component}
            </div>

            {index !== components.length - 1 && (

              <div
                className={`text-emerald-400 text-3xl mx-4 ${
                  visible ? "fade-right" : ""
                }`}
                style={{ animationDelay: `${index * 0.3 + 0.1}s` }}
              >
                →
              </div>

            )}

          </div>

        ))}

      </div>
      <br /><br /><br /><br /><br /><br /><br />
      <div className="section-divider mt-36"></div>

    </section>
  )
}

export default Architecture