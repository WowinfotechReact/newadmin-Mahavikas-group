import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const GetCompanyBaseURI = `${Base_Url}/AdminUser`;



export const GetCompanyLookupList = async () => {
  const url = `${GetCompanyBaseURI}/GetCompanyLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetRoleLookupList = async () => {
  const url = `${GetCompanyBaseURI}/GetRoleLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const AddUpdateAdminUser = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

  const res = await postApiWithAuthenticated(`${GetCompanyBaseURI}${url}`, params);
  return res;
};
export const GetAdminUserModel = async (id) => {
  let url = `${GetCompanyBaseURI}/GetAdminUserModel?UserKeyIDForUpdate=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetAdminUserList = async (params) => {
  let url = `${GetCompanyBaseURI}/GetAdminUserList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};