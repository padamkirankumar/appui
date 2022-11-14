import { Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend, } from 'chart.js'; 
import { Bar } from 'react-chartjs-2';
ChartJS.register(  CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
    ); 

 const SalesByRepresentative = ({ data }) => {
    return (
        <div>          
          {data && data.datasets.length > 0 ?  <Bar data={data} /> : <h6 style={{color: 'red'}}>No Reports For Selected Duration..!</h6> }      
        </div>
    );
    
}
export default SalesByRepresentative;