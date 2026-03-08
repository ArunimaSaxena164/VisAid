import { useEffect, useState } from "react"

function HowItWorks() {

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

    const section = document.getElementById("how-section")

    if (section) observer.observe(section)

    return () => observer.disconnect()

  }, [])

  const steps = [
    "Activate the VisAid extension using the hotkey 'FFFF'",
    "VisAid scans the webpage and detects all form fields automatically.",
    "Upload your resume or document PDF to autofill known information.",
    "VisAid extracts relevant details and fills matching fields.",
    "For remaining fields, VisAid asks questions using voice prompts.",
    "Answer verbally and VisAid fills the remaining inputs automatically.",
    "After completing all fields, VisAid asks for confirmation and submits the form."
  ]

  return (
    <section id="how-section" className="py-8 px-6">

      <h2 className="text-5xl font-bold text-center text-emerald-400 mb-20">
        How VisAid Works
      </h2>

      <div className={`max-w-4xl mx-auto space-y-8 ${visible ? "zoom-section" : "opacity-0"}`}>

        {steps.map((step, index) => (

          <div
            key={index}
            className={`p-8 rounded-xl border border-emerald-700 bg-[#04241c]/70 backdrop-blur-md shadow-lg text-lg transition-all duration-300 hover:scale-105 hover:bg-[#063b2f] ${
              visible ? "fade-down" : ""
            }`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >

            <span className="text-emerald-400 font-semibold text-xl mr-2">
              Step {index + 1}
            </span>

            {step}

          </div>

        ))}

      </div>
      <br /><br /><br /><br /><br /><br />
<div className="section-divider mt-36"></div>
    </section>
  )
}

export default HowItWorks