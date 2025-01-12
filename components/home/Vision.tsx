import { Metadata } from 'next'

export default function Vision() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto">
        {/* Grid */}
        <div className="grid gap-12">
          <div>
            <h2 className="text-3xl text-gray-800 font-bold lg:text-4xl dark:text-white">
              Our Vision
            </h2>
            <p className="mt-3 text-gray-800 dark:text-neutral-400">
              DarkWaves aims to be the premier destination for those seeking to explore the enigmatic and mysterious aspects of our universe. We strive to illuminate the shadows of knowledge, bringing forth captivating stories and insights that challenge the boundaries of human understanding.
            </p>
          </div>

          <div className="space-y-6 lg:space-y-10">
            {/* Icon Block */}
            <div className="flex gap-x-5 sm:gap-x-8">
              <svg className="shrink-0 mt-2 size-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              <div className="grow">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
                  Unveiling Cosmic Mysteries
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Our team of expert writers and researchers delve into the darkest corners of the cosmos, bringing to light the most intriguing and perplexing phenomena that our universe has to offer.
                </p>
              </div>
            </div>
            {/* End Icon Block */}

            {/* Icon Block */}
            <div className="flex gap-x-5 sm:gap-x-8">
              <svg className="shrink-0 mt-2 size-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              <div className="grow">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
                  Fostering Curiosity and Wonder
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  We believe in the power of curiosity to drive human progress. Our content is designed to spark wonder and inspire readers to question the nature of reality and our place in the universe.
                </p>
              </div>
            </div>
            {/* End Icon Block */}

            {/* Icon Block */}
            <div className="flex gap-x-5 sm:gap-x-8">
              <svg className="shrink-0 mt-2 size-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
              <div className="grow">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
                  Illuminating the Unknown
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  From the depths of black holes to the enigmatic nature of dark matter, we strive to shed light on the most obscure and fascinating aspects of our universe, making complex concepts accessible to all.
                </p>
              </div>
            </div>
            {/* End Icon Block */}
          </div>
        </div>
        {/* End Grid */}
      </div>
    </div>
  )
}

