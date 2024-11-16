// client/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import CourseItem from './Components/Course/CourseItem';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Auth/Login';
import SignUp from './Components/Auth/SignUp';
import CourseForm from './Components/Course/CourseForm';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState('home');
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('localhost:3000/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const checkLogin = () => {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (token && storedUser) {
        setIsLoggedIn(true);
    
        // Parse the token to extract the user ID
        const payload = JSON.parse(atob(storedUser.authToken.split('.')[1]));
        const userId = payload.user.id;
    
        setUserId(userId);
      }
    };

    fetchCourses();
    checkLogin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserId(null);
    setView('home');
  };

  const handleLogin = (user) => {
    localStorage.setItem('token', user.authToken);
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
    setUserId(user.id);
  };

  const handleCreateCourse = async (newCourse) => {
    try {
      const response = await axios.post('http:localhost:3000/api/courses/create', newCourse);
      setCourses((prevCourses) => [...prevCourses, response.data.course]);
      setView('home');
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleEditCourse = async (updatedCourse) => {
    try {
      const response = await axios.put(`http:localhost:3000/api/courses/${updatedCourse.courseid}`, updatedCourse);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseid === updatedCourse.courseid ? response.data.course : course
        )
      );
      setEditingCourse(null);
      setView('home');
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleEnrollCourse = async (courseId) => {
    if (!userId) {
      console.error('User ID is not set!');
      return;
    }
    console.log(courseId)
    try {
      const response = await axios.post(`http:localhost:3000/api/courses/enroll/${courseId}`,{userId},
        { headers: { "auth-token": localStorage.getItem('token') } }
      );
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseid === courseId ? response.data.course : course
        )
      );
    } catch (error) {
      console.error('Error enrolling in course:', error.message);
    }
  };

  const handleUnenrollCourse = async (courseId) => {
    if (!userId) {
      console.error('User ID is not set!');
      return;
    }

    try {
      const response = await axios.post(`http:localhost:3000/api/courses/unenroll/${courseId}`, { userId });
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseid === courseId ? response.data.course : course
        )
      );
    } catch (error) {
      console.error('Error unenrolling from course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http:/api/courses/${courseId}`);
      setCourses((prevCourses) => prevCourses.filter((course) => course.courseid !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const enrolledCourses = courses.filter((course) => course.enroll_list.includes(userId));
  const unenrolledCourses = courses.filter((course) => !course.enroll_list.includes(userId));

  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} onSelectView={setView} />

      {!isLoggedIn ? (
        <div className="auth-buttons">
          <SignUp onSignup={handleLogin} />
          <Login onLogin={handleLogin} />
        </div>
      ) : (
        <div>
          {view === 'home' && (
            <>
              <h1>Enrolled Courses</h1>
              <div className="course-list">
                {enrolledCourses.length === 0 ? (
                  <p>No enrolled courses</p>
                ) : (
                  enrolledCourses.map((course) => (
                    <CourseItem
                      key={course.courseid}
                      course={course}
                      onEdit={() => {
                        setEditingCourse(course);
                        setView('edit');
                      }}
                      onDelete={handleDeleteCourse}
                      onUnenroll={() => handleUnenrollCourse(course.courseid)}
                      isEnrolled={true}
                    />
                  ))
                )}
              </div>

              <h1>Unenrolled Courses</h1>
              <div className="course-list">
                {unenrolledCourses.length === 0 ? (
                  <p>No available courses to enroll</p>
                ) : (
                  unenrolledCourses.map((course) => (
                    <CourseItem
                      key={course.courseid}
                      course={course}
                      onEnroll={() => handleEnrollCourse(course.courseid)}
                      isEnrolled={false}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {view === 'create' && (
            <CourseForm onSave={handleCreateCourse} onCancel={() => setView('home')} />
          )}

          {view === 'edit' && editingCourse && (
            <CourseForm
              initialCourse={editingCourse}
              onSave={handleEditCourse}
              onCancel={() => setView('home')}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
