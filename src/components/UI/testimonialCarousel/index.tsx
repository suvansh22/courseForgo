import Carousel from "antd/es/carousel";
import { FC } from "react";
import type { Testimonial } from "@/types/testimonial";
import styles from "./index.module.css";

type Props = {
  testimonials: Testimonial[];
};

const TestimonialCarousel: FC<Props> = ({ testimonials }) => {
  return (
    <Carousel autoplay dots className="w-full">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="px-1">
          <blockquote className={styles.card}>
            <p className={styles.feedback}>{testimonial.feedback}</p>
            <footer className={styles.name}>- {testimonial.name}</footer>
          </blockquote>
        </div>
      ))}
    </Carousel>
  );
};

export default TestimonialCarousel;
