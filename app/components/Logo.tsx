// Place this code in your Next.js component file, e.g., components/Logo.js
import { Search } from 'lucide-react';
export default function Logo() {
  return (
    <div className="flex items-center">
    {/* Logo SVG */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" className="h-10 w-32">
      <rect width="200" height="60" fill="transparent"/>
      
      <g stroke="#f9731620" strokeWidth="0.5">
        <line x1="20" y1="0" x2="20" y2="60"/>
        <line x1="60" y1="0" x2="60" y2="60"/>
        <line x1="100" y1="0" x2="100" y2="60"/>
        <line x1="140" y1="0" x2="140" y2="60"/>
        <line x1="180" y1="0" x2="180" y2="60"/>
      </g>
      
      <g stroke="#f9731620" strokeWidth="0.5">
        <line x1="0" y1="15" x2="200" y2="15"/>
        <line x1="0" y1="25" x2="200" y2="25"/>
        <line x1="0" y1="35" x2="200" y2="35"/>
        <line x1="0" y1="45" x2="200" y2="45"/>
        <line x1="0" y1="55" x2="200" y2="55"/>
      </g>
      
      <line x1="100" y1="0" x2="100" y2="60" stroke="#f9731640" strokeWidth="1"/>
      <line x1="0" y1="35" x2="200" y2="35" stroke="#f9731640" strokeWidth="1"/>
      
      <path d="M 20 55 L 100 55 C 110 55 115 15 180 15" 
            stroke="#f97316" 
            fill="none" 
            strokeWidth="4"
            strokeLinecap="round"/>
      
      <path d="M 20 15 L 100 15 C 110 15 115 55 180 55" 
            stroke="#f97316" 
            fill="none" 
            strokeWidth="4"
            strokeLinecap="round"/>
      
      <path d="M 20 25 L 100 25 C 110 25 115 45 180 45" 
            stroke="#f97316" 
            fill="none" 
            strokeWidth="2.5"
            strokeDasharray="4"
            strokeLinecap="round"/>
      
      <path d="M 20 45 L 100 45 C 110 45 115 25 180 25" 
            stroke="#f97316" 
            fill="none" 
            strokeWidth="2.5"
            strokeDasharray="4"
            strokeLinecap="round"/>
    </svg>
    
    
  </div>
  );
}
