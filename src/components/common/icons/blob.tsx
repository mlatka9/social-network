import * as React from "react"

import { SVGProps } from 'react';

const BlobAnimation = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        filter="blur(0px)"
        width={200}
        height={200}
        style={{
            opacity: 1,
        }}
        {...props}
    >
        <defs>
            <linearGradient id="a" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                    offset="0%"
                    style={{
                        stopColor: "#b5cee8",
                    }}
                />
                <stop
                    offset="100%"
                    style={{
                        stopColor: "#edebff",
                    }}
                />
            </linearGradient>
        </defs>
    </svg>
)

export default BlobAnimation
