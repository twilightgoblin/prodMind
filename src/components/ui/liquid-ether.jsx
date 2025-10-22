import React from 'react';

const LiquidEther = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="liquid-ether">
        <div className="liquid-ether-blob blob-1"></div>
        <div className="liquid-ether-blob blob-2"></div>
        <div className="liquid-ether-blob blob-3"></div>
        <div className="liquid-ether-blob blob-4"></div>
        <div className="liquid-ether-blob blob-5"></div>
      </div>
      
      <style jsx>{`
        .liquid-ether {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #000000, #1a1a1a, #000000);
          overflow: hidden;
        }

        .liquid-ether-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          mix-blend-mode: screen;
          animation: float 20s infinite ease-in-out;
        }

        .blob-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 100%);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
          animation-duration: 25s;
        }

        .blob-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 100%);
          top: 60%;
          right: 10%;
          animation-delay: -5s;
          animation-duration: 30s;
        }

        .blob-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.06) 50%, transparent 100%);
          bottom: 20%;
          left: 20%;
          animation-delay: -10s;
          animation-duration: 22s;
        }

        .blob-4 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%);
          top: 30%;
          left: 50%;
          animation-delay: -15s;
          animation-duration: 28s;
        }

        .blob-5 {
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 100%);
          top: 70%;
          left: 70%;
          animation-delay: -20s;
          animation-duration: 35s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(-30px, -50px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translate(50px, -30px) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translate(-20px, 40px) rotate(270deg) scale(1.05);
          }
        }

        @media (max-width: 768px) {
          .blob-1, .blob-2, .blob-3, .blob-4, .blob-5 {
            width: 200px;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default LiquidEther;