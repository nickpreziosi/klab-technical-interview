"use client"

import * as React from "react"
import { useTheme } from "../../providers/theme-provider"

// Icon variant - from klab-logo-icon.svg
const KLabIconSvg = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="161.66 161.66 167.66 167.66"
      {...props}
    >
      <defs>
        <linearGradient id="klab-icon-lg" x1="147.75" y1="309.36" x2="225.96" y2="258.26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2e6db" />
          <stop offset=".17" stopColor="#f2ccb2" />
          <stop offset=".46" stopColor="#f2a574" />
          <stop offset=".7" stopColor="#f28847" />
          <stop offset=".89" stopColor="#f2762b" />
          <stop offset="1" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-icon-lg1" x1="164.47" y1="306.92" x2="326.52" y2="184.06" href="#klab-icon-lg" />
        <linearGradient id="klab-icon-lg2" x1="233.62" y1="257.92" x2="277.76" y2="370.2" href="#klab-icon-lg" />
        <linearGradient id="klab-icon-lg3" x1="199.77" y1="259.09" x2="285.22" y2="259.09" gradientUnits="userSpaceOnUse">
          <stop offset=".11" stopColor="#f1f1f1" />
          <stop offset=".18" stopColor="#f1edec" />
          <stop offset=".26" stopColor="#f1e5dd" />
          <stop offset=".34" stopColor="#f1d6c6" />
          <stop offset=".43" stopColor="#f1c2a5" />
          <stop offset=".52" stopColor="#f2a77b" />
          <stop offset=".62" stopColor="#f28848" />
          <stop offset=".68" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-icon-lg4" x1="210.34" y1="231.43" x2="383.8" y2="150.9" href="#klab-icon-lg" />
        <linearGradient id="klab-icon-lg5" x1="228.27" y1="165.27" x2="244.23" y2="240.45" gradientUnits="userSpaceOnUse">
          <stop offset=".3" stopColor="#f1f1f1" />
          <stop offset=".37" stopColor="#f1edec" />
          <stop offset=".46" stopColor="#f1e5dd" />
          <stop offset=".55" stopColor="#f1d6c6" />
          <stop offset=".64" stopColor="#f1c2a5" />
          <stop offset=".74" stopColor="#f2a77b" />
          <stop offset=".84" stopColor="#f28848" />
          <stop offset=".91" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-icon-lg6" x1="422.76" y1="157.62" x2="423.79" y2="343.47" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3f424a" />
          <stop offset="1" stopColor="#010101" />
        </linearGradient>
        <linearGradient id="klab-icon-lg7" x1="533.04" y1="157.01" x2="534.07" y2="342.85" href="#klab-icon-lg6" />
        <linearGradient id="klab-icon-lg8" x1="613.37" y1="156.56" x2="614.4" y2="342.41" href="#klab-icon-lg6" />
        <linearGradient id="klab-icon-lg9" x1="701.74" y1="156.07" x2="702.77" y2="341.92" href="#klab-icon-lg6" />
      </defs>
      <g>
        <g>
          <rect x="163.66" y="163.66" width="163.66" height="163.66" rx="34.74" ry="34.74" fill="url(#klab-icon-lg)" />
          <rect x="163.66" y="163.66" width="163.66" height="163.66" rx="34.74" ry="34.74" fill="none" stroke="url(#klab-icon-lg1)" strokeMiterlimit="10" strokeWidth="2" />
          <g>
            <path d="M211.68,219.25l71.83,74.95c2.43,2.54.62,6.75-2.89,6.73l-43-.23c-3.67-.02-7.16-1.59-9.61-4.32l-26.64-29.7c-.66-.74-1.02-1.69-1.02-2.68l.22-40.32c.03-5.8,7.1-8.62,11.11-4.43Z" fill="url(#klab-icon-lg2)" />
            <path d="M285.22,296.96c0,.58-.12,1.16-.35,1.73-.73,1.78-2.57,2.84-4.49,2.83l-42.76-.23c-3.83-.02-7.48-1.66-10.04-4.51l-26.64-29.7c-.76-.85-1.17-1.94-1.17-3.07l.21-40.03c.02-3.04,1.83-5.87,4.68-6.89,2.65-.95,5.48-.28,7.44,1.76l71.83,74.95c.85.88,1.29,2,1.28,3.15ZM200.94,264.01c0,.84.3,1.66.87,2.28l26.64,29.7c2.34,2.61,5.67,4.11,9.18,4.12l42.85.23c1.32,0,2.59-.67,3.19-1.84.67-1.32.44-2.84-.57-3.89l-71.83-74.95c-1.67-1.74-4.09-2.28-6.34-1.42-2.31.89-3.76,3.22-3.77,5.7l-.21,40.07Z" fill="url(#klab-icon-lg3)" />
            <path d="M281.63,196.76l-76.36,67.69c-2.33,2.15-6.1.45-6.03-2.72l.88-37.9c.09-3.9,1.83-7.59,4.78-10.14l31.07-24.42c2.6-2.25,5.94-3.45,9.38-3.37l32.46.75c5.24.12,7.67,6.55,3.82,10.11Z" fill="url(#klab-icon-lg4)" />
            <path d="M202.75,265.98c-.59-.01-1.19-.16-1.76-.44-1.48-.73-2.32-2.34-2.28-3.99l.87-37.7c.09-4.05,1.9-7.88,4.96-10.53l34.06-27c.78-.67,1.77-1.03,2.79-1l36.14.84c2.69.06,5.18,1.67,6.1,4.19.89,2.45.26,5.06-1.66,6.84l-76.36,67.69c-.81.75-1.83,1.13-2.87,1.1ZM245.33,186.47c-3.3-.08-6.52,1.08-9.02,3.24l-31.07,24.42c-2.84,2.46-4.51,6-4.6,9.75l-.87,37.68c-.03,1.22.82,2.71,1.96,3.15,1.1.43,2.3.2,3.18-.61l76.36-67.69c1.64-1.52,2.15-3.77,1.32-5.86-.81-2.02-2.85-3.29-5.03-3.34l-32.23-.75Z" fill="url(#klab-icon-lg5)" />
          </g>
        </g>
      </g>
    </svg>
))
KLabIconSvg.displayName = "KLabIconSvg"

// Full dark - from klab-logo-full-dark.svg
const KLabFullDarkSvg = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="163.66 161 576.81 168" {...props}>
      <defs>
        <linearGradient id="klab-dark-lg" x1="147.75" y1="309.36" x2="225.96" y2="258.26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2e6db" />
          <stop offset=".17" stopColor="#f2ccb2" />
          <stop offset=".46" stopColor="#f2a574" />
          <stop offset=".7" stopColor="#f28847" />
          <stop offset=".89" stopColor="#f2762b" />
          <stop offset="1" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-dark-lg1" x1="164.47" y1="306.92" x2="326.52" y2="184.06" href="#klab-dark-lg" />
        <linearGradient id="klab-dark-lg2" x1="233.62" y1="257.92" x2="277.76" y2="370.2" href="#klab-dark-lg" />
        <linearGradient id="klab-dark-lg3" x1="199.77" y1="259.09" x2="285.22" y2="259.09" gradientUnits="userSpaceOnUse">
          <stop offset=".11" stopColor="#f1f1f1" />
          <stop offset=".18" stopColor="#f1edec" />
          <stop offset=".26" stopColor="#f1e5dd" />
          <stop offset=".34" stopColor="#f1d6c6" />
          <stop offset=".43" stopColor="#f1c2a5" />
          <stop offset=".52" stopColor="#f2a77b" />
          <stop offset=".62" stopColor="#f28848" />
          <stop offset=".68" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-dark-lg4" x1="210.34" y1="231.43" x2="383.8" y2="150.9" href="#klab-dark-lg" />
        <linearGradient id="klab-dark-lg5" x1="228.27" y1="165.27" x2="244.23" y2="240.45" gradientUnits="userSpaceOnUse">
          <stop offset=".3" stopColor="#f1f1f1" />
          <stop offset=".37" stopColor="#f1edec" />
          <stop offset=".46" stopColor="#f1e5dd" />
          <stop offset=".55" stopColor="#f1d6c6" />
          <stop offset=".64" stopColor="#f1c2a5" />
          <stop offset=".74" stopColor="#f2a77b" />
          <stop offset=".84" stopColor="#f28848" />
          <stop offset=".91" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-dark-lg6" x1="422.76" y1="157.62" x2="423.79" y2="343.47" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3f424a" />
          <stop offset="1" stopColor="#010101" />
        </linearGradient>
        <linearGradient id="klab-dark-lg7" x1="533.04" y1="157.01" x2="534.07" y2="342.85" href="#klab-dark-lg6" />
        <linearGradient id="klab-dark-lg8" x1="613.37" y1="156.56" x2="614.4" y2="342.41" href="#klab-dark-lg6" />
        <linearGradient id="klab-dark-lg9" x1="701.74" y1="156.07" x2="702.77" y2="341.92" href="#klab-dark-lg6" />
      </defs>
      <g>
        <g>
          <rect x="163.66" y="163.66" width="163.66" height="163.66" rx="34.74" ry="34.74" fill="url(#klab-dark-lg)" />
          <rect x="163.66" y="163.66" width="163.66" height="163.66" rx="34.74" ry="34.74" fill="none" stroke="url(#klab-dark-lg1)" strokeMiterlimit="10" strokeWidth="2" />
          <g>
            <path d="M211.68,219.25l71.83,74.95c2.43,2.54.62,6.75-2.89,6.73l-43-.23c-3.67-.02-7.16-1.59-9.61-4.32l-26.64-29.7c-.66-.74-1.02-1.69-1.02-2.68l.22-40.32c.03-5.8,7.1-8.62,11.11-4.43Z" fill="url(#klab-dark-lg2)" />
            <path d="M285.22,296.96c0,.58-.12,1.16-.35,1.73-.73,1.78-2.57,2.84-4.49,2.83l-42.76-.23c-3.83-.02-7.48-1.66-10.04-4.51l-26.64-29.7c-.76-.85-1.17-1.94-1.17-3.07l.21-40.03c.02-3.04,1.83-5.87,4.68-6.89,2.65-.95,5.48-.28,7.44,1.76l71.83,74.95c.85.88,1.29,2,1.28,3.15ZM200.94,264.01c0,.84.3,1.66.87,2.28l26.64,29.7c2.34,2.61,5.67,4.11,9.18,4.12l42.85.23c1.32,0,2.59-.67,3.19-1.84.67-1.32.44-2.84-.57-3.89l-71.83-74.95c-1.67-1.74-4.09-2.28-6.34-1.42-2.31.89-3.76,3.22-3.77,5.7l-.21,40.07Z" fill="url(#klab-dark-lg3)" />
            <path d="M281.63,196.76l-76.36,67.69c-2.33,2.15-6.1.45-6.03-2.72l.88-37.9c.09-3.9,1.83-7.59,4.78-10.14l31.07-24.42c2.6-2.25,5.94-3.45,9.38-3.37l32.46.75c5.24.12,7.67,6.55,3.82,10.11Z" fill="url(#klab-dark-lg4)" />
            <path d="M202.75,265.98c-.59-.01-1.19-.16-1.76-.44-1.48-.73-2.32-2.34-2.28-3.99l.87-37.7c.09-4.05,1.9-7.88,4.96-10.53l34.06-27c.78-.67,1.77-1.03,2.79-1l36.14.84c2.69.06,5.18,1.67,6.1,4.19.89,2.45.26,5.06-1.66,6.84l-76.36,67.69c-.81.75-1.83,1.13-2.87,1.1ZM245.33,186.47c-3.3-.08-6.52,1.08-9.02,3.24l-31.07,24.42c-2.84,2.46-4.51,6-4.6,9.75l-.87,37.68c-.03,1.22.82,2.71,1.96,3.15,1.1.43,2.3.2,3.18-.61l76.36-67.69c1.64-1.52,2.15-3.77,1.32-5.86-.81-2.02-2.85-3.29-5.03-3.34l-32.23-.75Z" fill="url(#klab-dark-lg5)" />
          </g>
        </g>
        <g>
          <path d="M422.37,251.02h-24.74v51.45h-6.98c-6.16,0-11.16-5-11.16-11.16v-94.31c0-5.51,4.46-9.97,9.97-9.97h8.17v46.67h24.24l25.23-46.67h18.8v1.65l-28.37,52.94,30.02,59.2v1.65h-18.8l-26.39-51.45Z" fill="url(#klab-dark-lg6)" />
          <path d="M508.16,187.03h7.88v98.12h53.6v17.32h-59.51c-6.75,0-12.23-5.47-12.23-12.23v-92.95c0-5.67,4.6-10.26,10.26-10.26Z" fill="url(#klab-dark-lg7)" />
          <path d="M575.4,276.25c0-13.85,9.73-25.73,29.85-25.73h22.92v-3.63c0-7.26-5.28-15.17-17.48-15.17-7.98,0-12.67,3.75-14.95,7.91-1.47,2.68-4.34,4.3-7.39,4.3h-10.64c1.65-16,14.02-28.2,32.98-28.2,23.25,0,34.63,16.33,34.63,31.17v35.95c0,3.3,1.65,4.29,4.45,4.29h0c1.64,0,2.97,1.33,2.97,2.97v12.37h-10.55c-8.08,0-12.53-4.45-12.53-11.71v-.16c-3.46,7.26-11.38,13.36-24.9,13.36-16.16,0-29.35-11.05-29.35-27.71ZM607.56,288.29c13.85,0,20.61-8.91,20.61-18.8v-4.29h-22.76c-6.93,0-12.53,4.29-12.53,11.05,0,7.59,6.43,12.04,14.68,12.04Z" fill="url(#klab-dark-lg8)" />
          <path d="M681.6,295.71v6.76h-3.94c-7.39,0-13.38-5.99-13.38-13.38v-91.41c0-5.88,4.77-10.65,10.65-10.65h6.67v36.94c5.44-5.11,12.7-8.25,22.26-8.25,24.9,0,36.61,19.13,36.61,40.07v8.08c0,20.94-11.71,40.07-36.61,40.07-9.56,0-16.82-3.13-22.26-8.25ZM702.38,287.46c14.35,0,20.78-10.88,20.78-23.58v-8.08c0-12.7-6.43-23.75-20.78-23.75s-20.78,11.05-20.78,23.75v8.08c0,12.7,6.43,23.58,20.78,23.58Z" fill="url(#klab-dark-lg9)" />
        </g>
      </g>
    </svg>
))
KLabFullDarkSvg.displayName = "KLabFullDarkSvg"

// Full light - from klab-logo-full-light.svg
const KLabFullLightSvg = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="163.66 161 576.81 168" {...props}>
      <defs>
        <linearGradient id="klab-light-d1" x1="147.75" y1="180.65" x2="225.96" y2="231.75" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2e6db" />
          <stop offset=".17" stopColor="#f2ccb2" />
          <stop offset=".46" stopColor="#f2a574" />
          <stop offset=".7" stopColor="#f28847" />
          <stop offset=".89" stopColor="#f2762b" />
          <stop offset="1" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-light-d2" x1="164.44" y1="183.06" x2="326.54" y2="305.96" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2e6db" />
          <stop offset=".17" stopColor="#f2ccb2" />
          <stop offset=".46" stopColor="#f2a574" />
          <stop offset=".7" stopColor="#f28847" />
          <stop offset=".89" stopColor="#f2762b" />
          <stop offset="1" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-light-d3" x1="233.62" y1="232.08" x2="277.76" y2="119.8" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2e6db" />
          <stop offset=".17" stopColor="#f2ccb2" />
          <stop offset=".46" stopColor="#f2a574" />
          <stop offset=".7" stopColor="#f28847" />
          <stop offset=".89" stopColor="#f2762b" />
          <stop offset="1" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-light-d4" x1="199.77" y1="230.91" x2="285.22" y2="230.91" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset=".11" stopColor="#f1f1f1" />
          <stop offset=".18" stopColor="#f1edec" />
          <stop offset=".26" stopColor="#f1e5dd" />
          <stop offset=".34" stopColor="#f1d6c6" />
          <stop offset=".43" stopColor="#f1c2a5" />
          <stop offset=".52" stopColor="#f2a77b" />
          <stop offset=".62" stopColor="#f28848" />
          <stop offset=".68" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-light-d5" x1="210.34" y1="258.56" x2="383.8" y2="339.09" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2e6db" />
          <stop offset=".17" stopColor="#f2ccb2" />
          <stop offset=".46" stopColor="#f2a574" />
          <stop offset=".7" stopColor="#f28847" />
          <stop offset=".89" stopColor="#f2762b" />
          <stop offset="1" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-light-d6" x1="228.26" y1="324.73" x2="244.22" y2="249.55" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset=".3" stopColor="#f1f1f1" />
          <stop offset=".37" stopColor="#f1edec" />
          <stop offset=".46" stopColor="#f1e5dd" />
          <stop offset=".55" stopColor="#f1d6c6" />
          <stop offset=".64" stopColor="#f1c2a5" />
          <stop offset=".74" stopColor="#f2a77b" />
          <stop offset=".84" stopColor="#f28848" />
          <stop offset=".91" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-light-lg" x1="423.52" y1="187.03" x2="423.52" y2="302.47" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".33" stopColor="#fefdfc" />
          <stop offset=".52" stopColor="#fdf7f4" />
          <stop offset=".67" stopColor="#fbeee6" />
          <stop offset=".8" stopColor="#f9e1d2" />
          <stop offset=".92" stopColor="#f5d0b9" />
          <stop offset="1" stopColor="#f3c3a5" />
        </linearGradient>
        <linearGradient id="klab-light-lg2" x1="533.77" x2="533.77" href="#klab-light-lg" />
        <linearGradient id="klab-light-lg3" x1="614.07" y1="215.73" x2="614.07" y2="303.97" href="#klab-light-lg" />
        <linearGradient id="klab-light-lg4" x1="702.37" x2="702.37" y2="303.94" href="#klab-light-lg" />
      </defs>
      <g>
        <g>
          <rect x="163.66" y="163.66" width="163.66" height="163.66" rx="34.74" ry="34.74" fill="url(#klab-light-d1)" />
          <rect x="163.66" y="163.66" width="163.66" height="163.66" rx="34.74" ry="34.74" fill="none" stroke="url(#klab-light-d2)" strokeMiterlimit="10" strokeWidth="2" />
          <g>
            <path d="M211.68,219.25l71.83,74.95c2.43,2.54.62,6.75-2.89,6.73l-43-.23c-3.67-.02-7.16-1.59-9.61-4.32l-26.64-29.7c-.66-.74-1.02-1.69-1.02-2.68l.22-40.32c.03-5.8,7.1-8.62,11.11-4.43Z" fill="url(#klab-light-d3)" />
            <path d="M285.22,296.96c0,.58-.12,1.16-.35,1.73-.73,1.78-2.57,2.84-4.49,2.83l-42.76-.23c-3.83-.02-7.48-1.66-10.04-4.51l-26.64-29.7c-.76-.85-1.17-1.94-1.17-3.07l.21-40.03c.02-3.04,1.83-5.87,4.68-6.89,2.65-.95,5.48-.28,7.44,1.76l71.83,74.95c.85.88,1.29,2,1.28,3.15h0ZM200.94,264.01c0,.84.3,1.66.87,2.28l26.64,29.7c2.34,2.61,5.67,4.11,9.18,4.12l42.85.23c1.32,0,2.59-.67,3.19-1.84.67-1.32.44-2.84-.57-3.89l-71.83-74.95c-1.67-1.74-4.09-2.28-6.34-1.42-2.31.89-3.76,3.22-3.77,5.7l-.21,40.07h0Z" fill="url(#klab-light-d4)" />
            <path d="M281.63,196.76l-76.36,67.69c-2.33,2.15-6.1.45-6.03-2.72l.88-37.9c.09-3.9,1.83-7.59,4.78-10.14l31.07-24.42c2.6-2.25,5.94-3.45,9.38-3.37l32.46.75c5.24.12,7.67,6.55,3.82,10.11h0Z" fill="url(#klab-light-d5)" />
            <path d="M202.75,265.98c-.59-.01-1.19-.16-1.76-.44-1.48-.73-2.32-2.34-2.28-3.99l.87-37.7c.09-4.05,1.9-7.88,4.96-10.53l34.06-27c.78-.67,1.77-1.03,2.79-1l36.14.84c2.69.06,5.18,1.67,6.1,4.19.89,2.45.26,5.06-1.66,6.84l-76.36,67.69c-.81.75-1.83,1.13-2.87,1.1h0ZM245.33,186.47c-3.3-.08-6.52,1.08-9.02,3.24l-31.07,24.42c-2.84,2.46-4.51,6-4.6,9.75l-.87,37.68c-.03,1.22.82,2.71,1.96,3.15,1.1.43,2.3.2,3.18-.61l76.36-67.69c1.64-1.52,2.15-3.77,1.32-5.86-.81-2.02-2.85-3.29-5.03-3.34l-32.23-.75h0Z" fill="url(#klab-light-d6)" />
          </g>
        </g>
        <g>
          <path d="M422.37,251.02h-24.74v51.45h-6.98c-6.16,0-11.16-5-11.16-11.16v-94.31c0-5.51,4.46-9.97,9.97-9.97h8.17v46.67h24.24l25.23-46.67h18.8v1.65l-28.37,52.94,30.02,59.2v1.65h-18.8l-26.39-51.45h.01Z" fill="url(#klab-light-lg)" />
          <path d="M508.16,187.03h7.88v98.12h53.6v17.32h-59.51c-6.75,0-12.23-5.47-12.23-12.23v-92.95c0-5.67,4.6-10.26,10.26-10.26h0Z" fill="url(#klab-light-lg2)" />
          <path d="M575.4,276.25c0-13.85,9.73-25.73,29.85-25.73h22.92v-3.63c0-7.26-5.28-15.17-17.48-15.17-7.98,0-12.67,3.75-14.95,7.91-1.47,2.68-4.34,4.3-7.39,4.3h-10.64c1.65-16,14.02-28.2,32.98-28.2,23.25,0,34.63,16.33,34.63,31.17v35.95c0,3.3,1.65,4.29,4.45,4.29h0c1.64,0,2.97,1.33,2.97,2.97v12.37h-10.55c-8.08,0-12.53-4.45-12.53-11.71v-.16c-3.46,7.26-11.38,13.36-24.9,13.36-16.16,0-29.35-11.05-29.35-27.71h0ZM607.56,288.29c13.85,0,20.61-8.91,20.61-18.8v-4.29h-22.76c-6.93,0-12.53,4.29-12.53,11.05,0,7.59,6.43,12.04,14.68,12.04h0Z" fill="url(#klab-light-lg3)" />
          <path d="M681.6,295.71v6.76h-3.94c-7.39,0-13.38-5.99-13.38-13.38v-91.41c0-5.88,4.77-10.65,10.65-10.65h6.67v36.94c5.44-5.11,12.7-8.25,22.26-8.25,24.9,0,36.61,19.13,36.61,40.07v8.08c0,20.94-11.71,40.07-36.61,40.07-9.56,0-16.82-3.13-22.26-8.25v.02ZM702.38,287.46c14.35,0,20.78-10.88,20.78-23.58v-8.08c0-12.7-6.43-23.75-20.78-23.75s-20.78,11.05-20.78,23.75v8.08c0,12.7,6.43,23.58,20.78,23.58Z" fill="url(#klab-light-lg4)" />
        </g>
      </g>
    </svg>
))
KLabFullLightSvg.displayName = "KLabFullLightSvg"

// Full white - from klab-logo-full-white.svg
const KLabFullWhiteSvg = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="163.66 161 576.81 168" {...props}>
      <defs>
        <linearGradient id="klab-white-d1" x1="147.75" y1="180.65" x2="225.96" y2="231.75" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2e6db" />
          <stop offset=".17" stopColor="#f2ccb2" />
          <stop offset=".46" stopColor="#f2a574" />
          <stop offset=".7" stopColor="#f28847" />
          <stop offset=".89" stopColor="#f2762b" />
          <stop offset="1" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-white-d2" x1="164.44" y1="183.06" x2="326.54" y2="305.96" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2e6db" />
          <stop offset=".17" stopColor="#f2ccb2" />
          <stop offset=".46" stopColor="#f2a574" />
          <stop offset=".7" stopColor="#f28847" />
          <stop offset=".89" stopColor="#f2762b" />
          <stop offset="1" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-white-d3" x1="233.62" y1="232.08" x2="277.76" y2="119.8" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2e6db" />
          <stop offset=".17" stopColor="#f2ccb2" />
          <stop offset=".46" stopColor="#f2a574" />
          <stop offset=".7" stopColor="#f28847" />
          <stop offset=".89" stopColor="#f2762b" />
          <stop offset="1" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-white-d4" x1="199.77" y1="230.91" x2="285.22" y2="230.91" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset=".11" stopColor="#f1f1f1" />
          <stop offset=".18" stopColor="#f1edec" />
          <stop offset=".26" stopColor="#f1e5dd" />
          <stop offset=".34" stopColor="#f1d6c6" />
          <stop offset=".43" stopColor="#f1c2a5" />
          <stop offset=".52" stopColor="#f2a77b" />
          <stop offset=".62" stopColor="#f28848" />
          <stop offset=".68" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-white-d5" x1="210.34" y1="258.56" x2="383.8" y2="339.09" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2e6db" />
          <stop offset=".17" stopColor="#f2ccb2" />
          <stop offset=".46" stopColor="#f2a574" />
          <stop offset=".7" stopColor="#f28847" />
          <stop offset=".89" stopColor="#f2762b" />
          <stop offset="1" stopColor="#f37021" />
        </linearGradient>
        <linearGradient id="klab-white-d6" x1="228.26" y1="324.73" x2="244.22" y2="249.55" gradientTransform="translate(0 490) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset=".3" stopColor="#f1f1f1" />
          <stop offset=".37" stopColor="#f1edec" />
          <stop offset=".46" stopColor="#f1e5dd" />
          <stop offset=".55" stopColor="#f1d6c6" />
          <stop offset=".64" stopColor="#f1c2a5" />
          <stop offset=".74" stopColor="#f2a77b" />
          <stop offset=".84" stopColor="#f28848" />
          <stop offset=".91" stopColor="#f37021" />
        </linearGradient>
      </defs>
      <g>
        <g>
          <rect x="163.66" y="163.66" width="163.66" height="163.66" rx="34.74" ry="34.74" fill="url(#klab-white-d1)" />
          <rect x="163.66" y="163.66" width="163.66" height="163.66" rx="34.74" ry="34.74" fill="none" stroke="url(#klab-white-d2)" strokeMiterlimit="10" strokeWidth="2" />
          <g>
            <path d="M211.68,219.25l71.83,74.95c2.43,2.54.62,6.75-2.89,6.73l-43-.23c-3.67-.02-7.16-1.59-9.61-4.32l-26.64-29.7c-.66-.74-1.02-1.69-1.02-2.68l.22-40.32c.03-5.8,7.1-8.62,11.11-4.43Z" fill="url(#klab-white-d3)" />
            <path d="M285.22,296.96c0,.58-.12,1.16-.35,1.73-.73,1.78-2.57,2.84-4.49,2.83l-42.76-.23c-3.83-.02-7.48-1.66-10.04-4.51l-26.64-29.7c-.76-.85-1.17-1.94-1.17-3.07l.21-40.03c.02-3.04,1.83-5.87,4.68-6.89,2.65-.95,5.48-.28,7.44,1.76l71.83,74.95c.85.88,1.29,2,1.28,3.15h0ZM200.94,264.01c0,.84.3,1.66.87,2.28l26.64,29.7c2.34,2.61,5.67,4.11,9.18,4.12l42.85.23c1.32,0,2.59-.67,3.19-1.84.67-1.32.44-2.84-.57-3.89l-71.83-74.95c-1.67-1.74-4.09-2.28-6.34-1.42-2.31.89-3.76,3.22-3.77,5.7l-.21,40.07h0Z" fill="url(#klab-white-d4)" />
            <path d="M281.63,196.76l-76.36,67.69c-2.33,2.15-6.1.45-6.03-2.72l.88-37.9c.09-3.9,1.83-7.59,4.78-10.14l31.07-24.42c2.6-2.25,5.94-3.45,9.38-3.37l32.46.75c5.24.12,7.67,6.55,3.82,10.11h0Z" fill="url(#klab-white-d5)" />
            <path d="M202.75,265.98c-.59-.01-1.19-.16-1.76-.44-1.48-.73-2.32-2.34-2.28-3.99l.87-37.7c.09-4.05,1.9-7.88,4.96-10.53l34.06-27c.78-.67,1.77-1.03,2.79-1l36.14.84c2.69.06,5.18,1.67,6.1,4.19.89,2.45.26,5.06-1.66,6.84l-76.36,67.69c-.81.75-1.83,1.13-2.87,1.1h0ZM245.33,186.47c-3.3-.08-6.52,1.08-9.02,3.24l-31.07,24.42c-2.84,2.46-4.51,6-4.6,9.75l-.87,37.68c-.03,1.22.82,2.71,1.96,3.15,1.1.43,2.3.2,3.18-.61l76.36-67.69c1.64-1.52,2.15-3.77,1.32-5.86-.81-2.02-2.85-3.29-5.03-3.34l-32.23-.75h0Z" fill="url(#klab-white-d6)" />
          </g>
        </g>
        <g>
          <path d="M422.37,251.02h-24.74v51.45h-6.98c-6.16,0-11.16-5-11.16-11.16v-94.31c0-5.51,4.46-9.97,9.97-9.97h8.17v46.67h24.24l25.23-46.67h18.8v1.65l-28.37,52.94,30.02,59.2v1.65h-18.8l-26.39-51.45h.01Z" fill="#fff" />
          <path d="M508.16,187.03h7.88v98.12h53.6v17.32h-59.51c-6.75,0-12.23-5.47-12.23-12.23v-92.95c0-5.67,4.6-10.26,10.26-10.26h0Z" fill="#fff" />
          <path d="M575.4,276.25c0-13.85,9.73-25.73,29.85-25.73h22.92v-3.63c0-7.26-5.28-15.17-17.48-15.17-7.98,0-12.67,3.75-14.95,7.91-1.47,2.68-4.34,4.3-7.39,4.3h-10.64c1.65-16,14.02-28.2,32.98-28.2,23.25,0,34.63,16.33,34.63,31.17v35.95c0,3.3,1.65,4.29,4.45,4.29h0c1.64,0,2.97,1.33,2.97,2.97v12.37h-10.55c-8.08,0-12.53-4.45-12.53-11.71v-.16c-3.46,7.26-11.38,13.36-24.9,13.36-16.16,0-29.35-11.05-29.35-27.71h0ZM607.56,288.29c13.85,0,20.61-8.91,20.61-18.8v-4.29h-22.76c-6.93,0-12.53,4.29-12.53,11.05,0,7.59,6.43,12.04,14.68,12.04h0Z" fill="#fff" />
          <path d="M681.6,295.71v6.76h-3.94c-7.39,0-13.38-5.99-13.38-13.38v-91.41c0-5.88,4.77-10.65,10.65-10.65h6.67v36.94c5.44-5.11,12.7-8.25,22.26-8.25,24.9,0,36.61,19.13,36.61,40.07v8.08c0,20.94-11.71,40.07-36.61,40.07-9.56,0-16.82-3.13-22.26-8.25v.02ZM702.38,287.46c14.35,0,20.78-10.88,20.78-23.58v-8.08c0-12.7-6.43-23.75-20.78-23.75s-20.78,11.05-20.78,23.75v8.08c0,12.7,6.43,23.58,20.78,23.58Z" fill="#fff" />
        </g>
      </g>
    </svg>
))
KLabFullWhiteSvg.displayName = "KLabFullWhiteSvg"

export interface KLabLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "icon" | "dark" | "light" | "black" | "white" | "color"
  /** Accessible label (mapped to aria-label on the SVG) */
  alt?: string
}

export const KLabLogo = React.forwardRef<SVGSVGElement, KLabLogoProps>(
  ({ variant, alt, ...props }, ref) => {
    const { resolvedTheme, mounted } = useTheme()
    const resolvedVariant = React.useMemo(() => {
      // "color" = theme-based (dynamic); "black" → dark; "white" → white
      if (variant === "icon" || variant === "light" || variant === "white") return variant
      if (variant === "black" || variant === "dark") return "dark"
      // variant undefined or "color" → theme-based
      if (!mounted) return "dark"
      return resolvedTheme === "dark" ? "light" : "dark"
    }, [variant, resolvedTheme, mounted])
    const svgProps = { ...props, ...(alt != null && { "aria-label": alt }) }
    if (resolvedVariant === "icon") return <KLabIconSvg ref={ref} {...svgProps} />
    if (resolvedVariant === "light") return <KLabFullLightSvg ref={ref} {...svgProps} />
    if (resolvedVariant === "white") return <KLabFullWhiteSvg ref={ref} {...svgProps} />
    return <KLabFullDarkSvg ref={ref} {...svgProps} />
  }
)

KLabLogo.displayName = "KLabLogo"
