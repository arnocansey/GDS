import Image from "next/image";
import { Clock, Eye, MapPin, Shield, Smile, Target } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Secure Handling",
    text: "Every parcel is treated with care and insured for transit.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    text: "Deep knowledge of Ghanaian routes helps us find the hardest addresses.",
  },
  {
    icon: Clock,
    title: "Speed Guaranteed",
    text: "Optimized dispatch decisions keep packages moving.",
  },
  {
    icon: Smile,
    title: "Customer First",
    text: "Support that is ready to help before, during, and after delivery.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero soft">
        <span className="section-kicker">About Us</span>
        <h1>Driving the Future of Logistics in Ghana</h1>
        <p>
          Founded in 2020, GDS was born from a simple idea: businesses and
          individuals in Ghana deserve world-class logistics without compromise.
        </p>
      </section>

      <section className="section-shell mission-grid">
        <article className="mission red-card">
          <Target aria-hidden="true" />
          <h2>Our Mission</h2>
          <p>
            To empower Ghanaian commerce by providing the most reliable, fast,
            and transparent delivery network across all 16 regions.
          </p>
        </article>
        <article className="mission green-card">
          <Eye aria-hidden="true" />
          <h2>Our Vision</h2>
          <p>
            To be the undisputed leader in African logistics, setting the
            benchmark for operational excellence and customer satisfaction.
          </p>
        </article>
      </section>

      <section className="section-shell photo-grid">
        <div className="image-frame tall">
          <Image
            src="/images/warehouse-operations.jpg"
            alt="Warehouse aisle prepared for order fulfillment"
            fill
            sizes="(max-width: 980px) 92vw, 44vw"
          />
        </div>
        <div className="story-card">
          <span className="section-kicker">Built for Operators</span>
          <h2>Real logistics needs real operational muscle</h2>
          <p>
            GDS combines pickup teams, fulfillment discipline, and customer
            support into one delivery workflow for growing Ghanaian businesses.
          </p>
          <div className="image-frame small">
            <Image
              src="/images/delivery-worker.jpg"
              alt="Courier preparing a delivery by bicycle"
              fill
              sizes="(max-width: 980px) 92vw, 36vw"
            />
          </div>
        </div>
      </section>

      <section className="section-shell centered values">
        <h2>Why Choose Us</h2>
        <div className="value-grid">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title}>
                <Icon aria-hidden="true" />
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dark-stats">
        <div>
          <strong>2020</strong>
          <span>Founded</span>
        </div>
        <div>
          <strong>10k+</strong>
          <span>Deliveries</span>
        </div>
        <div>
          <strong>16</strong>
          <span>Regions</span>
        </div>
        <div>
          <strong>99%</strong>
          <span>Satisfaction</span>
        </div>
      </section>

      <section className="section-shell centered">
        <h2>Leadership Team</h2>
        <p>The passionate individuals driving our vision forward.</p>
        <div className="team-grid">
          <article>
            <div className="avatar">KM</div>
            <h3>Kwame Mensah</h3>
            <span>Chief Executive Officer</span>
          </article>
          <article>
            <div className="avatar">AS</div>
            <h3>Ama Serwaa</h3>
            <span>Operations Manager</span>
          </article>
          <article>
            <div className="avatar">YO</div>
            <h3>Yaw Osei</h3>
            <span>Customer Lead</span>
          </article>
        </div>
      </section>
    </>
  );
}
