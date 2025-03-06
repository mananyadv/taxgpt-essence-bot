
import { useEffect } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  useEffect(() => {
    document.title = "TaxBot | Your Tax Assistant";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto pt-24 pb-6 px-4">
        <div className="max-w-4xl mx-auto h-[calc(100vh-150px)] bg-gray-50/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <ChatInterface />
        </div>
      </main>
      
      <footer className="border-t border-gray-100 py-4 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Siemens TaxBot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
