import { Redirect, Route } from "react-router-dom";
import Login from "../components/login/Login";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const user = JSON.parse(sessionStorage.getItem('token'));
    return <Route {...rest} render={(props) => (
        user !== null
            ? <Component {...props} user={user} />
            : <Redirect to='/' /> 
            // : <Login /> 
        )} 
    />
}
export default  PrivateRoute;