
import {BsCart3, BsGrid1X2Fill, BsFillArchiveFill, 
 BsPeopleFill, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';



const Sidebar = () => 
    {
        return(
            <aside id="sidebar">
                <div className='sidebar-title'>
                    <div className='sidebar-brand'>
                        <BsCart3 className='icon'/>ADMIN
                    </div>
                    <span className='icon close_icon'>X</span>
                </div>
                <ul className='sidebar-list'>
                    <li className='sidebar-list-item'>
                        <a href=''>
                            <BsGrid1X2Fill className='icon'/>Dashboard
                            </a>
                    </li>
                    <li className='sidebar-list-item'>
                        <a href=''>
                            <BsFillArchiveFill className='icon'/>Paint
                        </a>
                    </li>
                    <li className='sidebar-list-item'>
                        <a href=''>
                            <BsPeopleFill className='icon'/>Collectioners
                        </a>
                    </li>
                    <li className='sidebar-list-item'>
                        <a href=''>
                            <BsPeopleFill className='icon'/>Painters
                        </a>
                    </li>
                    <li className='sidebar-list-item'>
                        <a href=''>
                            <BsMenuButtonWideFill className='icon'/>Reports
                            </a>
                    </li>
                    <li className='sidebar-list-item'>
                        <a href=''>
                            <BsFillGearFill className='icon'/>Settings
                        </a>
                    </li>
                </ul>
            </aside>
        );
    };

export default Sidebar;