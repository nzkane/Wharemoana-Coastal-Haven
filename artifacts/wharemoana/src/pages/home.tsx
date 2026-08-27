import { type FormEvent, useEffect, useRef, useState } from 'react';
import { createStayEnquiry } from '@workspace/api-client-react';
import "@/lib/scrollcraft"; // Side effect: attaches window.ScrollCraft

const PROPERTY_EMAIL = 'info@housebythesea.co.nz';

type EnquiryValues = {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
};

const emptyEnquiry: EnquiryValues = {
  name: '',
  email: '',
  phone: '',
  checkIn: '',
  checkOut: '',
  guests: '2',
  message: '',
};

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [enquiry, setEnquiry] = useState<EnquiryValues>(emptyEnquiry);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: 'success' | 'error';
    message: string;
  } | null>(null);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!rootRef.current) return;
    
    // We need to wait for fonts and images so layout can be calculated properly.
    // The script already does some layout, but it's good to trigger mount.
    const scrollcraft = (window as any).ScrollCraft;
    let timer: ReturnType<typeof setTimeout>;
    
    if (scrollcraft && scrollcraft.mount) {
      // Small timeout to allow React to paint DOM elements first
      timer = setTimeout(() => {
        if (rootRef.current) scrollcraft.mount(rootRef.current);
      }, 100);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const updateEnquiry = (field: keyof EnquiryValues, value: string) => {
    setFeedback(null);
    setEnquiry((current) => ({ ...current, [field]: value }));
  };

  const moveGallery = (direction: -1 | 1) => {
    galleryRef.current?.scrollBy({
      left: direction * galleryRef.current.clientWidth * 0.82,
      behavior: 'smooth',
    });
  };

  const handleEnquirySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      await createStayEnquiry({
        ...enquiry,
        guests: Number(enquiry.guests),
      });

      setFeedback({
        kind: 'success',
        message: 'Thanks — your enquiry has been sent. We’ll be in touch soon.',
      });
      setEnquiry(emptyEnquiry);
    } catch (error) {
      const responseData =
        typeof error === 'object' && error !== null && 'data' in error
          ? (error as { data?: unknown }).data
          : undefined;
      const serverMessage =
        typeof responseData === 'object' &&
        responseData !== null &&
        'error' in responseData &&
        typeof responseData.error === 'string'
          ? responseData.error
          : null;

      setFeedback({
        kind: 'error',
        message: serverMessage
          ? `${serverMessage} You can also email ${PROPERTY_EMAIL} directly.`
          : `We could not send your enquiry. Please try again or email ${PROPERTY_EMAIL} directly.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={rootRef} className="scrollcraft-root font-sans text-foreground bg-background">
      <span data-sc-progress></span>
      <div className="sc-grain" aria-hidden="true"></div>

      <header className="site-bar">
        <div className="brand-lockup" aria-label="Wharemoana">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 42 24" focusable="false">
              <path d="M2 17.5C7.5 5.5 16 5.5 21 12s11.5 8.5 19-3.5" />
              <path d="M9 17.5c2-5 5.5-7 9-4.5 2.2 1.6 2.2 4.5-.6 5.8-2.1 1-4.2-.2-4.2-2.2 0-1.2.8-2.1 2-2.1" />
            </svg>
          </span>
          <strong className="text-xl tracking-wide font-display">Wharemoana</strong>
        </div>
        <a href="#enquiry-form" className="sc-cta">Book Your Stay</a>
      </header>

      <main id="top">
        {/* 1 · RECOGNITION: Hero */}
        <section data-sc-act="flow" data-sc-drift="#f5f2eb" className="hero-section relative h-screen flex items-center justify-center overflow-hidden">
          <picture>
            <source
  media="(min-width: 861px)"
  srcSet="/images/47-the-strand-apartment-ground-level-russell-pic-10.jpg"
/>
            <img
              className="hero-bg"
              src="/images/47-the-strand-apartment-ground-level-russell-pic-10.jpg"
              alt="Wharemoana viewed from the beach"
            />
          </picture>
          <div className="sc-copy sc-copy--hero z-10" data-sc-cue="0 0.6 0">
            <h1 className="sc-display sc-display--xl text-white drop-shadow-md" data-sc-kinetic="lines">
              A Coastal Haven
            </h1>
            <p className="sc-body text-white mt-4 text-white drop-shadow-md">
              House by the Sea (Wharemoana), Russell
            </p>
          </div>
        </section>

        {/* 2 · CONTEXT: Pinning the feeling */}
        <section data-sc-act="flow" data-sc-drift="#f5f2eb">
          <div data-sc-stage className="context-stage sc-wrap flex flex-col md:flex-row items-center h-screen">
            <div className="sc-stack flex-1 p-8 md:p-16 z-20">
              <p className="sc-display sc-display--md" data-sc-cue="0 0.4 0 0.25">
                Nestled in the heart of Russell, Bay of Islands...
              </p>
              <p className="sc-display sc-display--md" data-sc-cue="0.27 0.68 0.1 0.25">
                A sanctuary of tranquility with stunning panoramic views of the ocean.
              </p>
              <p className="sc-display sc-display--md" data-sc-cue="0.58 1.0 0.1 0.25">
                A sense of calm that is unique to this part of New Zealand.
              </p>
            </div>
            <div className="flex-1 w-full h-[50vh] md:h-[80vh] px-4 md:px-0 mt-8 md:mt-0">
              <img 
                src="/images/47-the-strand-apartment-ground-level-russell-pic-3.jpg" 
                className="w-full h-full object-cover rounded-2xl md:rounded-[2rem] shadow-xl" 
                alt="View from Wharemoana" 
              />
            </div>
          </div>
        </section>

        {/* 3 · FEATURES: Flow + Reveal */}
        <section className="sc-section overflow-hidden" data-sc-act="flow" data-sc-drift="#f5f2eb">
          <div className="sc-wrap flex flex-col md:flex-row gap-12 items-center">
            <div className="sc-stack flex-1" data-sc-in data-sc-stagger="80">
              <h2 className="sc-display sc-display--lg">Refined Living</h2>
              <p className="sc-body text-lg mt-4">Experience the perfect blend of luxury and nature.</p>
              <ul className="sc-body space-y-4 mt-8 text-base font-medium">
                <li className="flex items-center gap-3">
                  <span className="text-xl">✨</span> Oceanfront location
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🍳</span> Gourmet kitchen
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🛋️</span> Spacious living areas
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🚗</span> Private parking
                </li>
              </ul>
            </div>
            <figure className="flex-1 w-full" data-sc-reveal="up" data-sc-reveal-at="0.2 0.7">
                <img 
                  src="/images/47-the-strand-apartment-ground-level-russell-pic-5.jpg" 
                className="w-full rounded-2xl shadow-xl"
                  alt="Bedroom at Wharemoana"
              />
            </figure>
          </div>
        </section>

        {/* 4 · GALLERY: Pan */}
        <section data-sc-act="flow" data-sc-drift="#eae6dc" className="gallery-section bg-[#eae6dc]">
          <div data-sc-stage className="gallery-stage flex items-center h-screen" role="region" aria-label="Property gallery">
            <button
              type="button"
              className="gallery-arrow gallery-arrow--prev"
              aria-label="Previous gallery image"
              aria-controls="property-gallery"
              onClick={() => moveGallery(-1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <div ref={galleryRef} id="property-gallery" className="gallery-rail flex items-center pl-[10vw] pr-[10vw]" tabIndex={0}>
              <img className="gallery-item shadow-2xl" src="/images/47-the-strand-apartment-ground-level-russell-pic-10.jpg" alt="Property View 1" />
              <img className="gallery-item shadow-2xl" src="/images/47-the-strand-apartment-ground-level-russell-pic-15.jpg" alt="Property View 2" />
              <img className="gallery-item shadow-2xl" src="/images/47-the-strand-apartment-ground-level-russell-pic-18.jpg" alt="Property View 3" />
              <img className="gallery-item shadow-2xl" src="/images/AzRT8xsWDLcQL9frPSuXFfBPP68gnzkfmgGPsxCmnowuVp_VK83QtIkP7Bd-6IIMwiROqBrdlWDirPkD6G3uzN_6qHlCogqw-oBuRWLyG2SGXykKqjA74N8N-vg77cB8n6ToW5wMFOrOeg5hTFf5yumpw2SbxzjTTx8rNW8ugR8r4ss25c4=.jpg" alt="Property View 4" />
               <img className="gallery-item shadow-2xl" src="/images/russell-wharf-at-dusk.png" alt="Russell wharf at dusk" />
               <img className="gallery-item shadow-2xl" src="/images/russell-beach.png" alt="Russell beach and waterfront" />
               <img className="gallery-item shadow-2xl" src="/images/russell-boats.png" alt="Boats on the Russell waterfront" />
            </div>
            <button
              type="button"
              className="gallery-arrow gallery-arrow--next"
              aria-label="Next gallery image"
              aria-controls="property-gallery"
              onClick={() => moveGallery(1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        {/* 5 · SOCIAL PROOF: Pin deconstructed */}
        <section data-sc-act="flow" data-sc-drift="#f5f2eb">
          <div data-sc-stage className="testimonials-stage sc-wrap flex flex-col md:flex-row gap-8 md:gap-16 items-center md:items-start h-screen pt-20 md:pt-[8vh]">
            <div className="sc-stack flex-1 z-20">
              <h2 className="sc-display sc-display--lg">Guest Experiences</h2>
              <div className="rating-container flex flex-wrap gap-4 mt-8" aria-label="Guest ratings out of ten">
                <span className="rating-badge" data-sc-count="0 9.5" aria-label="Booking.com rating: 9.5 out of 10">Booking.com</span>
                <span className="rating-badge" data-sc-count="0 9.0" aria-label="Google rating: 9.0 out of 10">Google</span>
                <span className="rating-badge" data-sc-count="0 9.2" aria-label="TripAdvisor rating: 9.2 out of 10">TripAdvisor</span>
              </div>
            </div>
            <div className="flex-1 w-full grid">
              <div className="review-card [grid-area:1/1]" data-sc-cue="0 0.44 0 0.28">
                <p className="sc-body italic text-lg leading-relaxed">
                  "A stunning, peaceful location with breathtaking views. We felt completely at home."
                </p>
                <strong className="sc-body block mt-4 text-foreground">— Sarah & Tom, Auckland</strong>
              </div>
              <div className="review-card [grid-area:1/1]" data-sc-cue="0.28 0.72 0.1 0.25">
                <p className="sc-body italic text-lg leading-relaxed">
                  "Wharemoana is a slice of heaven. The house is beautiful and the private beach access made our stay unforgettable."
                </p>
                <strong className="sc-body block mt-4 text-foreground">— Jane D., Christchurch</strong>
              </div>
              <div className="review-card [grid-area:1/1]" data-sc-cue="0.56 1.0 0.1 0.25">
                <p className="sc-body italic text-lg leading-relaxed">
                  "The perfect base to explore the Bay of Islands. The views are even better in person."
                </p>
                <strong className="sc-body block mt-4 text-foreground">— The Wilson Family</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 6 · CLOSING: Contact */}
        <section id="contact" className="contact-section" data-sc-act="flow" data-sc-drift="#f5f2eb">
          <div className="sc-wrap sc-stack contact-shell">
            <div className="contact-intro">
              <p className="sc-label">Stay enquiry</p>
              <h2 className="sc-display sc-display--lg">Plan Your Escape</h2>
              <p className="sc-body text-xl my-8">We look forward to welcoming you to Russell.</p>
              <div className="contact-details sc-body text-lg leading-loose opacity-80">
                <strong className="text-foreground">47 The Strand</strong><br />
                Russell, 0202 Northland, New Zealand<br />
                Email: <a href={`mailto:${PROPERTY_EMAIL}`} className="text-foreground hover:underline decoration-1 underline-offset-4 transition-all">{PROPERTY_EMAIL}</a>
              </div>
            </div>

            <div id="enquiry-form" className="enquiry-card">
              <h3 className="sc-display sc-display--md">Tell us about your stay</h3>
              <p className="sc-body enquiry-lede">Share a few details and we’ll help you find the right dates.</p>
              <form className="enquiry-form" onSubmit={handleEnquirySubmit}>
                <div className="enquiry-fields">
                  <label className="enquiry-field">
                    <span>Name</span>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={enquiry.name}
                      onChange={(event) => updateEnquiry('name', event.target.value)}
                      maxLength={100}
                      required
                    />
                  </label>
                  <label className="enquiry-field">
                    <span>Email</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={enquiry.email}
                      onChange={(event) => updateEnquiry('email', event.target.value)}
                      maxLength={254}
                      required
                    />
                  </label>
                  <label className="enquiry-field">
                    <span>Phone</span>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={enquiry.phone}
                      onChange={(event) => updateEnquiry('phone', event.target.value)}
                      maxLength={30}
                      required
                    />
                  </label>
                  <label className="enquiry-field">
                    <span>Arrival</span>
                    <input
                      name="arrival"
                      type="date"
                      min={today}
                      value={enquiry.checkIn}
                      onChange={(event) => updateEnquiry('checkIn', event.target.value)}
                      required
                    />
                  </label>
                  <label className="enquiry-field">
                    <span>Departure</span>
                    <input
                      name="departure"
                      type="date"
                      min={today}
                      value={enquiry.checkOut}
                      onChange={(event) => updateEnquiry('checkOut', event.target.value)}
                      required
                    />
                  </label>
                  <label className="enquiry-field enquiry-field--short">
                    <span>Guests</span>
                    <input
                      name="guests"
                      type="number"
                      min="1"
                      max="12"
                      step="1"
                      value={enquiry.guests}
                      onChange={(event) => updateEnquiry('guests', event.target.value)}
                      required
                    />
                  </label>
                  <label className="enquiry-field enquiry-field--wide">
                    <span>Message</span>
                    <textarea
                      name="message"
                      rows={3}
                      value={enquiry.message}
                      onChange={(event) => updateEnquiry('message', event.target.value)}
                      placeholder="Tell us anything helpful about your stay."
                      maxLength={2000}
                      required
                    />
                  </label>
                </div>
                <button className="enquiry-submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending your enquiry…' : 'Send enquiry'}
                </button>
                {feedback && (
                  <p
                    className={`enquiry-feedback enquiry-feedback--${feedback.kind}`}
                    role={feedback.kind === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                  >
                    {feedback.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

      </main>

      <footer className="flex justify-center p-8 bg-[var(--sc-surface)] border-t border-[var(--sc-accent)] mt-20">
        <p className="sc-body text-sm">&copy; 2026 House by the Sea (Wharemoana)</p>
      </footer>
    </div>
  );
}
