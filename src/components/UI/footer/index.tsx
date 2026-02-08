import TestimonialCarousel from "@/components/UI/testimonialCarousel";
import { mockTestimonials } from "@/components/mockData";
import { quickLinks } from "@/components/pages/home/constants";
import styles from "./index.module.css";

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerWrapper}>
        <div className={styles.footerRows}>
          <div className={styles.quickLinksContainer}>
            <h4 className={styles.headingWrapper}>Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {quickLinks.map((link, key) => (
                <li key={key}>
                  <a href={link.href} className="hover:text-gray-900">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.testimonialsContainer}>
            <h4 className={styles.headingWrapper}>What Our Learners Say</h4>
            <div>
              <TestimonialCarousel testimonials={mockTestimonials} />
            </div>
          </div>
        </div>
        <div className={styles.allRightsReservedContainer}>
          © {new Date().getFullYear()} CourseForgo. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
