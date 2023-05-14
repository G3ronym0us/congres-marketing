/* eslint-disable @next/next/no-html-link-for-pages */

export default function Footer() {
  return (
    <>
      <footer className="grotesk bg-[#f9fbfb]">
        <div className="px-2">
          <div className="max-w-8xl mx-auto px-5 py-6">
            <h2 className="text-black">Diam egestas ultrices odio vitae.</h2>
            <div>
              <h2 className="my-4 text-sm">
                Lorem ipsum accumsan arcu, consectetur adipiscing elit. Dolor
                proin tempor sed fermentum sit{" "}
                <br className="hidden lg:inline-block" /> pretium pellentesque.
                Dictumst risus elementum dignissim risus, lobortis molestie.
              </h2>
            </div>
            <div className="absolute right-0 -mt-24 hidden text-black lg:inline-block">
              <a href="/" className="mr-16">
                Terms & Conditions
              </a>
              <a href="/" className="mr-16">
                Privacy Policy
              </a>
              <a href="/" className="mr-16">
                Cookie Policy
              </a>
            </div>
            <div className="right-0 inline-block pt-12 pb-6 pr-20 text-sm text-black md:hidden">
              <a href="/" className="mr-16">
                Terms & Conditions
              </a>
              <a href="/" className="mr-16">
                Privacy Policy
              </a>
              <a href="/" className="mr-16">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
