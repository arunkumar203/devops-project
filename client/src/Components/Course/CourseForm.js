// client/src/components/Course/CourseForm.js
import React, { useState, useEffect } from 'react';

const CourseForm = ({ initialCourse, onSave, onCancel }) => {
  const [courseid, setCourseid] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [semester, setSemester] = useState('');
  const [instructor, setInstructor] = useState('');

  useEffect(() => {
    if (initialCourse) {
      setCourseid(initialCourse.courseid || '');
      setTitle(initialCourse.title || '');
      setDesc(initialCourse.desc || '');
      setSemester(initialCourse.semester || '');
      setInstructor(initialCourse.instructor || '');
    } else {
      // Reset fields if there's no initialCourse (adding a new course)
      setCourseid('');
      setTitle('');
      setDesc('');
      setSemester('');
      setInstructor('');
    }
  }, [initialCourse]);

  const handleSave = () => {
    const updatedCourse = {
      courseid,
      title,
      desc,
      semester,
      instructor,
    };
    onSave(updatedCourse);
  };

  return (
    <div className="course-form">
      <h2>{initialCourse ? 'Edit Course' : 'Add Course'}</h2>
      <input type="text" placeholder="Course ID" value={courseid} onChange={(e) => setCourseid(e.target.value)} />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <input type="text" placeholder="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} />
      <input type="text" placeholder="Instructor" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
      <button onClick={handleSave}>{initialCourse ? 'Update Course' : 'Create Course'}</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CourseForm;
