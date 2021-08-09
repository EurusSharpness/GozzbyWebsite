import {ClientUser} from "./Store";
import Loading from "./Loading";


export function Client(props) {
    return (
      <div>
          {ClientUser ? ClientUser.email : ""}
          <button onClick={()=>props.history.push('/client-cart')}>GO TO CART</button>
      </div>
    );
}

export function ClientCart(props){
    return(
        <div className={'Container'}>
            <Loading/>
        </div>
    );
}
