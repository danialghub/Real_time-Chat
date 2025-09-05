import { useRoutes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import { AuthContext } from './context/AuthContext'
import { useContext } from 'react'

const Router = () => {

    const { authUser } = useContext(AuthContext)

    const routes = [
        {
            path: '/',
            element: authUser ? <Home /> : <Navigate to="/login" />
        },
        {
            path: '/login',
            element: authUser ? <Navigate to="/" /> : <Login />
        },
        {
            path: '/profile',
            element: authUser ? <Profile /> : <Navigate to="/login" />
        },
        {
            path: '*',
            element: <h1>404 Not Found</h1>
        },
    ]
    const router = useRoutes(routes)
    return router
}

export default Router