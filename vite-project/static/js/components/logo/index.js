import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useSpring, animated } from "react-spring";
import { easeOutCubic, easeOutQuint } from "math/map";
import logoSrc from "./the-feed-logo.svg"; // Ensure you import logoSrc correctly

const flicker = keyframes`
  0% {
    filter: invert(0%);
  }
  50% {
    filter: invert(40%);
  }
  100% {
    filter: invert(0%);
  }
`;

const LogoDiv = animated(styled.div`
  overflow: hidden;
  position: absolute;
  height: 75px;
  top: 30px;
  left: 30px;

  .content {
    position: absolute;
    top: 0;
    display: block;
    white-space: pre;

    a {
      -webkit-user-drag: none;
    }

    img {
      width: 180px;
      &:hover {
        animation: ${flicker} 0.05s linear infinite;
      }

      @media (max-width: 768px) {
        width: 115px;
      }
    }
  }
`);

const Logo = (props) => {
  const content = useRef();

  const [contentWidth, setContentWidth] = useState(0);

  // Define the style spring for width animation
  const style = useSpring({
    width: props.animate === "in" ? contentWidth : 0,
    config: { duration: 800, easing: easeOutQuint },
  });

  // Define the opacity spring for fade-in/fade-out effect
  const opacity = useSpring({
    opacity: props.animate === "in" ? 1 : 0,
    config: { duration: props.animate === "in" ? 500 : 100, easing: easeOutCubic },
    delay: props.animate !== "in" ? 100 : 0,
  });

  useEffect(() => {
    if (content.current) setContentWidth(content.current.clientWidth);
  }, []);

  useLayoutEffect(() => {
    const updateLogoWidth = () => {
      if (content.current) setContentWidth(content.current.clientWidth);
    };
    window.addEventListener("resize", updateLogoWidth);
    return () => window.removeEventListener("resize", updateLogoWidth);
  }, []);

  return (
    <LogoDiv style={{ ...style, opacity: opacity.opacity }}>
      <div ref={content} className="content">
        <a href="https://sessizcigliklar.com/" target="_blank" rel="noopener noreferrer">
          <img draggable="false" src={logoSrc} alt="The Feed" />
        </a>
      </div>
    </LogoDiv>
  );
};

export default Logo;