import { courseCardsMock } from "@/components/mockData";
import CourseCard from "@/components/UI/courseCard";
import { FC } from "react";
import styles from "./index.module.css";

const HomePage: FC = () => {
  return (
    <div className={styles.mainContainer}>
      {courseCardsMock.map((course, key) => (
        <CourseCard key={key} {...course} />
      ))}
    </div>
  );
};
export default HomePage;
