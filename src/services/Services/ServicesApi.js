
import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const servicesBaseURI = `${Base_Url}/Services`;





export const GetServiceLookupList = async () => {
    const url = `${servicesBaseURI}/GetServiceLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
 