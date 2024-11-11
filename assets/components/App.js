import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CategoryGrid from './CategoryGrid';
import SpeciesList from './SpeciesList';
import TypeSpeciesList from './TypeSpeciesList';
import SpeciesDetail from './SpeciesDetail';
import UserProfile from './UserProfile'; 
import AvisForm from './FormAvis';
import CreateCategoryWithSpeciesForm from './CreateCategoryWithSpeciesForm';
import UpdateCategoryForm from './UpdateCategoryForm';


function App() {
    const [user, setUser] = useState(null); // État utilisateur partagé

     // Load user from localStorage on app load
     useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

     // Save user to localStorage whenever user state changes
     useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user'); // Clear storage on logout
        }
    }, [user]);


    return (
        <Router>
            <div>
                <Navbar user={user} setUser={setUser} />
                <main className="container my-4">
                    <Routes>
                        <Route path="/abysses" element={<CategoryGrid user={user}/>} />
                        <Route path="/category/:id" element={<SpeciesList user={user} />} />
                        <Route path="/type/:id" element={<TypeSpeciesList />} />
                        <Route path="/species/:id" element={<SpeciesDetail  user={user} />} />
                        <Route path="/profile" element={<UserProfile setUser={setUser}/>} />
                        <Route path="/create-category" element={<CreateCategoryWithSpeciesForm />} />
                        <Route path="/update-category/:id" element={<UpdateCategoryForm user={user}/>} />
                        {/* <Route path="/species/:id/avis" element={<AvisForm speciesId={1} user={user} setUser={setUser}/>} /> */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
