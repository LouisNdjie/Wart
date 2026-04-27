import './AdminLayout.css';
import Header from '../Components/header';
import Sidebar from '../Components/sidebar';
import Admin from '../Components/admin';

const AdminLayout = () => {
    return (
        <div className="grid-container">
            <Header />
            <Sidebar />
            <Admin />
        </div> 
    )

};

export default AdminLayout;