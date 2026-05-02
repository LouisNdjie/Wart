import {
  LineChart, Line, BarChart, Bar, XAxis,Tooltip, CartesianGrid, ResponsiveContainer,
  Cell, YAxis, Legend
} from "recharts";

import {BsCart3, BsGrid1X2Fill, BsFillArchiveFill, 
 BsPeopleFill, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';



const Admin = () => 
    {

        const data = [
            { name: "Jan", uv: 400 , pv: 50 },
            { name: "Feb", uv: 300 , pv: 80},
            { name: "Mar", uv: 500 , pv: 65},
        ];
        return(
            <main className="main-container">
                <div className="main-title">
                    <h3>DASHBOARD</h3>
                </div>

                <div className="main-cards">
                    <div className="card">
                        <div className="card-inner">
                        <h3>PAINT</h3>
                        <BsFillArchiveFill className='card_icon'/>
                    </div>
                        <h1>300</h1>
                    </div>

                    <div className="card">
                        <div className="card-inner">
                        <h3>COLLECTION</h3>
                        <BsPeopleFill className='card_icon'/>
                    </div>
                        <h1>12</h1>
                    </div>

                    <div className="card">
                        <div className="card-inner">
                        <h3>PAINTERS</h3>
                        <BsPeopleFill className='card_icon'/>
                    </div>
                        <h1>25</h1>
                    </div>

                    <div className="card">
                        <div className="card-inner">
                        <h3>REPORTS</h3>
                        <BsMenuButtonWideFill className='card_icon'/>
                    </div>
                        <h1>12</h1>
                    </div>
                    
                </div>

                <div className="charts">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={500} height={300} data={data} margin={{top:5, right:30, left:20, bottom:5,}}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip />
                            <Legend/>
                            <Bar dataKey="pv" fill="#8884d8" />
                            <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                     </ResponsiveContainer>


                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart width={500} height={300} data={data} margin={{top:5, right:30, left:20, bottom:5,}}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend/>
                            <Line type="monotone" dataKey="pv"stroke="#8884d8" activeDot={{r:8}}/>
                            <Line type="monotone" dataKey="uv" fill="#82ca9d" />
                        </LineChart>
                     </ResponsiveContainer>

                </div>
            </main>
        );
    };

export default Admin;