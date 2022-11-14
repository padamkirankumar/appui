import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; 
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

 const SalesByCategory = ({ data }) => { 
    return (
        <div> 
          {data && data.datasets[0].data.length > 0 ?  <Doughnut data={data} />  : <h6 style={{color: 'red'}}>No Reports For Selected Duration..!</h6> }    
        </div>
    );
    
}
export default SalesByCategory;