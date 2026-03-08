import { useEffect, useState } from "react"

function Features() {

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

    const section = document.getElementById("features-section")

    if (section) observer.observe(section)

    return () => observer.disconnect()

  }, [])


  const features = [
    {
      title: "Semantic Form Understanding",
      text: "AI interprets poorly labeled or inconsistent form fields and understands the true intent of each input."
    },
    {
      title: "Voice-First Interaction",
      text: "Users can navigate and complete forms entirely through natural speech without needing a keyboard."
    },
    {
      title: "Document Intelligence",
      text: "Upload resumes, certificates, or IDs and automatically extract and map relevant information to form fields."
    },
    {
      title: "Intelligent Error Reasoning",
      text: "AI explains confusing validation errors in simple speech and guides users to correct them."
    },
    {
      title: "In-Context Guided Assistance",
      text: "VisAid actively guides users step-by-step while filling long or complex forms."
    },
    {
      title: "Multilingual Voice Support",
      text: "Voice interaction in multiple Indian languages to improve accessibility across regions."
    },
    {
      title: "Privacy-Aware Interaction",
      text: "Users remain in control of sensitive data and can confirm important fields before submission."
    },
    {
      title: "Accessibility Personalization",
      text: "Adaptive contrast, font scaling, and interaction modes designed for different accessibility needs."
    }
  ]

  const leftFeatures = features.filter((_, i) => i % 2 === 0)
  const rightFeatures = features.filter((_, i) => i % 2 !== 0)

  return (
    <section id="features-section" className="py-32 px-6">

      <h2 className="text-5xl font-bold text-center text-emerald-400 mb-20">
        Vision & Key Features
      </h2>

      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-10 ${visible ? "zoom-section" : "opacity-0"}`}>

        {/* LEFT COLUMN */}

        <div className="space-y-8">

          {leftFeatures.map((feature, i) => (

            <div
              key={i}
              className={`p-8 rounded-xl border border-emerald-700 bg-[#04241c]/70 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#063b2f] ${
                visible ? "slide-left" : ""
              }`}
            >

              <h3 className="text-2xl font-semibold text-emerald-400 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-300 text-lg">
                {feature.text}
              </p>

            </div>

          ))}

        </div>

        {/* RIGHT COLUMN */}

        <div className="space-y-8">

          {rightFeatures.map((feature, i) => (

            <div
              key={i}
              className={`p-8 rounded-xl border border-emerald-700 bg-[#04241c]/70 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#063b2f] ${
                visible ? "slide-right" : ""
              }`}
            >

              <h3 className="text-2xl font-semibold text-emerald-400 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-300 text-lg">
                {feature.text}
              </p>

            </div>

          ))}

        </div>

      </div>
      <br /><br /><br /><br /><br />
<div className="section-divider mt-36"></div>
    </section>
  )
}

export default Features