// client/src/components/Course/CourseItem.js
import React from 'react';
import './CourseStyles.css';

const CourseItem = ({ course, onEdit, onDelete, onEnroll, onUnenroll, isEnrolled }) => (
  <div className="course-item">
    <h3>{course.title}</h3>
    <p>{course.desc}</p>
    <p className="instructor">Instructor: {course.instructor}</p>
    <p className="semester">Semester: {course.semester}</p>
    <p className="status">{isEnrolled ? 'Enrolled' : 'Not Enrolled'}</p>

    <div className="course-actions">
      {isEnrolled ? (
        <button className="button-secondary" onClick={() => onUnenroll && onUnenroll(course.courseid)}>
          button
        </button>
      ) : (
        <button className="button-primary" onClick={() => onEnroll && onEnroll(course.courseid)}>
          Enroll
        </button>
      )}

      {onEdit && (
        <button className="button-primary" onClick={() => onEdit(course)}>
          Edit
        </button>
      )}

      {onDelete && (
        <button className="button-secondary" onClick={() => onDelete(course.courseid)}>
          Delete
        </button>
      )}
    </div>
  </div>
);

export default CourseItem;
