
import React from "react";
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
        <a href="https://github.com/Arwid-Sjodin/algorithm-visualizer" 
        className="clickable clickable-img github-logo" 
        target="_blank"
        >
            <img src="images/github-mark-white.png" className="github-logo" alt="Github-repository" />
        </a>
    </footer>
  );
}

export default Footer;