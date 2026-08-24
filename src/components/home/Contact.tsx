import { contactIntro, contactTabs, profile } from "../../data/home";

export default function Contact() {
  return (
    <section className="panel panel--centred" id="contact" aria-label="Contact">
      <span className="eyebrow">06 &nbsp;/&nbsp; Contact</span>
      <div className="contact">
        <div className="contact-folder">
          <div className="tab-row">
            {contactTabs.map((tab) => (
              <a
                className="tab"
                key={tab.label}
                href={tab.href}
                target="_blank"
                rel="noopener"
              >
                <span style={{ minWidth: 0 }}>{tab.label}</span>
              </a>
            ))}
          </div>

          <div className="contact-card">
            <p className="contact-intro">{contactIntro}</p>
            <div className="email-chip">
              <a className="email" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <button type="button" className="copy-btn">
                <span className="copy-label">Copy</span>
              </button>
            </div>
          </div>
        </div>
        <span className="contact-place">{profile.location}</span>
      </div>
    </section>
  );
}
