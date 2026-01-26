import { courseCardsMock, mockTestimonials } from "@/components/mockData";
import CourseCard from "@/components/UI/courseCard";
import Header from "@/components/UI/header";
import TestimonialCarousel from "@/components/UI/testimonialCarousel";
import { FC } from "react";
import { quickLinks } from "./constants";
import styles from "./index.module.css";

const HomePage: FC = () => {
  return (
    <div>
      <Header />
      <main className={styles.mainContainer}>
        <div className="flex flex-wrap gap-6">
          {courseCardsMock.map((course, key) => (
            <CourseCard key={key} {...course} />
          ))}
        </div>
      </main>
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
    </div>
  );
};
export default HomePage;
