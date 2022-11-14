import PropTypes from 'prop-types';
import edit from '../../assets/images/edit.svg';
import confirm from '../../assets/images/conformation.svg';


function DisplayPools({ 
    listOfPools,
    modifyPool,
    viewPoolPrivilege,
    // dateFormat,
    handleRemovePool
}) {
    return (
      <div className="row m-0 p-0 scaling-center">  
        <div className="table-responsive m-0 p-0">
        <div className="col-12 ">
          <table className="table table-borderless mb-1 mt-2">
            <thead>
              <tr className="m-0 p-0">
                <th className="col-1"># Pool-ID</th>
                <th className="col-2">Pool Name</th>
                <th className="col-2">Type</th>
                <th className="col-2">Created By</th>
                <th className="col-2">Created date</th>
                <th className="col-2"></th>

              </tr>
            </thead>
            <tbody>
              {listOfPools.length > 0 && listOfPools.map((item, index) => {
                //  let date=this.dateFormat(date)
                const {
                  PoolID,
                  PoolName,
                  Type,
                  CreatedBy,
                  CreatedOn,
                } = item;
               return( 
               <tr key={index}>
                <td className="col-1 underline geeks">{item.poolId}</td>
                <td className="col-2">{item.poolName}</td>
                <td className="col-2">{item.poolType}</td>
                <td className="col-2">{item.createdBy}</td>
                <td className="col-2">{item.createdDate}</td>
                <td className="col-2">
                  <img disabled={!viewPoolPrivilege?.isEnabeld} onClick={() => modifyPool(item)} src={edit} className="w-12 pb-2" />
                </td>
                </tr> 
                )
              })}
              {listOfPools.length == 0  && <div className='no_records'><img src={confirm}></img> <label>No records found</label></div> }
            </tbody>
          </table>
      </div> 
      </div>
      </div>
    );
}
export default DisplayPools;
DisplayPools.propTypes = {
    listOfPools: PropTypes.array,
    modifyPool: PropTypes.func,
    handleRemovePool: PropTypes.func,
    // dateFormat: PropTypes.func,
  };