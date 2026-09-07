import React from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import Adinkra from "../../assets/img/adinkra-bullet.png";
// @ts-ignore
import Logo from "../../assets/img/logo_sso.png";
// @ts-ignore
import { FaArrowLeft } from "react-icons/fa";

function PrivacyPolicy() {
  return (
    <div className="w-full h-full bg-primary">
      <main className="mx-auto h-screen w-full max-w-7xl flex flex-col justify-center">
        {/* Mobile Header */}
        <section className="mx-2 my-1 py-2 shadow rounded-t-xl border-[3px] border-primary/20 backdrop-blur-lg bg-primary-dark/50 bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-bottom flex items-center justify-center">
          <img src={Logo} alt="" className="h-20 w-fit" />
        </section>

        {/* Mobile Content */}
        <section className="m-2 my-1 rounded-b-xl border-[3px] border-primary-dark/20 backdrop-blur-lg bg-primary bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-bottom flex flex-col justify-between overflow-y-scroll scrollbar-hide w-full">
          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-6">
              <img
                src={Adinkra}
                alt=""
                className="p-2 h-16 md:h-20 rounded-md border-2 border-dashed opacity-40 shadow-lg -rotate-45 mx-auto"
              />
            </div>

            <div className="flex-1 space-y-6">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl text-white font-bold tracking-wider mb-2">
                  Privacy Policy
                </h1>
                <p>&nbsp;</p>
                {/* <p className="text-white/80 text-base md:text-lg">
                  Last updated: {new Date().toLocaleDateString()}
                </p> */}
              </div>

              <div className="space-y-6 text-white/90 text-base md:text-lg leading-relaxed max-h-96 overflow-y-auto">
                <div>
                  <h3 className="text-white font-sans font-bold text-lg md:text-xl tracking-wider mb-3">Information We Collect</h3>
                  <p>
                    We collect information you provide directly to us, such as when you create an account,
                    update your profile, make a purchase, or contact us for support. This may include your
                    name, email address, phone number, and academic information.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-sans font-bold text-lg md:text-xl tracking-wider mb-3">How We Use Your Information</h3>
                  <p>
                    We use the information we collect to provide, maintain, and improve our services,
                    process transactions, send you technical notices and support messages, and respond
                    to your comments and questions.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-sans font-bold text-lg md:text-xl tracking-wider mb-3">Information Sharing</h3>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties
                    without your consent, except as described in this policy. We may share your information
                    only in limited circumstances, such as to comply with legal obligations or to protect our rights.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-sans font-bold text-lg md:text-xl tracking-wider mb-3">Data Security</h3>
                  <p>
                    We implement appropriate security measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
                    over the internet is 100% secure.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-sans font-bold text-lg md:text-xl tracking-wider mb-3">Your Rights</h3>
                  <p>
                    You have the right to access, update, or delete your personal information. You may also
                    opt out of certain communications or request data portability. Contact us to exercise these rights.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-sans font-bold text-lg md:text-xl tracking-wider mb-3">Contact Us</h3>
                  <p>
                    If you have any questions about this Privacy Policy or our data practices, please contact us at:
                    <br />
                    Email: privacy@aucb.edu.gh
                    <br />
                    Phone: +233 50 123 4567
                  </p>
                </div>
              </div>

              {/* Back Button */}
              <div className="pt-4">
                <Link
                  to="/mobile"
                  className="inline-flex items-center space-x-2 py-2 px-4 rounded-xl bg-primary-dark/70 hover:bg-primary-dark focus:ring-0 focus:outline-none transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4 text-white/80" />
                  <span className="text-sm font-bold text-white/80">
                    Back to Mobile App
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="h-14 w-full flex items-center justify-center">
            <p className="text-white text-xs font-medium">
              Copyright &copy; {new Date().getFullYear()} AUCB
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PrivacyPolicy;