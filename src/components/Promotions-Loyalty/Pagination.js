import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Pagination({poolsPerPage, totalPools, paginate}) {
    const [currentPage, setCurrentPage] = useState(1)
    const pageNumbers = [];
    for(let i =1 ; i <= Math.ceil(totalPools / poolsPerPage) ; i++) {
        pageNumbers.push(i);
    }
    return(        
        <React.Fragment>
            <nav>
                <ul>
                { pageNumbers.includes(currentPage - 1) && <button style={{marginRight: '5px'}} onClick={(e) => {
                    setCurrentPage(currentPage - 1);
                    paginate(e, currentPage - 1);
                }}> 
                    ❮
                </button>}
                {pageNumbers.includes(currentPage + 1) && <button onClick={(e) => {
                    setCurrentPage(currentPage + 1);
                    paginate(e, currentPage + 1);
                }}> ❯
                </button>} 
                </ul> 
            </nav>
           
        </React.Fragment>        
    );


}

export default Pagination;
Pagination.propTypes = {
    paginate: PropTypes.func
};
