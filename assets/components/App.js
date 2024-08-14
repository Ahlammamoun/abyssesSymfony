import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CategoryGrid from './CategoryGrid';
import SpeciesList from './SpeciesList';
import TypeSpeciesList from './TypeSpeciesList';
import SpeciesDetail from './SpeciesDetail';
import UserProfile from './UserProfile'; 



function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <main className="container my-4">
                    <Routes>
                        <Route path="/" element={<CategoryGrid />} />
                        <Route path="/category/:id" element={<SpeciesList />} />
                        <Route path="/type/:id" element={<TypeSpeciesList />} />
                        <Route path="/species/:id" element={<SpeciesDetail />} />
                        <Route path="/profile" element={<UserProfile />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
