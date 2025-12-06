import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TracksPage } from './pages/TracksPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { AlbumsPage } from './pages/AlbumsPage';
import { SourcesPage } from './pages/SourcesPage';
import { TagsPage } from './pages/TagsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <Layout>
                <LoginPage />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <RegisterPage />
              </Layout>
            }
          />
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/tracks"
            element={
              <Layout>
                <TracksPage />
              </Layout>
            }
          />
          <Route
            path="/artists"
            element={
              <Layout>
                <ArtistsPage />
              </Layout>
            }
          />
          <Route
            path="/albums"
            element={
              <Layout>
                <AlbumsPage />
              </Layout>
            }
          />
          <Route
            path="/sources"
            element={
              <Layout>
                <SourcesPage />
              </Layout>
            }
          />
          <Route
            path="/tags"
            element={
              <Layout>
                <TagsPage />
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

