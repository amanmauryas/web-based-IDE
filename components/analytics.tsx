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
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9496502750898739"
     crossOrigin="anonymous"></script>