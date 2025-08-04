import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/notFound.css';
import { motion } from 'framer-motion';

const NotFound = () => {
  const [seconds, setSeconds] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (seconds === 0) {
      navigate('/');
    }
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds, navigate]);

  return (
    <motion.div
      className="nf-container"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="nf-left text-center">
        <h1>404<br /> Page Not Found.</h1>
        <p>The page you're looking for doesn't exist.<br /></p>
        <p className="timer">Back Home in <span>{`00:00:${seconds.toString().padStart(2, '0')}`}</span></p>
        <button onClick={() => navigate('/')} className="btn-custom">Home Page</button>
      </div>
    </motion.div>
  );
};

export default NotFound;


