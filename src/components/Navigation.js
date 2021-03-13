import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => 
    <nav>
        <div>
            <ul>
                <li>
                    <Link to="/">Home</Link> 
                </li>
                <li>
                    <Link to="/profile">My profile</Link>
                </li>
            </ul>
        </div>
    </nav>;


export default Navigation;