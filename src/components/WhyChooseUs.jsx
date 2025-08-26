import React from 'react';
import { FaShippingFast, FaStar, FaTags, FaHeadset } from 'react-icons/fa';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us" data-aos="fade-up">
      <div className="text-center">
        <h2 className="section-title mb-4">Kwa Nini Utuchague?</h2>
        <div className="row justify-content-center">
          <div className="col-md-3 col-sm-6 feature-box">
            <FaStar className="feature-icon" />
            <h5>Ubora wa Juu</h5>
            <p>Bidhaa zetu zimethibitishwa kuwa bora kwa matumizi ya muda mrefu.</p>
          </div>
          <div className="col-md-3 col-sm-6 feature-box">
            <FaTags className="feature-icon" />
            <h5>Bei Nafuu</h5>
            <p>Tunatoa bei rafiki bila kuathiri ubora wa bidhaa zetu.</p>
          </div>
          <div className="col-md-3 col-sm-6 feature-box">
            <FaShippingFast className="feature-icon" />
            <h5>Uwasilishaji wa Haraka</h5>
            <p>Tunawafikia wateja wetu kwa wakati wowote mahali popote.</p>
          </div>
          <div className="col-md-3 col-sm-6 feature-box">
            <FaHeadset className="feature-icon" />
            <h5>Huduma kwa Wateja</h5>
            <p>Timu yetu iko tayari kukusaidia masaa 24/7 kwa mahitaji yako.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
