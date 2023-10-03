import axios, { Axios, AxiosRequestConfig } from "axios";
import { Result, Ok, Err } from "ts-results";

export async function apiCall<T>({
  path,
  map,
  depth,
  method,
  data,
}: {
  path: string;
  map?: (result: any) => T;
  depth?: number;
  method: "get" | "post" | "patch";
  data?: any;
}): Promise<Result<T, string>> {
  try {
    const response = await axios.request({
      url: path,
      method: method,
      data,
    });
    console.log("response for apiCall", response);

    if (response.status === 200) {
      return new Ok(map ? map(response.data) : response.data);
    } else return new Err("No data received");
  } catch (e) {
    throw e;
    return new Err("Somehting went wrong.");
  }
}

export async function getApiCall<T>(
  params: Omit<Parameters<typeof apiCall<T>>[number], "method">
): Promise<Result<T, string>> {
  return apiCall<T>({ ...params, method: "get" });
}

export async function postApiCall<DataType, T>(
  params: Omit<Parameters<typeof apiCall<T>>[number], "method"> & {
    data?: DataType;
  }
): Promise<Result<T, string>> {
  return apiCall<T>({ ...params, method: "post" });
}

export async function patchApiCall<DataType, T>(
  params: Omit<Parameters<typeof apiCall<T>>[number], "method"> & {
    data?: DataType;
  }
): Promise<Result<T, string>> {
  return apiCall<T>({ ...params, method: "patch" });
}
