import axios from "axios";
import { MESSAGE_URI } from "./Message_URI";

export const postMessage = async (data, token) => {
  try {
    const response = await axios.post(`${MESSAGE_URI}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getMessage = async (roomId) => {
  try {
    const response = await axios.get(`${MESSAGE_URI}/${roomId}`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
