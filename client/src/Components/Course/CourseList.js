// src/components/Course/CourseList.js
import React from 'react';
import CourseItem from './CourseItem';

const CourseList = ({ courses, user, onEnroll, onUnenroll }) => {
  const enrolledCourses = courses.filter((course) => course.enrolledList && course.enrolledList.includes(user.userId));
  const unenrolledCourses = courses.filter((course) => !course.enrolledList || !course.enrolledList.includes(user.userId));

  return (
    <div className="course-list">
      <h2>Enrolled Courses</h2>
      {enrolledCourses.map((course) => (
        <CourseItem
          key={course.courseId}
          course={course}
          onUnenroll={onUnenroll}
          isEnrolled={true}
        />
      ))}

      <h2>Unenrolled Courses</h2>
      {unenrolledCourses.map((course) => (
        <CourseItem
          key={course.courseId}
          course={course}
          onEnroll={onEnroll}
          isEnrolled={false}
        />
      ))}
    </div>
  );
};

export default CourseList;