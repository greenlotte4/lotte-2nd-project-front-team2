import { Outlet } from "react-router-dom";
import FAQ from "../../components/render/faq";

export default function FAQLayout(){
    return (<>
        <div className="FaqPage">
            <Outlet />
        </div>
    
    </>);
}