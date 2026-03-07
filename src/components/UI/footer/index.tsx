"use client";

import TestimonialCarousel from "@/components/UI/testimonialCarousel";
import { quickLinks } from "@/components/pages/home/constants";
import { getTestimonials } from "@/lib/api/testimonials";
import { useQuery } from "@tanstack/react-query";
import Spin from "antd/es/spin";
import styles from "./index.module.css";

const Footer = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerWrapper}>
        <div className={styles.footerRows}>
          <div className={styles.quickLinksContainer}>
            <h4 className={styles.headingWrapper}>Quick Links</h4>
            <ul className={styles.linksList}>
              {quickLinks.map((link, key) => (
                <li key={key}>
                  <a href={link.href} className={styles.linkItem}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.testimonialsContainer}>
            <h4 className={styles.headingWrapper}>What Our Learners Say</h4>
            {isLoading ? (
              <div>
                <Spin />
              </div>
            ) : data?.testimonials && data.testimonials.length > 0 ? (
              <div>
                <TestimonialCarousel testimonials={data.testimonials} />
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.allRightsReservedContainer}>
          (c) {new Date().getFullYear()} CourseForgo. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
