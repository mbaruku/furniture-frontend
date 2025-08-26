import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    name: "Amina M.",
    message: "Nilipokea meza yangu ndani ya siku moja! Ubora wa bidhaa ni wa hali ya juu!",
  },
  {
    name: "James K.",
    message: "Huduma kwa wateja ilikuwa bora sana, na bei ni rafiki. Nashukuru sana.",
  },
  {
    name: "Fatma T.",
    message: "Viti vyao ni imara, nimeridhika kabisa. Nitawapendekeza kwa wengine.",
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className=" text-center">
        <h2 className="section-title mb-4">Maoni ya Wateja Wetu</h2>
        <div className="row justify-content-center">
          {testimonials.map((testimonial, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="testimonial-card">
                <p className="message">“{testimonial.message}”</p>
                <h6 className="name">- {testimonial.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
