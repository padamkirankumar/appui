import URMService from '../services/URM/URMService';

const getChildPrivileges = (subPrivilege) => {
    let childPrivileges = [];
    const user = JSON.parse(sessionStorage.getItem('user'));
    let data = URMService.getSubPrivilegesbyRoleId(user["custom:roleName"]).then(res => {
        if (res) {
            let initialValue = {
                mobile: [],
                web: []
            }
            if (res.data.parentPrivileges) {
                const result = res.data.parentPrivileges.reduce((accumulator, current) => {
                    (current.previlegeType === 'Mobile') ? accumulator.mobile.push(current) : accumulator.web.push(current);
                    return accumulator;
                }, initialValue);
                result.web.forEach((parent) => {
                    parent.subPrivileges.forEach((sub) => {
                        if (sub.name === subPrivilege) {
                            sub.childPrivileges.forEach((child) => {
                                childPrivileges.push(child);
                            });
                        }
                    });
                });
            }
        }
        return childPrivileges;
    });
    return data;
}
export default getChildPrivileges;
