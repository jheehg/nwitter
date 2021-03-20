import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => 
    <nav>
        <div>
            <ul>
                <li>
                    <Link to="/">Home</Link> 
                </li>
                <li>
                    <Link to="/profile">{userObj.displayName}의 Profile</Link>
                </li>
            </ul>
        </div>
    </nav>;


export default Navigation;