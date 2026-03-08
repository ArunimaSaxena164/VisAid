import { useEffect, useState } from "react"

function Problem() {

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

    const section = document.getElementById("problem-section")

    if (section) observer.observe(section)

    return () => observer.disconnect()

  }, [])

  return (
    <section id="problem-section" className="py-25 px-6">

      <div
        className={`max-w-5xl mx-auto p-12 rounded-2xl border border-emerald-700 bg-[#04241c]/70 backdrop-blur-md shadow-2xl transition-all duration-700 ${
          visible ? "zoom-card" : "opacity-0"
        }`}
      >

        <h2 className="text-5xl font-bold text-center mb-10 text-emerald-400">
          The Accessibility Gap
        </h2>

        <p className="text-xl text-gray-300 leading-relaxed mb-8">

          Digital services are rapidly becoming the primary way people apply for
          government schemes, scholarships, healthcare, and employment.
          However, for millions of visually impaired users, interacting with
          complex web forms remains extremely difficult.

        </p>

        <p className="text-xl text-gray-300 leading-relaxed mb-8">

          According to the World Health Organization, over
          <span className="text-emerald-400 font-semibold"> 2.2 billion people globally </span>
          live with some form of vision impairment. In India alone, there are
          around
          <span className="text-emerald-400 font-semibold"> 70 million visually impaired individuals </span>
          and nearly
          <span className="text-emerald-400 font-semibold"> 5 million people who are blind.</span>

        </p>

        <p className="text-xl text-gray-300 leading-relaxed mb-8">

          While screen readers can narrate content, they often struggle with
          poorly labeled fields, inconsistent layouts, and complex validation
          errors commonly found in real-world forms.

        </p>

        <p className="text-xl text-gray-300 leading-relaxed mb-8">

          Studies show that nearly
          <span className="text-emerald-400 font-semibold"> 73% of users with disabilities abandon websites </span>
          when navigation becomes difficult.

        </p>

        <p className="text-xl text-gray-300 leading-relaxed">

          <span className="text-white font-semibold">VisAid bridges this gap. </span>
          By combining voice interaction, document intelligence, and
          AI-powered form understanding, VisAid transforms complex forms into
          guided conversational experiences that empower visually impaired users
          to independently access digital services.

        </p>

      </div>
      <br /><br /><br /><br /><br />
<br /><br />      <div className="section-divider mt-36"></div>

    </section>
  )
}

export default Problem