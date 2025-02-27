"use client"; 
import { useEffect } from "react";
import ReactGA from "react-ga4";

const GA_TRACKING_ID = "G-1SZSXHBY3R"; // Replace with your Measurement ID

export default function Analytics() {
  useEffect(() => {
    ReactGA.initialize(GA_TRACKING_ID);
    ReactGA.send("pageview");
  }, []);

  return null;
}
