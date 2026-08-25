import { useEffect, useRef } from 'react';
import "@/lib/scrollcraft"; // Side effect: attaches window.ScrollCraft

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

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
        <a href="#contact" className="sc-cta">Book Your Stay</a>
      </header>

      <main id="top">
        {/* 1 · RECOGNITION: Hero */}
        <section data-sc-act="flow" data-sc-drift="#f5f2eb" className="relative h-screen flex items-center justify-center overflow-hidden">
          <img 
            className="hero-bg" 
            src="/images/47-the-strand-apartment-ground-level-russell-pic-3.jpg" 
            alt="Wharemoana viewed from the street" 
          />
          <div className="sc-copy sc-copy--hero z-10" data-sc-cue="0 0.6 0">
            <h1 className="sc-display sc-display--xl text-white drop-shadow-md" data-sc-kinetic="lines">
              A Coastal Haven
            </h1>
            <p className="sc-body text-white mt-4 text-lg drop-shadow-md">
              House by the Sea (Wharemoana), Russell
            </p>
          </div>
        </section>

        {/* 2 · CONTEXT: Pinning the feeling */}
        <section data-sc-act="pin" data-sc-span="3.0" data-sc-drift="#f5f2eb">
          <div data-sc-stage className="sc-wrap flex flex-col md:flex-row items-center h-screen">
            <div className="sc-stack flex-1 p-8 md:p-16 z-20">
              <p className="sc-display sc-display--md" data-sc-cue="0 0.3">
                Nestled in the heart of Russell, Bay of Islands...
              </p>
              <p className="sc-display sc-display--md" data-sc-cue="0.3 0.6">
                A sanctuary of tranquility with stunning panoramic views of the ocean.
              </p>
              <p className="sc-display sc-display--md" data-sc-cue="0.6 1.0">
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
                alt="Interior gourmet kitchen" 
              />
            </figure>
          </div>
        </section>

        {/* 4 · GALLERY: Pan */}
        <section data-sc-act="pan" data-sc-span="2.5" data-sc-drift="#eae6dc" className="bg-[#eae6dc] py-20">
          <div data-sc-stage className="flex items-center pl-[10vw] h-screen">
            <img className="gallery-item shadow-2xl" src="/images/47-the-strand-apartment-ground-level-russell-pic-10.jpg" alt="Property View 1" />
            <img className="gallery-item shadow-2xl" src="/images/47-the-strand-apartment-ground-level-russell-pic-15.jpg" alt="Property View 2" />
            <img className="gallery-item shadow-2xl" src="/images/47-the-strand-apartment-ground-level-russell-pic-18.jpg" alt="Property View 3" />
            <img className="gallery-item shadow-2xl" src="/images/AzRT8xsWDLcQL9frPSuXFfBPP68gnzkfmgGPsxCmnowuVp_VK83QtIkP7Bd-6IIMwiROqBrdlWDirPkD6G3uzN_6qHlCogqw-oBuRWLyG2SGXykKqjA74N8N-vg77cB8n6ToW5wMFOrOeg5hTFf5yumpw2SbxzjTTx8rNW8ugR8r4ss25c4=.jpg" alt="Property View 4" />
          </div>
        </section>

        {/* 5 · SOCIAL PROOF: Pin deconstructed */}
        <section data-sc-act="pin" data-sc-span="3.0" data-sc-drift="#f5f2eb">
          <div data-sc-stage className="sc-wrap flex flex-col md:flex-row gap-8 md:gap-16 items-center h-screen pt-20 md:pt-0">
            <div className="sc-stack flex-1 z-20">
              <h2 className="sc-display sc-display--lg">Guest Experiences</h2>
              <div className="rating-container flex flex-wrap gap-4 mt-8">
                <span className="rating-badge" data-sc-count="9.5">Booking.com</span>
                <span className="rating-badge" data-sc-count="9.0">Google</span>
                <span className="rating-badge" data-sc-count="9.2">TripAdvisor</span>
              </div>
            </div>
            <div className="flex-1 w-full grid">
              <div className="review-card [grid-area:1/1]" data-sc-cue="0 0.3">
                <p className="sc-body italic text-lg leading-relaxed">
                  "A stunning, peaceful location with breathtaking views. We felt completely at home."
                </p>
                <strong className="sc-body block mt-4 text-foreground">— Sarah & Tom, Auckland</strong>
              </div>
              <div className="review-card [grid-area:1/1]" data-sc-cue="0.4 0.7">
                <p className="sc-body italic text-lg leading-relaxed">
                  "Wharemoana is a slice of heaven. The house is beautiful and the private beach access made our stay unforgettable."
                </p>
                <strong className="sc-body block mt-4 text-foreground">— Jane D., Christchurch</strong>
              </div>
              <div className="review-card [grid-area:1/1]" data-sc-cue="0.8 1.0">
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
          <div className="sc-wrap sc-stack max-w-2xl mx-auto" data-sc-in>
            <h2 className="sc-display sc-display--lg">Plan Your Escape</h2>
            <p className="sc-body text-xl my-8">We look forward to welcoming you to Russell.</p>
            <div className="sc-body text-lg leading-loose opacity-80 bg-white/50 p-8 rounded-2xl border border-border">
              <strong className="text-foreground">47 The Strand</strong><br />
              Russell, 0202 Northland, New Zealand<br />
              Email: <a href="mailto:info@housebythesea.co.nz" className="text-foreground hover:underline decoration-1 underline-offset-4 transition-all">info@housebythesea.co.nz</a>
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