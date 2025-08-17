import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

const UrlMasker = ({children}) => {
const location = useLocation();

  useEffect(() => {
    // Always replace URL with root (no route shown)
    window.history.replaceState({}, "", "/");
  }, [location]);

  return children;
}

export default UrlMasker
