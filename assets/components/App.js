import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CategoryGrid from './CategoryGrid';
import SpeciesList from './SpeciesList';
import TypeSpeciesList from './TypeSpeciesList';
import SpeciesDetail from './SpeciesDetail';
import UserProfile from './UserProfile'; 



function App() {
    const [user, setUser] = useState(null); // État utilisateur partagé

    return (
        <Router>
            <div>
                <Navbar user={user} setUser={setUser} />
                <main className="container my-4">
                    <Routes>
                        <Route path="/" element={<CategoryGrid />} />
                        <Route path="/category/:id" element={<SpeciesList />} />
                        <Route path="/type/:id" element={<TypeSpeciesList />} />
                        <Route path="/species/:id" element={<SpeciesDetail />} />
                        <Route path="/profile" element={<UserProfile setUser={setUser}/>} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
