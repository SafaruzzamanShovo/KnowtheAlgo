import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Documentation } from './pages/Documentation';
import { Admin } from './pages/Admin';
import { Contribute } from './pages/Contribute';
import { Community } from './pages/Community';
import { CommunityPost } from './pages/CommunityPost';
import { AllCourses } from './pages/AllCourses';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-indigo-100 dark:selection:bg-indigo-900/30 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Renamed URL from /about to /collaborate */}
            <Route path="/collaborate" element={<About />} />
            <Route path="/courses" element={<AllCourses />} />
            <Route path="/learn/:subjectId" element={<Documentation />} />
            <Route path="/learn/:subjectId/:topicId" element={<Documentation />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:postId" element={<CommunityPost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
