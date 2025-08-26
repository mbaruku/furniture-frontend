import React from "react";
import "./AboutPage.css";
import BottomNavbar from "./BottomNavbar";
import VideosPage from "./AllVideo";
import CustomerForm from "./CustomerForm";
import SubscribeForm from "./SubscribeForm";

export default function AboutPage() {
  return (
    <>
      <div className="about-page py-8">

        <h1 className="text-center mb-4">Kuhusu Sisi</h1>

        {/* Sehemu ya Utangulizi */}
        <section className="about-intro mb-5">
          <p>
            Karibu kwenye Duka letu! Tunajivunia kutoa bidhaa za ubora wa hali ya juu, 
            huduma za kipekee, na uzoefu mzuri kwa kila mteja. Tumeanzisha mfumo wetu 
            wa matangazo ya video ili kuwahudumia wateja kwa njia za kisasa na za kuvutia.
          </p>
        </section>

        {/* Sehemu ya Malengo */}
        <section className="about-goals mb-5">
          <h2>Malengo Yetu</h2>
          <ul>
            <li>Kutoa bidhaa bora kwa bei nafuu.</li>
            <li>Kuwezesha wateja kupata taarifa za matangazo kwa njia rahisi.</li>
            <li>Kukuza uhusiano wa karibu na wateja wetu kupitia huduma za video.</li>
            <li>Kuboresha uzoefu wa ununuzi mtandaoni kwa njia ya kuvutia na rahisi.</li>
          </ul>
        </section>

        {/* Sehemu ya Matangazo ya Video */}
        <section className="video-promo mb-5">
          <VideosPage />
        </section>

       <section className="contact-section">
  <CustomerForm />
  <SubscribeForm />
</section>

        {/* Sehemu ya Maadili na Dhamira */}
        <section className="about-values">
          <h2>Dhamira na Maadili</h2>
          <p>
            Tunajitahidi kuwa kiongozi katika sekta yetu kwa kuzingatia ubora, uaminifu, 
            na uwazi katika kila hatua. Wateja wetu ndio kipaumbele chetu kikuu.
          </p>
        </section>
      </div>

      {/* Hii sasa ipo nje ya container */}
      <BottomNavbar />
    </>
  );
}
