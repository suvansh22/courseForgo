import Carousel from "antd/es/carousel";
import { FC } from "react";
import styles from "./index.module.css";

type Props = {
  testimonials: Array<{ name: string; feedback: string }>;
};

const TestimonialCarousel: FC<Props> = ({ testimonials }) => {
  return (
    <Carousel autoplay dots className="w-full">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="px-1">
          <blockquote className={styles.feedbackWrapper}>
            <p className={styles.feedbackWrapper}>{testimonial.feedback}</p>
            <footer className={styles.nameWrapper}>— {testimonial.name}</footer>
          </blockquote>
        </div>
      ))}
    </Carousel>
  );
};

export default TestimonialCarousel;
