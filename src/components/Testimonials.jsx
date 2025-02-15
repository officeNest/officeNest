import { useEffect, useRef } from "react";
import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css"; // Import Keen Slider CSS

const testimonials = [
  {
    name: "Emily Johnson",
    role: "Marketing Specialist",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    review:
      "Flexora has completely changed the way we book office spaces! The platform is incredibly intuitive, and the virtual tours make decision-making so much easier. Highly recommend it!",
  },
  {
    name: "Michael Smith",
    role: "Startup Founder",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    review:
      "I needed a flexible office space for my growing startup, and Flexora was the perfect solution. The seamless booking process and great customer support made the experience exceptional!",
  },
  {
    name: "Sophia Patel",
    role: "Freelance Designer",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    rating: 4,
    review:
      "I've used many coworking space platforms, but none compare to Flexora. The site is fast, the listings are accurate, and the locations are perfect for remote work.",
  },
];

const Testimonials = () => {
  const sliderRef = useRef(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const prevButtonDesktopRef = useRef(null);
  const nextButtonDesktopRef = useRef(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    const keenSlider = new KeenSlider(sliderRef.current, {
      loop: true,
      slides: {
        origin: "center",
        perView: 1.25,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 1024px)": {
          slides: {
            origin: "auto",
            perView: 1.5,
            spacing: 32,
          },
        },
      },
    });

    // Attach event listeners for buttons
    const prevButton = prevButtonRef.current;
    const nextButton = nextButtonRef.current;
    const prevButtonDesktop = prevButtonDesktopRef.current;
    const nextButtonDesktop = nextButtonDesktopRef.current;

    if (prevButton && nextButton && prevButtonDesktop && nextButtonDesktop) {
      prevButton.addEventListener("click", () => keenSlider.prev());
      nextButton.addEventListener("click", () => keenSlider.next());
      prevButtonDesktop.addEventListener("click", () => keenSlider.prev());
      nextButtonDesktop.addEventListener("click", () => keenSlider.next());
    }

    return () => {
      keenSlider.destroy();
    };
  }, []);

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-[1340px] px-4 py-12 sm:px-6 lg:py-16 xl:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center lg:gap-16">
          <div className="max-w-xl text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Don't just take our word for it...
            </h2>
            <p className="mt-4 text-gray-700">
              Discover what our satisfied customers have to say about their experiences with Flexora.
            </p>

            <div className="hidden lg:mt-8 lg:flex lg:gap-4">
              <button
                aria-label="Previous slide"
                ref={prevButtonDesktopRef}
                className="rounded-full border border-[#0C2BA1] p-3 text-[#0C2BA1] transition hover:bg-[#0C2BA1] hover:text-white"
              >
                &#8592;
              </button>

              <button
                aria-label="Next slide"
                ref={nextButtonDesktopRef}
                className="rounded-full border border-[#0C2BA1] p-3 text-[#0C2BA1] transition hover:bg-[#0C2BA1] hover:text-white"
              >
                &#8594;
              </button>
            </div>
          </div>

          {/* Slider Section */}
          <div className="-mx-6 lg:col-span-2 lg:mx-0">
            <div ref={sliderRef} className="keen-slider">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="keen-slider__slide p-6 bg-white shadow-md rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-yellow-500 text-lg">
                      {"⭐".repeat(testimonial.rating)}
                    </p>
                    <p className="mt-2 text-gray-700">{testimonial.review}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="mt-4 flex justify-center gap-4 lg:hidden">
              <button
                aria-label="Previous slide"
                ref={prevButtonRef}
                className="rounded-full border border-[#0C2BA1] p-3 text-[#0C2BA1] transition hover:bg-[#0C2BA1] hover:text-white"
              >
                &#8592;
              </button>

              <button
                aria-label="Next slide"
                ref={nextButtonRef}
                className="rounded-full border border-[#0C2BA1] p-3 text-[#0C2BA1] transition hover:bg-[#0C2BA1] hover:text-white"
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
